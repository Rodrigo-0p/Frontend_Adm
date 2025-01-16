const ObjetoInical = {
  cod_articulo   : '',           
  descripcion    : '',         
  stock_minimo   : '',           
  inventariar    : 'N',         
  estado         : 'S',     
  codigo_barras  : '',           
  cod_categoria  : '',           
  fecha_alta     : '',         
  usuario        : '',     
  fecha_mod      : '',       
  usuario_mod    : '',         
  name_img       : '',       
  cod_almacen    : 1,
  cod_empresa    : sessionStorage.getItem('cod_empresa'),    
  insertDefault  : true   
}

const ObjetoInicalDet = {
  cod_unidad     : '',     
  descripcion    : '',     
  cantidad       : '',
  cod_articulo   : '',       
  cod_empresa    : sessionStorage.getItem('cod_empresa'),
  cod_sucursal   : sessionStorage.getItem('cod_sucursal'),
  insertDefault  : true    
}

const ObjetoInicalAlm = {
  cod_empresa    : sessionStorage.getItem('cod_empresa'),    
  cod_sucursal   : sessionStorage.getItem('cod_sucursal'), 
  cod_articulo   : '',
  cod_almacen    : '',
  cod_proveedor  : '',
  insertDefault  : true    
}

const main = { ObjetoInical, ObjetoInicalDet, ObjetoInicalAlm}
export default main