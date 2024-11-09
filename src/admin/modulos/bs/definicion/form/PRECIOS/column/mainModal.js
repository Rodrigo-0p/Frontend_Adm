const columnModalDet = {
  urlValidar : [],
  urlBuscador: [],
  title      : [],
  config:{}
};

const columnDet = [
  { data: 'titulo'   , title: 'Sevicio' , width : 150 , className: 'htLeft'   , readOnly:true   , filter:false }, 
  { data: 'precios'  , title: 'Precios' , width : 40  , className: 'htRight'  , type:'numeric'  , format:{pattern: '0,0'}},
  { data: 'indpromo' , title: 'Promo'   , width : 14  , className: 'htCenter' , type:'checkbox' , readOnly:true , checkbox:['S','N']},
]
const nextEnter = [0];

const main = {
  columnModalDet,
  columnDet,
  nextEnter
}

export default main;