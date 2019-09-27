import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { User } from '../constant/constants';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  user: User[];
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.users();
  }

  users(){
    this.userService.getUsers().subscribe((data: any) => {
      if (data.success) {
        this.user = data.users;
      }
    });
  }
  editUser(id){
    this.router.navigate([`/edit/${id}`]);

  }
  deleteUser(id) {
    this.userService.deleteUserById(id).subscribe(() => {
      this.users();
    });
  }
}
