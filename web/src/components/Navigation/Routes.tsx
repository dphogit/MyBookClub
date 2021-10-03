import React from "react";
import { Switch } from "react-router-dom";
import { Redirect, Route } from "react-router";
import { AuthPage, BookPage, ExplorePage } from "../../pages";
import { useMeQuery } from "../../generated/graphql";

const Routes = () => {
  const { data } = useMeQuery();

  const authenticatedRoutes = [
    <Route path="/" key="redirect-to-book-search">
      <Redirect to="/books" />
    </Route>,
  ];

  const unauthenticatedRoutes = [
    <Route path="/authenticate" exact key="authenticate">
      <AuthPage />
    </Route>,
    <Route path="/" key="redirect-to-authentication">
      <Redirect to="/authenticate" />
    </Route>,
  ];

  return (
    <Switch>
      <Route path="/books/:id">
        <BookPage />
      </Route>
      <Route path="/books" exact>
        <ExplorePage />
      </Route>
      {data?.me ? authenticatedRoutes : unauthenticatedRoutes}
    </Switch>
  );
};

export default Routes;
