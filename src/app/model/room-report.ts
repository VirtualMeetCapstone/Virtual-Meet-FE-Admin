import {User} from './user';
import {Room} from './room';

export interface RoomReport {
  reporter: User;
  reportedRoom: Room;
  reason: string;
  reporterId: string;
  targetId: string;
}
