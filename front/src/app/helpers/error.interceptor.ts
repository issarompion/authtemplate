import {Injectable} from "@angular/core";
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {AuthService} from "../services/auth.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                setTimeout(() =>{ location.reload(true) }, 2000);
            }

            const error = err.error || err.statusText;
            return throwError(error);
        }))
    }
}