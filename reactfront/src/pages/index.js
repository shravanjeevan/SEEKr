import React from 'react';
import Layout from '../layouts/index';
import Hero from '../components/hero/Hero';
import HeroIllustration from '../components/hero/HeroIllustration';

const IndexPage = () => {
  return (
    <Layout>
      <Hero
        title="We want to very quickly find you the right match"
        content="SEEKr is for you if you are looking for the perfect job or if you are a company looking for the right candidate."
        illustration={HeroIllustration}
      />
    </Layout>
  )
}

export default IndexPage;
