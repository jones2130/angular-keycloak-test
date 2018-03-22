import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

import { KeycloakAuth } from './keycloak-auth';

declare let Keycloak: any;

@Injectable()
export class KeycloakService {
  static auth: KeycloakAuth = {
    loggedIn: false,
    authz: null,
    logoutUrl: null
  };

  constructor() { }

  static init(): Promise<any> {
    const keycloakAuth:any = Keycloak({
      url: environment.keycloakRootUrl,
      realm: environment.realm,
      clientId: environment.clientId,
      'ssl-required': environment.sslRequired,
      'public-client': environment.publicClient,
    });

    KeycloakService.auth.loggedIn = false;

    return new Promise((resolve, reject) => {
      keycloakAuth.init({onLoad: 'login-required'})
        .success(() => {
          console.log(keycloakAuth);
          KeycloakService.auth.loggedIn = true;
          KeycloakService.auth.authz = keycloakAuth;
          KeycloakService.auth.logoutUrl = `${keycloakAuth.authServerUrl}/realms/${environment.realm}/protocol/openid-connect/logout?redirect_uri=${document.baseURI}`;
          resolve();
        }).error(() => {
          reject();
        })
    });
  }

  static logout() {
    console.log('** LOGOUT');
    KeycloakService.auth.loggedIn = false;
    KeycloakService.auth.authz = null;

    window.location.href = KeycloakService.auth.logoutUrl;
  }

  static getUsername(): string {
    return KeycloakService.auth.authz.tokenParsed.preferred_username;
  }

  static getFullName(): string {
    return KeycloakService.auth.authz.tokenParsed.name;
  }

  getToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(KeycloakService.auth.authz.token) {
        KeycloakService.auth.authz.updateToken(5)
          .success(() => {
            resolve(KeycloakService.auth.authz.token);
          }).error(() => {
            reject('Not logged in');
          });
      }
    })
  }
}
