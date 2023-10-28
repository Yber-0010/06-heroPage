import { inject } from '@angular/core';
import { Router, CanMatchFn, CanActivateFn } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../service/auth.service';


function checkAuthStatus(): boolean | Observable<boolean> {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkAuthentication()
  .pipe(
    tap( isAuthenticated => console.log('Authtenticated: ',isAuthenticated)),
    tap( isAuthenticated => {
      if(!isAuthenticated) router.navigate(['./auth/login'])
    })
  )
}
/* actualmente estas funciones hacen lo mismo pero tiene diferente tipo */
export const AuthGuardCM:CanMatchFn = (route,segments) => {
  return checkAuthStatus();
}
export const AuthGuardCA: CanActivateFn = (route,state) => {
  return checkAuthStatus();
};


/* meotodo deprecado funcional */
/* @Injectable({providedIn: 'root'})
export class AuthGuard implements CanMatch, CanActivate {

  constructor(
    private authService:AuthService,
    private router: Router
  ) { }

  private checkAuthStatus(): boolean | Observable<boolean> {
    return this.authService.checkAuthentication()
    .pipe(
      tap( isAuthenticated => console.log('Authtenticated: ',isAuthenticated)),
      tap( isAuthenticated => {
        if(!isAuthenticated) this.router.navigate(['./auth/login'])
      })
    )
  }


  canMatch(route:Route,segments:UrlSegment[]):boolean | Observable<boolean>{
    // console.log('Can Match')
    // console.log({route,segments})
    // return false;
    return this.checkAuthStatus();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    // console.log('Can Activate')
    // console.log({route,state})
    // return false;
    return this.checkAuthStatus();
  }
} */
