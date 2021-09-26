import React from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { Location } from 'history';
import routes from './routes';
import PrivateRoute from './PrivateRoute';

interface ILocationState {
  page: Location<string>
}

export default function Router({ isOwner }: { isOwner: boolean }) {
  const location = useLocation<ILocationState>();
  let locationState = location.state;

  return (
    <Switch location={{ ...location, state: locationState } || location}>
      {
        Object.keys(routes).map((SPARoute, idx) => {
          const { onlyOwner, ...routeData } = routes[SPARoute];
          console.log('HERE');
          return (
            onlyOwner ?
            <PrivateRoute
              key={idx}
              {...routeData}
              isOwner={isOwner}
              component={routeData.component}
            /> :
            <Route
              key={idx}
              {...routeData}
            />
          );
        })
      }
    </Switch>
  );
}