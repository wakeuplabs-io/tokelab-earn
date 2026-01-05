/**
 * Auth0 Configuration
 */

import { config } from "../config/env";

export const auth0Config = {
  domain: config.AUTH0_DOMAIN,
  clientId: config.AUTH0_CLIENT_ID,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: config.AUTH0_AUDIENCE,
  },
};

