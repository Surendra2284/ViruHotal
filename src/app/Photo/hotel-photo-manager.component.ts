import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../services/photo.service';
import { BookingService } from '../../services/booking.service';
import imageCompression from 'browser-image-compression';
import { environment } from '../environments/environment';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { BillingService } from '../../services/billing.service';
import { RoomService } from '../../services/rooms.service';
import { Room } from '../models/room.model';
import { combineLatest } from 'rxjs';
@Component({
  selector: 'app-hotel-photo-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-photo-manager.component.html',
  styleUrls: ['./hotel-photo-manager.component.scss']
})

export class HotelPhotoManagerComponent implements OnInit {

  api = environment.apiUrl + "/uploads/photos/";
checkedInGuests: any[] = [];
checkedOutGuests: any[] = [];
ordersMap: any = {};
billMap: any = {};
  uploadProgress = 0;
rooms: Room[] = [];
  loading = true;
  customerPhotos: any[] = [];
  roomPhotos: any[] = [];
  restaurantPhotos: any[] = [];

  customerPreview: string[] = [];
  roomPreview: string[] = [];
  restaurantPreview: string[] = [];

  previewImage = "";

  customerId = "";
  roomId = "";

  constructor(
    private photoService: PhotoService,
    private bookingService: BookingService,
    private RestaurantService:RestaurantService,
    private BillingService :BillingService,
    private RoomService:RoomService
  ) {}

  ngOnInit(): void {
this.loadCheckedInGuests();
this.loadCheckedOutGuests();
  this.bookingService.getBookings().subscribe((res:any)=>{

    const bookings = Array.isArray(res) ? res : [];

    const checkedIn = bookings.find(
      (b:any)=> b.status === "CheckedIn"
    );

    if(!checkedIn) {
      console.log("No checked in guest");
      return;
    }

    console.log("Checked In Booking:", checkedIn);

    // Use phone as reference because booking has no customerId
    this.customerId = checkedIn.phone;

    this.roomId = checkedIn.room?._id || checkedIn.room;

    this.loadPhotos();

  });

}

selectGuest(guest:any){

this.customerId = guest.phone;

this.roomId = guest.room?._id || guest.room;

this.loadPhotos();

}
loadCheckedInGuests() {

combineLatest([
  this.RoomService.getRooms(),
  this.bookingService.getBookings(),
  this.RestaurantService.getOrders()
]).subscribe(([rooms, bookings, orders]: any) => {

  this.rooms = rooms || [];

  const bookingList = Array.isArray(bookings) ? bookings : [];

  const checked = bookingList.filter(
    (b:any) => b.status === "CheckedIn"
  );

  this.checkedInGuests = checked.map((b:any) => {

    const roomObj = this.rooms.find(
      r => r._id === (b.room?._id || b.room)
    );

    const guestOrders = orders.filter(
      (o:any) => o.room === b.room || o.room?._id === b.room
    );

    return {
      ...b,
      roomData: roomObj,
      orders: guestOrders,
      photos: [],
      bill: null
    };

  });

  /* load photos + bills separately */

  this.checkedInGuests.forEach(g => {

    this.loadGuestPhoto(g);

    this.loadGuestBill(g);

  });

});
}

loadCheckedOutGuests() {

combineLatest([
  this.RoomService.getRooms(),
  this.bookingService.getBookings(),
  this.RestaurantService.getOrders()
]).subscribe(([rooms, bookings, orders]: any) => {

  this.rooms = rooms || [];

  const bookingList = Array.isArray(bookings) ? bookings : [];

  const checked = bookingList.filter(
    (b:any) => b.status === "CheckedOut"
  );

  this.checkedOutGuests = checked.map((b:any) => {

    const roomObj = this.rooms.find(
      r => r._id === (b.room?._id || b.room)
    );

    const guestOrders = orders.filter(
      (o:any) => o.room === b.room || o.room?._id === b.room
    );

    return {
      ...b,
      roomData: roomObj,
      orders: guestOrders,
      photos: [],
      bill: null
    };

  });

  /* load photos + bills separately */

  this.checkedOutGuests.forEach(g => {

    this.loadGuestPhoto(g);

    this.loadGuestBill(g);

  });

});
}
loadRooms() {
    this.RoomService.getRooms().subscribe({
      next: (res: any) => {
        this.rooms = res;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.error("Failed to load rooms", err);
      }
    });
  }
loadGuestPhoto(guest:any){

  this.photoService
  .get("customer", guest.phone)
  .subscribe((photos:any)=>{

    guest.photos = photos || [];

  });

}
loadGuestOrders(guest:any){

  this.RestaurantService.getOrders().subscribe((orders:any[])=>{

    guest.orders = orders.filter(
      (o:any)=> o.room === guest.room || o.room?._id === guest.room
    );

  });

}
loadGuestBill(guest:any){

  this.BillingService
  .getBillDynamic(guest._id)
  .subscribe({
    next:(bill:any)=>{
      guest.bill = bill;
    },
    error:(err)=>{
      console.log("Bill error", err);
    }
  });

}
  /* ===============================
     FILE SELECT
  =============================== */

  onFileSelect(event: any, type: string) {

    const files: FileList = event.target.files;

    if (!files || files.length === 0) return;

    this.generatePreview(files, type);

    this.upload(files, type);

  }

  /* ===============================
     GENERATE PREVIEW
  =============================== */

  generatePreview(files: FileList, type: string) {

    const previews: string[] = [];

    Array.from(files).forEach(file => {

      const reader = new FileReader();

      reader.onload = (e: any) => {
        previews.push(e.target.result);
      };

      reader.readAsDataURL(file);

    });

    if (type === "customer") this.customerPreview = previews;

    if (type === "room") this.roomPreview = previews;

    if (type === "restaurant") this.restaurantPreview = previews;

  }

  /* ===============================
     DRAG & DROP
  =============================== */

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, type: string) {

    event.preventDefault();

    const files = event.dataTransfer?.files;

    if (!files || files.length === 0) return;

    this.generatePreview(files, type);

    this.upload(files, type);

  }

  /* ===============================
     COMPRESS + UPLOAD
  =============================== */

  async upload(files: FileList, type: string) {

    const compressedFiles: File[] = [];

    const options = {
      maxSizeMB: 0.7,
      maxWidthOrHeight: 1600,
      useWebWorker: true
    };

    for (const file of Array.from(files)) {

      const compressed = await imageCompression(file, options);

      compressedFiles.push(compressed);

    }

    let ref = "hotel";

    if (type === "customer") ref = this.customerId;

    if (type === "room") ref = this.roomId;

    this.photoService
      .upload(compressedFiles, type, ref)
      .subscribe(event => {

        if (event.type === HttpEventType.UploadProgress) {

          this.uploadProgress = Math.round(
            100 * (event.loaded / (event.total || 1))
          );

        }

        if (event.type === HttpEventType.Response) {

          this.uploadProgress = 0;

          this.clearPreview(type);

          this.loadPhotos();

        }

      });

  }

  /* ===============================
     CLEAR PREVIEW AFTER UPLOAD
  =============================== */

  clearPreview(type: string) {

    if (type === "customer") this.customerPreview = [];

    if (type === "room") this.roomPreview = [];

    if (type === "restaurant") this.restaurantPreview = [];

  }

  /* ===============================
     LOAD PHOTOS
  =============================== */

  loadPhotos() {

    if(!this.customerId || !this.roomId) return;

    this.photoService
      .get("customer", this.customerId)
      .subscribe(res => this.customerPhotos = res);

    this.photoService
      .get("room", this.roomId)
      .subscribe(res => this.roomPhotos = res);

    this.photoService
      .get("restaurant", "hotel")
      .subscribe(res => this.restaurantPhotos = res);

  }

  /* ===============================
     DELETE PHOTO
  =============================== */

  deletePhoto(photo: any) {

    if (!confirm("Delete this photo?")) return;

    this.photoService
      .delete(photo._id)
      .subscribe(() => {
        this.loadPhotos();
      });

  }

  /* ===============================
     ZOOM IMAGE
  =============================== */

  zoom(img: string) {
    this.previewImage = img;
  }

  closeZoom() {
    this.previewImage = "";
  }

}