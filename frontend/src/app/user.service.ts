import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  uri = 'http://localhost:4000/api';
  constructor(private http: HttpClient ) { }
  //Service Calls
  //Get Authentication
  getAuth(username, password) {
    const credential = {
      username: username,
      password: password
    };
    return this.http.post(`${this.uri}/authenticate`, credential);
  }
  //Register a new user
  addUser(name, email, username, password, permission){
    const userDetails = {
      name: name,
      email: email,
      username: username,
      password: password,
      permission: permission
    };
    return this.http.post(`${this.uri}/add`, userDetails);
  }
  //check e-mail
  checkEmail(email) {
    const eMail = {
      email: email
    }
    return this.http.post(`${this.uri}/email`, eMail);
  }
  //check e-mail
  checkUsername(username) {
    const userName = {
      username: username
    }
    return this.http.post(`${this.uri}/username`, userName);
  }

  //get Permissions
  getPermissions(username) {
    return this.http.post(`${this.uri}/permission`, {'username':username});
  }

  //get All Users
  getUsers() {
    return this.http.get(`${this.uri}/users`);
  }

  //get  User by Id
  getUserById(id) {
    return this.http.get(`${this.uri}/user/${id}`);
  }

  //Edit User By Id 
  updateUser(id, name, username, permission, email, ) {
    const user = {
      name: name,
      username: username,
      permission: permission,
      email: email,
     
    };
    return this.http.patch(`${this.uri}/update/${id}`, user);
  }

  //Delete User
 deleteUserById(id){
   return this.http.get(`${this.uri}/delete/${id}`, id);
 }
 

//------------------------------------------------------------------------------------------------------
  //Methods
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  deleteToken(){
    localStorage.removeItem('token');
  }

  getUserPayload() {
    var token = localStorage.getItem('token');
    if(token){
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
    return null
  }

  isLoggedIn(){
    var userPayload = this.getUserPayload();
    if(userPayload){
      return userPayload.exp > Date.now()/1000;
    } else {
      return false;
    }
  }
}
