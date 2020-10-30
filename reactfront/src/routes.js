import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import SignUpPage from "./pages/signup";
import SignInPage from "./pages/signin";
import ContactPage from "./pages/contact";
import AboutPage from "./pages/about";
import FaqsPage from "./pages/faqs";
import SupportPage from "./pages/support";
import IndexPage from "./pages";
import history from "./pages/history";


class App extends Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route exact path="/signup" component={SignUpPage} />
          <Route exact path="/signin" component={SignInPage} />
          <Route exact path="/contact" component={ContactPage} />
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
