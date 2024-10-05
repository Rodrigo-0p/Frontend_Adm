import React, { memo } from 'react';
import Layout     from '../../componente/Layout';
const Home = memo(() => {
  return (    
    <Layout defaultSelectedKeys={['HOME']} defaultOpenKeys={['HOME']}>
      HOME
    </Layout>    
  );
});

export default Home;