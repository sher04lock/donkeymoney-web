import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { AuthGuardService } from "./auth-guard.service";
import { HomeComponent } from "./home/home.component";
import { OperationsComponent } from "./operations/operations.component";
import { ActivateComponent } from "./activate/activate.component";

const routes: Routes = [
    { path: "", redirectTo: "/dashboard", pathMatch: "full" },
    { path: "home", component: HomeComponent },
    { path: "login", component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'activate', component: ActivateComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
    { path: 'operations', component: OperationsComponent, canActivate: [AuthGuardService] }
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
