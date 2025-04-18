import {Component, input, OnInit} from '@angular/core';
import {LogoServiceService} from '../Service/logo-service/logo-service.service';

@Component({
  selector: 'app-logo-configuration',
  templateUrl: './logo-configuration.component.html',
  styleUrl: './logo-configuration.component.scss'
})
export class LogoConfigurationComponent implements OnInit {
  logoUrl: string = 'assets/default-logo.png';
  selectedFile: File | null = null;
constructor(private logoService: LogoServiceService) {
}
  ngOnInit(): void {
    this.logoService.getLogo().subscribe({
      next: (res) => {
        if (res?.media?.url) {
          this.logoUrl = res.media.url;
        }
      },
      error: () => {
        console.error('Failed to load logo');
      }
    });
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.logoUrl = e.target?.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }


  saveLogo(): void {
    if (!this.selectedFile) return;

    this.logoService.updateLogo(this.selectedFile).subscribe({
      next: (res) => {
        if (res?.success) {
          alert('Logo updated successfully!');
          this.logoUrl = URL.createObjectURL(this.selectedFile!);
          this.selectedFile = null;
        } else {
          alert('Update failed!');
        }
      },
      error: () => {
        alert('An error occurred while uploading logo.');
      }
    });
  }



}
