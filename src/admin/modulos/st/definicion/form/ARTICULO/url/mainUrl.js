const url_base       = '/admin/articulo'

const url_listar_cab        = url_base+'/listar/cabecera';
const url_listar_det        = url_base+'/listar/detalle';
const url_listar_alm        = url_base+'/listar/almacen';
const url_get_serialCab     = url_base+'/idserialCab/';
const url_get_serialDet     = url_base+'/idserialDet/';
// valida
const url_valida_categoria  = url_base+ '/valida/categoria';
const url_valida_impuesto   = url_base+ '/valida/impuesto';
// buscadores
const url_buscar_categoria  = url_base+ '/buscar/categoria';
const url_buscar_impuesto   = url_base+ '/buscar/impuesto';
const url_buscar_stockDisp  = url_base+ '/buscar/stockDisp';
// url img
const url_post_img          = url_base+ '/upload/img/ARTICULO/';

const url_abm               = url_base

const main = {  url_listar_cab
              , url_listar_det
              , url_listar_alm
              , url_get_serialCab
              , url_get_serialDet
              , url_abm
              // valida
              , url_valida_categoria
              , url_valida_impuesto 
              // buscador
              , url_buscar_categoria
              , url_buscar_impuesto 
              , url_buscar_stockDisp
              // img 
              , url_post_img
             }

export default main;