import {Injectable} from "@angular/core";
import {HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor} from "@angular/common/http";
import {Observable, of, throwError} from "rxjs";
import {delay, mergeMap, materialize, dematerialize} from "rxjs/operators";
import {IUser} from "../models/entities";
import {
    createAlreadyExistsError,
    loginCredentialsFailError,
    notAuthorizedError,
    forgotEmailError,
    resetTokenError
} from "../../../../back/src/helpers/errors"
import {userForgotSuccessMsg,userResetSuccessMsg} from "../../../../back/src/helpers/success"

const users: IUser[] = [
    { userId: "1", email :"test@gmail.com", name: "test", password: "test", token: "fake-jwt-token" }
];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
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
            if (!user) return errorResponse(loginCredentialsFailError);
            return ok({
                    userId: user.userId,
                    email : user.email,
                    name: user.name,
                    token: "fake-jwt-token"
            })
        }

        function getUsers() {
            if (!isLoggedIn()) return errorResponse(notAuthorizedError);
            return ok(users);
        }

        function create(){
            const user = body;
            const copy = users.find(x => x.email === body.email)
            if(copy){
                return errorResponse(createAlreadyExistsError)
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
            if (!isLoggedIn()) return errorResponse(notAuthorizedError);
            const user = users.find(x => x.token = "fake-jwt-token")
            return ok({
                userId: user.userId,
                email : user.email,
                name: user.name,
                token: user.token
            })
        }

        function logout(){
            if (!isLoggedIn()) return errorResponse(notAuthorizedError);
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
            if (!user) return errorResponse(forgotEmailError);
            return ok(userForgotSuccessMsg(email))
        }

        function reset(){
            const fakeRefreshToken = "12345"
            if(url.endsWith(fakeRefreshToken)){
                return ok(userResetSuccessMsg)
            }else{
                return errorResponse(resetTokenError);
            }
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function errorResponse(httpError){
            return throwError({ status : httpError.status, error: httpError.body });
        }

        function isLoggedIn() {
            return headers.get("Authorization") === "Bearer fake-jwt-token";
        }
    }
}