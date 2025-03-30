import { CommonModule } from '@angular/common';
import {Component, OnInit} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Room } from '../model/room';
import { RoomServiceService } from '../Service/room-service/room-service.service';
import {User} from '../model/user';
import {UserService} from '../Service/user-service/user-service.service';

@Component({
  selector: 'app-room-detail',
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.scss'
})
export class RoomDetailComponent implements OnInit {

public room : Room |null = null;
user : User | null = null;
constructor(
  private route: ActivatedRoute,
  private roomService: RoomServiceService,
  private userService: UserService,
) {}

ngOnInit(): void {
  const roomId = this.route.snapshot.paramMap.get('id');

  if (roomId) {
    this.roomService.getRoomDetail( roomId).subscribe(
      (data: Room) => {
        this.room = data;
        console.log("room detail",this.room)
        this.userService.getUserDetail(this.room.ownerId).subscribe(
          (data: User) => {
            this.user = data;
          },
          error => {
            console.error('Error fetching user detail:', error);
          }
        );
      },
      error => {
        console.error('Error fetching room detail:', error);
      }
    );
  }
}
}

