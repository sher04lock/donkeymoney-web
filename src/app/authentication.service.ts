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
  private token: string;
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();

  constructor(private httpClient: HttpClient, private messageService: MessageService) { }

  login(user: User) {
    const body = JSON.stringify({ email: user.email, password: user.password });
    return this.httpClient
      .post(this.authUrl, body, { ...httpOptions, observe: 'response', responseType: 'text' })
      .pipe(
      tap(response => {
        this.token = response.headers.get('Authorization');
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
