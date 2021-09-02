import React from 'react';
import { Route, Redirect } from 'react-router-dom';

interface PrivateRouteProps {
  component: any,
  isOwner: boolean,
}

export default function PrivateRoute({
  component: Component,
  isOwner,
  ...restProps
}: PrivateRouteProps) {
  return (
    <Route
      {...restProps}
      render={props => (
        isOwner ?
        <Component {...props} /> :
        <Redirect to='/project/:projectId/403' />
      )}
    />
  );
}