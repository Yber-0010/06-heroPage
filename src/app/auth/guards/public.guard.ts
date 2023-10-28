import { inject } from '@angular/core';
import { Router, CanMatchFn, CanActivateFn } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../service/auth.service';


function checkAuthStatus(): boolean | Observable<boolean> {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.checkAuthentication()
    .pipe(
      tap( isAuthenticated => {
        if(isAuthenticated) router.navigate(['./'])
      }),
      map(isAuthenticated => !isAuthenticated)
    )
}
/* actualmente estas funciones hacen lo mismo pero tiene diferente tipo */
export const PublicGuardCM:CanMatchFn = (route,segments) => {
  return checkAuthStatus();
}
export const PublicGuardCA:CanActivateFn = (route,state) => {
  return checkAuthStatus();
};



/* metodo deprecado */
// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
// import { Observable, map, tap } from 'rxjs';
// import { AuthService } from '../service/auth.service';

// @Injectable({providedIn: 'root'})
// export class PublicGuard implements CanMatch, CanActivate {
//   constructor(
//     private authService:AuthService,
//     private router: Router
//   ) { }

//   private checkAuthStatus(): boolean | Observable<boolean> {
//     return this.authService.checkAuthentication()
//     .pipe(
//       tap( isAuthenticated => {
//         if(isAuthenticated) this.router.navigate(['./'])
//       }),
//       map(isAuthenticated => !isAuthenticated)
//     )
//   }

//   canMatch(route:Route,segments:UrlSegment[]):boolean | Observable<boolean>{
//     // console.log('Can Match')
//     // console.log({route,segments})
//     // return false;
//     return this.checkAuthStatus();
//   }
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
//     // console.log('Can Activate')
//     // console.log({route,state})
//     // return false;
//     return this.checkAuthStatus();
//   }
// }
