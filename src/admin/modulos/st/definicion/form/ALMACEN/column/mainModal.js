const columnModalDet = {
  urlValidar : [],
  urlBuscador: [],
  title      : [],
  config:{}
};

const columnDet = [
  { data: 'cod_almacen' , title: 'Cod Almacen' , width : 22  , className: 'htLeft'   , requerido:false , readOnly:true   , filter:true       }, 
  { data: 'nombre'      , title: 'nombre'      , width : 50  , className: 'htLeft'   , requerido:true  , readOnly:false  , filter:false      }, 
  { data: 'ubicacion'   , title: 'Ubicación'   , width : 100 , className: 'htLeft'   , requerido:true  , readOnly:false  , filter:false      }, 
  { data: 'estado'      , title: 'Estado'      , width : 10  , className: 'htCenter' , type:'checkbox' , readOnly:false  , checkbox:['S','N']},
]
const nextEnter = [0,1,2,3];

const main = {
  columnModalDet,
  columnDet,
  nextEnter
}

export default main;