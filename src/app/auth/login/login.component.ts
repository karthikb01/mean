import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{

  constructor(private authService : AuthService) {}

  isLoading : boolean = false

  private subscription! : Subscription

  ngOnInit(): void {
    this.subscription = this.authService.getAuthStatus().subscribe( authStatus => {
      this.isLoading = false
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
  

  onLogin(loginForm : NgForm){
    // console.log(loginForm.value);
    this.isLoading = true
    if(loginForm.invalid)
    return
    this.authService.login(loginForm.value.email, loginForm.value.password)
  }

}
