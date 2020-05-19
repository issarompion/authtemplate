import {Component} from "@angular/core";
import {Router} from "@angular/router";

import {AuthService} from "./services/auth.service";
import {IUser} from "./models/entities";
import {environment} from "../environments/environment"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
    currentUser: IUser;

    constructor(
        private router: Router,
        private authenticationService: AuthService
    ) {
        document.title = environment.project_name
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(["/login"]);
    }
}
