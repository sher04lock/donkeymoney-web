import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";

import { Observable } from "rxjs/Observable";
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { config } from './config';

import { User } from './user';
import { AuthResponse } from './authResponse';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class AuthenticationService {

  private authTemplate: string;
  private token: string;

  private securityToken: string;
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();

  constructor(private httpClient: HttpClient, private messageService: MessageService) { }

  login(user: User) {
    const body = JSON.stringify({ email: user.email, password: user.password });
    let self = this;

    return this.getSecurityToken(user).flatMap(response => {
      const url = `${config.API_URL}/services/oauth2/token`;
      return this.httpClient.post<AuthResponse>(url, body, {
        params: {
          ...config.sf_client,
          "username": user.email,
          "password": user.password + response.securityToken
        },
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "web"
        }
      });
    })
      .pipe(
      tap(response => {
        this.token = response.access_token;
        if (this.token) {
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage
            .setItem('currentUser', JSON.stringify({ email: user.email, token: this.token }));
          this.loggedIn.emit(true);
        }
      }),
      catchError((error: any) => Observable.throw(error.error || 'Server error'))
      );
  }

  private getSecurityToken(user: User) {
    const body = JSON.stringify({ email: user.email, password: user.password });
    const url = `${config.ACTIVATE_URL}/securityToken`;
    return this.httpClient
      .post<{securityToken: string}>(url, body, httpOptions);
  }

  register(user: User) {

    // TODO: replece url with saleforce endpoint
    const registerUrl = "https://osiol-test.herokuapp.com/api/users";

    const body = JSON.stringify({ email: user.email, password: user.password });

    return this.httpClient.post(registerUrl, user, { ...httpOptions, observe: 'response', responseType: 'text' })
      .pipe(
      tap(_ => { },
        catchError((error: any) => Observable.throw(error.error || 'Server error'))));
  }

  activate(user: User, token: string) {
    const url = `${config.ACTIVATE_URL}/registration`;
    const body = JSON.stringify({ email: user.email, password: user.password, securityToken: token });
    return this.httpClient.post(url, body, httpOptions);
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
    // const token = this.getToken();
    // const jwtHelper = new JwtHelper();
    // let isTokenExpired;
    // // Check whether the token is expired and return
    // // true or false
    // try {
    //   isTokenExpired = jwtHelper.isTokenExpired(token);
    // } catch (e) { isTokenExpired = true; }
    // return !isTokenExpired;
    return this.getToken().length > 0;
  }
}
