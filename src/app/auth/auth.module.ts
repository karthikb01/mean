import { NgModule } from "@angular/core";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { AngularMaterailModule } from "../angular-materail.module";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
    declarations : [
        LoginComponent,
        SignupComponent,
    ],
    imports : [
        CommonModule,
        AuthRoutingModule,
        AngularMaterailModule,
        FormsModule,
    ]
})
export class AuthModule{

}