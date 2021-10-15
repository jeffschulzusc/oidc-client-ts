import { Injectable } from "@angular/core";
import { Log, User, UserManager } from "oidc-client-ts";
import { environment } from "src/environments/environment";

export { User };

Log.level = Log.DEBUG;
Log.logger = console;

@Injectable({
  providedIn: "root",
})
export class AuthService {
  userManager: UserManager;

  constructor() {
    const settings = {
      authority: environment.stsAuthority,
      client_id: environment.clientId,
      redirect_uri: `${environment.clientRoot}assets/signin-callback.html`,
      silent_redirect_uri: `${environment.clientRoot}assets/silent-callback.html`,
      post_logout_redirect_uri: `${environment.clientRoot}`,
      response_type: "code",
      scope: environment.clientScope,
    };
    this.userManager = new UserManager(settings);
  }

  public getUser(): Promise<User> {
    return this.userManager.getUser();
  }

  public login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  public renewToken(): Promise<User> {
    return this.userManager.signinSilent();
  }

  public logout(): Promise<void> {
    return this.userManager.signoutRedirect();
  }
}
