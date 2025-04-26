import {Component, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {DatePipe} from '@angular/common';
import {MatFormField, MatInput} from '@angular/material/input';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {DurationFormatPipe} from '../duration-format.pipe';
import {RoomServiceService} from '../Service/room-service/room-service.service';
import {RouterLink} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {MatAnchor} from '@angular/material/button';
@Component({
  selector: 'app-meeting-report',
  standalone: true,
  imports: [
    FormsModule,
    MatPaginator,
    MatTable,
    MatFormField,
    DatePipe,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatInput,
    MatSortModule,
    DurationFormatPipe,
    RouterLink,
    MatIconModule,
    MatAnchor
  ],
  templateUrl: './meeting-report.component.html',
  styleUrl: './meeting-report.component.scss'
})
export class MeetingReportComponent implements OnInit {
  displayedColumns: string[] = ['roomTopic', 'ownerName', 'startTime', 'endTime', 'longestSessionTicks', 'averageUserSessionTicks', 'totalJoins', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private meetingService: RoomServiceService) {
    // Giả sử dữ liệu được lấy từ API hoặc truyền vào như biến input
    const jsonData = {
      "data": [
      //   {
      //     "roomId": "d32c302b-d4bf-482f-be66-b77c09a52793",
      //     "roomTopic": "123",
      //     "ownerId": "1de08109-38ae-4fea-9d64-06989c098bef",
      //     "ownerName": "Quang Vinh",
      //     "startTime": "2025-04-21T18:46:02.882Z",
      //     "endTime": "2025-04-26T03:36:05.763Z",
      //     "peakUsers": 1,
      //     "peakTime": "2025-04-26T03:36:03.698Z",
      //     "joinLogs": [
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-26T03:36:03.698Z"
      //       }
      //     ],
      //     "leaveLogs": [
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-26T03:36:05.763Z"
      //       }
      //     ],
      //     "totalUniqueUsers": 1,
      //     "userParticipationRate": 0,
      //     "totalJoins": 1,
      //     "totalLeaves": 1,
      //     "currentUsersCount": 0,
      //     "durationFromFirstJoinTicks": 20643487,
      //     "longestSessionTicks": 20643487,
      //     "averageUserSessionTicks": 20643487,
      //     "durationTicks": 3774028807392,
      //     "userSessionCounts": {
      //       "cc7995a0-d9ea-4486-be46-b4074c763ab2": 1
      //     },
      //     "firstJoinTime": "2025-04-26T03:36:03.698Z",
      //     "lastJoinUserId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "firstJoinUserId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "id": "f44fda19-9f5c-4b9e-9c26-1c4890cc7305",
      //     "createTime": 0,
      //     "lastModifyTime": 0
      //   },
      //   {
      //     "roomId": "cf7dc572-a953-4dc8-bcf2-95c63225a850",
      //     "roomTopic": "Room có nên được phân loại theo chủ đề?",
      //     "ownerId": "4be38d4a-c42e-476b-b00f-06612f00a0f8",
      //     "ownerName": "Cạp Cạp",
      //     "startTime": "2025-04-22T19:23:38.435Z",
      //     "endTime": "2025-04-26T03:56:28.581Z",
      //     "peakUsers": 1,
      //     "peakTime": "2025-04-26T03:54:38.867Z",
      //     "joinLogs": [
      //       {
      //         "user": {
      //           "id": "c36e03ea-35f3-43d1-b9bd-573cff6f9c3e",
      //           "name": "ManhVipPro",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/ddd34f9b-51b4-4530-86a0-b27b2e23096b-202504101544-Image.jpg"
      //         },
      //         "time": "2025-04-26T03:54:38.867Z"
      //       }
      //     ],
      //     "leaveLogs": [
      //       {
      //         "user": {
      //           "id": "c36e03ea-35f3-43d1-b9bd-573cff6f9c3e",
      //           "name": "ManhVipPro",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/ddd34f9b-51b4-4530-86a0-b27b2e23096b-202504101544-Image.jpg"
      //         },
      //         "time": "2025-04-26T03:56:28.581Z"
      //       }
      //     ],
      //     "totalUniqueUsers": 1,
      //     "userParticipationRate": 0,
      //     "totalJoins": 1,
      //     "totalLeaves": 1,
      //     "currentUsersCount": 0,
      //     "durationFromFirstJoinTicks": 1097142595,
      //     "longestSessionTicks": 1097142595,
      //     "averageUserSessionTicks": 1097142595,
      //     "durationTicks": 2899701468222,
      //     "userSessionCounts": {
      //       "c36e03ea-35f3-43d1-b9bd-573cff6f9c3e": 1
      //     },
      //     "firstJoinTime": "2025-04-26T03:54:38.867Z",
      //     "lastJoinUserId": "c36e03ea-35f3-43d1-b9bd-573cff6f9c3e",
      //     "firstJoinUserId": "c36e03ea-35f3-43d1-b9bd-573cff6f9c3e",
      //     "id": "5d9f799d-21c1-4366-aa5a-d9ca5f10f196",
      //     "createTime": 0,
      //     "lastModifyTime": 0
      //   },
      //   {
      //     "roomId": "9d48c4cf-07c1-4a36-bf86-636bff9ab70d",
      //     "roomTopic": "Vao hop cung toi",
      //     "ownerId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "ownerName": "Tuong đẹp trai",
      //     "startTime": "2025-04-19T02:20:17.587Z",
      //     "endTime": "2025-04-25T16:30:02.983Z",
      //     "peakUsers": 2,
      //     "peakTime": "2025-04-25T16:29:21.675Z",
      //     "joinLogs": [
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-25T16:28:51.773Z"
      //       },
      //       {
      //         "user": {
      //           "id": "4b9b4fd9-670e-4fb3-9a99-956be62d6720",
      //           "name": "2003 Tuong",
      //           "imageUrl": "https://lh3.googleusercontent.com/a/ACg8ocJuyvyMr91TOcfWV4R_emNOXWlOjoHyWLcs8VE9pSG3ptC8QVs=s96-c"
      //         },
      //         "time": "2025-04-25T16:29:21.675Z"
      //       }
      //     ],
      //     "leaveLogs": [
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-25T16:29:29.69Z"
      //       },
      //       {
      //         "user": {
      //           "id": "4b9b4fd9-670e-4fb3-9a99-956be62d6720",
      //           "name": "2003 Tuong",
      //           "imageUrl": "https://lh3.googleusercontent.com/a/ACg8ocJuyvyMr91TOcfWV4R_emNOXWlOjoHyWLcs8VE9pSG3ptC8QVs=s96-c"
      //         },
      //         "time": "2025-04-25T16:30:02.983Z"
      //       }
      //     ],
      //     "totalUniqueUsers": 2,
      //     "userParticipationRate": 0,
      //     "totalJoins": 2,
      //     "totalLeaves": 2,
      //     "currentUsersCount": 0,
      //     "durationFromFirstJoinTicks": 712108663,
      //     "longestSessionTicks": 413086889,
      //     "averageUserSessionTicks": 396132027,
      //     "durationTicks": 5693853967702,
      //     "userSessionCounts": {
      //       "cc7995a0-d9ea-4486-be46-b4074c763ab2": 1,
      //       "4b9b4fd9-670e-4fb3-9a99-956be62d6720": 1
      //     },
      //     "firstJoinTime": "2025-04-25T16:28:51.773Z",
      //     "lastJoinUserId": "4b9b4fd9-670e-4fb3-9a99-956be62d6720",
      //     "firstJoinUserId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "id": "82488725-83fa-404b-b371-249fbd3835c9",
      //     "createTime": 0,
      //     "lastModifyTime": 0
      //   },
      //   {
      //     "roomId": "cfd45ce3-4cd9-4db0-8d73-b33a877f14c0",
      //     "roomTopic": "Room Tiếng Anh",
      //     "ownerId": "4b9b4fd9-670e-4fb3-9a99-956be62d6720",
      //     "ownerName": "2003 Tuong",
      //     "startTime": "2025-04-22T12:38:28.232Z",
      //     "endTime": "2025-04-26T03:31:49.624Z",
      //     "peakUsers": 1,
      //     "peakTime": "2025-04-26T03:31:36.053Z",
      //     "joinLogs": [
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-26T03:31:36.053Z"
      //       }
      //     ],
      //     "leaveLogs": [
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-26T03:31:49.624Z"
      //       }
      //     ],
      //     "totalUniqueUsers": 1,
      //     "userParticipationRate": 0,
      //     "totalJoins": 1,
      //     "totalLeaves": 1,
      //     "currentUsersCount": 0,
      //     "durationFromFirstJoinTicks": 135712740,
      //     "longestSessionTicks": 135712740,
      //     "averageUserSessionTicks": 135712740,
      //     "durationTicks": 3128013924469,
      //     "userSessionCounts": {
      //       "cc7995a0-d9ea-4486-be46-b4074c763ab2": 1
      //     },
      //     "firstJoinTime": "2025-04-26T03:31:36.053Z",
      //     "lastJoinUserId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "firstJoinUserId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "id": "52f3b4c1-169a-4cf8-86a7-4348fe84e4de",
      //     "createTime": 0,
      //     "lastModifyTime": 0
      //   },
      //   {
      //     "roomId": "0e404018-757d-4ba7-9411-72245311b829",
      //     "roomTopic": "Cho phep user live chat ***",
      //     "ownerId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "ownerName": "Tuong đẹp trai",
      //     "startTime": "2025-04-25T16:32:39.975Z",
      //     "endTime": "2025-04-25T16:33:32.612Z",
      //     "peakUsers": 1,
      //     "peakTime": "2025-04-25T16:33:08.041Z",
      //     "joinLogs": [
      //       {
      //         "user": {
      //           "id": "20e762a1-ef0f-44e9-a464-1e417e9badec",
      //           "name": "TUONG OK",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/80bbec0f-b7a5-4c66-9f85-bcca549cb29f-202504201623-Image.png"
      //         },
      //         "time": "2025-04-25T16:33:08.041Z"
      //       }
      //     ],
      //     "leaveLogs": [
      //       {
      //         "user": {
      //           "id": "20e762a1-ef0f-44e9-a464-1e417e9badec",
      //           "name": "TUONG OK",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/80bbec0f-b7a5-4c66-9f85-bcca549cb29f-202504201623-Image.png"
      //         },
      //         "time": "2025-04-25T16:33:32.612Z"
      //       }
      //     ],
      //     "totalUniqueUsers": 1,
      //     "userParticipationRate": 0,
      //     "totalJoins": 1,
      //     "totalLeaves": 1,
      //     "currentUsersCount": 0,
      //     "durationFromFirstJoinTicks": 245710380,
      //     "longestSessionTicks": 245710380,
      //     "averageUserSessionTicks": 245710380,
      //     "durationTicks": 526374897,
      //     "userSessionCounts": {
      //       "20e762a1-ef0f-44e9-a464-1e417e9badec": 1
      //     },
      //     "firstJoinTime": "2025-04-25T16:33:08.041Z",
      //     "lastJoinUserId": "20e762a1-ef0f-44e9-a464-1e417e9badec",
      //     "firstJoinUserId": "20e762a1-ef0f-44e9-a464-1e417e9badec",
      //     "id": "a15f0aa2-b8e2-496b-875b-9eaf1b4e07b7",
      //     "createTime": 0,
      //     "lastModifyTime": 0
      //   },
      //   {
      //     "roomId": "c6de967c-3a92-4b2f-a14f-cf46f31612d4",
      //     "roomTopic": "12",
      //     "ownerId": "17d0b7ab-75f9-4c0b-8bac-cb4dd21315df",
      //     "ownerName": "vinh quang",
      //     "startTime": "2025-04-22T16:30:19.27Z",
      //     "endTime": "2025-04-25T16:15:25.854Z",
      //     "peakUsers": 2,
      //     "peakTime": "2025-04-25T16:14:23.217Z",
      //     "joinLogs": [
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-25T16:11:09.879Z"
      //       },
      //       {
      //         "user": {
      //           "id": "20e762a1-ef0f-44e9-a464-1e417e9badec",
      //           "name": "TUONG OK",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/80bbec0f-b7a5-4c66-9f85-bcca549cb29f-202504201623-Image.png"
      //         },
      //         "time": "2025-04-25T16:14:23.217Z"
      //       }
      //     ],
      //     "leaveLogs": [
      //       {
      //         "user": {
      //           "id": "20e762a1-ef0f-44e9-a464-1e417e9badec",
      //           "name": "TUONG OK",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/80bbec0f-b7a5-4c66-9f85-bcca549cb29f-202504201623-Image.png"
      //         },
      //         "time": "2025-04-25T16:14:44.275Z"
      //       },
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-25T16:15:25.854Z"
      //       }
      //     ],
      //     "totalUniqueUsers": 2,
      //     "userParticipationRate": 0,
      //     "totalJoins": 2,
      //     "totalLeaves": 2,
      //     "currentUsersCount": 0,
      //     "durationFromFirstJoinTicks": 2559743373,
      //     "longestSessionTicks": 2559743373,
      //     "averageUserSessionTicks": 1385161727,
      //     "durationTicks": 2583065834387,
      //     "userSessionCounts": {
      //       "cc7995a0-d9ea-4486-be46-b4074c763ab2": 1,
      //       "20e762a1-ef0f-44e9-a464-1e417e9badec": 1
      //     },
      //     "firstJoinTime": "2025-04-25T16:11:09.879Z",
      //     "lastJoinUserId": "20e762a1-ef0f-44e9-a464-1e417e9badec",
      //     "firstJoinUserId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "id": "d21e8ce3-313d-4ce9-a0ff-54a4da6f4a12",
      //     "createTime": 0,
      //     "lastModifyTime": 0
      //   },
      //   {
      //     "roomId": "9a0bb830-f8e2-4635-a577-4e0084206d81",
      //     "roomTopic": "Redis dùng để làm gì",
      //     "ownerId": "9d85e49c-b6b6-49de-86ca-52ec1136ecfe",
      //     "ownerName": "Gâu Gâu",
      //     "startTime": "2025-04-23T06:33:32.396Z",
      //     "endTime": "2025-04-25T15:40:09.846Z",
      //     "peakUsers": 1,
      //     "peakTime": "2025-04-25T15:40:01.991Z",
      //     "joinLogs": [
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-25T15:40:01.991Z"
      //       }
      //     ],
      //     "leaveLogs": [
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-25T15:40:09.846Z"
      //       }
      //     ],
      //     "totalUniqueUsers": 1,
      //     "userParticipationRate": 0,
      //     "totalJoins": 1,
      //     "totalLeaves": 1,
      //     "currentUsersCount": 0,
      //     "durationFromFirstJoinTicks": 78551646,
      //     "longestSessionTicks": 78551646,
      //     "averageUserSessionTicks": 78551646,
      //     "durationTicks": 2055974497007,
      //     "userSessionCounts": {
      //       "cc7995a0-d9ea-4486-be46-b4074c763ab2": 1
      //     },
      //     "firstJoinTime": "2025-04-25T15:40:01.991Z",
      //     "lastJoinUserId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "firstJoinUserId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "id": "c6006377-705d-40ad-bfb9-33c0e4bb18d5",
      //     "createTime": 0,
      //     "lastModifyTime": 0
      //   },
      //   {
      //     "roomId": "ebd6356e-4479-4178-89d7-507a27821c2e",
      //     "roomTopic": "Room cho triệu phú",
      //     "ownerId": "9d85e49c-b6b6-49de-86ca-52ec1136ecfe",
      //     "ownerName": "Gâu Gâu",
      //     "startTime": "2025-04-24T01:15:15.034Z",
      //     "endTime": "2025-04-25T15:38:38.119Z",
      //     "peakUsers": 1,
      //     "peakTime": "2025-04-25T15:38:16.048Z",
      //     "joinLogs": [
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-25T15:38:16.048Z"
      //       }
      //     ],
      //     "leaveLogs": [
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-25T15:38:38.119Z"
      //       }
      //     ],
      //     "totalUniqueUsers": 1,
      //     "userParticipationRate": 0,
      //     "totalJoins": 1,
      //     "totalLeaves": 1,
      //     "currentUsersCount": 0,
      //     "durationFromFirstJoinTicks": 220709575,
      //     "longestSessionTicks": 220709575,
      //     "averageUserSessionTicks": 220709575,
      //     "durationTicks": 1382030851944,
      //     "userSessionCounts": {
      //       "cc7995a0-d9ea-4486-be46-b4074c763ab2": 1
      //     },
      //     "firstJoinTime": "2025-04-25T15:38:16.048Z",
      //     "lastJoinUserId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "firstJoinUserId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "id": "a3e75731-f3ab-4854-9a66-952308176780",
      //     "createTime": 0,
      //     "lastModifyTime": 0
      //   },
      //   {
      //     "roomId": "86f192e4-7a67-403b-91f6-1bcac16f2049",
      //     "roomTopic": "Vao hoc tieng Anh chung",
      //     "ownerId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "ownerName": "Tuong đẹp trai",
      //     "startTime": "2025-04-19T01:16:06.46Z",
      //     "endTime": "2025-04-25T16:32:44.841Z",
      //     "peakUsers": 2,
      //     "peakTime": "2025-04-25T16:31:32.919Z",
      //     "joinLogs": [
      //       {
      //         "user": {
      //           "id": "4b9b4fd9-670e-4fb3-9a99-956be62d6720",
      //           "name": "2003 Tuong",
      //           "imageUrl": "https://lh3.googleusercontent.com/a/ACg8ocJuyvyMr91TOcfWV4R_emNOXWlOjoHyWLcs8VE9pSG3ptC8QVs=s96-c"
      //         },
      //         "time": "2025-04-25T16:30:21.105Z"
      //       },
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-25T16:31:32.919Z"
      //       }
      //     ],
      //     "leaveLogs": [
      //       {
      //         "user": {
      //           "id": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //           "name": "Tuong đẹp trai",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/5b55706e-fae6-488b-866b-7ce69ab3dc5d-202504250228-Image.jpg"
      //         },
      //         "time": "2025-04-25T16:31:35.444Z"
      //       },
      //       {
      //         "user": {
      //           "id": "4b9b4fd9-670e-4fb3-9a99-956be62d6720",
      //           "name": "2003 Tuong",
      //           "imageUrl": "https://lh3.googleusercontent.com/a/ACg8ocJuyvyMr91TOcfWV4R_emNOXWlOjoHyWLcs8VE9pSG3ptC8QVs=s96-c"
      //         },
      //         "time": "2025-04-25T16:32:44.841Z"
      //       }
      //     ],
      //     "totalUniqueUsers": 2,
      //     "userParticipationRate": 0,
      //     "totalJoins": 2,
      //     "totalLeaves": 2,
      //     "currentUsersCount": 0,
      //     "durationFromFirstJoinTicks": 1437361684,
      //     "longestSessionTicks": 1437361684,
      //     "averageUserSessionTicks": 731305317,
      //     "durationTicks": 5733983803732,
      //     "userSessionCounts": {
      //       "4b9b4fd9-670e-4fb3-9a99-956be62d6720": 1,
      //       "cc7995a0-d9ea-4486-be46-b4074c763ab2": 1
      //     },
      //     "firstJoinTime": "2025-04-25T16:30:21.105Z",
      //     "lastJoinUserId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "firstJoinUserId": "4b9b4fd9-670e-4fb3-9a99-956be62d6720",
      //     "id": "42e1faa0-3cfb-4b5b-84e8-1ebc2f82ebf6",
      //     "createTime": 0,
      //     "lastModifyTime": 0
      //   },
      //   {
      //     "roomId": "004d948c-437b-40b4-ade9-a055696f8cf9",
      //     "roomTopic": "Cho phep user live chat ***",
      //     "ownerId": "cc7995a0-d9ea-4486-be46-b4074c763ab2",
      //     "ownerName": "Tuong đẹp trai",
      //     "startTime": "2025-04-23T02:00:47.539Z",
      //     "endTime": "2025-04-26T01:33:28.191Z",
      //     "peakUsers": 1,
      //     "peakTime": "2025-04-26T01:30:00.192Z",
      //     "joinLogs": [
      //       {
      //         "user": {
      //           "id": "9d85e49c-b6b6-49de-86ca-52ec1136ecfe",
      //           "name": "Gâu Gâu",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/a943de09-fc15-40a2-9d46-69e5ac87f325-202504250212-Image.jpg"
      //         },
      //         "time": "2025-04-26T01:30:00.192Z"
      //       }
      //     ],
      //     "leaveLogs": [
      //       {
      //         "user": {
      //           "id": "9d85e49c-b6b6-49de-86ca-52ec1136ecfe",
      //           "name": "Gâu Gâu",
      //           "imageUrl": "https://storage.derapi.io.vn/capcap/gocap/a943de09-fc15-40a2-9d46-69e5ac87f325-202504250212-Image.jpg"
      //         },
      //         "time": "2025-04-26T01:33:28.191Z"
      //       }
      //     ],
      //     "totalUniqueUsers": 1,
      //     "userParticipationRate": 0,
      //     "totalJoins": 1,
      //     "totalLeaves": 1,
      //     "currentUsersCount": 0,
      //     "durationFromFirstJoinTicks": 2079983673,
      //     "longestSessionTicks": 2079983673,
      //     "averageUserSessionTicks": 2079983673,
      //     "durationTicks": 2575606517008,
      //     "userSessionCounts": {
      //       "9d85e49c-b6b6-49de-86ca-52ec1136ecfe": 1
      //     },
      //     "firstJoinTime": "2025-04-26T01:30:00.192Z",
      //     "lastJoinUserId": "9d85e49c-b6b6-49de-86ca-52ec1136ecfe",
      //     "firstJoinUserId": "9d85e49c-b6b6-49de-86ca-52ec1136ecfe",
      //     "id": "7170800d-f4d5-4df9-9df7-1616e5572c36",
      //     "createTime": 0,
      //     "lastModifyTime": 0
      //   }
      ],
      "totalCount": 1
    };
    this.dataSource.data = jsonData.data;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit(): void {
    this.meetingService.getMeetingReport().subscribe({
      next: (response) => {
        // Kiểm tra cấu trúc dữ liệu trả về
        console.log('API Response:', response);

        // Nếu API trả về dạng { data: [], totalCount: number }
        this.dataSource.data = response.data || response;

        // Nếu cần phân trang
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      }
    });
  }
}
