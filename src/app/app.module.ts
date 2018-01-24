import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { PrettyDateFormat } from "./_pipes/pretty-date-format";

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavigationComponent } from './navigation/navigation.component';
import { OperationsComponent } from './operations/operations.component';
import { ActivateComponent } from './activate/activate.component';

import { AuthenticationService } from "./authentication.service";
import { AuthGuardService } from './auth-guard.service';
import { OperationsService } from './operations.service';

/**
 * Core android app module.
 */
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HomeComponent,
    NavigationComponent,
    OperationsComponent,
    ActivateComponent,
    PrettyDateFormat
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AuthenticationService,
    AuthGuardService,
    OperationsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
