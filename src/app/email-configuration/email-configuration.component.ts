import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
// Dùng build miễn phí không yêu cầu license
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-email-configuration',
  standalone: true,
  imports: [FormsModule, CommonModule, CKEditorModule],
  templateUrl: './email-configuration.component.html',
  styleUrl: './email-configuration.component.scss'
})
export class EmailConfigurationComponent {
  emailSubject: string = '';
  emailMessage: string = '';
  successMessage: string = '';
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  sendNotification() {
    if (!this.emailSubject || !this.emailMessage) {
      alert("Please enter both subject and message!");
      return;
    }

    // Chuẩn bị dữ liệu gửi
    const formData = new FormData();
    formData.append("subject", this.emailSubject);
    formData.append("message", this.emailMessage);
    if (this.selectedFile) {
      formData.append("file", this.selectedFile);
    }

    console.log("Sending Email:", formData);

    // Gọi API gửi email (cần backend xử lý)
    // this.http.post('your-api-url', formData).subscribe(response => {
    //   this.successMessage = "Notification sent successfully!";
    // });

    // Hiển thị thông báo thành công
    this.successMessage = "Notification sent successfully!";

    // Reset form sau khi gửi
    setTimeout(() => this.successMessage = '', 3000);
  }
}
