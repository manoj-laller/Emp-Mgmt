import { Injectable } from '@angular/core';
import { BehaviorSubject, observable, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor() { }

  IsAuthenticated(){
    return this.isLoggedIn.asObservable();
  }

  Login(username: string, password: string) {
    this.setAuth(true);
  }

  Logout() {
    this.setAuth(false);
  }

  private setAuth(auth : boolean) {
    this.isLoggedIn.next(auth);
  }
}
