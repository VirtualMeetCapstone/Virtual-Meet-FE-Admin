import {CommonModule} from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import {RouterLink} from '@angular/router';
import {User} from '../model/user';
import {UserService} from '../Service/user-service/user-service.service';
import {RoomServiceService} from '../Service/room-service/room-service.service';
import {PostServiceService} from '../Service/post-service/post-service.service';
import {Post} from '../model/post';
import {Room} from '../model/room';
import {UserReport} from '../model/userReport';
import {ChartConfiguration, ChartData, ChartOptions} from 'chart.js';
import {FormsModule} from '@angular/forms';
import {BaseChartDirective} from 'ng2-charts';
// Import required components from chart.js
import {
  Chart,
  LineElement,
  LineController,
  PointElement,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import {RevenueServiceService} from '../Service/revenue-service/revenue-service.service';
import {RevenueReport} from '../model/revenue-report';

// Register them
Chart.register(
  BarController,
  BarElement,
  LineElement,
  LineController,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, FormsModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
// Thêm vào component class
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public userData: User[] = [];
  public users: User[] = [];
  public postData: Post[] = [];
  public roomData: Room[] = [];
  public userMap: Map<string, User> = new Map();
  today: string = '';
  beforeDate: string = '';
  afterDate: string = '';
  userReportData: UserReport | null = null;
  postReportData: any = null;
  public revenueReportData: any = null;
  revenueInfo: any = null;

  totalUsers = 0;
  usersPerPage = 5;
  currentUserPage = 1;
  totalPosts = 0;
  postsPerPage = 5;
  currentPostPage = 1;
  totalRooms = 0;
  roomsPerPage = 5;
  currentRoomPage = 1;
  public isLoading = false;

  constructor(
    private userService: UserService,
    private roomService: RoomServiceService,
    private postService: PostServiceService,
    private revenueService: RevenueServiceService,
  ) {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];
    this.afterDate = this.today;

    const before = new Date();
    before.setMonth(before.getMonth() - 1);
    this.beforeDate = before.toISOString().split('T')[0];

  }

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Average Session Duration',
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66,165,245,0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };


  lineChartLabels: string[] = [];
  public lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {display: true},
      title: {
        display: true,
        text: 'Average Session Duration Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average Session (minutes)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Time in Date'
        }
      }
    }
  };

  barChartData: ChartData<'bar'> = {
    labels: ['Total Users', 'Total Rooms', 'Total Posts', 'Revenue', 'New Posts', 'Reported Posts'],
    datasets: [
      {
        label: 'System Report',
        data: [120, 50, 7, 25542, 0, 0], // values for total users, rooms, posts, revenue, new posts, reported posts
        backgroundColor: [
          '#4CAF50',
          '#F44336',
          '#FFC107',
          '#2196F3',
          '#9C27B0',
          '#FF9800'
        ],
      }
    ]
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  isValidDateRange(): boolean {
    if (!this.beforeDate || !this.afterDate) return false;
    const from = new Date(this.beforeDate);
    const to = new Date(this.afterDate);
    const now = new Date(this.today);
    return from <= to && to <= now;
  }

  convertToDateTime(date: string): string {
    const dateObj = new Date(date);
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    return `${date} ${hours}:${minutes}:${seconds}`;
  }

  onDateChange(): void {
    this.fetchUserReport();
    this.fetchMeetingReport();
  }

  revenueReport: RevenueReport | null = null;

  fetchRevenueReport(): void {
    if (this.isValidDateRange()) {
      const formattedBeforeDate = encodeURIComponent(this.convertToDateTime(this.beforeDate));
      const formattedAfterDate = encodeURIComponent(this.convertToDateTime(this.afterDate));

      this.revenueService.getRevenueReport(formattedBeforeDate, formattedAfterDate).subscribe(response => {
        // response.data là mảng -> lấy phần tử đầu tiên response.data[0]
        if (response.data && response.data.length > 0) {
          this.revenueReport = response.data[0];
          console.log(this.revenueReport?.totalPaidOrders);
        } else {
          this.revenueReport = null;
        }
        console.log(this.revenueReport);
      }, error => {
        console.error('Error occurred:', error);
      });
    } else {
      this.revenueReport = null;
    }
  }

  fetchUserReport(): void {
    if (this.isValidDateRange()) {
      const formattedBeforeDate = encodeURIComponent(this.convertToDateTime(this.beforeDate));
      const formattedAfterDate = encodeURIComponent(this.convertToDateTime(this.afterDate));

      this.userService.userReport(formattedBeforeDate, formattedAfterDate).subscribe(userData => {
        this.userReportData = userData;

        this.postService.postReport(formattedBeforeDate, formattedAfterDate).subscribe(postData => {
          this.postReportData = postData;
          console.log('post data', postData);

          this.revenueService.getRevenueReport(formattedBeforeDate, formattedAfterDate).subscribe(revenueData => {
            if (revenueData.data && revenueData.data.length > 0) {
              this.revenueInfo = revenueData.data[0];
              this.revenueReportData = this.revenueInfo;

            } else {
              this.revenueReportData = null;
            }

            this.barChartData = {
              labels: [
                'Total Users', 'New Users', 'Banned Users',
                'Total Posts', 'New Posts', 'Banned Posts',
                'Total Orders', 'Paid Orders', 'Canceled Orders'
              ],
              datasets: [
                {
                  label: 'User Report',
                  data: [
                    userData.totalUsers || 0,
                    userData.newUsers || 0,
                    userData.bannedUsers || 0,
                    0, 0, 0, 0, 0, 0, 0
                  ],
                  backgroundColor: '#786aec'
                },
                {
                  label: 'Post Report',
                  data: [
                    0, 0, 0,
                    postData.totalPosts || 0,
                    postData.newPosts || 0,
                    postData.reportedPosts || 0,
                    0, 0, 0, 0
                  ],
                  backgroundColor: '#FF9800'
                },
                {
                  label: 'Revenue Report',
                  data: [
                    0, 0, 0, 0, 0, 0,
                    this.revenueInfo.totalOrders || 0,
                    this.revenueInfo.totalPaidOrders || 0,
                    this.revenueInfo.totalCancelledOrders || 0
                  ],
                  backgroundColor: '#4CAF50'
                }

              ]
            };

          }, (error: any) => console.error('Error revenue report:', error));

        }, error => console.error('Error post report:', error));

      }, error => console.error('Error user report:', error));
    } else {
      this.userReportData = null;
      this.postReportData = null;
      this.revenueReportData = null;
      console.log('Invalid date range');
    }
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadPosts();
    this.loadRooms();
    this.loadUsersInfo();
    this.fetchUserReport();
    this.fetchMeetingReport();
    this.fetchRevenueReport();

  }

  fetchMeetingReport(): void {
    this.roomService.getMeetingReportsByDateRange(this.beforeDate, this.afterDate)
      .subscribe((data) => {
        const dailyData: { [key: string]: { totalMinutes: number, count: number } } = {};

        data.forEach((item: any) => {
          const startTime = new Date(item.startTime);
          const dateKey = startTime.toLocaleDateString();

          const avgTicks = item.averageUserSessionTicks || 0;
          const averageMinutes = avgTicks / 10_000_000 / 60;

          if (!dailyData[dateKey]) {
            dailyData[dateKey] = { totalMinutes: 0, count: 0 };
          }

          dailyData[dateKey].totalMinutes += averageMinutes;
          dailyData[dateKey].count += 1;
        });

        const chartLabels: string[] = [];
        const chartData: number[] = [];

        const sortedKeys = Object.keys(dailyData).sort((a, b) => {
          return new Date(a).getTime() - new Date(b).getTime();
        });

        sortedKeys.forEach((dateKey) => {
          const averageForDay = dailyData[dateKey].totalMinutes / dailyData[dateKey].count;
          chartLabels.push(dateKey);
          chartData.push(parseFloat(averageForDay.toFixed(2)));
        });

        // Cách 1: Tạo object mới hoàn toàn để kích hoạt change detection
        this.lineChartData = {
          labels: [...chartLabels],
          datasets: [
            {
              ...this.lineChartData.datasets[0],
              data: [...chartData]
            }
          ]
        };

        // Cách 2: Hoặc nếu giữ nguyên cấu trúc cũ thì cần gọi update()
        // this.lineChartData.labels = [...chartLabels];
        // this.lineChartData.datasets[0].data = [...chartData];
        // this.chart?.update();

        console.log('Chart Updated:', this.lineChartData);

        // Đảm bảo chart render lại sau khi data thay đổi
        setTimeout(() => {
          this.chart?.update();
        }, 0);
      });
  }


  // Method to load user data
  private loadUsers(): void {
    this.isLoading = true;
    const skip = (this.currentUserPage - 1) * this.usersPerPage;
    const top = this.usersPerPage;

    this.userService.getUsersPaging(top, skip).subscribe((response: any) => {
      this.isLoading = false;
      if (Array.isArray(response.data)) {
        this.userData = response.data.map((item: any) => ({
          ...item,
          formattedCreateTime: this.convertTicksToDateTime(item.createTime)
        }));
        this.totalUsers = response.totalCount || response.data.length;
      } else {
        console.error('Unexpected response format:', response);
      }
    }, error => {
      this.isLoading = false;
      console.error("Error loading posts: ", error);
    });
  }

  private loadUsersInfo(): void {
    this.userService.getUsers().subscribe((response: any) => {

      if (Array.isArray(response)) {
        response.forEach((user: User) => {
          this.userMap.set(user.id, user);
        });
      } else if (response && Array.isArray(response.data)) {
        response.data.forEach((user: User) => {
          this.userMap.set(user.id, user);
        });
      } else {
        console.error("Unexpected response format:", response);
      }
    });
  }

  private loadPosts(): void {
    this.isLoading = true;
    const skip = (this.currentPostPage - 1) * this.postsPerPage;
    const top = this.postsPerPage;

    this.postService.getPosts(skip, top).subscribe((response: any) => {
      this.isLoading = false;
      if (Array.isArray(response.data)) {
        this.postData = response.data.map((item: any) => ({
          ...item,
          formattedCreateTime: this.convertTicksToDateTime(item.createTime)
        }));
        this.totalPosts = response.totalCount || response.data.length;
      } else {
        console.error('Unexpected response format:', response);
      }
    }, error => {
      this.isLoading = false;
      console.error("Error loading posts: ", error);
    });
  }

  private loadRooms(): void {
    this.isLoading = true;
    const skip = (this.currentRoomPage - 1) * this.roomsPerPage;
    const top = this.roomsPerPage;
    // console.log(`Loading rooms - Skip: ${skip}, Top: ${top}`);
    this.roomService.getRoomsPaging(skip, top).subscribe((response: any) => {
      this.isLoading = false;
      // console.log("API Response:", response);
      if (Array.isArray(response.data)) {
        this.roomData = response.data.map((item: any) => ({
          ...item,
          formattedCreateTime: this.convertTicksToDateTime(item.createTime)
        }));
        this.totalRooms = response.totalCount || response.data.length;
      } else {
        console.error('Unexpected response format:', response);
      }
    }, error => {
      this.isLoading = false;
      console.error("Error loading rooms: ", error);
    });
  }


  convertTicksToDateTime(ticks: number): string {
    const epochTicks = 621355968000000000;
    const tickMs = 0.0001;
    const jsTime = (ticks - epochTicks) * tickMs;
    const date = new Date(jsTime);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  }

  updateBarChart(): void {
    if (this.userReportData && this.postReportData) {
      this.barChartData = {
        labels: ['Total Users', 'New Users', 'Banned Users', 'Total Posts', 'New Posts', 'Reported Posts'],
        datasets: [
          {
            label: 'System Report',
            data: [
              this.userReportData.totalUsers || 0,
              this.userReportData.newUsers || 0,
              this.userReportData.bannedUsers || 0,
              this.postReportData.totalPosts || 0,
              this.postReportData.newPosts || 0,
              this.postReportData.reportedPosts || 0
            ],
            backgroundColor: [
              '#786aec', '#8d81e6', '#726cc5',
              '#FFC107', '#4CAF50', '#F44336'
            ]
          }
        ]
      };
    }
  }

}

