import { AfterViewInit, Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UserManager } from '../../../src/UserManager';
import { Log } from '../../../src/utils';

@Component({
  selector: 'app-root',
  template: `<div>
    ANGULAR DBG MODULE V1.0032
    <button (click)="user ? _signout() : _signin()" style="margin-left: 2rem;">
      {{ user ? 'sign-out' : 'sign-in' }}
    </button>
    <button (click)="_silent()" style="margin-left: 2rem;">silent</button>
  </div>`,
})
class AppComponent implements AfterViewInit {
  user?: any;

  private userManager?: UserManager;

  constructor() {
    console.log('<AppComponent>');
  }

  ngAfterViewInit(): void {
    const settings = {
      authority: 'https://demo.identityserver.io/',
      client_id: 'interactive.public',
      redirect_uri: `http://localhost:4200/assets/signin-callback.html`,
      silent_redirect_uri: `http://localhost:4200/assets/silent-callback.html`,
      post_logout_redirect_uri: `http://localhost:4200/assets/signout-callback.html`,
      response_type: 'code',
      scope: 'openid profile email api',
      silentRequestTimeoutInSeconds: 2.5,
    };
    this.userManager = new UserManager(settings);
    console.log(this.userManager);
    Log.level = Log.DEBUG;
    Log.logger = console;
  }

  _signin() {
    console.log('<signin>');

    this.userManager
      ?.signinRedirect()
      .then((u) => this.adopt(u))
      .catch((e) => this.error(e));
  }

  _signout() {
    console.log('<signout>');

    this.userManager
      ?.signoutRedirect()
      .then((u) => this.adopt(u))
      .catch((e) => this.error(e));
  }

  _silent() {
    console.log('<silent>');

    this.userManager
      ?.signinSilent()
      .then((u) => this.adopt(u))
      .catch((e) => this.error(e));
  }

  private adopt(u?: any) {
    this.user = u;
    console.log(u);
  }

  private error(e: any) {
    this.user = undefined;
    console.log(e.message);
  }
}

@NgModule({
  declarations: [],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
