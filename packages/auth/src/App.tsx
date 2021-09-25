import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';

import SignInPage from './pages/SignInPage/SignInPage';
// import SignUpPage from './pages/SignUpPage/SignUpPage';

export default function App({ history }: any) {
  return (
    <div>
      hello blyaaaa
      <Router history={history}>
        <Switch>
          <Route path="/auth/signin">
            <SignInPage />
          </Route>
          {/* <Route path="/auth/signup">
            <SignUpPage />
          </Route> */}
        </Switch>
      </Router>
    </div>
  );
};
