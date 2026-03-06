import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../../services/photo.service';
import imageCompression from 'browser-image-compression';
import { environment } from '../environments/environment';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-hotel-photo-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel-photo-manager.component.html',
  styleUrls: ['./hotel-photo-manager.component.scss']
})

export class HotelPhotoManagerComponent implements OnInit {

  api = environment.apiUrl + "/uploads/photos/";

  uploadProgress = 0;

  customerPhotos: any[] = [];
  roomPhotos: any[] = [];
  restaurantPhotos: any[] = [];

  customerPreview: string[] = [];
  roomPreview: string[] = [];
  restaurantPreview: string[] = [];

  previewImage = "";

  customerId = "cust123";
  roomId = "101";

  constructor(private photoService: PhotoService) {}

  ngOnInit(): void {
    this.loadPhotos();
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