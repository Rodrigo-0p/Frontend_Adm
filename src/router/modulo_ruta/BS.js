// CONFIG
import CONFIGUR from "../../admin/modulos/bs/config/form/CONFIGUR/CONFIGUR";
// DEFINICIONES
import ACECADE  from "../../admin/modulos/bs/definicion/form/ACERCADE/ACECADE";
import SERVCIO  from "../../admin/modulos/bs/definicion/form/SERVICIO/SERVICIO";
import PRECIOS  from "../../admin/modulos/bs/definicion/form/PRECIOS/PRECIOS";

const Route = [
  {
    path: '/bs/acercade',
    component: ACECADE,
  },{
    path: '/bs/servicio',
    component: SERVCIO,
  },{
    path: '/bs/precios',
    component: PRECIOS,
  },{
    path: '/bs/configur',
    component:CONFIGUR
  }
]

export default Route
