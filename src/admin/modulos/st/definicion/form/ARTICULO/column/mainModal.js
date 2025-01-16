const columnModalDet = {
  urlValidar  : [],
  urlBuscador : [],
  title       : [],
  config      : {},
};

const columnDet = [{  data: 'cod_unidad' , title: 'Código Unidad',  width: 40 ,  className: 'htLeft' , readOnly: true  ,  filter: true  },
                   {  data: 'descripcion', title: 'Descripción'  ,  width: 200,  className: 'htLeft' , requerido: true ,  readOnly: false,  filter: true},
                   {  data: 'cantidad'   , title: 'Mult'         ,  width: 20 ,  className: 'htRight', type: 'numeric' ,  format: '0.00' ,  requerido: true,  readOnly: false},
                  ];
const nextEnter = [0,1,2]; // Indica la columna inicial para navegar con Enter.

//===============================================================================
//================================   F9    ======================================
//===============================================================================
const columnCategoria = [
  { data: 'cod_categoria'   , width : 5  , title: 'Código'       , className:'htLeft' },
  { data: 'desc_categoria'  , width : 25 , title: 'Descripción'  , className:'htLeft' },  
]

const columnImpuesto = [
  { data: 'cod_impuesto'   , width : 5  , title: 'Código'       , className:'htLeft' },
  { data: 'desc_impuesto'  , width : 25 , title: 'Descripción'  , className:'htLeft' },  
]

const columnAlmacen = [
  { data: 'cod_almacen'   , title: 'Cod. Almacen'   , width : 27  , className: 'htLeft'   , requerido:true  , readOnly:false , filter:true   }, 
  { data: 'desc_almacen'  , title: 'descripción'    , width : 60  , className: 'htLeft'   , requerido:false , readOnly:true  , filter:false  }, 
  { data: 'cod_proveedor' , title: 'Cod. Proveedor' , width : 27  , className: 'htLeft'   , requerido:false , readOnly:false , filter:true   }, 
  { data: 'desc_proveedor', title: 'descripción'    , width : 60  , className: 'htLeft'   , requerido:false , readOnly:true  , filter:false  }, 
]
const nextEnterAlm = [0,2];

const main = {
  columnModalDet,
  columnDet,
  nextEnter,
  columnAlmacen,
  nextEnterAlm,
  // F9
  columnCategoria,
  columnImpuesto
};

export default main;
