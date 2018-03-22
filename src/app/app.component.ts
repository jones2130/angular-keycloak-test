import { Component } from '@angular/core';

import { KeycloakHttp } from './keycloak/keycloak.http';
import { KeycloakService } from './keycloak/keycloak.service';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  titleToken = 'User Information Obtained from the Token';
  titleAPIList = 'User List optained via Keycloak HTTP API Call';

  isTokenCardVisible: boolean = false;
  isAPICardsVisible: boolean = false;

  username: string;
  fullName: string;
  usersArray = [];

  constructor(private http: KeycloakHttp) {

  }

  logout(): void {
    KeycloakService.logout();
  }

  getUserInfoFromToken(): void {
    this.username = KeycloakService.getUsername();
    this.fullName = KeycloakService.getFullName();

    this.isTokenCardVisible = true;
  }

  getUsersFromJsonApi(): void {
    this.http.get(environment.usersApiRootUrl)
      .map(res => res.json())
      .subscribe((result) => {
        this.usersArray = result;
        this.isAPICardsVisible = true;
      },
      (err) => console.error(err),
      () => console.log('Request Completed :: AppComponent.getUsersFromJsonApi()')
    );
  }

  reset(): void {
    this.isTokenCardVisible = false;
    this.isAPICardsVisible = false;

    this.usersArray = [];
  }
}
