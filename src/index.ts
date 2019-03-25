import authConfig from "./auth.config";
import * as Auth from "./auth/auth";
import { Api } from "./api/Api";
import { renderApp } from "./App";

const auth = Auth.init(authConfig);

async function main(): Promise<void> {
  if (window.location.pathname.startsWith("/callback")) {
    await auth.handleAuth();
    window.history.pushState({}, "", "/");
    return main();
  }

  if (auth.isExpired || !auth.isLoggedIn) {
    return auth.login();
  }

  const api = Api.init({
    baseUrl: window.location.origin + "/api/",
    idToken: auth.idToken!
  });

  renderApp(api);
}

main();
