import auth0, { AuthOptions } from "auth0-js";

export function clearAuthData() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("id_token");
  localStorage.removeItem("token_expiration");
}

export function init(config: AuthOptions) {
  const webAuth = new auth0.WebAuth(config);
  const authFunctions = {
    login: webAuth.authorize.bind(webAuth),
    get accessToken() {
      return localStorage.getItem("access_token");
    },
    get idToken() {
      return localStorage.getItem("id_token");
    },
    get isLoggedIn() {
      return authFunctions.idToken && authFunctions.accessToken;
    },
    get isExpired() {
      const expiresTimestamp = localStorage.getItem("token_expiration");
      if (!expiresTimestamp) {
        return false;
      }

      return Date.now() > +expiresTimestamp;
    },
    handleAuth() {
      return new Promise((resolve, reject) => {
        webAuth.parseHash((err, result) => {
          if (err && result !== null) {
            reject(err);
          }

          localStorage.setItem("access_token", result!.accessToken!);
          localStorage.setItem("id_token", result!.idToken!);

          if (result!.expiresIn) {
            localStorage.setItem(
              "token_expiration",
              (result!.idTokenPayload!.exp * 1000).toString()
            );
          }

          resolve();
        });
      });
    }
  };

  return authFunctions;
}

export type Auth = ReturnType<typeof init>;
