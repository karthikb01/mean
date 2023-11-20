import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post-service.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  constructor(private postService: PostService, private authService: AuthService) { }

  private subscription!: Subscription
  isLoading = false
  posts: Post[] = []
  totalPosts: number = 0
  postsPerPage: number = 2
  pageSizeOptions = [1, 2, 5, 10]
  currentPage = 1

  isAuthenticated: boolean = false
  private authSubscription!: Subscription

  userId!: string

  ngOnInit(): void {

    this.isAuthenticated = this.authService.getIsAuth()

    this.authSubscription = this.authService.getAuthStatus().subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated
      this.userId = this.authService.getUserId() as string
    })

    this.userId = this.authService.getUserId() as string

    this.isLoading = true
    this.postService.getPosts(this.postsPerPage, this.currentPage)
    this.subscription = this.postService.getPostUpdateListener().subscribe((data: { posts: Post[], postsCount: number }) => {
      this.isLoading = false
      this.posts = data.posts
      this.totalPosts = data.postsCount
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
    this.authSubscription.unsubscribe()
  }

  onDelete(postId: string) {
    // console.log(postId);
    this.isLoading = true
    this.postService.deletePost(postId).subscribe((data) => {
      this.postService.getPosts(this.postsPerPage, this.currentPage)
    }, () => {
      this.isLoading = false
    })
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1
    this.postsPerPage = pageData.pageSize
    this.postService.getPosts(this.postsPerPage, this.currentPage)
  }


}
