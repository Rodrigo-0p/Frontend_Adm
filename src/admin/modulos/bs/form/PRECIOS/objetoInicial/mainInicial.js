const ObjetoInical = {
  cod_servicio            : null,
  cod_empresa             : sessionStorage.getItem('cod_empresa'),
  titulo_precios          : null,
  cod_combo               : null,
  name_img_precios        : null,
  name_img_fondo_precios  : null,
}

const ObjetoInicalDet = {
  titulo        : null,
  descripcion   : null,
  icono         : null,
  precios       :0 ,
  indPromo      :'N'
}

const main = {ObjetoInical, ObjetoInicalDet}
export default main;