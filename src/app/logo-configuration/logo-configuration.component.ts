import { Component } from '@angular/core';

@Component({
  selector: 'app-logo-configuration',
  templateUrl: './logo-configuration.component.html',
  styleUrl: './logo-configuration.component.scss'
})
export class LogoConfigurationComponent {
  logoUrl: string = 'assets/default-logo.png';
  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.logoUrl = e.target?.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveLogo() {
    if (this.selectedFile) {
      console.log('Lưu logo:', this.selectedFile.name);
      // Xử lý lưu ảnh tại đây (upload lên server hoặc lưu vào local storage)
    }
  }
}
