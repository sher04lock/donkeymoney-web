import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthenticationService } from '../authentication.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = new User();
  constructor(private authenticationService: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  onRegister() {
    this.authenticationService
      .register(this.user)
      .subscribe(() => this.router.navigate(["/login"]));
  }
  ngOnInit() {
    const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
    if (this.authenticationService.isAuthenticated()) {
      this.router.navigate([returnUrl]);
    }
  }

}


