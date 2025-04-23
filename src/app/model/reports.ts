import { User } from './user'; // Đường dẫn tuỳ bạn đặt

export interface Reports {
  reporter: User;
  targetReporter: User;
  reason: string;
  reporterId: string;
  targetId: string;
}
