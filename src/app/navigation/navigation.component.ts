import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  loggedIn: boolean;

  constructor(private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit() {
    this.loggedIn = this.authenticationService.isAuthenticated();
    this.authenticationService.loggedIn.subscribe(is => this.loggedIn = is);
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/home"]);
  }
}
