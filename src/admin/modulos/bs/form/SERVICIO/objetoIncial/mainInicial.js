const ObjetoInical = {
  cod_servicio            :null,
  cod_empresa             : sessionStorage.getItem('cod_empresa'),
  titulo                  :null,
  descripcion             :null,
  activo                  :'N',
  titulo_precios          : 'Nuestros Precios',
  name_img_precios        :null,
  name_img_fondo_precios  :null,
  insertDefault           :true
}

const ObjetoInicalDet = {
  nro_orden      : null,
  cod_empresa    : sessionStorage.getItem('cod_empresa'),
  titulo         : null,
  descripcion    : null,
  icono          : null,
  precios        : '0',
  indpromo       : 'N',
  insertDefault  : true
}

const main = {ObjetoInical, ObjetoInicalDet}
export default main;