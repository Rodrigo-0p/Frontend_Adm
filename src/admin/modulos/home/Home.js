import * as React  from 'react';
import Layout      from '../../componente/Layout';
import Main        from '../../util/Main';
const Home =  React.memo(() => {
  
  const FormName   = 'HOME';
  const TituloList = "";
  var vname_img    = 'configur-img' ;

  return (    
    <Layout defaultSelectedKeys={['HOME']} defaultOpenKeys={['HOME']}>
      <Main.Spin spinning={false} delay={500}>

        <div className="paper-header">
          <Main.Title level={4} className="title-color">
            {TituloList}<div level={5} className="title-color-forname">{FormName}</div>
          </Main.Title>
        </div>
        HOME
      </Main.Spin>
    </Layout>    
  );
});

export default Home;