import { Component, OnInit } from '@angular/core';
import { Post } from './posts/post';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  constructor(private authService : AuthService){}

  title = 'mean';

  posts : Post[] = []

  ngOnInit(): void {
    this.authService.autoAuthUser()
  }

  addPost(post : Post){
    this.posts.push(post)
  }

}
