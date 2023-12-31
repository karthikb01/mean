import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostsCreateComponent } from "./posts/posts-create/posts-create.component";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
    {
        path: '',
        component: PostListComponent
    },
    {
        path: 'create',
        component: PostsCreateComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'edit/:postId',
        component: PostsCreateComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {

}