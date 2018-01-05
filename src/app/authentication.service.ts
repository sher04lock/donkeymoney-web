import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { JwtHelper } from 'angular2-jwt';

import { User } from './user';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class AuthenticationService {

  private authUrl = 'https://osiol-test.herokuapp.com/login';
  private securityTokenUrl = "https://donkeymoney.herokuapp.com/api/user/securityToken";
  // private securityTokenUrl = "http://localhost:8080/api/user/securityToken";

  private authTemplate: string;
  private token: string;

  private securityToken: string;
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();

  constructor(private httpClient: HttpClient, private messageService: MessageService) { }

  login(user: User) {
    const body = JSON.stringify({ email: user.email, password: user.password });

    let self = this;
    return this.getSecurityToken(user).flatMap(response => {
      // this.securityToken = token;
      console.log("received token: ");
      console.log(response.body);
      const token = response.body;
      // tslint:disable-next-line:max-line-length
      const tokenUrl = `https://donkeymoney-dev-ed.my.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9I5UQ_0k_hTmeUVaC9dV..3UNitxbLQLxfExl29fGl_FI1zXAj9B1GP2CnxBLnY4AOaCBySAZw7BOhSvm&client_secret=7854954256455050410&\
      username=${user.email}&password=${user.password}${token}`;

      return this.httpClient.post(tokenUrl, body, httpOptions);
    })
      .pipe(
      tap(response => {
        console.log("tapped into repsponse");
        console.log(response);
        this.token = response.toString();
        if (this.token) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage
            .setItem('currentUser', JSON.stringify({ email: user.email, token: this.token }));
          console.log(this.isLoggedIn());
          this.loggedIn.emit(true);
          // return true to indicate successful login
        }
      }),
      catchError((error: any) => Observable.throw(error.error || 'Server error'))
      );


    // return this.httpClient
    //   .post(this.authUrl, body, { ...httpOptions, observe: 'response', responseType: 'text' })
    //   .pipe(
    //   tap(response => {
    //     this.token = response.headers.get('Authorization');
    //     if (this.token) {
    //       // store username and jwt token in local storage to keep user logged in between page refreshes
    //       localStorage
    //         .setItem('currentUser', JSON.stringify({ email: user.email, token: this.token }));
    //       console.log(this.isLoggedIn());
    //       this.loggedIn.emit(true);
    //       // return true to indicate successful login
    //     }
    //   }),
    //   catchError((error: any) => Observable.throw(error.error || 'Server error'))
    //   );
  }

  private getSecurityToken(user: User) {
    const body = JSON.stringify({ email: user.email, password: user.password });
    let self = this;
    return this.httpClient
      .post(this.securityTokenUrl, body, { ...httpOptions, observe: 'response', responseType: 'text' });
  }

  register(user: User) {

    const registerUrl = "https://osiol-test.herokuapp.com/api/user/registration";

    const body = JSON.stringify({ email: user.email, password: user.password });

    return this.httpClient.post(registerUrl, body, { ...httpOptions, observe: 'response', responseType: 'text' })
      .pipe(
      tap(_ => { },
        catchError((error: any) => Observable.throw(error.error || 'Server error'))));
  }

  getToken(): string {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const token = currentUser && currentUser.token;
    return token ? token : "";
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.loggedIn.emit(false);
  }

  isLoggedIn(): boolean {
    return this.getToken().length > 0;
  }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    const jwtHelper = new JwtHelper();
    let isTokenExpired;
    // Check whether the token is expired and return
    // true or false
    try {
      isTokenExpired = jwtHelper.isTokenExpired(token);
    } catch (e) { isTokenExpired = true; }
    return !isTokenExpired;
  }

}
