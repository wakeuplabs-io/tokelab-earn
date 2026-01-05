/**
 * Vault Page
 * Main page for vault management
 */

import { useVault, useCreateVault } from "../../hooks/api/useVault";
import { Button } from "../../components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Loading } from "../../components/feedback/loading";
import { ErrorMessage } from "../../components/feedback/error-message";
import { useState } from "react";

export function VaultPage() {
  const { data: vault, isLoading, error, refetch } = useVault();
  const createVault = useCreateVault();
  const [vaultName, setVaultName] = useState("");

  const handleCreateVault = async () => {
    try {
      await createVault.mutateAsync({ name: vaultName || undefined });
      setVaultName("");
    } catch (error) {
      console.error("Failed to create vault:", error);
    }
  };

  if (isLoading) {
    return <Loading message="Loading vault..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={() => refetch()} />;
  }

  if (vault) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Your Vault</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {vault.name}
              </p>
              <p>
                <strong>Status:</strong> <span className="badge badge-primary">{vault.status}</span>
              </p>
              <p>
                <strong>Fireblocks Vault ID:</strong> {vault.fireblocksVaultId}
              </p>
              <p>
                <strong>Created:</strong> {new Date(vault.createdAt).toLocaleDateString()}
              </p>
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
          <CardTitle>Create Your Vault</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <Input
              label="Vault Name (optional)"
              placeholder="My Vault"
              value={vaultName}
              onChange={(e) => setVaultName(e.target.value)}
            />
            <Button
              onClick={handleCreateVault}
              isLoading={createVault.isPending}
              disabled={createVault.isPending}
            >
              Create Vault
            </Button>
            {createVault.isError && (
              <ErrorMessage error={createVault.error as Error} />
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

