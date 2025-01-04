import * as React      from 'react';
import { Layout}  from 'antd';
const { Header} = Layout;

const HeaderMain = ({colorBgContainer}) => {
  return (
    <Header style={{ padding: 0, background: colorBgContainer}}
    />
  );
};

export default HeaderMain;