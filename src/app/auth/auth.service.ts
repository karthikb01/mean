import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthData } from './auth';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  private authStatusStream = new Subject<boolean>()
  isAuthenticated: boolean = false
  private tokenTimer: any
  private userId: string | null = null

  private token!: string
  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }

    return this.http.post('/api/user/signup', authData)
      .subscribe(data => {
        // console.log(data);
        this.router.navigate(['/login'])
      }, error => {
        this.authStatusStream.next(false)
      })
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password }
    this.http.post<{ token: string, expiresIn: number, userId: string }>('/api/user/login', authData).subscribe(response => {
      // console.log(response);
      this.token = response.token
      if (this.token) {
        const expiresIn = response.expiresIn
        // console.log(expiresIn);

        this.setAuthTimer(expiresIn)

        this.isAuthenticated = true
        this.userId = response.userId
        this.authStatusStream.next(true)
        const now = new Date()
        const expiration = new Date(now.getTime() + expiresIn * 1000)
        this.saveAuthData(this.token, expiration, this.userId)
        console.log(expiration);
        this.router.navigate(['/'])
      }
    }, error => {
      this.authStatusStream.next(false)
    })
  }

  private setAuthTimer(duration: number) {

    // console.log("Setting timer " + duration);

    this.tokenTimer = setTimeout(() => {
      this.logout()
    }, duration * 1000)
  }

  getToken() {
    return this.token
  }

  getIsAuth() {
    return this.isAuthenticated
  }

  getAuthStatus() {
    return this.authStatusStream.asObservable()
  }

  logout() {
    this.token = ""
    this.isAuthenticated = false
    this.authStatusStream.next(false)
    clearTimeout(this.tokenTimer)
    this.clearAuthData()
    this.userId = null
    this.router.navigate(['/'])
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())
    localStorage.setItem('userId', userId)
  }

  private clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('expiration')
    localStorage.removeItem('userId')
  }

  private getAuthData() {
    const token = localStorage.getItem('token')
    const expiration = localStorage.getItem('expiration')
    const userId = localStorage.getItem('userId')
    if (!token || !expiration) {
      return
    }
    return {
      token: token,
      expirationDate: new Date(expiration),
      userId: userId
    }
  }

  autoAuthUser() {
    const authInfo = this.getAuthData()
    if (!authInfo) {
      return
    }
    const now = new Date()
    const expiresIn = authInfo?.expirationDate.getTime()! - now.getTime()
    // console.log(authInfo, expiresIn);

    if (expiresIn > 0) {
      this.token = authInfo?.token as string
      this.isAuthenticated = true
      this.userId = authInfo.userId
      this.setAuthTimer(expiresIn / 1000)
      this.authStatusStream.next(true)
    }
  }

  getUserId() {
    return this.userId
  }


}
