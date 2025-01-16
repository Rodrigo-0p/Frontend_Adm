import mainUrl    from '../url/mainUrl';
import mainColumn from '../column/mainModal';

var ValidaInput = [
  { input    : 'cod_categoria',
    url      : mainUrl.url_valida_categoria,
    valor_ant: '-1',
    data     : ['cod_empresa'],
    rel      : [],
    next     : 'estado', 
    band     : true,
    outError : false,
    requerido: true,
    ejecute  : false,
    // F9
    column:{
      url    : mainUrl.url_buscar_categoria,
      title  : 'Categoria',
      columna: mainColumn.columnCategoria,
    },
  },
  {
    input    : 'cod_impuesto',
    url      : mainUrl.url_valida_impuesto,
    valor_ant: '-1',
    data     : ['cod_empresa'],
    rel      : [],
    next     : 'cod_articulo', 
    band     : true,
    outError : false,
    requerido: true,
    ejecute  : false,
    // F9
    column:{
      url    : mainUrl.url_buscar_impuesto,
      title  : 'Impuesto',
      columna: mainColumn.columnImpuesto,
    },
  }
]

const limpiarInputAnt = ()=>{
  ValidaInput.map((resp)=>{
    resp.valor_ant = null
  })
}

const main = { ValidaInput
             , limpiarInputAnt}


export default main;

