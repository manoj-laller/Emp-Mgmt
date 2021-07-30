import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'Employee Management';
  public isAuthenticated : Boolean = false;
  public auth$ : Subscription;

  constructor(private authService: AuthService, private router: Router){
  }

  ngOnInit(){
    this.auth$ =  this.authService.IsAuthenticated().subscribe(v => this.isAuthenticated = v);
  }

  ngOnDestroy(){
    this.auth$.unsubscribe();
  }

  logout() {
    this.authService.Logout();
    this.router.navigate(["/Login"]);
  }
}
