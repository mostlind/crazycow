import authConfig from "./auth.config";
import * as Auth from "./auth/auth";
import { Api } from "./api/Api";
import { renderApp } from "./App";

if (process.env.BACKEND_URL === undefined) {
  throw new Error("must provide backendUrl as environment variable");
}

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
    baseUrl: process.env.BACKEND_URL!,
    idToken: auth.idToken!
  });

  renderApp(api);
}

main();
