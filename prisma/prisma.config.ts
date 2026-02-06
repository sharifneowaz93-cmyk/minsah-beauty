import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("SHADOW_DATABASE_URL"),
    shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
  },
});
// import "dotenv/config";
// import { defineConfig } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//     seed: "npx tsx prisma/seed.ts",
//   },
//   datasource: {
//     url: process.env.DATABASE_URL!,
//   },
// });

// import "dotenv/config";
// import { defineConfig, env } from "prisma/config";

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   migrations: {
//     path: "prisma/migrations",
//   },
//   datasource: {
//     url: env("DATABASE_URL"),
//     shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
//   },
// });

// import 'dotenv/config'
// import { defineConfig, env } from "prisma/config";

// export default defineConfig({
//   schema: './prisma/schema.prisma',
//   migrations: {
//     path: './prisma/migrations',
//     seed: 'npx tsx prisma/seed.ts',
//   },
//   datasource: {
//     url: env("DATABASE_URL"),
//   },
// });
