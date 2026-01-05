/**
 * Home Page
 */

import { useAuth } from "../../hooks/auth/useAuth";
import { Button } from "../../components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "../../components/ui/card";
import { Link } from "@tanstack/react-router";

export function HomePage() {
  const { isAuthenticated, user, login } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Web3 Custody Platform</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="mb-4">Please log in to access your vault.</p>
            <Button onClick={login}>Log In</Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.email}</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <p>You are logged in. Manage your vault to get started.</p>
            <Link to="/vault">
              <Button>Go to Vault</Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

