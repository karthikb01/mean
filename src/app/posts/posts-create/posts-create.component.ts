import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Post } from '../post';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { PostService } from '../post-service.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-posts-create',
  templateUrl: './posts-create.component.html',
  styleUrls: ['./posts-create.component.css']
})
export class PostsCreateComponent implements OnInit, OnDestroy {

  constructor(private postService: PostService, private route: ActivatedRoute, private authService : AuthService) { }
  

  isLoading: boolean = false
  private mode: string = "create"
  private postId: string = ""
  post: Post = {
    title: "",
    content: "",
    id: "",
    imagePath: "",
    creatorId : ""
  }

  form!: FormGroup
  imagePreview!: string

  private subscription! : Subscription


  ngOnInit(): void {

    this.subscription = this.authService.getAuthStatus().subscribe(authStatus => {
      this.isLoading = false
    })

    this.form = new FormGroup({
      'title': new FormControl(null, { validators: [Validators.required, Validators.minLength(3)], updateOn: 'blur' }),
      'content': new FormControl(null, { validators: [Validators.required], updateOn: 'blur' }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType], updateOn: 'blur' })
    }, { updateOn: 'blur' })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = "edit"
        this.postId = paramMap.get('postId') as string
        //show spinner
        this.isLoading = true
        this.postService.getPost(this.postId).subscribe(post => {
          //hide spinner
          this.isLoading = false
          this.post = {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
            creatorId: post.creatorId
          }

          // initialize form with values that need to be edited
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath
          })
        })
      } else {
        this.mode = "create"
      }
    })
  }

  enteredContent = ""
  enteredTitle = ""

  onSavePost() {
    if (this.form.invalid) {
      return
    }
    this.isLoading = true
    if (this.mode == "create") {
      this.postService.addPost(this.form.value.title, this.form.value.content, this.form.value.image)
    } else {
      this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
    }

    this.form.reset()

  }

  onImagePicked(event: Event) {
    // if ((event.target! as HTMLInputElement).files == null) return;
    const files = (event.target! as HTMLInputElement).files
    const file = files![0]
    this.form.patchValue({ image: file })
    this.form.get('image')?.updateValueAndValidity()
    // console.log(file);
    // console.log(this.form);
    const reader = new FileReader()
    reader.onload = () => {
      this.imagePreview = reader.result as string
    }
    reader.readAsDataURL(file)
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }

}
