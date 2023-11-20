import { NgModule } from "@angular/core";

import { PostListComponent } from './post-list/post-list.component';
import { PostsCreateComponent } from './posts-create/posts-create.component';

import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterailModule } from "../angular-materail.module";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@NgModule({
    declarations : [
        PostsCreateComponent,
        PostListComponent,
    ],
    imports : [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterailModule,
        RouterModule,
    ]
})
export class PostsModule{

}