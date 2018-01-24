import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './authentication.service';

/**
 * Auth Guard is used to properly redirect authenticated and not authenticated users
 */
@Injectable()
export class AuthGuardService implements CanActivate {
    constructor(public auth: AuthenticationService, public router: Router) { }
    canActivate(): boolean {
        try {
            if (!this.auth.isAuthenticated()) {
                this.router.navigate(['login']);
                return false;
            }
            return true;
        } catch (e) {
            this.router.navigate(['login']);
            return false;
        }
    }
}
