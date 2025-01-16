// DEFINICIONES
import ARTICULO  from "../../admin/modulos/st/definicion/form/ARTICULO/ARTICULO";
import CATEGORIA from "../../admin/modulos/st/definicion/form/CATEGORIA/CATEGORIA";
import ALMACEN   from "../../admin/modulos/st/definicion/form/ALMACEN/ALMACEN";

const Route = [
  {
    path: '/st/articulo',
    component: ARTICULO,
  },{
    path: '/st/categoria',
    component: CATEGORIA,
  },{
    path: '/vt/almacen',
    component: ALMACEN,
  }
]

export default Route
