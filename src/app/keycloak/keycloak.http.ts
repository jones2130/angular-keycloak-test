import { Injectable } from '@angular/core';
import { ConnectionBackend, Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response, XHRBackend} from '@angular/http';

import { KeycloakService } from './keycloak.service';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/map';

@Injectable()
export class KeycloakHttp extends Http {
  constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private keycloakService: KeycloakService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    const tokenPromise: Promise<any> = this.keycloakService.getToken();
    const tokenObservable: Observable<any> = Observable.fromPromise(tokenPromise);

    if(typeof url === 'string') {
      return tokenObservable.map(token => {
        const authOptions = new RequestOptions({
          headers: new Headers({
            'Authorization': `Bearer ${token}`
          })
        });

        return new RequestOptions().merge(options).merge(authOptions);
      }).concatMap(opts => super.request(url, opts));
    } else if(url instanceof Request) {
      return tokenObservable.map(token => {
        url.headers.set('Authorization', `Bearer ${token}`);
        return url;
      }).concatMap(request => super.request(request));
    }
  }
}

export function keycloakHttpFactory(backend: XHRBackend, defaultOptions: RequestOptions, keycloakService: KeycloakService) {
  return new KeycloakHttp(backend, defaultOptions, keycloakService);
}
