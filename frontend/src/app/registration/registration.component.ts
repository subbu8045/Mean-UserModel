import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup;
  nameRegex = /^(([a-zA-Z.]{3,20})+[ ]+([a-zA-Z.]{3,20})+)+$/;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  usernameRegex = /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  passwordRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,30}$/;
  errorMessage : boolean = false;
  message: any;
  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      permission: ['', ]
    });
   }
  

  ngOnInit() {
 
  }
  addUser(name, email, username, password, permission) {

    this.userService.addUser(name, email, username, password, permission) .subscribe((data: any) => {
      if (data.success) {
        //this.userService.setToken(data['token']);
        this.router.navigate(['/login'], { queryParams: { registered: 'true', user: name  } });
      } else {
        this.errorMessage = true
         this.message = data.message;
      }
    });
  }
  checkUsername(username) {
    this.userService.checkUsername(username).subscribe((data : any) => {
      if (!data.success) {
        this.errorMessage = true
        this.message = data.message;
      } return true;
    });
  }
  checkEmail(email) {
    console.log(email)
    this.userService.checkEmail(email).subscribe((data: any) => {
      if (!data.success) {
        this.errorMessage = true
        this.message = data.message;
      } return true;
    });
  }

}
