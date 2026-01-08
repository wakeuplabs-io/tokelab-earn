// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

const PROJECT_NAME = "tokelab-earn";
const CUSTOMER = "tokelab";

export default $config({
  app(input) {
    return {
      name: PROJECT_NAME,
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: {
          defaultTags: {
            tags: {
              customer: CUSTOMER,
              application: PROJECT_NAME,
              project: PROJECT_NAME,
              environment: input?.stage,
            },
          },
        },
      },
    };
  },

  async run() {
    // ─────────────────────────────────────────
    // Load env
    // ─────────────────────────────────────────
    const dotenv = await import("dotenv");
    dotenv.config();

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://d1tg30xkclf6bx.cloudfront.net",
    ];

    // ─────────────────────────────────────────
    // Assets bucket
    // ─────────────────────────────────────────
    const assetsBucket = new sst.aws.Bucket("assets", {
      access: "public",
      cors: {
        allowOrigins: allowedOrigins,
        allowMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        allowHeaders: ["*"],
      },
    });

    // ─────────────────────────────────────────
    // Assets CDN (NO custom domain)
    // ─────────────────────────────────────────
    const assetsCdn = new sst.aws.Cdn("assets-cdn", {
      origins: [
        {
          domainName: $interpolate`${assetsBucket.domain}`,
          originId: "assetsBucket",
        },
      ],
      defaultCacheBehavior: {
        targetOriginId: "assetsBucket",
        viewerProtocolPolicy: "redirect-to-https",
        compress: true,
        allowedMethods: ["GET", "HEAD", "OPTIONS"],
        cachedMethods: ["GET", "HEAD"],
        forwardedValues: {
          queryString: false,
          cookies: { forward: "none" },
        },
      },
    });

    // ─────────────────────────────────────────
    // API
    // ─────────────────────────────────────────
    const apiEnv = {
      DATABASE_URL: process.env.DATABASE_URL!,
      DIRECT_URL: process.env.DIRECT_URL!,
      FIREBLOCKS_API_KEY: process.env.FIREBLOCKS_API_KEY!,
      FIREBLOCKS_SECRET_KEY_PATH: process.env.FIREBLOCKS_SECRET_KEY_PATH!,
      FIREBLOCKS_BASE_URL: process.env.FIREBLOCKS_BASE_URL,
      FIREBLOCKS_WEBHOOK_SECRET: process.env.FIREBLOCKS_WEBHOOK_SECRET!,
      AUTH0_DOMAIN: process.env.AUTH0_DOMAIN!,
      AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
      NODE_ENV: $app.stage,
    };

    const apiFunction = new sst.aws.Function("api", {
      handler: "packages/api/src/index.handler",
      runtime: "nodejs20.x",
      environment: {
        ...apiEnv,
        ASSETS_BUCKET_NAME: $interpolate`${assetsBucket.name}`,
        ASSETS_URL: assetsCdn.url,
      },
      permissions: [
        {
          actions: ["s3:*"],
          resources: [$interpolate`${assetsBucket.arn}/*`],
        },
      ],
      copyFiles: [
        { from: "node_modules/.prisma/client/", to: ".prisma/client/" },
        { from: "node_modules/@prisma/client/", to: "@prisma/client/" },
        {
          from: "packages/api/src/generated/prisma/",
          to: "src/generated/prisma/",
        },
      ],
      nodejs: {
        format: "cjs",
      },
    });

    const api = new sst.aws.ApiGatewayV2("gateway", {
      cors: {
        allowOrigins: allowedOrigins,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowHeaders: ["*"],
      },
    });

    api.route("ANY /{proxy+}", apiFunction.arn);
    api.route("ANY /", apiFunction.arn);

    // ─────────────────────────────────────────
    // UI
    // ─────────────────────────────────────────
    const uiEnv = {
      VITE_API_URL: api.url,
      VITE_ASSETS_URL: assetsCdn.url,
      VITE_AUTH0_DOMAIN: process.env.AUTH0_DOMAIN!,
      VITE_AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID!,
      NODE_ENV: $app.stage,
    };

    const ui = new sst.aws.StaticSite("ui", {
      build: {
        command: "npm run build --workspace=packages/ui",
        output: "packages/ui/dist",
      },
      environment: uiEnv,
      indexPage: "index.html",
      errorPage: "index.html",
      assets: {
        textEncoding: "utf-8",
      },
    });

    // ─────────────────────────────────────────
    // Outputs
    // ─────────────────────────────────────────
    return {
      ui: ui.url,
      api: api.url,
      assetsUrl: assetsCdn.url,
      assetsBucketName: assetsBucket.name,
    };
  },
});
