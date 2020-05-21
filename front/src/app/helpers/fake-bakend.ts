import {Injectable} from "@angular/core";
import {HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {delay, mergeMap, materialize, dematerialize} from "rxjs/operators";
import {IUser} from "../models/entities";

const users: IUser[] = [
    { userId: "1", email :"test@gmail.com", name: "test", password: "test", token: "fake-jwt-token" }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body, params } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            //console.log(url,method,headers,body,params)
            switch (true) {
                case url.endsWith("/users/login") && method === "POST":
                    return login();
                case url.endsWith("/users") && method === "GET":
                    return getUsers();
                case url.endsWith("/users") && method === "POST":
                    return create();
                case url.endsWith("/users/me") && method === "GET":
                    return read();
                case url.endsWith("/users/logout") && method === "POST":
                    return logout();
                case url.endsWith("/users/forgot") && method === "POST":
                    return forgot();
                case url.includes("/users/reset/") && method === "POST":
                    return reset();
                default:
                    // pass through any requests not handled above
                    console.log("default")
                    return next.handle(request);
            }    
        }

        // route functions

        function login() {
            const { email, password } = body;
            const user = users.find(x => x.email === email && x.password === password);
            if (!user) return unauthorized("email or password is incorrect");
            return ok({
                    userId: user.userId,
                    email : user.email,
                    name: user.name,
                    token: "fake-jwt-token"
            })
        }

        function getUsers() {
            if (!isLoggedIn()) return unauthorized("Unauthorised");
            return ok(users);
        }

        function create(){
            const user = body;
            const copy = users.find(x => x.email === body.email)
            if(copy){
                return unauthorized(body.email + " already exists")
            }else{
                users.push(user)
                return ok({
                        userId: user.userId,
                        email : user.email,
                        name: user.name,
                        token: "fake-jwt-token"
                })
            }
        }

        function read(){
            if (!isLoggedIn()) return unauthorized("Unauthorised");
            const user = users.find(x => x.token = "fake-jwt-token")
            return ok({
                userId: user.userId,
                email : user.email,
                name: user.name,
                token: user.token
            })
        }

        function logout(){
            if (!isLoggedIn()) return unauthorized("Unauthorised");
            const user = users.find(x => x.token === "fake-jwt-token")
            return ok({
                userId: user.userId,
                email : user.email,
                name: user.name,
                token: user.token
            })
        }
        
        function forgot(){
            const { email } = body;
            const user = users.find(x => x.email === email);
            if (!user) return unauthorized("No account with that email address exists");
            return ok("An e-mail has been sent to " + email + " with further instructions.")
        }

        function reset(){
            if(url.endsWith("12345")){
                return ok("Success! Your password has been changed")
            }else{
                return unauthorized("Password reset token is invalid or has expired");
            }
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }
        
        function notFound(message : string){
            return throwError({ status : 404, error: message });
        }

        function unauthorized(message : string) {
            return throwError({ status: 401, error: message});
        }

        function isLoggedIn() {
            return headers.get("Authorization") === "Bearer fake-jwt-token";
        }
    }
}