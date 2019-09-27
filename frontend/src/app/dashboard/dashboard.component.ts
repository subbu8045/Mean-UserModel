import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  admin: boolean = false;
  public userRole;
  public permission;
  
  constructor(private userService: UserService, private router: Router, ) { 
  }
  ngOnInit() {
    var user = this.userService.getUserPayload();
    this.permission = this.userService.getPermissions(user.username).subscribe((data : any) => {
      if(data.permission == 'admin'){
        this.admin = true;
        this.userRole = data.permission
      } else {
        this.admin = false
        this.userRole = data.permission
      }
    });

  }
  logout(){
    this.userService.deleteToken();
    this.router.navigate(['/login'])
  }
}
