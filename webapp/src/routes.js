import React, { Fragment } from 'react';
import { PrivateLayout, PublicLayout, NotLoggedInLayout } from '@layouts';
import { BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import { FriendsMap, Settings } from './components'

import { Login, Register, PageNotFound, Welcome, RegistrationSuccess, MyFriends } from './containers';

const privateRoutes = [
  {
    id: 'welcome',
    path: '/welcome',
    component: Welcome
  },
  {
    id: 'myFriends',
    path: '/myFriends',
    component: MyFriends
  },
  {
    id: 'friendsMap',
    path: '/friendsMap',
    component: FriendsMap
  },
  {
    id: 'settingsRadio',
    path: '/settingsRadio',
    component: Settings
  }
];

const Routes = () => (
  <Router>
    <Fragment>
      <Switch>
        <NotLoggedInLayout component={Login} path="/login" exact />
        <NotLoggedInLayout component={Register} path="/register" exact />
        <NotLoggedInLayout path="/register/success" component={RegistrationSuccess} exact />
        <PublicLayout path="/404" component={PageNotFound} exact />
        <Redirect from="/" to="/welcome" exact />
        <PrivateLayout path="/" routes={privateRoutes} />
        <Redirect to="/404" />
      </Switch>
    </Fragment>
  </Router>
);

export default Routes;
