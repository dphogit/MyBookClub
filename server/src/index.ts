import "reflect-metadata";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  PluginDefinition,
} from "apollo-server-core";
import express from "express";
import { COOKIE_NAME, IS_PRODUCTION } from "./common/constants";
import { buildSchema } from "type-graphql";
import { createConnection, getRepository } from "typeorm";
import session from "express-session";

import UserResolver from "./resolver/UserResolver";
import { TypeormStore } from "connect-typeorm/out";
import Session from "./entity/Session";

dotenv.config();

const PORT = process.env.PORT || 8080;
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 10; // 10 years
const SESSION_TIME_TO_LIVE = 86400; // 1 Day

const main = async () => {
  await createConnection();

  const app = express();

  app.use(
    session({
      name: COOKIE_NAME,
      resave: false,
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET!,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        maxAge: COOKIE_MAX_AGE,
        secure: IS_PRODUCTION,
      },
      store: new TypeormStore({
        cleanupLimit: 10, // Removes maximum 10 expired sessions
        ttl: SESSION_TIME_TO_LIVE,
      }).connect(getRepository(Session)),
    })
  );

  const plugins: PluginDefinition[] = [];
  if (!IS_PRODUCTION) {
    plugins.push(ApolloServerPluginLandingPageGraphQLPlayground());
  }

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    plugins,
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => console.log(`Express started on port: ${PORT}`));
};

main().catch((e) => console.log(e));
