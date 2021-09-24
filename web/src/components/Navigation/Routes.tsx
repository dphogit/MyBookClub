import React from "react";
import { Switch } from "react-router-dom";
import { Redirect, Route } from "react-router";
import Auth from "../../pages/Auth";
import BookSearch from "../../pages/BookSearch";
import Book from "../../pages/Book";
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
      <Auth />
    </Route>,
    <Route path="/" key="redirect-to-authentication">
      <Redirect to="/authenticate" />
    </Route>,
  ];

  return (
    <Switch>
      <Route path="/books/:id">
        <Book />
      </Route>
      <Route path="/books" exact>
        <BookSearch />
      </Route>
      {data?.me ? authenticatedRoutes : unauthenticatedRoutes}
    </Switch>
  );
};

export default Routes;
