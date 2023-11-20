import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  constructor(private authService : AuthService){}
  
  private authListenerSub! : Subscription
  isAuthenticated : boolean = false
  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe()
  }
  
  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth()
    this.authListenerSub = this.authService.getAuthStatus().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated
    })
  }

  onLogout(){
    this.authService.logout()
  }
}
