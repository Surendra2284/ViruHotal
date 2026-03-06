import {
Component,
DestroyRef,
inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';

import { BookingService } from '../../services/booking.service';
import { PhotoService } from '../../services/photo.service';
import { RestaurantService } from '../../services/restaurant.service';
import { BillingService } from '../../services/billing.service';

import { environment } from '../environments/environment';

import imageCompression from 'browser-image-compression';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
selector:'app-hotel-photo-manager',
standalone:true,
imports:[CommonModule,FormsModule],
templateUrl:'./hotel-photo-manager.component.html',
styleUrls:['./hotel-photo-manager.component.scss']
})
export class HotelPhotoManagerComponent{

private destroyRef = inject(DestroyRef);

api = environment.apiUrl;

/* SEARCH */

searchKey='';
customer:any=null;

/* CUSTOMER PHOTO */

customerPhoto:any=null;
uploading=false;
uploadProgress=0;

/* DATA */

bookings:any[]=[];
orders:any[]=[];
bill:any=null;

/* TIMELINE */

timeline:any[]=[];

/* ROOM PHOTOS */

roomId='';
roomPhotos:any[]=[];

/* RESTAURANT PHOTOS */

restaurantId='';
restaurantPhotos:any[]=[];

/* UI */

activeTab:'profile'|'booking'|'restaurant'|'billing'|'timeline'='profile';
zoomImage:string|null=null;
invoiceModal=false;

constructor(
private bookingService:BookingService,
private photoService:PhotoService,
private restaurantService:RestaurantService,
private billingService:BillingService
){}


/* CUSTOMER SEARCH */

searchCustomer(){

if(!this.searchKey) return;

this.restaurantService
.searchCustomer(this.searchKey)
.pipe(takeUntilDestroyed(this.destroyRef))
.subscribe({

next:(customer:any)=>{

this.customer=customer;

this.loadCustomerPhoto();
this.loadBookings();
this.loadOrders();
this.loadBill();

}

});

}


/* LOAD CUSTOMER PHOTO */

loadCustomerPhoto(){

if(!this.customer) return;

this.photoService
.get("customer",this.customer._id)
.pipe(takeUntilDestroyed(this.destroyRef))
.subscribe((photos:any)=>{

this.customerPhoto=photos?.length?photos[0]:null;

});

}


/* BOOKINGS */

loadBookings(){

this.bookingService
.getBookings()
.pipe(takeUntilDestroyed(this.destroyRef))
.subscribe((data:any[])=>{

this.bookings=data.filter(b=>b.customerId===this.customer._id);

this.buildTimeline();

});

}


/* RESTAURANT ORDERS */

loadOrders(){

this.restaurantService
.getOrders()
.pipe(takeUntilDestroyed(this.destroyRef))
.subscribe((orders:any[])=>{

this.orders=orders.filter(o=>o.customerId===this.customer._id);

this.buildTimeline();

});

}


/* BILL */

loadBill(){

this.billingService
.getBillDynamic(this.customer._id)
.pipe(takeUntilDestroyed(this.destroyRef))
.subscribe((bill:any)=>{

this.bill=bill;

});

}


/* TIMELINE */

buildTimeline(){

this.timeline=[];

this.bookings.forEach(b=>{

this.timeline.push({
date:b.checkin,
title:"Room Check-in",
data:b
});

});

this.orders.forEach(o=>{

this.timeline.push({
date:o.date,
title:"Restaurant Order",
data:o
});

});

this.timeline.sort((a,b)=>
new Date(a.date).getTime()-new Date(b.date).getTime()
);

}


/* PHOTO UPLOAD */

async uploadCustomerPhoto(event:any){

const file=event.target.files[0];

if(!file) return;

const compressed=await imageCompression(file,{
maxSizeMB:1,
maxWidthOrHeight:1600,
useWebWorker:true
});

const formData=new FormData();

formData.append("files",compressed);
formData.append("type","customer");
formData.append("refId",this.customer._id);

this.uploading=true;

this.photoService
.uploadRaw(formData)
.pipe(takeUntilDestroyed(this.destroyRef))
.subscribe((event:any)=>{

if(event.type===HttpEventType.UploadProgress){

this.uploadProgress=Math.round(
100*event.loaded/(event.total||1)
);

}

if(event.type===HttpEventType.Response){

this.uploading=false;
this.uploadProgress=0;

this.loadCustomerPhoto();

}

});

}


/* ROOM PHOTOS */

loadRoomPhotos(){

this.photoService
.get("room",this.roomId)
.subscribe((photos:any)=>{

this.roomPhotos=photos||[];

});

}

async uploadRoomPhoto(event:any){

const file=event.target.files[0];

const compressed=await imageCompression(file,{
maxSizeMB:1,
maxWidthOrHeight:1600
});

const formData=new FormData();

formData.append("files",compressed);
formData.append("type","room");
formData.append("refId",this.roomId);

this.photoService.uploadRaw(formData)
.subscribe(()=>this.loadRoomPhotos());

}


/* RESTAURANT PHOTOS */

loadRestaurantPhotos(){

this.photoService
.get("restaurant",this.restaurantId)
.subscribe((photos:any)=>{

this.restaurantPhotos=photos||[];

});

}

async uploadRestaurantPhoto(event:any){

const file=event.target.files[0];

const compressed=await imageCompression(file,{
maxSizeMB:1,
maxWidthOrHeight:1600
});

const formData=new FormData();

formData.append("files",compressed);
formData.append("type","restaurant");
formData.append("refId",this.restaurantId);

this.photoService.uploadRaw(formData)
.subscribe(()=>this.loadRestaurantPhotos());

}


/* DELETE PHOTO */

deletePhoto(photo:any){

this.photoService
.delete(photo._id)
.subscribe(()=>{

this.roomPhotos=this.roomPhotos.filter(p=>p._id!==photo._id);
this.restaurantPhotos=this.restaurantPhotos.filter(p=>p._id!==photo._id);

});

}


/* UI */

setTab(tab:any){

this.activeTab=tab;

}

zoom(path:string){

this.zoomImage=path;

}

closeZoom(){

this.zoomImage=null;

}

openInvoice(){

this.invoiceModal=true;

}

closeInvoice(){

this.invoiceModal=false;

}

}