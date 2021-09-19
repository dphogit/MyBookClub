import * as React from "react";
import { ChakraProvider, theme } from "@chakra-ui/react";
import Layout from "./components/Layout";
import Navigation from "./components/Navigation/Navigation";
import { BrowserRouter } from "react-router-dom";
import Routes from "./components/Routes";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "http://localhost:4000/graphql",
  credentials: "include", // Development only
});

export const App = () => (
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <ChakraProvider theme={theme}>
        <Navigation />
        <Layout>
          <Routes />
        </Layout>
      </ChakraProvider>
    </BrowserRouter>
  </ApolloProvider>
);
