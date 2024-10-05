const columnModalDet = {
  urlValidar : [],
  urlBuscador: [],
  title      : [],
  config:{}
};

const columnDet = [
  { data: 'titulo'       , title: 'titulo'      , width : 45  , className: 'htLeft'   , requerido:true , readOnly:false  , filter:false      }, 
  { data: 'descripcion'  , title: 'Descripcion' , width : 150 , className: 'htLeft'   , requerido:true , readOnly:false  , filter:false      }, 
  { data: 'indpromo'     , title: 'Promo'       , width : 20  , className: 'htCenter' , type:'checkbox', readOnly:false  , checkbox:['S','N']},
]
const nextEnter = [0];
      

const main = {
  columnModalDet,
  columnDet,
  nextEnter
}

export default main;