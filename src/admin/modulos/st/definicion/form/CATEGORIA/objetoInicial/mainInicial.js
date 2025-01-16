const ObjetoInical = {
  cod_categoria  : '',        
  descripcion    : '',      
  estado         : 'S',   
  usuario        : '',   
  fecha_alta     : '',      
  fecha_mod      : '',     
  usuario_alta   : '',        
  usuario_mod    : '',      
  cod_empresa    : sessionStorage.getItem('cod_empresa'),    
  cod_sucursal   : sessionStorage.getItem('cod_sucursal'),
  insertDefault  : true  
}
const main = {  ObjetoInical }
export default main