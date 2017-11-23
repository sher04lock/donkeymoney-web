import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = new User();

  constructor(
    private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }



  onLogin(): void {
    this.authenticationService.login(this.user)
      .subscribe(() => this.router.navigate(["/dashboard"]));
  }


  ngOnInit() {
    const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate([returnUrl]);
    }
  }
}
