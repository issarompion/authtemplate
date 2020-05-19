import {BrowserModule} from "@angular/platform-browser";
import {NgModule, Provider} from "@angular/core";
import {ReactiveFormsModule,FormsModule} from "@angular/forms";
import {HttpClientModule, HTTP_INTERCEPTORS} from "@angular/common/http";
import {environment} from "../environments/environment";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";

import {JwtInterceptor, ErrorInterceptor, FakeBackendInterceptor} from "./helpers";
import {RegisterComponent} from "./components/register/register.component";

let isDev : boolean = !environment.production

const mockProviders : Provider[] = [
  {  provide: HTTP_INTERCEPTORS,useClass: FakeBackendInterceptor,multi: true }
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule
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
