import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {first} from "rxjs/operators";
import {AuthService} from "../../services/auth.service";
import {mustMatch} from "../../utils"

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = "";
  refreshToken:string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthService
) { 
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) { 
        this.router.navigate(["/"]);
    }
}

ngOnInit() {
  this.refreshToken = this.route.snapshot.paramMap.get("refreshToken");
  this.resetPasswordForm = this.formBuilder.group({
    password: ["", Validators.required],
    confirmPassword:["", Validators.required]
  }, {
    validator: mustMatch("password", "confirmPassword")
  });

  // get return url from route parameters or default to "/"
  this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
}

  // convenience getter for easy access to form fields
  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.resetPasswordForm.invalid) {
        return;
    }

    this.loading = true;
    let password = this.f.password.value
    this.authenticationService.reset(this.refreshToken,password)
        .pipe(first())
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.error = error;
                console.log(error)
                this.loading = false;
            });
}

}

