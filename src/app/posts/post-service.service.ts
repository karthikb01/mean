import { Injectable } from '@angular/core';
import { Post } from './post';
import { Subject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient, private router: Router) { }

  private posts: Post[] = []

  private stream = new Subject<{ posts: Post[], postsCount: number }>();

  getPostUpdateListener() {
    return this.stream.asObservable();
  }

  getPosts(pageSize: number, currentPage: number) {
    const queryParams = `?pageSize=${pageSize}&currentPage=${currentPage}`

    this.http.get<{ message: string, posts: any, postsCount: number }>("/api/posts" + queryParams).pipe(
      map((postData) => {
        return {
          postsCount: postData.postsCount,
          posts: postData.posts.map((post: {
            creator: any; title: any; content: any; _id: any; imagePath: any
          }) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creatorId: post.creator
            }
          })
        }
      })
    ).subscribe((data) => {
      // console.log(data);
      this.posts = data.posts
      this.stream.next({
        posts: [...this.posts],
        postsCount: data.postsCount
      })
    })
  }

  addPost(title: string, content: string, image: File) {
    const newPost: Post = {
      id: '',
      title: title,
      content: content,
      imagePath: '',
      creatorId : ""
    }

    const postData = new FormData()
    postData.append('title', title)
    postData.append('content', content)
    postData.append('image', image, title)

    this.http.post<{ message: string, post: Post }>("/api/posts", postData).subscribe((data) => {
      // console.log(data);
      // const post: Post = {
      //   id: data.post.id,
      //   title: title,
      //   content: content,
      //   imagePath: data.post.imagePath
      // }
      // // newPost.id = data.postId
      // // console.log(data.postId);

      // this.posts.push(post)
      // this.stream.next([...this.posts])

      this.router.navigate(["/"])
    })

  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>("http://localhost:3000/api/posts/" + postId)
    // .subscribe(data => {
    //   // console.log(data.message);
    //   const updatedPosts = this.posts.filter(post => post.id != postId)
    //   this.posts = updatedPosts
    //   this.stream.next([...this.posts])
    // })
  }

  getPost(postId: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string , creatorId : string}>("/api/posts/" + postId)
  }

  updatePost(postId: string, title: string, content: string, image: File | string) {
    // const post : Post = {
    //   id : postId,
    //   title : title,
    //   content : content,
    //   imagePath : ''
    // }

    let postData: Post | FormData

    if (typeof (image) == 'object') {
      // create a form data
      postData = new FormData()
      postData.append('title', title)
      postData.append('content', content)
      postData.append('id', postId)
      postData.append('image', image, title)

    } else {
      postData = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
        creatorId : ""
      }
    }

    this.http.put("/api/posts/" + postId, postData).subscribe((data) => {
      // console.log(data);
      // const updatedPost = [...this.posts]
      // const oldPostIndex = updatedPost.findIndex(p => p.id == postId)

      // updatedPost[oldPostIndex] = {
      //   id: postId,
      //   title: title,
      //   content: content,
      //   imagePath: "data.imagePath"
      // }
      // this.posts = updatedPost
      // this.stream.next([...this.posts])

      this.router.navigate(["/"])
    })
  }
}
