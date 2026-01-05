/**
 * Authentication Middleware
 * Auth0 JWT verification
 * 
 * Verifies JWT tokens issued by Auth0 using JWKS (JSON Web Key Set)
 */

import { Context, Next } from "hono";
import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import jwksClient, { type SigningKey } from "jwks-rsa";
import { getEnv } from "../../config/env";

// Cache for JWKS client (singleton)
let jwksClientInstance: jwksClient.JwksClient | null = null;

function getJwksClient(): jwksClient.JwksClient {
  if (!jwksClientInstance) {
    const env = getEnv();
    jwksClientInstance = jwksClient({
      jwksUri: `https://${env.AUTH0_DOMAIN}/.well-known/jwks.json`,
      cache: true,
      cacheMaxAge: 86400000, // 24 hours
      rateLimit: true,
      jwksRequestsPerMinute: 5,
    });
  }
  return jwksClientInstance;
}

/**
 * Get signing key from Auth0 JWKS
 */
function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  const client = getJwksClient();
  
  if (!header.kid) {
    return callback(new Error("Token missing kid (key ID)"));
  }
  
  client.getSigningKey(header.kid, (err: Error | null, key?: jwksClient.SigningKey) => {
    if (err) {
      return callback(err);
    }
    if (!key) {
      return callback(new Error("Signing key not found"));
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

/**
 * Verify Auth0 JWT token and extract user information
 */
export async function authMiddleware(c: Context, next: Next) {
  try {
    // Get token from Authorization header
    const authHeader = c.req.header("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ error: "Unauthorized: Missing or invalid Authorization header" }, 401);
    }

    const token = authHeader.substring(7);
    const env = getEnv();

    // Verify JWT token with Auth0
    const decoded = await new Promise<jwt.JwtPayload>((resolve, reject) => {
      jwt.verify(
        token,
        getKey,
        {
          audience: env.AUTH0_AUDIENCE,
          issuer: `https://${env.AUTH0_DOMAIN}/`,
          algorithms: ["RS256"],
        },
        (err: jwt.VerifyErrors | null, decoded?: string | jwt.JwtPayload) => {
          if (err) {
            reject(err);
          } else if (!decoded || typeof decoded === "string") {
            reject(new Error("Invalid token payload"));
          } else {
            resolve(decoded as jwt.JwtPayload);
          }
        }
      );
    });

    // Extract user ID from token
    // Auth0 uses 'sub' (subject) as the user identifier
    // Format: auth0|userId or provider|userId
    const userId = decoded.sub;

    if (!userId) {
      return c.json({ error: "Invalid token: Missing user identifier" }, 401);
    }

    // Set user ID in context for use in controllers
    c.set("userId", userId);
    
    // Optionally set other user info from token
    if (decoded.email) {
      c.set("userEmail", decoded.email);
    }
    c.set("userToken", decoded);

    await next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return c.json({ error: "Invalid token" }, 401);
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return c.json({ error: "Token expired" }, 401);
    }
    
    return c.json({ error: "Unauthorized" }, 401);
  }
}

/**
 * Optional: Admin-only middleware
 * Checks if user has admin role from Auth0 token
 */
export async function adminMiddleware(c: Context, next: Next) {
  const userToken = c.get("userToken") as JwtPayload | undefined;
  
  if (!userToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Check for admin role in token
  // Auth0 roles/permissions are typically in:
  // - userToken['https://your-namespace/roles'] (custom claim)
  // - userToken.permissions (if using RBAC)
  // - userToken.app_metadata.roles (if configured)
  
  const roles = userToken["https://your-namespace/roles"] || userToken.permissions || [];
  const isAdmin = Array.isArray(roles) && roles.includes("admin");

  if (!isAdmin) {
    return c.json({ error: "Forbidden: Admin access required" }, 403);
  }

  await next();
}

