import * as React from "react";
import { Route } from "react-router";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import { IReduxStore } from "types";

const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const user = useSelector((state: IReduxStore) => state.user);

  if (!user || !user.isAdmin)
    return (
      <Route
        render={(props) => (
          <Redirect
            to={{
              pathname: "/home",
              state: { from: props.location },
            }}
          />
        )}
      />
    );

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default PrivateRoute;
