import * as React   from "react";
import AppRouter    from "./router/AppRouter";
import './styles/global.css';
import { ConfigProvider } from 'antd';
const App = ()=> {
  return (  
   
  <ConfigProvider theme={{ hashed: false }}>
    <AppRouter />
  </ConfigProvider>);
}

export default App;
