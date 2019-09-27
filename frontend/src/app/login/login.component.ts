import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  usernameRegex = /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  passwordRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,30}$/;
  errorMessage: boolean = false;
  message: any;
  successMessage = '';
  constructor(private userService: UserService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    
    });
   }
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
        if (params.registered !== undefined && params.registered === 'true' ) {
          this.successMessage = 'Hello ' + params.user + ' you are successfully registered. Login to continue';
        }
      });

    if(this.userService.isLoggedIn){
      this.router.navigate([`/dashboard`]);
    }
  }
  loginUser(username, passowrd) {
    this.userService.getAuth(username, passowrd).subscribe((data: any) => {
      if (data.success) {
        this.userService.setToken(data['token']);
        this.router.navigate([`/dashboard`]);
      } else {
        this.errorMessage = true
        this.message = data.message;
      }
    });
  }
}
