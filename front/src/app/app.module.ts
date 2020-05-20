import {BrowserModule} from "@angular/platform-browser";
import {NgModule, Provider} from "@angular/core";
import {ReactiveFormsModule,FormsModule} from "@angular/forms";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ToastrModule} from 'ngx-toastr';

import {environment} from "../environments/environment";
import {JwtInterceptor, ErrorInterceptor, FakeBackendInterceptor} from "./helpers";
import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './components/reset-password/reset-password.component';

let isDev : boolean = !environment.production

const mockProviders : Provider[] = [
  {  provide: HTTP_INTERCEPTORS,useClass: FakeBackendInterceptor,multi: true }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // provider used to create fake backend
    isDev ? mockProviders : []
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
