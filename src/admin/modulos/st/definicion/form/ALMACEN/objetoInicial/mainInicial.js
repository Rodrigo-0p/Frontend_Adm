const ObjetoInical = {
  cod_almacen    : '',
  nombre         : '',
  ubicacion      : '',
  estado         : 'S',   
  cod_empresa    : sessionStorage.getItem('cod_empresa'),
  cod_sucursal   : sessionStorage.getItem('cod_sucursal'),
  insertDefault  : true  
}
const main = {  ObjetoInical }
export default main