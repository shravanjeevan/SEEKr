import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import history from './history';
import Layout from '../layouts/index';
import img from '../images/job-match2.jpg';


const IndexPage = () => {
  return (
    <Layout>
      <article className="entry">
        <div className="container">
          <div className="entry-inner">
            <div className="entry-content">
              <div className="container-sm">
                <header className="entry-header">
                  <h1 className="entry-title">We want to very quickly find you the right match</h1>
                </header>
                <div className="entry-body">
                  	<br></br>
	                  <p>
	                    SEEKr is for you if you are looking for the perfect job or if you are a company looking for the perfect candidate.
	                </p>
	                	<br></br>
                	<form>
				        <div className="control">
				        	<button className="button button-primary button-block button-shadow" onClick={() => history.push('/signup-job')}>Sign Up Today</button>
				        </div>
			        </form>
                </div>
              </div>
            </div>
              <div className="img">
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <img src={img} alt="" />
              </div>
          </div>
        </div>
      </article>
    </Layout>
  )
}

export default IndexPage;