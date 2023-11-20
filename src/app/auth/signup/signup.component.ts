import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy{

  constructor(private authService: AuthService) { }
  
  private subscription! : Subscription

  ngOnInit(): void {
    this.subscription = this.authService.getAuthStatus().subscribe( authStatus => {
      this.isLoading = false
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

  isLoading: boolean = false;

  onSignUp(signUpForm: NgForm) {

    this.isLoading = true

    if (signUpForm.invalid)
      return

    this.authService.createUser(signUpForm.value.email, signUpForm.value.password)
  }

}
