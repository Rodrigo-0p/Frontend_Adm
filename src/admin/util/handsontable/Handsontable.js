import React                                from 'react';
import { HotTable,HotColumn  }              from '@handsontable/react';
import {registerLanguageDictionary, esMX }  from 'handsontable/i18n';
import Handsontable                         from 'handsontable' // No eliminar
import FormModalSearch                      from '../ModalForm/FormModalSearch'
import ModalHadsontable                     from '../ModalForm/ModalHadsontable'
import Main                                 from '../Main';
import iconsBinoculars                      from '../../../assets/icons/binocular.svg';
import iconsPromo                      from '../../../assets/icons/promo.png';
import 'handsontable/dist/handsontable.full.min.css';
import './handsontableGrid.css';


registerLanguageDictionary(esMX);


let mes             = ["Enero"  , "Febrero","Marzo" , "Abril"    ,"Mayo"  , "Junio"  ,"Julio" ,"Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
let semana          = ["Domingo", "lunes"  ,"Martes", "Miercoles","Jueves", "Viernes","Sábado"];
let diasSemanaCorto = ["Dom"    , "Lun"    ,"Mar"   , "Mier"     ,"Juev"  , "Vier"   , "Sab"  ];


class KeyValueListEditor extends Handsontable.editors.HandsontableEditor {
  prepare(row, col, prop, td, value, cellProperties) {
    super.prepare(row, col, prop, td, value, cellProperties);

    Object.assign(this.htOptions, {
      licenseKey: 'non-commercial-and-evaluation',
      data: this.cellProperties.source,
      className:'handsontable_opcion',
      columns: [
        { data: 'id'   },
        { data: 'label' , type:'autocomplete'},
      ],
      hiddenColumns: {
        columns: [1],
      },
      colWidths: (cellProperties.width + cellProperties.width) - 40,
      beforeValueRender(value, { row, instance }) {
        return instance.getDataAtRowProp(row, 'label');
      },
    });

    if (cellProperties.keyValueListCells) {
      this.htOptions.cells = cellProperties.keyValueListCells;
    }
    if (this.htEditor) {
      this.htEditor.destroy();
    }

    this.htEditor = new Handsontable(this.htContainer, this.htOptions);
  }
  
  setValue(value) {
    if (this.htEditor) {
      const index = this.htEditor.getDataAtProp('id').findIndex(id => id === value);

      if (index !== -1) {
        value = this.htEditor.getDataAtRowProp(index, 'label');
      }
    }
    super.setValue(value);
  }
  
  getValue() {
    const value = super.getValue();

    if (this.htEditor) {
      const labels = this.htEditor.getDataAtProp('label');
      const row = labels.indexOf(value);

      if (row !== -1) {
        return this.htEditor.getDataAtRowProp(row, 'id');
      }
    }

    return value;
  }
}
const keyValueListValidator = function(value, callback) {
  let valueToValidate = value;

  if (valueToValidate === null || valueToValidate === void 0) {
    valueToValidate = '';
  }

  if (this.allowEmpty && valueToValidate === '') {
    callback(true);
  } else {
    callback(this.source.find(({ id }) => id === value) ? true : false);
  }
};
const keyValueListRenderer = function(hot, TD, row, col, prop, value, cellProperties) {
  const item = cellProperties.source.find(({ id }) => id === value);
  
  if (item) {
    value = item.label;
  }
  
  Handsontable.renderers.getRenderer('autocomplete').call(hot, hot, TD, row, col, prop, value, cellProperties);
};

export const columnDependencia = async (dependencia,refData,row,columnModal,row_ant = false)=>{
  if( Object.keys(columnModal.config).length === 0 ) return;

  dependencia.forEach(async items => {
    var key               = items.id
    var rowDelete         = columnModal[key];
    var rowIndex          = row_ant ? row[0].rowIndex_ant : row[0].rowIndex

    if(items?.remove === true || items?.remove === undefined){
      if(rowDelete){
        let columnIndex1 = refData.current.hotInstance.propToCol(rowDelete[0].data)
        let columnIndex2 = refData.current.hotInstance.propToCol(rowDelete[1].data)
        
        if(!Main._.isNull(refData.current.__hotInstance.toVisualColumn(columnIndex1))){
          refData.current.__hotInstance.setDataAtCell(rowIndex,columnIndex1,"")
        }

        if(!Main._.isNull(refData.current.__hotInstance.toVisualColumn(columnIndex2))){
          refData.current.__hotInstance.setDataAtCell(rowIndex,columnIndex2,"")
        }
      }else{
        refData.current.__hotInstance.view.settings.data[rowIndex][key] = "";
      }
    }
  });
}

var indiceCabecera = {};
export const setIndiceCabecera = (valor,idComp) => {
  if(Object.keys(indiceCabecera).includes(idComp)){
    indiceCabecera[idComp] = valor
  }else{    
    indiceCabecera = {...indiceCabecera,...{
      [idComp]:valor
    }}
  }
};
export const getIndiceCabecera = (idComp) => {
  return indiceCabecera[idComp];
};

export var idGrid = {'grid':{},'columna':{}}    
export const setIdGrid = (grid,column,idComponet) =>{
  if(Object.keys(idGrid.grid).includes(idComponet)){
    idGrid.grid[idComponet]    = grid
    idGrid.columna[idComponet] = column
  }else{    
    idGrid.grid = {...idGrid.grid,...{
      [idComponet] : grid
    }}
    idGrid.columna = {...idGrid.columna,...{
      [idComponet] : column
    }}
  }
}

export var banScroll = {row:0}
export const setBanScroll = (e,idComponet,keyCode = 40) =>{
  if(e === -1 && keyCode !== 38) return
  if(Object.keys(banScroll).includes(idComponet)){
    banScroll[idComponet].row = e
  }else{    
    banScroll = {...banScroll,...{
      [idComponet]:{row:e}
    }}
  }
}

export var newArrayPushHedSeled  = []
export const newSetArrayHedSeled = (nameBuscador,id) =>{
  var valor = document.querySelectorAll("#newIconoLupa")
 
   if(valor?.length > 1){
     valor.forEach(async(element) => {
       let nombre    = await element.attributes[0].value
       let iconohead = await document.getElementsByClassName(`${nombre}${id}`);
       if(iconohead[1]) iconohead[1].style.visibility = 'collapse'
     });
   }
 
  setTimeout(()=>{
   let resul = document.getElementsByClassName(`${nameBuscador}${id}`)
     if(resul?.length){
       resul[0].style.visibility = 'visible';
       resul[0].id = 'iconoLupa'
     }
   },5)
 
  newArrayPushHedSeled[id] = []
  newArrayPushHedSeled[id].push(nameBuscador);
}

export var eventGlobal = {}
export const setEventGlobal = (e,idComponet) =>{
  if(Object.keys(eventGlobal).includes(idComponet)){
    eventGlobal[idComponet] = e
  }else{    
    eventGlobal = {...eventGlobal,...{
      [idComponet]:e
    }}
  }
  if(e === -1)setFocusCloseModal({valida:true,valor:''},idComponet)
}
export var focusCloseModal = {valida:true,valor:''}
export const setFocusCloseModal = (e,idComponet) =>{
  if(idComponet.includes(Object.keys(focusCloseModal))){
    focusCloseModal[idComponet] = e
  }else{    
    focusCloseModal = {...focusCloseModal,...{
      [idComponet]:e
    }}
  }
}

var g_RowFocus = {}
var g_RowFocus_valor = {}
const g_setRowFocus = (e = {},idComponet,rowIndex,columnIndex)=>{
  
  if(Main._.isNull(e)) e = {};

  if(Object.keys(g_RowFocus).length  > 0){

    e.rowIndex_ant    = g_RowFocus_valor?.rowIndex    ? g_RowFocus_valor?.rowIndex    : 0 ;
    e.columnIndex_ant = g_RowFocus_valor?.columnIndex ? g_RowFocus_valor?.columnIndex : 0 ;
    
    g_RowFocus_valor.rowIndex    = rowIndex
    g_RowFocus_valor.columnIndex = columnIndex
    
  }else{
    e.rowIndex_ant     = rowIndex;
    e.columnIndex_ant  = columnIndex;

    g_RowFocus_valor.rowIndex    = rowIndex
    g_RowFocus_valor.columnIndex = columnIndex
  }

  e.rowIndex     = rowIndex
  e.columnIndex  = columnIndex
  if(idComponet.includes(Object.keys(g_RowFocus))){
    g_RowFocus[idComponet] = [e]
  }else{    
    g_RowFocus = {...g_RowFocus,...{
      [idComponet]:[e]
    }}
  }
}
export const g_getRowFocus =(idComponet=false)=>{
  if(idComponet)return g_RowFocus[idComponet]
  else return g_RowFocus
}
export const setFocusedRowIndex = (rowIndex = false,columnIndex = false, refData={}, idComp='')=>{
  let valorRow  = g_getRowFocus(idComp);
  
  if(valorRow){
    
    if(Main._.isUndefined(valorRow[0])) return

    valorRow[0].rowIndex    = rowIndex    >= 0 && rowIndex    !== false ? rowIndex    : valorRow[0].rowIndex    >= 0 ? valorRow[0].rowIndex    : 0;
    valorRow[0].columnIndex = columnIndex >= 0 && columnIndex !== false ? columnIndex : valorRow[0].columnIndex >= 0 ? valorRow[0].columnIndex : 0;
  
    if(valorRow[0].rowIndex === false) valorRow[0].rowIndex      = 0;
    if(valorRow[0].rowIndex_ant === -1) valorRow[0].rowIndex_ant = 0;

    var cell     = refData.current.__hotInstance.getCell(valorRow[0].rowIndex, valorRow[0].columnIndex);
    let cell_ant = document.querySelector('td.current')
    
    if(!Main._.isNull(cell_ant)){
      cell_ant.classList.remove('current')
    } 
    if(!cell?.classList.value.includes("current")) cell?.classList?.add('current')
  }
}

var bloqueoCabecera_id = []
export const setCambiosPendiente = (idCom,valor)=>{
  idCom = idCom +'_'+ sessionStorage.getItem('usuario')
  bloqueoCabecera_id[idCom] = valor
};
export const getCambiosPendiente = (idCom)=>{
  idCom = idCom +'_'+ sessionStorage.getItem('usuario')
  return bloqueoCabecera_id[idCom];
};
export const limpiar_CambiosPendiente = (idCom)=>{
  idCom = idCom +'_'+ sessionStorage.getItem('usuario')
  bloqueoCabecera_id[idCom] = false;
};

export var ArrayDependenciaGlobal = [];


const HandsontableGrid = ({ refData                    , columns = []         , columnModal= false ,  idComp = ''  , FormName         = ''   ,  setfocusRowIndex = false,
                            height                     , columnNavigationEnter = [] , 
                            setUpdateValue_ant = false , setUpdateValue_desp  , setLastFocusNext  = false          , columBuscador    = ''   ,  buttomAccion     = false,
                            maxFocus                   , dataCabecera         , setClickCell       , multipleHeader, nextFocus        = false,  setUpdateEdit,
                            colorButtom = false        , validaExterno = false, focusEditMode      , executeCab    , validaAllExterno = false,  nextValidaInput  = false,
                            f7_and_F8 , modalClick = false}) => {

  const refModal            = React.useRef({  modalColumn : []
                                            , data        : []                                            
                                            , ModalTitle  : ''
                                            , idInput     : ''
                                            , dataParams  : ''
                                            , url_buscador: ''
                                          })
  const previousEditRef = React.useRef(null);  
  const refModalData    = React.useRef()
  const refKeyDown      = React.useRef({KeyDown:false,banEdit:true,inputChange:''})

  // USESTATE
  const [shows          , setShows           ] = React.useState(false);

  React.useEffect(()=>{    
    setIdGrid(refData,columns,idComp)
    setEventGlobal(null,idComp)    
    newArrayPushHedSeled[idComp] = [columBuscador];
    g_setRowFocus({},idComp,0,0); 
    setCambiosPendiente(idComp,false);
    // eslint-disable-next-line 
  },[])

  var currentColumn = 0;
  const setCurrentColumn = (e)=>{
    currentColumn = e
  }
  const handleAfterSelection = ( row, col) => {
    const indiceFilaFuenteDeDatos = refData.current.hotInstance.toPhysicalRow(row !== -1 ? row : 0);
    const valor = refData.current.hotInstance.getSourceDataAtRow(indiceFilaFuenteDeDatos);
    g_setRowFocus(valor,idComp,indiceFilaFuenteDeDatos,col);
    if(setfocusRowIndex)setfocusRowIndex(valor,indiceFilaFuenteDeDatos,col,false);
    let input = document.getElementsByClassName('handsontableInput') // NO ELIMINAR / SE ULILIZA ONKEYDOW
    if(input.length > 0){
      for (let i = 0; i < input.length; i++) {        
        input[i].id = row
      }
    }
    setFocusedRowIndex(false,false,refData,idComp);  
    setCurrentColumn(col)
  };
  const acciontButton = (row,col)=>{
    let rowValue = refData.current.__hotInstance.getSourceDataAtRow(row)
    if(buttomAccion)buttomAccion(rowValue,row,col,idComp);
  }
  const customRenderer = (instance, TD, row, col, icon) => {
    if(!TD.querySelector('button')){
      var buttonIcon       = document.createElement('button');
      buttonIcon.className = `${columns[col].data}${idComp}`
      buttonIcon.id        = "button_iconsBinoculars"
      let rowIndex         = refData.current.hotInstance.toPhysicalRow(row);
      buttonIcon.onclick   = ()=>acciontButton(rowIndex,col);
      buttonIcon.innerHTML = `<img src=${icon === 'BI' ? iconsBinoculars : icon === 'PRO' ? iconsPromo : ''} className="img-icon bi-${idComp}" width="18px" id="right-arrow"/>`
      TD.appendChild(buttonIcon)
    }else{
      if(refData.current.hotInstance.getSettings().data[row]){
        let rowIndex       = refData.current.hotInstance.toPhysicalRow(row);
        let buttonIcon     = TD.querySelector('button')
        buttonIcon.onclick = ()=>acciontButton(rowIndex,col);
        TD.appendChild(buttonIcon)
      }
    }
  };  
  const handleCellClick = (event, coords, td)=>{
    let focusValida = focusCloseModal[idComp]    
    let evento      = eventGlobal[idComp]
  
    if((focusValida?.valida !== undefined && focusValida?.valida === false ) && evento !== -120){
      setEventGlobal(13,idComp);
      let row        = refData.current.hotInstance.getSourceDataAtRow(focusValida.rowIndex);
      let nameColumn = columns[focusValida.columnIndex].data
      let valorIndex = [focusValida.rowIndex,focusValida.columnIndex,focusValida.rowIndex,focusValida.columnIndex] 
      let e          = { keyCode : 13}
      if(row[nameColumn]) validaInput(row[nameColumn],valorIndex,e);
    }
    
    // let valor = refData.current.__hotInstance.getSourceDataAtRow(coords.row)
    const indiceFilaFuenteDeDatos = refData.current.hotInstance.toPhysicalRow(coords.row !== -1 ? coords.row : 0);
    const valor = refData.current.hotInstance.getSourceDataAtRow(indiceFilaFuenteDeDatos);
    g_setRowFocus(valor,idComp,indiceFilaFuenteDeDatos,coords.col);      
    setBanScroll(coords.row,idComp)    
    
    // cambie por que al hacer click se repetia los focus de la fila
    let evet1       = document.getElementsByClassName('ht_clone_master')
    if(evet1.length > 0){
      setTimeout(async()=>{
        setFocusedRowIndex(coords.row,false,refData,idComp);
      })
    }
    setTimeout(()=>{
      if(setClickCell)setClickCell(idComp,coords);
    },1)
    
  }
  const onAfterSelectionEnd = (event, coords) => {
    if (previousEditRef.current !== null) {
      if (previousEditRef?.current?.row !== event) {
        // Después de que se haya seleccionado otra fila, podemos detectar que se ha terminado la edición
        // y hacer algo con el valor editado almacenado en previousValueRef.
        let row   = refData.current.hotInstance.getSourceDataAtRow(previousEditRef?.current?.row);
        if(row?.inserted || row?.updated){          
          let nameColumn  = previousEditRef?.current.prop
          let indexColumn = refData.current.hotInstance.propToCol(previousEditRef?.current.prop)
          if(!columnModal) return
          if(columnModal.urlValidar.length > 0 && columnModal.urlValidar[0][nameColumn]){
            let valorIndex = [previousEditRef?.current?.row, indexColumn, previousEditRef?.current?.row, indexColumn] 
            let e          = { keyCode : 13}
            validaInput(row[nameColumn],valorIndex,e)
          }
        }
      }
      previousEditRef.current = null; // Reseteamos el valor almacenado para futuras ediciones.
    }
    if(refKeyDown.current.KeyDown){
      refData.current.hotInstance.addHook("beforeKeyDown", KeyDown);
      refKeyDown.current.KeyDown = false;
      refKeyDown.current.banEdit = true;
    }
  };
  const validarDependencia = async (nameData)=>{
    var ArrayDataDependencia = [];
    if(!columnModal) return

    if((Object.keys(columnModal.config).length === 0) || !columnModal.config[nameData]){
      if(columnModal.config.not_in){
        let key = Object.keys(columnModal.config.not_in);
        if(key.includes(nameData)){
          let nro_ref = refData.current.hotInstance.getDataAtCol(columnModal.config.not_in[nameData])
          let resul   = Main._.compact( nro_ref) // filtra valores false,'',null
          ArrayDataDependencia.push({[nameData]:`${resul}`})
          ArrayDependenciaGlobal = ArrayDataDependencia;
        }
      }
      return ArrayDataDependencia;
    }
    let valor = g_getRowFocus(idComp);
    var info  = refData.current.__hotInstance.getSourceData()[valor[0].rowIndex]

    if(columnModal.config[nameData]?.depende_ex_cab !== undefined){
      for (let i = 0; i < columnModal.config[nameData].depende_ex_cab.length; i++){
        const items  = columnModal.config[nameData].depende_ex_cab[i];
        var dataName = items.id
        let indice   = getIndiceCabecera(idComp)
        let infoData = [{}]
        if(executeCab){
          infoData = dataCabecera();          
        }else{
          infoData = dataCabecera !== undefined && dataCabecera.current.data !== undefined ? dataCabecera?.current.data[indice] : dataCabecera?.current.dataCab ? dataCabecera?.current.dataCab[indice] : []
        }
        
        
        if(infoData[dataName]?.length === 0){
          setTimeout(()=>{
            Main.message.info({
              content  : `Favor complete el campo ${items.label} antes de continuar!! (valor externo)`,
              className: 'custom-class',
              duration : `${2}`,
              style    : {
                marginTop: '2vh',
              },
            });
          },10)       
          return {valor:true,externo:true,nameColumn:dataName}
        }else{
          ArrayDataDependencia = [...ArrayDataDependencia,{
            [dataName]:infoData[dataName]
          }]
          ArrayDependenciaGlobal = ArrayDataDependencia;
        }
      }
    }
    
    if(columnModal.config[nameData].depende_de.length > 0){

      for (let i = 0; i < columnModal.config[nameData].depende_de.length; i++){
        const items  = columnModal.config[nameData].depende_de[i];
        let dataName = items.id
          if(info[dataName] === "" || Main._.isUndefined(info[dataName]) || Main._.isNull(info[dataName])){
            if(!items.isNull){
              setTimeout(()=>{
                Main.message.info({
                  content  : `Favor complete el campo ${items.label} antes de continuar!!`,
                  className: 'custom-class',
                  duration : `${2}`,
                  style    : {
                    marginTop: '2vh',
                  },
                });
              },10)                        
              return {valor:true,externo:false,nameColumn:dataName}
            }else{
              ArrayDataDependencia = [...ArrayDataDependencia,{
                [dataName]:info[dataName]
              }]
              ArrayDependenciaGlobal = ArrayDataDependencia;  
            }
          }else{
            ArrayDataDependencia = [...ArrayDataDependencia,{
              [dataName]:info[dataName]
            }]
            ArrayDependenciaGlobal = ArrayDataDependencia;
          }
      }
    }
    return ArrayDataDependencia
  }
  // const validarDependencia = async (nameData)=>{
  //   var ArrayDataDependencia = [];
  //   if(!columnModal) return

  //   if((Object.keys(columnModal.config).length == 0) || !columnModal.config[nameData]){
  //     if(columnModal.config.not_in){
  //       let key = Object.keys(columnModal.config.not_in);
  //       if(key.includes(nameData)){
  //         let nro_ref = refData.current.hotInstance.getDataAtCol(columnModal.config.not_in[nameData])
  //         let resul   = Main._.compact( nro_ref) // filtra valores false,'',null
  //         ArrayDataDependencia.push({[nameData]:`${resul}`})
  //         ArrayDependenciaGlobal = ArrayDataDependencia;
  //       }
  //     }
  //     return ArrayDataDependencia;
  //   }

  //   let valor = g_getRowFocus(idComp);
  //   var info  = refData.current.__hotInstance.getSourceData()[valor[0].rowIndex]

  //   if(columnModal.config[nameData]?.depende_ex_cab !== undefined){
  //     for (let i = 0; i < columnModal.config[nameData].depende_ex_cab.length; i++){
  //       const items  = columnModal.config[nameData].depende_ex_cab[i];
  //       var dataName = items.id
  //       let indice   = getIndiceCabecera(idComp)
  //       let infoData = dataCabecera !== undefined && dataCabecera.current.data !== undefined ? dataCabecera?.current.data[indice] : dataCabecera?.current.dataCab ? dataCabecera?.current.dataCab[indice] : []
  //       if(infoData[dataName]?.length == 0){
  //         setTimeout(()=>{
  //           Main.message.info({
  //             content  : `Favor complete el campo ${items.label} antes de continuar!! (valor externo)`,
  //             className: 'custom-class',
  //             duration : `${2}`,
  //             style    : {
  //               marginTop: '2vh',
  //             },
  //           });
  //         },10)       
  //         return {valor:true,externo:true,nameColumn:dataName}
  //       }else{
  //         ArrayDataDependencia = [...ArrayDataDependencia,{
  //           [dataName]:infoData[dataName]
  //         }]
  //         ArrayDependenciaGlobal = ArrayDataDependencia;
  //       }
  //     }
  //   }
    
  //   if(columnModal.config[nameData].depende_de.length > 0){

  //     for (let i = 0; i < columnModal.config[nameData].depende_de.length; i++){
  //       const items  = columnModal.config[nameData].depende_de[i];
  //       var dataName = items.id
  //         if(info[dataName] === "" || Main._.isUndefined(info[dataName]) || Main._.isNull(info[dataName])){
  //           if(items.depende_value || items.isNull){
  //             if(items.depende_value?.value?.includes(info[items.depende_value.id]) || (items?.isNull !== undefined && items?.isNull !== true) ){
  //               setTimeout(()=>{
  //                 Main.message.info({
  //                   content  : `Favor complete el campo ${items.label} antes de continuar!!`,
  //                   className: 'custom-class',
  //                   duration : `${2}`,
  //                   style    : {
  //                     marginTop: '2vh',
  //                   },
  //                 });                  
  //               },10)
  //               return {valor:true,externo:false,nameColumn:dataName}
  //             }else{
  //               ArrayDataDependencia = [...ArrayDataDependencia,{
  //                 [dataName]:info[dataName]
  //               }]
  //               ArrayDependenciaGlobal = ArrayDataDependencia;
  //             }

  //           }else{
  //             setTimeout(()=>{
  //               Main.message.info({
  //                 content  : `Favor complete el campo ${items.label} antes de continuar!!`,
  //                 className: 'custom-class',
  //                 duration : `${2}`,
  //                 style    : {
  //                   marginTop: '2vh',
  //                 },
  //               });
  //             },10)            
  //             return {valor:true,externo:false,nameColumn:dataName} 
  //           }            
  //         }else{
  //           ArrayDataDependencia = [...ArrayDataDependencia,{
  //             [dataName]:info[dataName]
  //           }]
  //           ArrayDependenciaGlobal = ArrayDataDependencia;
  //         }
  //     }
  //   }
  //   return ArrayDataDependencia
  // }

  const getRowDataModal = async (url, tipo, data,dependencia)=>{
    let dataRows = []
    Main.activarSpinner()
    try {
        var method       = tipo;
        data.valor       = 'null'
        data.cod_empresa = sessionStorage.getItem('cod_empresa');
        data.dependencia = dependencia;
        await Main.Request(url,method,data)
        .then((response)=>{        
            if(response.data.rows){
              dataRows = response.data.rows;
            }                    
        });   
      Main.desactivarSpinner()
      return dataRows;
    } catch (error) {
      Main.desactivarSpinner()
      console.log("Error en el metodo getRowDataModal ",error);
    }
  }
  const KeyDown = (e)=>{
    if(!refData) return
    let editInput = document.getElementsByClassName('ht_clone_master') 
    if(editInput.length){
      let rowValue = g_getRowFocus(idComp)[0];
      refKeyDown.current.inputChange = rowValue
    }

    if(FormName && modalClick){
      const buttonElement = document.getElementsByClassName(FormName+'_alert')[0];
      if (buttonElement && [13,9].includes(e.keyCode)) {
        buttonElement.click(); // Enfocar el botón del modal
        return
      }
    }
    
    if(f7_and_F8 && [118,119].includes(e.keyCode))f7_and_F8(e);
    else if(e.keyCode === 118) e.preventDefault();

    if([38,40].includes(e?.keyCode) && e.repeat){
      if( e.keyCode === 40){
        let rowCount     = refData?.current?.hotInstance?.getSourceData()?.length;
        let rowIndex     = g_getRowFocus(idComp)[0]?.rowIndex
        let columnIndex  = g_getRowFocus(idComp)[0]?.columnIndex
        if(rowIndex === (rowCount - 1)){
          let rowScroll = banScroll[idComp]
          if(rowScroll?.row !== rowIndex) refData?.current?.hotInstance?.scrollViewportTo(rowIndex,columnIndex)
          else if(rowIndex === (rowCount - 1)) refData?.current?.hotInstance?.scrollViewportTo(rowIndex,columnIndex)
          if(setLastFocusNext){
            let dataRow =  refData.current.__hotInstance.getSourceData()[rowIndex]
            setLastFocusNext(e,dataRow,rowCount,rowIndex);  
          } 
          setBanScroll(rowIndex,idComp)          
        }
      }
      e.preventDefault()
      return
    }

    // FUNCION F9
    if(e.keyCode === 120){
      e.preventDefault();
      let valor   = g_getRowFocus(idComp);
      let element = refData?.current?.hotInstance?.getCellMeta(valor[0].rowIndex,valor[0].columnIndex);
      if(refData.current.__hotInstance.getCellMeta(valor[0].rowIndex,valor[0].columnIndex).readOnly) return
      if(!columnModal) return
      if(columnModal.urlBuscador.length === 0) return
      if(!element.readOnly && columnModal.urlBuscador[0][element.prop]){
        setTimeout(async()=>{

          var ArrayDataDependencia = await validarDependencia(element.prop);
          if(ArrayDataDependencia.valor === true && !ArrayDataDependencia.externo){
            let columIndex = refData.current.hotInstance.propToCol(ArrayDataDependencia.nameColumn)
            if(!Main._.isNull(refData.current.__hotInstance.toVisualColumn(columIndex))){
            refData.current.__hotInstance.selectCell(valor[0].rowIndex,columIndex)          
            }
            return
          }else if(ArrayDataDependencia.valor === true && ArrayDataDependencia.externo){
            if(document.getElementById(ArrayDataDependencia.nameColumn)){
              setTimeout(()=>{
                document.getElementById(ArrayDataDependencia.nameColumn).focus();
              },1)              
            }
            e.preventDefault()
            refData.current.__hotInstance.deselectCell()
            refKeyDown.current.KeyDown = true;
            refData.current.hotInstance.removeHook('beforeKeyDown',KeyDown)            
            return
          }
          var url          = columnModal.urlBuscador[0][element.prop]
          var AuxDatamodal = await getRowDataModal(url,'POST', {} ,ArrayDataDependencia)
          
     
          setShows(true);          
          refModal.current.dataParams   = { dependencia : ArrayDataDependencia
                                          , cod_empresa:sessionStorage.cod_empresa
                                          }
          refModal.current.idInput      = element.prop;
          refModal.current.ModalTitle   = columnModal.title[0][element.prop];
          refModal.current.modalColumn  = columnModal[element.prop];
          refModal.current.url_buscador = url;

          refData.current.hotInstance.deselectCell()
          refData.current.hotInstance.removeHook("beforeKeyDown", KeyDown);
          refKeyDown.current.KeyDown = true

          refModal.current.data = AuxDatamodal;          
          setEventGlobal(e.keyCode,idComp)
          

        })
      }
    }

    // ADD MAYUSCULA // VALIDA TIPO NUMERICO
    if (e.target.nodeName === 'TEXTAREA') {

      let rowindex      = g_getRowFocus(idComp)[0]?.rowIndex
      let rowColumn     = g_getRowFocus(idComp)[0]?.columnIndex
      let rowindex_ant  = g_getRowFocus(idComp)[0]?.rowIndex_ant
      let rowColumn_ant = g_getRowFocus(idComp)[0]?.columnIndex_ant

      let  valorIndex  = refData?.current?.hotInstance?.getSelectedLast() ? refData?.current?.hotInstance?.getSelectedLast() : [rowindex,rowColumn,rowindex_ant,rowColumn_ant]

      let rowIndex    = valorIndex && valorIndex !== -1 ? valorIndex[0] : 0
      let columnIndex = valorIndex && valorIndex !== -1 ? valorIndex[1] : 0
      rowIndex = rowIndex === -1 ? 0 : rowIndex;

      if(refData?.current?.hotInstance?.getCellMeta(rowIndex,columnIndex)?.readOnly) return


      let element     = refData?.current?.hotInstance?.getCellMeta(rowIndex,columnIndex);
      let evet1       = document.getElementsByClassName('ht_clone_master')
      
      if(evet1 && !element.readOnly){
        if(evet1.length > 0 && columns[columnIndex]?.upper){
          if(!e.target.classList.value.includes('handsontable-upper')){
            e.target.classList.add('handsontable-upper');              
          }
          setTimeout(()=>{
            e.target.value = e.target.value.toLocaleUpperCase()
          })
        }else{
          if(e.target.classList.value.includes('handsontable-upper')) e.target.classList.remove('handsontable-upper');
        }
        if(columnModal && columnModal.urlValidar.length > 0){
          if([37,39,13,40,9].includes(e?.keyCode) && evet1.length > 0 && columnModal?.urlValidar[0][columns[rowColumn]?.data]){
            validaInput(e.target.value,valorIndex,e)
          }else if(evet1.length > 0 && [40,38].includes(e.keyCode)){
            setTimeout(async()=>{
              let index = await parseInt(e.target.id)
              setFocusedRowIndex(index,false,refData,idComp);
            },1)
          }else if([13,9].includes(e?.keyCode)){
            if(columnModal && maxFocus){
              if(setLastFocusNext && columnModal[maxFocus[0].hasta]?.length > 0){
                let dataRow   = refData.current.__hotInstance.getSourceData()[rowIndex]
                let rowCount  = refData?.current?.hotInstance?.getSourceData()?.length;
                // let rowcolumn = refData.current.__hotInstance.propToCol(maxFocus[0].hasta)
                rowCount      = (rowCount - 1) === -1 ? 0 : rowCount - 1
                // let nexColumn = refData.current.__hotInstance.getSelected()[0][1]
                if(rowIndex === rowCount ) setLastFocusNext(e,dataRow,rowCount,rowIndex);
              }
            }
          }
        }else if(evet1.length > 0 && [40,38].includes(e.keyCode)){
          setTimeout(async()=>{
            let index = await parseInt(e.target.id)
            setFocusedRowIndex(index,false,refData,idComp);
          },1)
        }
          
        
        if(columns[rowColumn] && columns[rowColumn].type !== 'date'){
            if(evet1.length > 0){
              let value = refData.current.__hotInstance.view.settings.data[valorIndex[0] !== -1 ? valorIndex[0] : 0]
              if(value.insertDefault){
                value.inserted      = true;
                value.insertDefault = false;
              }else if(value.inserted){
                value.inserted      = true;
                value.insertDefault = false;
              }else if(!value.inserted || !value.insertDefault){
                value.updated       = true;
              }
              
              Main.modifico(FormName);
          }
        }
     }
    }
    
    if(e.keyCode === 38) setBanScroll(-1,idComp,e.keyCode)

    if([37,39,13,40,38].includes(e.keyCode)){
      
      let rowScroll = banScroll[idComp]
      let row       = g_getRowFocus(idComp)[0]
      let rowIndex  = refData?.current?.hotInstance?.getSelectedLast() ? refData?.current?.hotInstance?.getSelectedLast()[0] : g_getRowFocus(idComp)[0]?.rowIndex
      let rowCount  = refData?.current?.hotInstance?.getSourceData()?.length;

      if(row.columnIndex === 0 && rowIndex === 0 && e.keyCode === 37){
        refData?.current?.hotInstance?.selectCell(0, 0); 
        e?.stopImmediatePropagation();
        setFocusedRowIndex(0,false,refData,idComp);
      }else if(row.columnIndex === (columns.length - 1) && rowIndex === (rowCount - 1) && e.keyCode === 39) {
        refData.current.hotInstance.selectCell(rowIndex, row.columnIndex); 
        e?.stopImmediatePropagation();        
        setFocusedRowIndex(rowIndex,false,refData,idComp);
      }
      if(setLastFocusNext){
        if(columnModal && maxFocus){
          if(columnModal[maxFocus[0]?.hasta]?.length > 0) return // en caso que el valor maximo sea un valida
        }
        if([40,13].includes(e.keyCode)){
          let columnIndex = maxFocus ? refData.current.hotInstance.propToCol(maxFocus[0].hasta) : (columns.length - 1)
          let dataRow =  refData.current.__hotInstance.getSourceData()[rowIndex]
          if(row.columnIndex === columnIndex && rowIndex === (rowCount - 1) && e.keyCode === 13){
            refData?.current?.hotInstance.deselectCell()            
            setTimeout(async()=>{
              let valor = await Main.hotTableRequerido(idGrid,idComp);
              if(valor.Addband){      
                setTimeout(()=>{
                  Main.message.warning({
                    content  : `Ingrese ${valor.columnaRequerido.label} para Continuar!!`,
                    className: 'custom-class',
                    duration : `${2}`,
                    style    : {marginTop: '2vh'},
                  });
                  refData.current.__hotInstance.selectCell(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);
                  refData.current.__hotInstance.scrollViewportTo(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun)
                },4)
                return
              }else{
                if(maxFocus){
                  if(maxFocus[0].newAddRow === true && maxFocus[0].id === idComp)setLastFocusNext(e,dataRow,rowCount,rowIndex);  
                }else{
                  setLastFocusNext(e,dataRow,rowCount,rowIndex);  
                }
              }
            })
          }else if(rowIndex === (rowCount - 1) && e.keyCode === 40){
            if(rowScroll?.row !== rowIndex){
              refData.current.__hotInstance.scrollViewportTo(rowIndex,row.columnIndex)
            }
            setBanScroll(rowIndex,idComp)
            setLastFocusNext(e,dataRow,rowCount,rowIndex);  
          }
        }
      }else if(rowIndex === (rowCount - 1) && e.keyCode === 40){
        refData.current.__hotInstance.scrollViewportTo(rowIndex,row.columnIndex)
        setBanScroll(rowIndex,idComp)
      }
    }
    // NAVEGACION ENTER  
    navegacion(e)  

    if(e?.keyCode === 46 || e?.keyCode === 8){
      let row  = g_getRowFocus(idComp);
      if(!refData.current.hotInstance.getCellMeta(row[0].rowIndex, row[0].columnIndex).readOnly){
        setTimeout(()=>setFocusedRowIndex(row[0].rowIndex,false,refData,idComp),1)
      }
    }
    
    if(e.keyCode === 27){// espacape
      setTimeout(async()=>{
        let row = await g_getRowFocus(idComp);
        setFocusCloseModal({valor:e.target.value,rowIndex:row[0].rowIndex_ant,columnIndex:row[0].columnIndex_ant,valida:true},idComp)
      })
    }
  };
  const afterCreateRow = (row,col)=>{        
    let rowScroll = banScroll[idComp]
    let rowIndex  = g_getRowFocus(idComp)[0].rowIndex
    let rowCount  = refData?.current?.hotInstance?.getSourceData()?.length;
    if(rowScroll?.row !== rowIndex && rowIndex === (rowCount - 1)){
      // entra en conflicto en add header
      setTimeout(()=>{
        refData.current.__hotInstance.scrollViewportTo(rowIndex,row.columnIndex)
        setBanScroll(rowIndex,idComp)
      },1)
    }
  }

  const okMensaje = ()=>{
    let rowIndex  = g_getRowFocus(idComp)[0]
    setTimeout(()=>{
      if(refKeyDown.current.KeyDown){
        refKeyDown.current.KeyDown = false;
        refData.current.hotInstance.addHook('beforeKeyDown',KeyDown);
        refData.current.hotInstance.selectCell(rowIndex.rowIndex,rowIndex.columnIndex)  
      }
    })
  }

  const validaInput = async (valor,valorIndex,e)=>{
     // setTimeout(async()=>{
      let nameColumn = columns[valorIndex[1]].data    
      let row        = [{rowIndex:valorIndex[0],rowIndex_ant:valorIndex[2]}]      
      Main.modifico(FormName);
      if((setUpdateValue_ant)){
        setUpdateValue_ant(false,valorIndex,nameColumn)
      }else{ 
        if(columnModal.urlValidar[0][nameColumn]){
          var ArrayDataDependencia = await validarDependencia(nameColumn);
          
          if(Object.keys(columnModal.config).length !== 0 ){
            if(columnModal.config[nameColumn]?.dependencia_de.length > 0){
              columnDependencia(columnModal.config[nameColumn].dependencia_de,refData,row,columnModal,false);
            }
          }  
  
          if( ArrayDataDependencia.valor === true && !ArrayDataDependencia.externo){
            let columIndex = refData.current.hotInstance.propToCol(ArrayDataDependencia.nameColumn)
            if(!Main._.isNull(refData.current.__hotInstance.toVisualColumn(columIndex))){
              refData.current.__hotInstance.selectCell(valorIndex[0],columIndex)          
            }                          
            return
          }else if(ArrayDataDependencia.valor === true && ArrayDataDependencia.externo){
            e.stopImmediatePropagation();
            if(document.getElementById(ArrayDataDependencia.nameColumn)){
              setTimeout(()=>{
                document.getElementById(ArrayDataDependencia.nameColumn).focus();
              },1)              
            }            
            let columIndex = refData.current.hotInstance.propToCol(nameColumn)
            if(!Main._.isNull(refData.current.__hotInstance.toVisualColumn(columIndex))){              
              if(columns[columIndex].type === 'numeric'){
                const rowIndex = row[0] && row[0].rowIndex && row[0].rowIndex > 0 ? row[0].rowIndex : 0;
                refData.current.hotInstance.setDataAtCell(rowIndex, columIndex, '');
              }else{
                refData.current.hotInstance.setDataAtCell(row[0].rowIndex && row[0].rowIndex > 0 ? row[0].rowIndex : 0,columIndex,'')
              }              
            }
            e.preventDefault()            
            setTimeout(()=>{
              refData.current.__hotInstance.deselectCell()
              refKeyDown.current.KeyDown = true
              refData.current.hotInstance.removeHook('beforeKeyDown',KeyDown)                          
            }) 
            return
          }
  
          Main.activarSpinner()
          var columIndex = refData.current.hotInstance.propToCol(nameColumn)
          refData.current.__hotInstance.selectCell(valorIndex[0],columIndex)
  
          try {
  
            let url  = columnModal.urlValidar[0][nameColumn];
            var data = {valor,'cod_empresa':sessionStorage.getItem('cod_empresa'),dependencia:ArrayDataDependencia};
            await Main.Request( url,'POST', data).then(async resp => {			
              if(resp.status === 200 ){
                if(resp.data.outBinds.ret === 1){
  
                  if((Object.keys(resp.data.outBinds).length - 1 ) > 2){
                    for(var i in resp.data.outBinds){
                      if(i !== 'ret' && i !== 'p_mensaje'){
                      let columnIndex  = refData.current.hotInstance.propToCol(i)                  
                      if(!Main._.isNull(refData.current.__hotInstance.toVisualColumn(columnIndex))){
                        refData.current.__hotInstance.setDataAtCell(valorIndex[0],columnIndex,resp.data.outBinds[i])
                       }else{
                        refData.current.__hotInstance.view.settings.data[valorIndex[0]][i] = resp.data.outBinds[i];
                       }
                      }                              
                    }
                    refData.current.__hotInstance.updateSettings({      
                      cellRow:row[0].rowIndex,
                    });
                  }else{
                    var nombreColumn = columnModal[nameColumn] ? columnModal[nameColumn][1].data : Object.keys(resp.data.outBinds)[0];
                    let columnIndex  = refData.current.hotInstance.propToCol(nombreColumn)
                    if(!Main._.isNull(refData.current.__hotInstance.toVisualColumn(columnIndex))){
                      let DESC         = resp.data.outBinds[nombreColumn];
                      refData.current.__hotInstance.setDataAtCell(row[0].rowIndex,columnIndex,DESC)
                    }else{
                      refData.current.__hotInstance.view.settings.data[valorIndex[0]][nombreColumn] = resp.data.outBinds[nombreColumn];
                    }
                  }
                  setFocusCloseModal({valor,rowIndex:row[0].rowIndex_ant,columnIndex:columIndex,valida:true},idComp)
                  setFocusedRowIndex(row[0].rowIndex_ant,false,refData,idComp);
                  navegacion(e,true);
                  if(setUpdateValue_desp)setUpdateValue_desp(false,valorIndex,nameColumn)
                  if(setLastFocusNext && maxFocus && columnModal){
                    if(columnModal[maxFocus[0].hasta] || (maxFocus[0]?.hasta === nameColumn && columnModal.urlValidar[0][nameColumn]) ){
                      let dataRow     = refData.current.__hotInstance.getSourceData()[row[0].rowIndex];
                      let rowCount    = refData?.current?.hotInstance?.getSourceData()?.length;
                      let columnIndex = refData.current.__hotInstance.propToCol(maxFocus[0].hasta)                  
                      let nexColumn   = valorIndex[1]
                      // refData.current.__hotInstance.getSelected()[0][1]
                      rowCount        = (rowCount - 1) === -1 ? 0 : rowCount - 1
                      if(row[0].rowIndex === rowCount && columnIndex === nexColumn) setLastFocusNext(e,dataRow,rowCount,row[0].rowIndex);
                    }
                  }
                  
                  if(columns[columIndex].nextValida){
                    if(nextValidaInput){
                      refData.current.hotInstance.view.settings.data[valorIndex[0]].rowIndex = valorIndex[0];
                      nextValidaInput(nameColumn,refData.current.hotInstance.view.settings.data[valorIndex[0]])
                    }
                  }

                }else{
  
                  setFocusCloseModal({valor:'',rowIndex:row[0].rowIndex_ant,columnIndex:columIndex,valida:false},idComp)
                  let event = await eventGlobal[idComp]
                  
                  if(event !== -13){                   
                    refData?.current?.hotInstance.deselectCell()
                    setEventGlobal(-120,idComp);
                    if(columnModal[nameColumn]){
                      if((Object.keys(resp.data.outBinds).length - 1 ) > 2){
                        for(var a in resp.data.outBinds){
                          if(a !== 'ret' && a !== 'p_mensaje'){
                          let columnIndex  = refData.current.hotInstance.propToCol(a)                  
                          if(!Main._.isNull(refData.current.__hotInstance.toVisualColumn(columnIndex))){
                            refData.current.__hotInstance.setDataAtCell(valorIndex[0],columnIndex,resp.data.outBinds[a])
                           }else{
                            refData.current.__hotInstance.view.settings.data[valorIndex[0]][a] = resp.data.outBinds[a];
                           }
                          }        
                        }
                      }else{
                        for (let i = 0; i < columnModal[nameColumn].length; i++) {
                          const element = columnModal[nameColumn][i];
                          let IndexColumn  = refData.current.hotInstance.propToCol(element.data) 
                          if(!Main._.isNull(refData.current.__hotInstance.toVisualColumn(IndexColumn))){
                            refData.current.hotInstance.setDataAtCell(row[0].rowIndex_ant,IndexColumn,'')
                          }else{
                            refData.current.hotInstance.view.settings.data[row[0].rowIndex_ant][element.data] = '';
                          }
                        }
                      }
                    }
                    refData.current.hotInstance.setDataAtCell(row[0].rowIndex_ant,columIndex,'')
                    setFocusedRowIndex(row[0].rowIndex_ant,false,refData,idComp);                                        
                    refData.current.hotInstance.removeHook("beforeKeyDown", KeyDown);
                    refKeyDown.current.KeyDown = true
                    setTimeout(()=>{
                      Main.alert(resp.data.outBinds.p_mensaje, '¡Atención!', 'alert', 'OK',false,okMensaje)
                    })
                    
                  }
                }
              }
            });
            Main.desactivarSpinner()
          } catch (error) {
            Main.desactivarSpinner()
            console.error(error)  
          }
  
        }else if(columns[valorIndex[1]].type === 'numeric'){
          setTimeout(async()=>{
            let valor = await g_getRowFocus(idComp)[0]
            setFocusedRowIndex(valor.rowIndex,false,refData,idComp);
          },1)
        }
      }
  }
  const navegacion = (e,validate = false)=>{
    if(refKeyDown.current.KeyDown) return
    if (((e.keyCode === 13 || e.keyCode === 9) || (e.key === 'Enter' && e.shiftKey)) && columnNavigationEnter.length > 0) {
      const totalColumns = refData.current.hotInstance.countCols();
      let row            = g_getRowFocus(idComp);
      
      if ( (e.key === 'Enter' && e.shiftKey)) {
          // Flecha izquierda
          currentColumn = (currentColumn - 1 + totalColumns) % totalColumns;
        } else if (e.keyCode === 13 || e.keyCode === 9){
        // Flecha derecha
        currentColumn = (currentColumn + 1) % totalColumns;
      }

      // Verificar si la columna actual es editable
      while (columnNavigationEnter.indexOf(currentColumn) === -1) {
        if (e.key === 'Enter' && e.shiftKey) {
          // Flecha izquierda
          currentColumn = (currentColumn - 1 + totalColumns) % totalColumns;
        } else if (e.keyCode === 13 || e.keyCode === 9) {
          // Flecha derecha
          currentColumn = (currentColumn + 1) % totalColumns;
        }
      }
      
      var rowIndex       = row[0].rowIndex

      if((e.key === 'Enter' && e.shiftKey)                                                  && 
          row[0].columnIndex === columnNavigationEnter[0]                                   
          ){
        currentColumn = columnNavigationEnter[columnNavigationEnter.length - 1];      
        rowIndex      = rowIndex - 1; // fila izquierda
        currentColumn = rowIndex === -1 ? 0 : columnNavigationEnter[columnNavigationEnter.length - 1]
      }else if ( (e.keyCode   === 13 || e.keyCode === 9)                                    && 
          !(e.key === 'Enter' && e.shiftKey)                                                &&
          row[0].columnIndex === columnNavigationEnter[columnNavigationEnter.length - 1]    
         ) {
        currentColumn = columnNavigationEnter[0];      
        rowIndex += 1; // Siguiente fila
      }
      
      let nameColum = columns[row[0].columnIndex].data
      let evet1     = document.getElementsByClassName('ht_clone_master') 

      let p_valor   = focusEditMode === false ? focusEditMode : focusEditMode === true ? focusEditMode : undefined

      if((columns[row[0].columnIndex].validaExterno || columns[row[0].columnIndex].validaAllExterno) && (evet1.length > 0 || p_valor === false)){
        e.preventDefault();
        e.stopImmediatePropagation();
        
        row[0][nameColum] = e.target.value.trim().length > 0 ? e.target.value : row[0][nameColum]
        if(validaExterno)validaExterno(row[0],nameColum)
        if(validaAllExterno && refKeyDown.current.banEdit){
          validaAllExterno(row[0],nameColum,13);
          refKeyDown.current.banEdit = false;
        }; 
        setTimeout(()=>{
          refKeyDown.current.KeyDown = true;
          refData.current.hotInstance.removeHook('beforeKeyDown',KeyDown);          
        })
      }else if(columnModal && columnModal.urlValidar.length > 0){
        if(!columnModal.urlValidar[0][nameColum] || evet1.length === 0 || validate){
          refData.current.hotInstance.selectCell(rowIndex, currentColumn); // Cambiar la celda seleccionada
          if(columns[currentColumn]?.editFocus){            
            // hotInstance.setCellMeta(0, 0, 'readOnly', false);
            let activeEditor = refData.current?.hotInstance?.getActiveEditor();
            if(activeEditor){
              activeEditor.enableFullEditMode();
              setTimeout(()=>{
                activeEditor.beginEditing();
              },5);
            }            
          } 
          if(e?.stopImmediatePropagation)e?.stopImmediatePropagation(); // Detener la propagación del evento para evitar la navegación por defecto  
          setFocusedRowIndex(rowIndex,false,refData,idComp);
          if(nextFocus && (e.key === 'Enter' || e.key  === 'Tab') ){
            const totalColumns = refData.current.hotInstance.countCols() - 1;
            let row           = g_getRowFocus(idComp)[0];
            if(totalColumns === row.columnIndex_ant || totalColumns === rowIndex){
              refData.current.hotInstance.selectCell(row.rowIndex_ant, totalColumns === row.columnIndex_ant ? row.columnIndex_ant : rowIndex )
              refData.current.hotInstance.deselectCell();              
              refData.current.hotInstance.removeHook("beforeKeyDown", KeyDown);
              refKeyDown.current.KeyDown = true;
              setTimeout(()=>{
                nextFocus(rowIndex);
              },5)
            }
          }
        }
      }else if(nextFocus && (e.key === 'Enter' || e.key  === 'Tab') ){
        const totalColumns = refData.current.hotInstance.countCols() - 1;
        let rowIndex       = g_getRowFocus(idComp)[0];
        if(totalColumns === rowIndex.columnIndex){
          refData.current.hotInstance.deselectCell();
          refData.current.hotInstance.selectCell(rowIndex.rowIndex, rowIndex.columnIndex);
          refData.current.hotInstance.removeHook("beforeKeyDown", KeyDown);
          refKeyDown.current.KeyDown = true;
          setTimeout(()=>{            
            nextFocus(rowIndex);            
          },15)
        }
      }

    }else if(nextFocus && (e.key === 'Enter' || e.key  === 'Tab') ){
      const totalColumns = refData.current.hotInstance.countCols() - 1;
      let rowIndex       = g_getRowFocus(idComp)[0];
      if(totalColumns === rowIndex.columnIndex){
        refData.current.hotInstance.deselectCell();
        refData.current.hotInstance.removeHook("beforeKeyDown", KeyDown);
        refKeyDown.current.KeyDown = true;
        setTimeout(()=>{
          nextFocus(rowIndex);          
        },15)
      }
    }
  }

  //********** MODAL F9  ***************************/ 
  const eventoClick = async (data) => {
    setShows(!shows)
    setEventGlobal(120,idComp)
    Main.modifico(idComp)
    let row     = Main.g_getRowFocus(idComp);
    let element = refData.current.hotInstance.getCellMeta(row[0].rowIndex,row[0].columnIndex);

    if(columnModal.config[element.prop]){
      if(columnModal.config[element.prop].dependencia_de.length > 0){
        columnDependencia(columnModal.config[element.prop].dependencia_de,refData,row,columnModal);
      }
    }

    setTimeout(()=>{
    
      const meta = refData.current.hotInstance.getCellMetaAtRow(row[0].rowIndex);
      if(meta.length > 0 && meta[row[0].columnIndex].readOnly) meta[row[0].columnIndex].readOnly = false

      if (Object.keys(data).length > 0) {
        for (let key in data) {          
          let columnIndex = refData.current.hotInstance.propToCol(key)
          if(!Main._.isNull(refData.current.__hotInstance.toVisualColumn(columnIndex))){
            refData?.current?.hotInstance?.setDataAtCell(row[0].rowIndex,columnIndex,data[key])
          }else{
            refData.current.hotInstance.view.settings.data[row[0].rowIndex][key] = data[key];
          }
        }
      }

      if(refData.current.hotInstance.view.settings.data[row[0].rowIndex].insertDefault){
        refData.current.hotInstance.view.settings.data[row[0].rowIndex].inserted      = true;
        refData.current.hotInstance.view.settings.data[row[0].rowIndex].insertDefault = false;
      }else if(refData.current.hotInstance.view.settings.data[row[0].rowIndex].inserted){
        refData.current.hotInstance.view.settings.data[row[0].rowIndex].inserted      = true;
        refData.current.hotInstance.view.settings.data[row[0].rowIndex].insertDefault = false;
      }else if(!refData.current.hotInstance.view.settings.data[row[0].rowIndex].inserted || !refData.current.hotInstance.view.settings.data[row[0].rowIndex].insertDefault){
        refData.current.hotInstance.view.settings.data[row[0].rowIndex].updated       = true;
      }

      refData?.current?.hotInstance?.selectCell(row[0].rowIndex,row[0].columnIndex);
      if(columns[row[0].columnIndex] && columns[row[0].columnIndex].editModalFocus){
        setTimeout(()=>{
          const activeEditor = refData?.current?.hotInstance?.getActiveEditor();
          if (activeEditor) {
              const currentValue = data[columns[row[0].columnIndex].data];
              activeEditor.beginEditing(); // Activa el modo de edición
              // Restaura el valor después de que el modo de edición esté activo
              setTimeout(() => {
                activeEditor.setValue(currentValue);
              },);
          }
        },10)
      }
    })    
  }
  const cerrarModal = async (e)=>{
    setShows(e)
    let row     = Main.g_getRowFocus(idComp);
    refData?.current?.hotInstance?.selectCell(row[0].rowIndex,row[0].columnIndex);
    
    setTimeout(() => {
      const meta = refData.current.hotInstance.getCellMetaAtRow(row[0].rowIndex);
      if(meta.length > 0 && meta[row[0].columnIndex].readOnly){
        meta[row[0].columnIndex].readOnly = false
        // Actualiza los metadatos para la fila
        refData.current.hotInstance.setCellMetaObject(row[0].rowIndex, meta);
      }       
    });
  }
  const onChangeModal = async (e) => {
    let valor = e.target.value;
    if (valor.trim().length === 0) valor = 'null';
    let url = refModal.current.url_buscador;
    let data = { valor, ...refModal.current.dataParams }
    try {
      await Main.Request(url, 'POST', data).then(resp => {
        if (resp.status === 200) {
          refModalData.current.loadData(resp.data.rows)
        }
      });
    } catch (error) {
      console.log(error);
    }
  }  
  const afterChange = (changes, source)=>{
    if(changes){
      if(source === 'edit'){
        var columIndex = refData.current.hotInstance.propToCol(changes[0][1])

        if(columns[columIndex].edit && setUpdateEdit) setUpdateEdit(changes)

        if(columns[columIndex].type === 'numeric' || columns[columIndex].type === 'checkbox' || columns[columIndex].type === 'date' || columns[columIndex].type === 'select'){
          if(changes[0][2] !== changes[0][3]){
            Main.modifico(FormName)            
            setCambiosPendiente(idComp,true)

            if(columns[columIndex].type === 'date' || columns[columIndex].type === 'checkbox'){
              columIndex = refKeyDown.current.inputChange.columnIndex >= 0 ? refKeyDown.current.inputChange.columnIndex : columIndex; 
              if(validaAllExterno && columns[columIndex].validaAllExterno) refKeyDown.current.banEdit = true;
            
              let value = refData.current.__hotInstance.view.settings.data[changes[0][0]]
              // changes[0][0]
              if(value.insertDefault){
                value.inserted      = true;
                value.insertDefault = false;
              }else if(value.inserted){
                value.inserted      = true;
                value.insertDefault = false;
              }else if(!value.inserted || !value.insertDefault){
                value.updated       = true;
              }
            }            
          }
          if(columns[columIndex].type !== 'date' && columns[columIndex].type !== "select"){
            setFocusedRowIndex(changes[0][0],false,refData,idComp);  
          }else{
            setFocusedRowIndex(changes[0].rowIndex,false,refData,idComp);
          }
        }else{
          if(changes[0][2] !== changes[0][3]){
            Main.modifico(FormName);
            setCambiosPendiente(idComp,true)
            let value = refData.current.__hotInstance.view.settings.data[changes[0][0]]
          
            if(value.insertDefault){
              value.inserted      = true;
              value.insertDefault = false;
            }else if(value.inserted){
              value.inserted      = true;
              value.insertDefault = false;
            }else if(!value.inserted || !value.insertDefault){
              value.updated       = true;
            }

          }
        }

        columIndex = refKeyDown.current.inputChange.columnIndex >= 0 ? refKeyDown.current.inputChange.columnIndex : columIndex; 
        if(validaAllExterno && refKeyDown.current.banEdit && columns[columIndex].validaAllExterno){          
          refKeyDown.current.banEdit = false
          let valor  = refData.current.hotInstance.view.settings.data[changes[0][0]]
          valor.rowIndex  = changes[0][0];
          valor.rowColumn = columIndex;
          validaAllExterno(valor,changes[0][1],-1);
          setTimeout(()=>{
            refKeyDown.current.KeyDown = true;
            refData.current.hotInstance.removeHook('beforeKeyDown',KeyDown);
          })
        } 
      }
    }
  }
  const isValidDate = (dateString)=> {
    let valor = {isDate:false,date:''}

    const dateRegex = /^(\d{2})(\/)?(\d{2})\2(\d{4})$/;
    if (!dateRegex.test(dateString)) {
      return valor;
    }
  
    const [, day, , month, year] = dateString.match(dateRegex);
  
    const dateObject = new Date(`${year}-${month}-${day}T00:00:00`);
    
    
    if( dateObject.getDate()     === parseInt(day, 10)       &&
        dateObject.getMonth()    === parseInt(month, 10) - 1 &&
        dateObject.getFullYear() === parseInt(year, 10)){
  
      let date     = `${day}/${month}/${year}`
      valor.date   = date;     
      valor.isDate = true
    }
  
    return valor
  }
  const isValidDateHoraMin = (dateString) =>{
    let valor = { isDateTime: false, dateTime: '' };
  
    // Expresión regular para validar el formato DD/MM/YYYY HH:mm
    const dateTimeRegex = /^(\d{2})(\/)?(\d{2})\2(\d{4}) (\d{2}):(\d{2})$/;
  
    // Verificar si la cadena no cumple con el formato
    if (!dateTimeRegex.test(dateString)) {
      return valor;
    }
  
    try {
      // Desestructurar la cadena para obtener día, mes, año, hora y minutos
      const [, day, , month, year, hour, minute] = dateString.match(dateTimeRegex);
  
      // Crear un objeto de fecha
      const dateObject = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
  
      // Verificar si los componentes de la fecha y hora coinciden
      if (
        dateObject.getDate() === parseInt(day, 10) &&
        dateObject.getMonth() === parseInt(month, 10) - 1 &&
        dateObject.getFullYear() === parseInt(year, 10) &&
        dateObject.getHours() === parseInt(hour, 10) &&
        dateObject.getMinutes() === parseInt(minute, 10)
      ) {
        // Reformatear la fecha al formato DD/MM/YYYY HH:mm
        let dateTime = `${day}/${month}/${year} ${hour}:${minute}`;
        valor.dateTime = dateTime;
        valor.isDateTime = true;
      } else {
        throw new Error('Fecha y hora no válidas');
      }
    } catch (error) {
      console.error('Error al procesar la fecha y hora:', error);
    }
  
    return valor;
  }
  const onBeforeChange = (changes,source) => {
    
    // Antes de que se realice un cambio, almacenamos el valor actual de la celda en previousValueRef.
    if (changes && changes.length > 0) {
      const [row, prop] = changes[0];
      previousEditRef.current = { row, prop };
    }

    for (let i = 0; i < changes.length; i++) {
      // eslint-disable-next-line
      const [row, prop, oldVal, newVal] = changes[i];
      let columnIndex = refData.current.hotInstance.propToCol(prop)
      // if (columns[columnIndex].type === 'numeric' && isNaN(Number(newVal)) && newVal !== "" ){
      if( columns[columnIndex].type === 'numeric' && (isNaN(Number(newVal)) || (newVal < 0 && columns[columnIndex].isNegative === false)) && newVal !== ""){
        // Rechazar el cambio si el nuevo valor no es numérico
        if(newVal !== "") return false;
      }else if(columns[columnIndex].type === 'date'){
        let valor =  columns[columnIndex].hora ? isValidDateHoraMin(newVal) : isValidDate(newVal);
        if(valor.isDate || valor.isDateTime){
          changes[i][3] = valor.date ? valor.date : valor.dateTime;
        }else{
          return false
        }        
      }
      else if(columns[columnIndex].type === 'select'){
        const item = columns[columnIndex].options.find(({ id }) => id === newVal);
        if(!item) return false
      }
    }
  };
  const getHeaderAlignment = (col) => {
    switch (columns[col]?.className) {
      case "htLeft":
        return 'left';
      case "htCenter":
        return 'center';
      case "htRight":
        return 'right';
      default:
        return 'left';
    }
  };
  const removeColumnMenuButton = (col, TH) => {
    if (!columns[col].filter) {
      const button = TH.querySelector('.changeType');
      if (!button) return;
      button.parentElement.removeChild(button);
    }
    
    if(columns[col].type === 'numeric' || columns[col].className === 'htRight' ){
      const button = TH.querySelector('span');
      button.classList.add('withStyles');
    }
  };
  const customAfterGetColHeader = (col, TH) => {
    const headerAlignment = getHeaderAlignment(col);
    TH.style.textAlign = headerAlignment;   
    removeColumnMenuButton(col, TH)
  };
  const getkeysValue = (value)=>{
    var arrayValue = []
    if(value.length > 0){
      // eslint-disable-next-line
      value.map((items)=>{
        let keys = items.title;
        arrayValue.push(keys);
      })
    }
    return arrayValue;
  }
  // MULTIPLE HEADER
  const generateNestedHeaders = ()=>{
      var rowArray = []
      var banArray = false;
      // eslint-disable-next-line
      columns.map((itemSubTitle)=>{
        if(itemSubTitle.subTitle){
          banArray      = true;
          
          if(itemSubTitle.subTitle.length > 0){
            rowArray.push(itemSubTitle.subTitle)
          }
          
        }
      });
  
      if(banArray){
        let keyColumn = getkeysValue(columns)
        rowArray.push(keyColumn);
      }
  
      if(!banArray)return false
      else return rowArray;
  }
  const nestedHeaders = multipleHeader ? generateNestedHeaders() : false;  

  return (
    <div className={`componente-${idComp}`}>
      <FormModalSearch
        setShowsModal={(e)=>cerrarModal(e)}
        open={shows}
        title={shows ? refModal.current.ModalTitle : refModal.current.ModalTitle}
        className='Modal-contenet'
        component={
          <ModalHadsontable
            refData={refModalData}
            data={shows ? refModal.current.data : refModal.current.data}
            columns={shows ? refModal.current.modalColumn : refModal.current.modalColumn}
            onChange={onChangeModal}
            eventoClick={eventoClick}
            idComp={FormName}
          />
        }
        footer={null}
      />
      
      <HotTable
        ref={refData}
        data={refData?.current?.hotInstance ? refData?.current?.hotInstance.getSourceData() : []}
        height={height}
        copyPaste={true}
        columnSorting={true}
        trimRows={true}
        snapToBottom={true}
        enterBeginsEditing={false}
        autoWrapRow={true}
        autoWrapCol={false}
        dragToScroll={true}
        afterRender={true}

        filters={true}
        dropdownMenu={['filter_by_value', 'filter_action_bar']}
        afterDropdownMenuShow={
          (instance)=>{
            var filters = instance.hot.getPlugin('filters');
            filters.components.get('filter_by_value').elements[0].onClearAllClick({preventDefault: function() {}});
          }
        }
        contextMenu={['alignment','undo','copy']}

        className={`handsontable_${idComp}`}
        enterMoves={()=>{return {row:0 , col: 1}}}
        language={'es-MX'}
        stretchH={'all'}
        viewportRowRenderingOffset={350}

        colHeaders={columns.map((col) => `<div class="handsontable_${col.className}">${col.title}</div>`)}
        
        afterSelection={handleAfterSelection}
        beforeKeyDown={KeyDown}
        afterOnCellMouseDown={handleCellClick} 
        afterChange={afterChange}
        afterSelectionEnd={onAfterSelectionEnd}
        beforeChange={onBeforeChange}
        afterGetColHeader={customAfterGetColHeader}        
        afterCreateRow={afterCreateRow}  
        
        nestedHeaders={nestedHeaders}
        
        renderAllRows={true}

        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
      >
      {
        columns.map((col,indice)=>{
          
        return(
          col.type === 'date' ?          
            <HotColumn
              key={indice}
              data={col.data}
              type={'date'}
              title={col.title}
              width={col.width}
              className={col.className}
              readOnly={col.readOnly}              
              correctFormat={true}
              columnSorting={col.sorter === true ? {headerAction:true} : {headerAction:false}}
              dateFormat={col.hora ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY"}
              datePickerConfig={{
                showOnFocus: false, // Desactivar el calendario al enfocar el campo
                showWeekNumber: false,
                i18n:{
                  previousMonth:'Mes Anterior',
                  nextMonth: "Próximo Mes",
                  months:mes,
                  weekdays:semana,
                  weekdaysShort:diasSemanaCorto
                }
              }}
            />        
        : col.type === 'numeric' ?
          <HotColumn
            key={indice}
            data={col.data}
            type={col.type}
            title={col.title}
            width={col.width}
            className={col.className}
            readOnly={col.readOnly}
            columnSorting={col.sorter === true ? {headerAction:true} : {headerAction:false}}
            numericFormat={ col.format ? col.format : { pattern:'0',culture:'de-DE' }}
          />     
        : col.type === 'BUTTON' ?
          <HotColumn
            key={indice}
            data={col.data}
            title={col.title}
            width={col.width}
            className={col.className}
            renderer={(instance, TD, row, colum)=>customRenderer(instance, TD, row, colum, col.icon)}
            readOnly={true}
          />        
        : col.type === 'select' ?
          <HotColumn
            key={indice}
            data={col.data}
            type='dropdown'            
            title={col.title}
            width={col.width}
            className={col.className}
            readOnly={col.readOnly ? col.readOnly : false}
            source={col.options ? col.options : []}
            validator={keyValueListValidator}
            renderer={keyValueListRenderer}
            editor={KeyValueListEditor}
            columnSorting={col.sorter === true ? {headerAction:true} : {headerAction:false}}
          />    
        : 
          <HotColumn
            key={indice}
            data={col.data}
            type={col.type}
            title={col.title}
            width={col.width}              
            className={`${col.textWrap ? `unwraptext , ${col.className}` : col.className}`}
            readOnly={col.readOnly}
            checkedTemplate={col?.checkbox?.length > 0 ? col?.checkbox[0] : ''}
            // columnSummary={[{}]}
            // CHECKBOX
            uncheckedTemplate={col?.checkbox?.length > 0 ? col?.checkbox[1] : ''}  
            columnSorting={col.sorter === true ? {headerAction:true} : {headerAction:false}}
          />            

          )          
        })
        
      }

      </HotTable>
    </div>
  );
};

export default HandsontableGrid;