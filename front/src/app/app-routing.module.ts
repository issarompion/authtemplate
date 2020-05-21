import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component"
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component"
import {ResetPasswordComponent} from "./components/reset-password/reset-password.component"
import {AuthGuard} from "./helpers";

const routes: Routes = [
    { path: "", component: HomeComponent, canActivate: [AuthGuard] },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "forgot-password", component: ForgotPasswordComponent },
    { path: "reset-password/:refreshToken", component: ResetPasswordComponent },
    // otherwise redirect to home
    { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
