import {Injectable} from "@angular/core";
import {HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse}   from "@angular/common/http";
import {Observable} from "rxjs";
import {tap} from "rxjs/operators";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class SuccessInterceptor implements HttpInterceptor {
    constructor(public toasterService: ToastrService) {}

    intercept(request: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {
        if( 
            request.url.endsWith("/users/forgot")
            || request.url.includes("/users/reset/")
            ){
                return next.handle(request).pipe(
                    tap(evt => {
                        if (evt instanceof HttpResponse) {
                            if(evt.body){
                                this.toasterService.success(evt.body, "Success", { positionClass: "toast-bottom-center" });
                            }
                        }
                    }));
            }else{
                return next.handle(request);
            }
      }
}