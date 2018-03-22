import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { KeycloakModule } from './keycloak/keycloak.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    KeycloakModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
