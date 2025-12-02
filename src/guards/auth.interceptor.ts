import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const user = localStorage.getItem("user");

    if (user) {
      const token = JSON.parse(user).token;

      req = req.clone({
        setHeaders: {
          Authorization: token
        }
      });
    }

    return next.handle(req);
  }
}
