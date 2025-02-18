import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { Room } from '../model/room';
import { RoomServiceService } from '../Service/room-service/room-service.service';

@Component({
  selector: 'app-room-detail',
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './room-detail.component.html',
  styleUrl: './room-detail.component.scss'
})
export class RoomDetailComponent {

public room : Room |null = null;

constructor(
  private route: ActivatedRoute,  
  private roomService: RoomServiceService 
) {}

ngOnInit(): void {
  const roomId = this.route.snapshot.paramMap.get('id'); 

  if (roomId) {
    this.roomService.getRoomDetail( roomId).subscribe(
      (data: Room) => {
        this.room = data;  
        console.log("room detail",this.room)
      },
      error => {
        console.error('Error fetching room detail:', error);
      }
    );
  }
}
}

