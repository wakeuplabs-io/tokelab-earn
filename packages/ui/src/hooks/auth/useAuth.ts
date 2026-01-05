/**
 * Auth Hook
 * Wrapper for Auth0 authentication
 */

import { useAuth0 } from "@auth0/auth0-react";

export function useAuth() {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout, getAccessTokenSilently } =
    useAuth0();

  return {
    user,
    isAuthenticated,
    isLoading,
    login: () => loginWithRedirect(),
    logout: () => logout({ logoutParams: { returnTo: window.location.origin } }),
    getToken: getAccessTokenSilently,
  };
}
