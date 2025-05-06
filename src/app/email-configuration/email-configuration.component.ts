import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {EmailServiceService} from '../Service/email-service/email-service.service';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-email-configuration',
  standalone: true,
  imports: [FormsModule, CommonModule, CKEditorModule, ConfirmModalComponent],
  templateUrl: './email-configuration.component.html',
  styleUrl: './email-configuration.component.scss'
})
export class EmailConfigurationComponent {
  constructor(private emailService: EmailServiceService) {
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  emailSubject: string = '';
  emailMessage: string = '';
  selectedFile: File | null = null;
  selectedTemplate: string = '';
  successMessage: string = '';

  onTemplateChange(): void {
    switch (this.selectedTemplate) {
      case 'maintenance':
        this.emailSubject = 'VirtualMeet - Thông báo bảo trì hệ thống';
        this.emailMessage = `Kính gửi quý người dùng,

Hệ thống sẽ được bảo trì từ {Time} ngày {Date} đến {Time} ngày {Date}. Trong thời gian này, một số chức năng có thể bị gián đoạn. Mong quý người dùng thông cảm.

Trân trọng,
Đội ngũ VirtualMeet.`;
        break;

      case 'newFeature':
        this.emailSubject = 'VirtualMeet - Ra mắt tính năng mới!';
        this.emailMessage = `Xin chào,

Chúng tôi vừa cập nhật một số tính năng mới giúp việc họp trực tuyến của bạn hiệu quả hơn. Hãy đăng nhập để trải nghiệm ngay nhé!

Cảm ơn bạn đã đồng hành cùng VirtualMeet.`;
        break;

      case 'promotion':
        this.emailSubject = 'VirtualMeet - Ưu đãi hấp dẫn từ VirtualMeet';
        this.emailMessage = `Kính gửi quý người dùng,

Từ hôm nay đến hết tháng, hãy tận hưởng chương trình khuyến mãi đặc biệt với nhiều phần quà hấp dẫn dành cho người dùng thân thiết.

Truy cập ngay để không bỏ lỡ!

Trân trọng,
VirtualMeet Team.`;
        break;
    }
  }
  showSuccessModal: boolean = false;
  isError: boolean = false;

  sendNotification() {
    this.emailService.emailNotification(this.emailSubject, this.emailMessage)
      .subscribe({
        next: (res) => {
          this.successMessage = 'Email sent successfully!';
          this.showSuccessModal = true;
          this.isError = false;
          this.resetNotification();
        },
        error: (err: { error: { message: any } }) => {
          console.error(err);
          this.successMessage = err.error.message || 'Failed to sent email!';
          this.showSuccessModal = true;
          this.isError = true;
          this.resetNotification();
        }
      });
  }

  resetNotification() {
    setTimeout(() => {
      this.successMessage = '';
      this.showSuccessModal = false;
      this.isError = false;
    }, 3000);
  }
}
