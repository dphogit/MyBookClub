import React from "react";
import { Switch } from "react-router-dom";
import { Route } from "react-router";
import Auth from "../pages/Auth";

const Routes = () => {
  return (
    <Switch>
      <Route path="/authenticate" exact>
        <Auth />
      </Route>
    </Switch>
  );
};

export default Routes;
