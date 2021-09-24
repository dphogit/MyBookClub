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
import { createConnection } from "typeorm";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import { books } from "@googleapis/books";

import UserResolver from "./resolver/UserResolver";
import BookRatingResolver from "./resolver/BookRatingResolver";

dotenv.config();

const PORT = process.env.PORT || 8080;
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 365 * 10; // 10 years
const SESSION_TIME_TO_LIVE = 86400; // 1 Day

const main = async () => {
  await createConnection();

  const googleBooks = books("v1");

  const app = express();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

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
      store: new (connectPgSimple(session))({
        ttl: SESSION_TIME_TO_LIVE,
        conString: process.env.POSTGRES_URI,
      }),
      unset: "destroy",
    })
  );

  const plugins: PluginDefinition[] = [];
  if (!IS_PRODUCTION) {
    plugins.push(ApolloServerPluginLandingPageGraphQLPlayground());
  }

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, BookRatingResolver],
    }),
    plugins,
    context: ({ req, res }) => ({ req, res, googleBooks }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(PORT, () => console.log(`Express started on port: ${PORT}`));
};

main().catch((e) => console.log(e));
