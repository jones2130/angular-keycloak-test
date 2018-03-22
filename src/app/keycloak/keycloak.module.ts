import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestOptions, XHRBackend } from '@angular/http';

import { KeycloakHttp, keycloakHttpFactory } from './keycloak.http';
import { KeycloakService } from './keycloak.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    { provide: KeycloakHttp, useFactory: keycloakHttpFactory, deps: [XHRBackend, RequestOptions, KeycloakService]},
    KeycloakService
  ]
})
export class KeycloakModule { }
