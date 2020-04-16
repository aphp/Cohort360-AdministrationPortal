import * as React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Authentication from "components/authentication";
import Home from "components/home";
import Dashboard from "components/dashboard";
import Permissions from "components/permissions";
import Profile from "components/profile";
import Users from "components/users";
import PrivateRoute from "components/routes/private";
import AdminRoute from "components/routes/admin";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/login" component={Authentication} />
      <PrivateRoute exact path="/" component={Home} />
      <PrivateRoute exact path="/dashboard" component={Dashboard} />
      <PrivateRoute
        exact
        path="/users"
        render={() => <Users admin={false} />}
      />
      <PrivateRoute exact path="/profile/:userId" component={Profile} />
      <AdminRoute exact path="/admins" render={() => <Users admin={true} />} />
      <AdminRoute exact path="/permissions" render={() => <Permissions />} />
    </Switch>
  </BrowserRouter>
);

export default Routes;
