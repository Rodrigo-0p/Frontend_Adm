import { Result, Button } from 'antd';
import{ Link }            from 'react-router-dom';

const AppRouter404 = () => {

  return (
    <Result
      status="404"
      title="404"
      subTitle="Esta pagina no existe"
      extra={<Link to="/">
                  <Button type="primary">Volver a inicio</Button> 
              </Link>}
      />
  );
};

export default AppRouter404;