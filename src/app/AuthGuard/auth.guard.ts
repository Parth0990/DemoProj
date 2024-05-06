import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private route:Router, private activatedRoute: ActivatedRoute){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const url: Observable <string> = this.activatedRoute.url.pipe(map((x)=> x.join('')));
      
      if(!localStorage.getItem('CompanyId')){
        this.route.navigate(['login']);
      }
      return true;
  }
  
}