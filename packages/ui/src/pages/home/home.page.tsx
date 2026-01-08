/**
 * Home Page
 */

import { useAuth } from "../../hooks/auth/useAuth";
import { useHealth } from "../../hooks/api/useHealth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { SearchInput } from "../../components/ui/search-input";
import { Card, CardBody, CardHeader, CardTitle } from "../../components/ui/card";
import { Link } from "@tanstack/react-router";
import { HiChevronRight } from "react-icons/hi";

export function HomePage() {
  const { isAuthenticated, user, login } = useAuth();
  const { data: health, isLoading: healthLoading, refetch: checkHealth } = useHealth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Web3 Custody Platform</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="mb-4">Please log in to access your vault.</p>
            <Button onClick={login}>Log In</Button>
          </CardBody>
        </Card>

        {/* Button Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Button Examples</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-8">
              {/* Primary Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Primary Buttons</h3>

                {/* No Icon */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-neutral-l-grey">No icon</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="primary">Label</Button>
                    <Button variant="primary" isLoading>
                      Label
                    </Button>
                    <Button variant="primary" disabled>
                      Label
                    </Button>
                  </div>
                </div>

                {/* Icon Right */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-neutral-l-grey">Icon right</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="primary">
                      Label <HiChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button variant="primary" isLoading>
                      Label <HiChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button variant="primary" disabled>
                      Label <HiChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Secondary Buttons */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Secondary Buttons</h3>

                {/* No Icon */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-neutral-l-grey">No icon</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="secondary">Label</Button>
                    <Button variant="secondary" isLoading>
                      Label
                    </Button>
                    <Button variant="secondary" disabled>
                      Label
                    </Button>
                  </div>
                </div>

                {/* Icon Right */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-neutral-l-grey">Icon right</p>
                  <div className="flex flex-wrap gap-4 items-center">
                    <Button variant="secondary">
                      Label <HiChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button variant="secondary" isLoading>
                      Label <HiChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                    <Button variant="secondary" disabled>
                      Label <HiChevronRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Input Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Input Examples</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-8">
              {/* Input - No icon */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Input - No icon</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-l-grey">Default</p>
                    <Input placeholder="Label" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-l-grey">Error</p>
                    <Input placeholder="Label" error="Error message" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-l-grey">Success</p>
                    <Input placeholder="Label" success />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-l-grey">Disabled</p>
                    <Input placeholder="Label" disabled />
                  </div>
                </div>
              </div>

              {/* Input - Icon right */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Input - Icon right</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-l-grey">Default</p>
                    <Input placeholder="Label" iconRight={<span>%</span>} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-l-grey">Error</p>
                    <Input placeholder="Label" iconRight={<span>%</span>} error="Error message" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-l-grey">Success</p>
                    <Input placeholder="Label" iconRight={<span>%</span>} success />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-l-grey">Disabled</p>
                    <Input placeholder="Label" iconRight={<span>%</span>} disabled />
                  </div>
                </div>
              </div>

              {/* Search Input */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Search</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-l-grey">Default</p>
                    <SearchInput onSearch={(value) => console.log("Search:", value)} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-l-grey">Error</p>
                    <SearchInput
                      onSearch={(value) => console.log("Search:", value)}
                      error="Error message"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-neutral-l-grey">Success</p>
                    <SearchInput onSearch={(value) => console.log("Search:", value)} success />
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Health Check Card */}
        <Card>
          <CardHeader>
            <CardTitle>API Connection Status</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              {healthLoading ? (
                <p className="text-sm text-gray-500">Checking connection...</p>
              ) : health ? (
                <div className="space-y-1">
                  <p className="text-sm">
                    <span className="font-semibold">Status:</span>{" "}
                    <span className="badge badge-success">{health.status}</span>
                  </p>
                  <p className="text-xs text-gray-500">
                    Last checked: {new Date(health.timestamp).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-error">Failed to connect to API</p>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => checkHealth()}
                disabled={healthLoading}
              >
                {healthLoading ? "Checking..." : "Check Connection"}
              </Button>
            </div>
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
