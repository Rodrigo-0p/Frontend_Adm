import urlMain from '../url/mainUrl';

const columnModal = {
  urlValidar : [{ cod_redes_sociales: urlMain.url_validar_redes} ],
  urlBuscador: [{ cod_redes_sociales: urlMain.url_buscar_redes}  ],
  title      : [{ cod_redes_sociales: "Redes Sociales" }         ],
  cod_redes_sociales: [
    { data: 'cod_redes_sociales'  , width : 20  , title: 'Codigo'       , className:'htLeft'  },
    { data: 'desc_redes_sociales' , width : 100 , title: 'Descripción'  , className:'htLeft'  },
  ],
  config: {} 
};

const columnDet = [
  { data: 'cod_redes_sociales' , title: 'Cod. Redes' , width : 32  , className: 'htLeft'   , requerido:true , readOnly:false  , filter:false      }, 
  { data: 'desc_redes_sociales', title: 'Descripción', width : 60  , className: 'htLeft'   , readOnly:true  , filter:false   }, 
  { data: 'url'                , title: 'Url'        , width : 150 , className: 'htLeft'   , requerido:true , readOnly:false  , filter:false      }, 
  { data: 'activo'             , title: 'Activar'    , width : 20  , className: 'htCenter' , type:'checkbox', readOnly:false  , checkbox:['S','N']},
]

const nextEnter = [0,2,3];


const main = {
  columnModal,
  columnDet,
  nextEnter
}

export default main;