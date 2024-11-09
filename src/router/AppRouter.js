import React            from 'react';
import { BrowserRouter as Router
      , Switch, Route } from 'react-router-dom';
import NotFound         from './AppRouter404';
import Main             from '../admin/util/Main';
import MainLogin        from '../admin/modulos/login/Login';
// ADMINISTRACION
import HOME             from '../admin/modulos/home/Home';
import BS               from './modulo_ruta/BS'

const AppRouter = () => {
  const route = Main._.union(BS);  
  return (
    <Router>
      <Switch>
        <Route exact path={"/"}      component={MainLogin} />
        {/* ADMIN */}
        <Route exact path={"/home"}  component={HOME} />
        {
          route.map((ruta,indice) => (
            <Route exact key={indice} path={ruta.path} component={ruta.component} />
          ))
        }
        <Route component={NotFound}/>
      </Switch>  
    </Router>
  );
};



export default AppRouter;