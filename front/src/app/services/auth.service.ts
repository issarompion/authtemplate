import {Injectable} from "@angular/core";
import {HttpClient,HttpHeaders,HttpErrorResponse} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {IUser} from "../models/entities";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};


@Injectable({
  providedIn: "root"
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<IUser>;
  public currentUser: Observable<IUser>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<IUser>(JSON.parse(localStorage.getItem("currentUser")));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): IUser {
    return this.currentUserSubject.value;
  }

login(email: string, password: string) {
    return this.http.post<IUser>(`${environment.apiUri}/users/login`, { email, password }, httpOptions)
        .pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
}

logout() {
    // remove user from local storage to log user out
    return this.http.post<IUser>(`${environment.apiUri}/users/login`, {}, httpOptions)
    .pipe(map(user => {
      console.log('user deco : ',user)
      localStorage.removeItem("currentUser");
      this.currentUserSubject.next(null);
    }))
}

create(user : IUser){
  return this.http.post<IUser>(`${environment.apiUri}/users`, user, httpOptions )
  .pipe(map(user => {
      // store user details and jwt token in local storage to keep user logged in between page refreshes
      localStorage.setItem("currentUser", JSON.stringify(user));
      this.currentUserSubject.next(user);
      return user;
  }));
}

forgot(email:string){
  return this.http.post<string>(`${environment.apiUri}/users/login`, { email }, httpOptions)
  .pipe(map(msg => {
    console.log()
  }));
}

}
