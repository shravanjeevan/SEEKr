import React, { Component } from 'react';
import classnames from 'classnames';
import history from './../../pages/history';

class NewsletterForm extends Component {
  state = {
    email: '',
  }

  render() {
    const { className, submit = 'Submit' } = this.props;
    const classNames = classnames(
      'newsletter-form field field-grouped is-revealing',
      className
    )

    return (
      <form className={classNames}>
        <div className="control">
          <button className="button button-primary button-block button-shadow" onClick={() => history.push('/signup')}>Sign Up Today</button>
        </div>
      </form>
    )
  }
}

export default NewsletterForm;
