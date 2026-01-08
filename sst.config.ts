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
    console.log("🚀 [SST] Starting run() function");
    console.log("📋 [SST] Stage:", $app.stage);
    console.log("📋 [SST] App name:", $app.name);
    
    // load environment variables
    console.log("🔧 [SST] Loading environment variables...");
    const dotenv = await import("dotenv");
    dotenv.config();
    console.log("✅ [SST] Environment variables loaded");

    console.log("🌐 [SST] Calculating domain URLs...");
    const stageSuffix =
      $app.stage === "production" ? "" : $app.stage === "staging" ? "-staging" : "-dev";
    const UI_DOMAIN_URL = `${PROJECT_NAME}${stageSuffix}`;
    const UI_URL = `https://${UI_DOMAIN_URL}`;

    const API_DOMAIN_URL = `api.${UI_DOMAIN_URL}`;
    const API_URL = `https://${API_DOMAIN_URL}`;

    const ASSETS_DOMAIN_URL = `assets.${UI_DOMAIN_URL}`;
    const ASSETS_URL = `https://${ASSETS_DOMAIN_URL}`;
    console.log("✅ [SST] Domain URLs calculated:", { UI_URL, API_URL, ASSETS_URL });

    const allowedOrigins = [
      UI_URL,
      API_URL,
      ...($app.stage !== "production"
        ? [
            "http://localhost:3000", // for local development
            "http://localhost:3001", // for API dev server
          ]
        : []),
    ];

    console.log("allowedOrigins", allowedOrigins);
    // --> Assets bucket and cloudfront distribution

    console.log("📦 [SST] Creating assets bucket...");
    const assetsBucket = new sst.aws.Bucket("assets", {
      access: "public",
      cors: {
        allowOrigins: allowedOrigins,
        allowMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        allowHeaders: ["*"],
      },
    });
    console.log("✅ [SST] Assets bucket created:", assetsBucket.name);

    //SST Router wouldn't create cloudfront, so using this instead
    console.log("🌐 [SST] Creating assets CDN...");
    new sst.aws.Cdn("assets-cdn", {
      domain: ASSETS_DOMAIN_URL,
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
        maxTtl: 2592000,
        forwardedValues: {
          queryString: false,
          cookies: { forward: "none" },
        },
      },
    });
    console.log("✅ [SST] Assets CDN created");

    // <-- Assets bucket and cloudfront distribution

    console.log("🔧 [SST] Preparing API environment variables...");
    const apiEnv = {
      API_URL: API_URL,
      ASSETS_URL: ASSETS_URL,
      ASSETS_BUCKET_NAME: assetsBucket.name,
      CORS_ORIGINS: allowedOrigins.join(","),
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
    console.log("✅ [SST] API environment variables prepared");
    console.log("📝 [SST] API env keys:", Object.keys(apiEnv).join(", "));

    console.log("⚡ [SST] Creating API function...");
    const apiFunction = new sst.aws.Function("api", {
      handler: "packages/api/src/index.handler",
      environment: {
        ...apiEnv,
        ASSETS_BUCKET_NAME: $interpolate`${assetsBucket.name}`,
      },
      permissions: [
        {
          actions: ["s3:PutObject", "s3:PutObjectAcl", "s3:GetObject", "s3:ListBucket"],
          resources: [$interpolate`${assetsBucket.arn}/*`],
        },
      ],
      copyFiles: [
        {
          from: "node_modules/.prisma/client/",
          to: ".prisma/client/",
        },
        {
          from: "node_modules/@prisma/client/",
          to: "@prisma/client/",
        },
        {
          from: "packages/api/src/generated/prisma/",
          to: "src/generated/prisma/",
        },
      ],
    });
    console.log("✅ [SST] API function created:", apiFunction.arn);

    // deploy API Gateway with custom domain
    console.log("🚪 [SST] Creating API Gateway...");
    const api = new sst.aws.ApiGatewayV2("gateway", {
      domain: API_DOMAIN_URL,
      cors: {
        allowOrigins: allowedOrigins,
        allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowHeaders: ["*"],
      },
    });

    // Add routes to connect API Gateway to the function
    console.log("🛣️  [SST] Adding API routes...");
    api.route("ANY /{proxy+}", apiFunction.arn);
    api.route("ANY /", apiFunction.arn);
    console.log("✅ [SST] API routes added");
    // <-- API deployment

    console.log("🎨 [SST] Preparing UI environment variables...");
    // Prepare UI environment
    const uiEnv = {
      VITE_API_URL: API_URL,
      VITE_ASSETS_URL: ASSETS_URL,
      VITE_AUTH0_DOMAIN: process.env.AUTH0_DOMAIN!,
      VITE_AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID!,
      NODE_ENV: $app.stage,
    };
    console.log("✅ [SST] UI environment variables prepared");
    console.log("📝 [SST] UI env keys:", Object.keys(uiEnv).join(", "));

    // --> UI deployment
    console.log("🌐 [SST] Processing UI domain configuration...");
    const domainRoot = UI_DOMAIN_URL.replace(/^https?:\/\/(www\.)?/, "");
    const domainAlias = UI_DOMAIN_URL.replace(/^https?:\/\//, "");
    console.log("📋 [SST] Domain root:", domainRoot, "Domain alias:", domainAlias);

    console.log("🎨 [SST] Creating UI StaticSite...");
    const ui = new sst.aws.StaticSite("ui", {
      build: {
        command: "npm run build:ui",
        output: "packages/ui/dist",
      },
      domain: {
        name: domainRoot,
        aliases: domainAlias !== domainRoot ? [domainAlias] : [],
      },
      environment: uiEnv,
      assets: {
        textEncoding: "utf-8",
        fileOptions: [
          {
            files: ["**/*.css", "**/*.js"],
            cacheControl: "max-age=31536000,public,immutable",
          },
          {
            files: "**/*.html",
            cacheControl: "max-age=0,no-cache,no-store,must-revalidate",
          },
          {
            files: ["**/*.png", "**/*.jpg", "**/*.jpeg", "**/*.gif", "**/*.svg"],
            cacheControl: "max-age=2592000,public,immutable",
          },
          {
            files: ["**/*.ttf", "**/*.woff", "**/*.woff2"],
            cacheControl: "max-age=31536000,public,immutable",
          },
        ],
      },
      indexPage: "index.html",
      errorPage: "index.html",
      edge: {
        viewerResponse: {
          injection: `
              event.response.headers["content-security-policy"] = {value: "default-src 'self' wss://*.crisp.chat wss://*.web3auth.io wss://*.tor.us https://*.web3auth.io https://*.tor.us https://*.crisp.chat https://*.sentry.io https://fonts.googleapis.com https://fonts.gstatic.com https://*.googletagmanager.com https://*.google-analytics.com https://accounts.google.com https://*.doubleclick.net https://hcaptcha.com https://*.hcaptcha.com; script-src 'self' 'unsafe-inline' https://cmp.osano.com https://www.googletagmanager.com https://browser.sentry-cdn.com https://js.sentry-cdn.com https://accounts.google.com https://*.doubleclick.net https://hcaptcha.com https://*.hcaptcha.com https://*.getmati.com blob:; style-src 'self' 'unsafe-inline' https://client.crisp.chat https://fonts.googleapis.com https://accounts.google.com https://hcaptcha.com https://*.hcaptcha.com; img-src 'self' * data: https://*.web3auth.io https://*.tor.us https://*.crisp.chat; frame-src 'self' https://*.getmati.com https://*.web3auth.io; object-src 'none'; connect-src 'self' * https://hcaptcha.com https://*.hcaptcha.com;"};
              event.response.headers["referrer-policy"] = {value: "no-referrer"};
              event.response.headers["access-control-allow-origin"] = {value: "*"};
              event.response.headers["access-control-allow-methods"] = {value: "GET, HEAD, OPTIONS"};
              event.response.headers["access-control-allow-headers"] = {value: "*"};
              event.response.headers["access-control-expose-headers"] = {value: "ETag"};
            `,
        },
      },
    });
    console.log("✅ [SST] UI StaticSite created");

    // <-- UI deployment

    console.log("📤 [SST] Preparing return values...");
    const returnValues = {
      ui: ui.url,
      api: api.url,
      assetsUrl: ASSETS_URL,
      assetsBucketName: assetsBucket.name,
    };
    console.log("✅ [SST] Return values prepared:", returnValues);
    console.log("🎉 [SST] run() function completed successfully");
    return returnValues;
  },
});
