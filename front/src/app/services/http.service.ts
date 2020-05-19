import {Injectable} from "@angular/core";
import {HttpClient,HttpHeaders,HttpErrorResponse} from "@angular/common/http";
import {Observable,throwError} from "rxjs";
import {catchError,retry} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {IUser} from "../models/entities";

const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json"})
};

@Injectable({
  providedIn: "root"
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

getUsers(): Observable<IUser[]> {
    return this.http.get<IUser[]>(environment.apiUri + "/users",httpOptions).pipe(
      retry(1),
      catchError(this.handleError)
    );
}

  /**
   * Function to handle error when the server return an error
   *
   * @param error
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code. The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(error);
  }

}
