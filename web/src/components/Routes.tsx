import React from "react";
import { Switch } from "react-router-dom";
import { Redirect, Route } from "react-router";
import Auth from "../pages/Auth";
import Search from "../pages/Search";
import NewReview from "../pages/NewReview";
import { useMeQuery } from "../generated/graphql";

const Routes = () => {
  const { data } = useMeQuery();

  const authenticatedRoutes = [
    <Route path="/reviews/new" exact key="new-reviews">
      <NewReview />
    </Route>,
    <Route path="/" key="redirect-to-reviews">
      <Redirect to="/reviews" />
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
      <Route path="/" exact>
        <Search />
      </Route>
      {data?.me ? authenticatedRoutes : unauthenticatedRoutes}
    </Switch>
  );
};

export default Routes;
