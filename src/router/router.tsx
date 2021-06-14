import { Route, Switch, useLocation } from 'react-router-dom';
import { Location } from 'history';
import routes from './routes';

interface ILocationState {
  page: Location<string>
}

export default function Router() {
  const location = useLocation<ILocationState>();
  let locationState = location.state;

  return (
    <Switch location={{ ...location, state: locationState } || location}>
      {
        Object.keys(routes).map((SPARoute, idx) => {
          return (
            <Route
              key={idx}
              {...routes[SPARoute]}
            />
          );
        })
      }
    </Switch>
  );
}