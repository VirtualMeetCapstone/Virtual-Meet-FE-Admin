import {Component, input, OnInit} from '@angular/core';
import {LogoServiceService} from '../Service/logo-service/logo-service.service';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-logo-configuration',
  templateUrl: './logo-configuration.component.html',
  imports: [
    ConfirmModalComponent
  ],
  styleUrl: './logo-configuration.component.scss'
})
export class LogoConfigurationComponent implements OnInit {
  logoUrl: string = 'assets/default-logo.png';
  selectedFile: File | null = null;
  isLoading = false;

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

  showSuccessModal = false;
  successMessage = '';
  saveLogo(): void {
    if (!this.selectedFile) return;
    this.isLoading = true; // Bắt đầu loading

    this.logoService.updateLogo(this.selectedFile).subscribe({
      next: (res) => {
        this.isLoading = false; // Dừng loading

        this.successMessage = 'Logo updated successfully!';
        this.showSuccessModal = true;
      },
      error: (err: { error: { message: any } }) => {
        this.isLoading = false; // Dừng loading

        console.error(err);
        this.successMessage = err.error.message || 'Failed to update logo!';
        this.showSuccessModal = true;
      }
    });
  }



}
