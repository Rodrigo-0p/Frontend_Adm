
// DEFINICIONES
import ACECADE from "../../admin/modulos/bs/form/ACERCADE/ACECADE";
import SERVCIO from "../../admin/modulos/bs/form/SERVICIO/SERVICIO";
import PRECIOS from "../../admin/modulos/bs/form/PRECIOS/PRECIOS";

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
  },
]

export default Route
