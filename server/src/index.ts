import "reflect-metadata";
import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginLandingPageGraphQLPlayground,
  PluginDefinition,
} from "apollo-server-core";
import express from "express";
import { IS_PRODUCTION } from "./constants";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

import UserResolver from "./resolver/UserResolver";

dotenv.config();

const PORT = process.env.PORT || 8080;

const main = async () => {
  const app = express();

  await createConnection();

  const plugins: PluginDefinition[] = [];
  if (!IS_PRODUCTION) {
    plugins.push(ApolloServerPluginLandingPageGraphQLPlayground());
  }

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    plugins,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  app.listen(PORT, () => console.log(`Express started on port: ${PORT}`));
};

main().catch((e) => console.log(e));
