import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.baseURL;
  private user?: User;

  constructor(private http:HttpClient) {}

  get currentUser():User|undefined {
    if( !this.user ) return undefined;
    return structuredClone( this.user );
  }
  login(email:string,password:string):Observable<User>{
    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe (
      tap( user => this.user = user ),
      tap( user=> localStorage.setItem('token','asdawdas.dawdasda.wdawd' )),
    )
  }
  logout(){
    this.user = undefined;
    localStorage.clear();
  }
  checkAuthentication():Observable<boolean> {
    if ( !localStorage.getItem('token') ) return of(false)
    const token = localStorage.getItem('token')
    return this.http.get<User>(`${this.baseUrl}/users/1`)
    .pipe(
      tap( user => this.user = user),
      map( user => !!user),
      catchError( err => of(false))
    )
  }


}
