import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RoomListComponent } from './room-list/room-list.component';
import { AddRoomComponent } from './add-room/add-room.component';
import { EditRoomComponent } from './edit-room/edit-room.component';

import { RoomsRoutingModule } from '../rooms/rooms-routing.module';

@NgModule({
  declarations: [
    RoomListComponent,
    AddRoomComponent,
    EditRoomComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RoomsRoutingModule
  ]
})
export class RoomsModule {}
