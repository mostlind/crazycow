if (
  [
    process.env.AUTH0_DOMAIN,
    process.env.AUTH0_CLIENT_ID,
    process.env.REDIRECT_URL
  ].some(x => x === undefined)
) {
  throw new Error(
    "must provide auth0 domain, auth0 clientId, and redirect url as env vars"
  );
}

export default {
  domain: process.env.AUTH0_DOMAIN!,
  clientID: process.env.AUTH0_CLIENT_ID!,
  redirectUri: process.env.REDIRECT_URL!,
  responseType: "token id_token",
  scope: "openid http://role.claim/role"
};
