import React from "react";
import { Container, Row, Col } from "shards-react";
import Header from '../components/layout/Header-withoutBody';
import Footer from '../components/layout/Footer';

import Banner from "../components/Banner";
import UserDetails from "../components/UserProfile";


const UserProfileLite = () => (
  <Container fluid className="main-content-container px-4">
      <br></br>
      <Banner title="Profile" md="12" className="ml-sm-auto mr-sm-auto" />
      <br></br>
      <UserDetails />
  </Container>
);

export default UserProfileLite;
