const ObjetoInical = {
  cod_configuracion :null,
  titulo            :null, 
  name_img          :null,   
  activo            :'N' ,
  cod_empresa       : sessionStorage.getItem('cod_empresa'),
  insertDefault     :true
}

const ObjetoInicalDet = {
  nro_orden          : null,
  cod_redes_sociales : null,
  url                : null,
  activo             :'N'  ,
  cod_empresa        : sessionStorage.getItem('cod_empresa'),
  insertDefault      : true
}

const main = {ObjetoInical, ObjetoInicalDet}
export default main;