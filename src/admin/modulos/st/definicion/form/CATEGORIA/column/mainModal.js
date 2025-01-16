const columnModalDet = {
  urlValidar : [],
  urlBuscador: [],
  title      : [],
  config:{}
};

const columnDet = [
  { data: 'cod_categoria' , title: 'Cod Categoria' , width : 12  , className: 'htLeft'   , requerido:false , readOnly:true   , filter:true       }, 
  { data: 'descripcion'   , title: 'Descripción'   , width : 100 , className: 'htLeft'   , requerido:true  , readOnly:false  , filter:false      }, 
  { data: 'estado'        , title: 'Estado'        , width : 10  , className: 'htCenter' , type:'checkbox' , readOnly:false  , checkbox:['S','N']},
]
const nextEnter = [0,1,2];

const main = {
  columnModalDet,
  columnDet,
  nextEnter
}

export default main;