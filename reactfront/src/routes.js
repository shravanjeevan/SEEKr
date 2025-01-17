import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import SignUpJobPage from "./pages/signup-job";
import SignInPage from "./pages/signin";
import PostJobPage from "./pages/post-jobs";
import AboutPage from "./pages/about";
import FaqsPage from "./pages/faqs";
import SupportPage from "./pages/support";
import IndexPage from "./pages";
import history from "./pages/history";
import Account from "./pages/Account"
import Matchlist from "./pages/MatchedJob"

class App extends Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/signup-job" component={SignUpJobPage} />
          <Route exact path="/signin" component={SignInPage} />
          <Route exact path="/account" component={Account} />
          <Route exact path="/matched-jobs" component={Matchlist} />
          <Route exact path="/post-jobs" component={PostJobPage} />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/faqs" component={FaqsPage} />
          <Route exact path="/support" component={SupportPage} />
          <Route exact path="/" component={IndexPage} />
        </Switch>
      </Router>
    );
  }
}

export default App;
