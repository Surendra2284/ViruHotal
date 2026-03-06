import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from '../app/environments/environment';

@Injectable({
 providedIn:'root'
})

export class PhotoService {

 api = environment.apiUrl + "/photo";

 constructor(private http:HttpClient){}

 upload(files:File[],type:string,refId:string,idType?:string){

   const formData = new FormData();

   files.forEach(f=>{
     formData.append("photos",f);
   });

   formData.append("type",type);
   formData.append("refId",refId);

   if(idType){
     formData.append("idType",idType);
   }

   const req = new HttpRequest(
     "POST",
     this.api+"/upload",
     formData,
     { reportProgress:true }
   );

   return this.http.request(req);

 }

 get(type:string,refId:string){
  return this.http.get<any[]>(this.api+"/"+type+"/"+refId);
 }

 delete(id:string){
  return this.http.delete(this.api+"/"+id);
 }
uploadRaw(formData:FormData){

   const req = new HttpRequest(
     "POST",
     this.api+"/upload",
     formData,
     { reportProgress:true }
   );

   return this.http.request(req);

 }

 reorder(list:any[]){
  return this.http.post(this.api+"/reorder",list);
 }

}