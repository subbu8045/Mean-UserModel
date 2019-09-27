import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service'
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  id: String;
  users: any = {};
  updateForm: FormGroup;
  nameRegex = /^(([a-zA-Z.]{3,20})+[ ]+([a-zA-Z.]{3,20})+)+$/;
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  usernameRegex = /^(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
  passwordRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,30}$/;
  errorMessage: boolean = false;
  message: any;
  showMsg: boolean = false;
  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();

    this.route.params.subscribe(params => {
      this.id = params.id;
      console.log(this.id);
      this.userService.getUserById(this.id).subscribe((res : any) => {
        this.users = res.user;
        console.log(this.users.name)
        this.updateForm.get('name').setValue(this.users.name);
        this.updateForm.get('username').setValue(this.users.username);
        this.updateForm.get('permission').setValue(this.users.permission);
        // this.updateForm.get('password').setValue(this.users.password);
        this.updateForm.get('email').setValue(this.users.email);

      });
    });
  }
  createForm() {
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      permission: ['', Validators.required],
      email: ['',],
      // password: ['',]
    });
  }
  checkUsername(username) {
    this.userService.checkUsername(username).subscribe((data: any) => {
      if (!data.success) {
        this.errorMessage = true
        this.message = data.message;
      } return true;
    });
  }
  updateUser(name, username, permission, email) {

 this.userService.updateUser(this.id, name, username, permission, email).subscribe((data:any) => {
    this.checkUsername(username);

  });
  }
}
