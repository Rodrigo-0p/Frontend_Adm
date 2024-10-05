import React,{memo}       from 'react';
import { Layout, theme }  from 'antd';
import SiderMain          from './Sider/Sider';
import SessionTime        from "./sessionTime";
import HeaderMain         from './Header/Header';
import { useHistory }     from 'react-router-dom';

import './styles/Layout.css';
import './styles/form.css';

const { Content, Footer} = Layout;

const Home = memo((props) => {
  const history = useHistory();

  const CloseSession = (e) => {
    sessionStorage.clear()
    history.push("/")
  };
  if (!sessionStorage.token)history.push("/");      
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  
  return (
    <>
    <Layout hasSider={true}>
      <SessionTime CloseSession={CloseSession} />
      <SiderMain defaultSelectedKeys={props.defaultSelectedKeys} defaultOpenKeys={props.defaultOpenKeys}  CloseSession={CloseSession} />

      <Layout className="site-layout" id="system-layout">
        <HeaderMain colorBgContainer={'linear-gradient(197deg, rgba(0, 21, 41, 0.97) 0%, rgb(78 93 108) 100%)'}/>

        <Content style={{ margin: '4px 4px 0px'}}>
          <div className='ant-layout-content' style={{ background:colorBgContainer,borderRadius: borderRadiusLG}}>
            {props.children}         
          </div>
        </Content>

        <Footer style={{textAlign: 'center'}}>
          {sessionStorage.getItem('empresa')} ©{new Date().getFullYear()}
        </Footer>
        
      </Layout>
      
    </Layout>
    </>
  );
});

export default Home;