import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { APP_CONSTANTS } from '../../shared/app-constants';
@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private tokenSubject: BehaviorSubject<string>;
  private refreshInProgress = false;
  private refreshQueue: ((token: string | null) => void)[] = [];
  private userSubject: BehaviorSubject<any>;
  private cachedUser: any = null;
  private backendUserCache = new Map<string, any>();
  public user$: any;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  constructor(private http: HttpClient) {
    const initialToken = this.getStoredToken();
    this.tokenSubject = new BehaviorSubject<string>(initialToken);
    this.userSubject = new BehaviorSubject<any>(null);
    this.user$ = this.userSubject.asObservable();

    // Tự load user nếu đã có token
    const user = this.getUserFromToken();
    this.userSubject.next(user);
  }


  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private getStoredToken(): string {
    return this.isBrowser() ? localStorage.getItem('accessToken') || '' : '';
  }

  getToken(): string {
    return this.tokenSubject.value;
  }

  setToken(accessToken: string, refreshToken: string) {
    if (this.isBrowser()) {
      console.log('🚀 Setting token:', refreshToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      this.tokenSubject.next(accessToken);

      // Cập nhật user
      const user = this.getUserFromToken();
      this.userSubject.next(user);
    }
  }



  //get user
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUser(): any {
    if (this.cachedUser) return this.cachedUser;
    const token = this.getToken();
    if (!token) return null;
    return this.getUserFromToken();
  }

  getUserFromToken(): any {
    if (this.cachedUser) return this.cachedUser;

    const token = this.getToken();
    console.log('🚀 Token:', token);
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      console.log('🚀 Decoded token:', decoded);

      let photoUrl = '';

      if (typeof decoded.picture === 'string') {
        photoUrl = decoded.picture;
      }

      // Nếu decoded.photoUrl tồn tại
      if (!photoUrl && decoded.photoUrl) {
        // Kiểm tra nếu photoUrl là string thì parse
        if (typeof decoded.photoUrl === 'string') {
          try {
            const parsed = JSON.parse(decoded.photoUrl);
            // Nếu parsed là object có trường Url thì lấy Url
            if (parsed && typeof parsed === 'object' && parsed.Url) {
              photoUrl = parsed.Url;
            } else {
              photoUrl = decoded.photoUrl; // fallback giữ nguyên string
            }
          } catch (e) {
            console.error('❌ Lỗi parse photoUrl JSON string:', e);
            photoUrl = decoded.photoUrl; // fallback giữ nguyên string
          }
        } else if (typeof decoded.photoUrl === 'object' && decoded.photoUrl.Url) {
          // Nếu photoUrl đã là object thì lấy Url trực tiếp
          photoUrl = decoded.photoUrl.Url;
        } else {
          // Trường hợp khác (chuỗi hay object ko có Url)
          photoUrl = 'assets/images/default-avatar.png';
        }
      }

      photoUrl = photoUrl || 'assets/images/default-avatar.png';
      const role = decoded.role || decoded.roles || decoded.Role || null;
      this.cachedUser = {
        id: decoded.id || decoded.sub,
        email: decoded.email,
        name: decoded.unique_name || decoded.name || 'Người dùng',
        photoUrl: JSON.parse(photoUrl)?.Url,
        role: role,
      };

      if (role === 'admin') {
        return this.cachedUser;
      } else {
        console.warn('⚠️ User không có quyền admin, từ chối đăng nhập');
        return null;
      }
    } catch (error) {
      console.error('❌ Lỗi giải mã token:', error);
      return null;
    }
  }


  async getBackendUser(userId: string): Promise<any> {
    if (this.backendUserCache.has(userId)) {
      return this.backendUserCache.get(userId);
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.getToken()}`,
    });

    try {
      const user = await this.http
        .get(`${APP_CONSTANTS.REST_API_SERVIER}/users/${userId}`, { headers })
        .toPromise();
      this.backendUserCache.set(userId, user);
      return user;
    } catch (error) {
      return null;
    }
  }

  getRefreshTokenSafely(): string | null {
    return this.isBrowser() ? localStorage.getItem('refreshToken') : null;
  }

  logout() {
    console.log('🚪 Logging out due to expired token');

    const refreshToken = this.getRefreshTokenSafely();

    if (refreshToken) {
      fetch(`${APP_CONSTANTS.REST_API_SERVIER}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'text/plain',
        },
        body: JSON.stringify({ token: refreshToken }),
      })
        .then((res) => {
          if (!res.ok) {
            console.warn('⚠️ Backend logout thất bại:', res.status);
          }
        })
        .catch((err) => {
          console.error('❌ Lỗi khi gọi API logout:', err);
        });
    }

    // Xóa toàn bộ localStorage
    if (this.isBrowser()) {
      localStorage.clear(); // Xóa toàn bộ dữ liệu trong localStorage
      this.tokenSubject.next('');
    }

    this.cachedUser = null;
  }

  //kiem tra token
  async getValidAccessToken(): Promise<string | null> {
    const accessToken = this.getToken();
    if (accessToken && !this.isTokenExpired(accessToken)) {
      return accessToken;
    }

    const refreshToken = this.getRefreshTokenSafely();
    if (!refreshToken) {
      this.logout();
      return null;
    }

    // Nếu đang làm mới → đợi
    if (this.refreshInProgress) {
      return new Promise(resolve => {
        this.refreshQueue.push(resolve);
      });
    }

    this.refreshInProgress = true;

    try {
      const newTokens = await this.refreshToken(refreshToken).toPromise();
      this.setToken(newTokens!.accessToken, newTokens!.refreshToken);

      // ✅ Thông báo cho tất cả những người đang chờ
      this.refreshQueue.forEach(cb => cb(newTokens!.accessToken));
      this.refreshQueue = [];
      return newTokens!.accessToken;
    } catch (err) {
      console.error('❌ Refresh token không hợp lệ, đăng xuất');
      this.logout();

      this.refreshQueue.forEach(cb => cb(null));
      this.refreshQueue = [];
      return null;
    } finally {
      this.refreshInProgress = false;
    }
  }


  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() > exp;
    } catch (e) {
      return true;
    }
  }


  refreshToken(refreshToken: string): Observable<{ accessToken: string; refreshToken: string }> {
    return this.http.post<any>(
      `${APP_CONSTANTS.REST_API_SERVIER}/refresh-token`,
      { token: refreshToken },
      this.httpOptions
    ).pipe(
      map((res) => {
        if (res?.accessToken && res?.refreshToken) {
          return {
            accessToken: res.accessToken,
            refreshToken: res.refreshToken
          };
        }
        throw new Error('Invalid refresh response');
      }),
      catchError(err => {
        console.error('❌ Lỗi refresh token:', err);
        return throwError(() => new Error('Không thể làm mới access token'));
      })
    );
  }
}
