import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from "./authentication.service";
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from './auth-guard.service';
import { HomeComponent } from './home/home.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MessagesComponent } from './messages/messages.component';
import { MessageService } from './message.service';
import { OperationsComponent } from './operations/operations.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ClientPagingComponent } from './client-paging/client-paging.component';
import { DevtableComponent } from './devtable/devtable.component';
import { DevService } from './dev-service.service';
import { DxDataGridModule, DxButtonModule } from 'devextreme-angular';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    HomeComponent,
    NavigationComponent,
    MessagesComponent,
    OperationsComponent,
    ClientPagingComponent,
    DevtableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxDatatableModule,
    DxDataGridModule,
    DxButtonModule
  ],
  providers: [AuthenticationService, AuthGuardService, MessageService, DevService],
  bootstrap: [AppComponent]
})
export class AppModule { }
