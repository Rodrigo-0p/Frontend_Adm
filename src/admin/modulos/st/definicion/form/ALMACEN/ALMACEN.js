import * as React from 'react';
import Main       from '../../../../../util/Main';
import mainUrl    from './url/mainUrl';
import mainIncial from './objetoInicial/mainInicial';
import mainColumn from './column/mainModal';
import VALMACEN   from './view';
import './styles/styles.css'

const FormName   = 'ALMACEN'     ;
const idComp     = FormName;
const TituloList = "Almacen";

const ALMACEN = React.memo(() => {
  const history   = Main.useHistory();
  
  let defaultSelectedKeys = [FormName]
  let defaultOpenKeys     = Main.getMenuKeysForCodForm(FormName);
  
  const buttonSaveRef  = React.useRef(null);
  const refDet         = React.useRef(null)
  const refCab         = React.useRef({ dataCanDet:[], deleteDet:[]});
  const banRef         = React.useRef({indice:0, id_cabecera:'',idFocus:true, indexRow:0})
  Main.useHotkeys(Main.guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});

  let idGrid = {
    grid:{
      [idComp] : refDet
    },
    columna:{
      [idComp] : mainColumn.columnDet
    }
  }

  React.useEffect(()=>{
    if(defaultOpenKeys.length <= 0) history.push("/home");
    else{
      getData()
    } 
    // eslint-disable-next-line
  },[]);
  
  const guardar = async()=>{
    
    Main.finalFocusDet(refDet.current.hotInstance);
    let update_insert_detalle = []    
    if(refDet.current){
      update_insert_detalle = refDet.current.hotInstance.getSourceData();
      const valor = await Main.hotTableRequerido(idGrid,idComp,true);
      if(valor.Addband){
        setTimeout(()=>{
          Main.message.warning({
            content  : `Ingrese ${valor.columnaRequerido.label} para Continuar!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {marginTop: '2vh'},
          });        
          refDet.current.hotInstance.selectCell(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);
        },1)
        return
      } 
    }
    
    let url_det         = mainUrl.url_get_serial+`${sessionStorage.getItem('cod_empresa')}/${sessionStorage.getItem('cod_sucursal')}`;
    let row_det         = await Main.GenerarUpdateInsert(update_insert_detalle,url_det,'cod_almacen',[],['cod_almacen'],false,['cod_almacen']);
    let updateInsertDet = row_det.updateInsert;
    let delete_det      = refCab.current.deleteDet[0] && refCab.current.deleteDet?.length > 0 && refCab.current.deleteDet !== undefined ? refCab.current.deleteDet : []
  
    let auditoria       = {"usuario" : sessionStorage.getItem('usuario') ,"cod_empresa": sessionStorage.getItem('cod_empresa')};
    
    let data = {

      updateInsertDet,
      aux_updateInsertDet : refCab.current.dataCanDet,
      delete_det,
      // --
      auditoria,
    }

    Main.activarSpinner()
    if(updateInsertDet.length > 0 || delete_det.length > 0){
      Main.Request(mainUrl.url_abm,"POST",data).then(async(resp) => {
        Main.desactivarSpinner();
        if(resp.data.res >= 1){          
          Main.message.success({
            content  : `Procesando Correctamente!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {
                marginTop: '2vh',
            },
          });
          cancelar();          
        }else{
          Main.message.error({
            content  : resp.data.mensaje.length > 0 ? resp.data.mensaje : 'Favor intente mas tarde!!',
            className: 'custom-class',
            duration : `${2}`,
            style    : {
                marginTop: '2vh',
            },
          });
        }
      });
    }else{
      Main.message.info({
        content  : `No encontramos cambios para guardar`,
        className: 'custom-class',
        duration : `${2}`,
        style    : {
            marginTop: '2vh',
        },
      });
      Main.desactivarSpinner();
    }

  }
  const addRow = async(index = false)=>{
    let valor = await  Main.hotTableRequerido(idGrid,idComp);
    if(valor.Addband){
      setTimeout(()=>{
        Main.message.warning({
          content  : `Ingrese ${valor.columnaRequerido.label} para Continuar!!`,
          className: 'custom-class',
          duration : `${2}`,
          style    : {marginTop: '2vh'},
        });
        refDet.current.hotInstance.selectCell(valor.columnaRequerido.indexRow,valor.columnaRequerido.indexComun);
      },5)
      return
    }      
    let newRow    = await getParams(false);
    let rowIndex  = index !== false ? index.index + 1 : banRef.current.indexRow === 0 ? banRef.current.indexRow + 1  : banRef.current.indexRow === -1 ? 0 : banRef.current.indexRow;
    newRow.insertDefault  = true
    newRow.cod_empresa  = sessionStorage.getItem('cod_empresa');
    newRow.cod_sucursal = sessionStorage.getItem('cod_sucursal');
    Main.modifico(FormName);
    refDet.current.hotInstance.alter('insert_row', rowIndex);
    refDet.current.hotInstance.view.settings.data[rowIndex] =  JSON.parse(JSON.stringify({...newRow}));
    refDet.current.hotInstance.updateSettings({
      cellRow:rowIndex,
    });
    habilitarCampo();
    setTimeout(()=>{        
      refDet.current.hotInstance.selectCell(rowIndex, 1)
      banRef.current.indexRow = rowIndex;
    },40)
  }
  const habilitarCampo = ()=>{
    let hotInstance = refDet.current.hotInstance;
    if(hotInstance){
      setTimeout(()=>{
        hotInstance.updateSettings({
          cells(row, col) {
            const cellProperties = {};
            const rowValue = hotInstance.getSourceDataAtRow(row);
            if([0].includes(col) && (rowValue?.insertDefault === true || rowValue?.inserted)){
              if( Main.nvl(hotInstance.getData()[row],false) !== false){
                cellProperties.readOnly = false;
              }
            }
            return cellProperties;
          }
        });
        hotInstance.render();
      },15);
    }
  }
  const deleteRow = ()=>{
    let rowCount      = refDet.current.hotInstance.countRows();
    let rowIndex      = banRef.current.indexRow;
    let rowData       = refDet.current.hotInstance.view.settings.data[Main.nvl(rowIndex,0)];
    let rowIndexFocus = rowIndex - 1 < 0  ? 0 : rowIndex - 1;

    if(!rowData?.inserted && !rowData?.insertDefault){

      if(refCab.current.deleteDet.length > 0){
        refCab.current.deleteDet = Main._.union(refCab.current.deleteDet, [rowData])
      }else{
        refCab.current.deleteDet = [...refCab.current.deleteDet,rowData]
      }

      refDet.current.hotInstance.alter('remove_row',rowIndex);
      setTimeout(()=>{
        refDet.current.hotInstance.selectCell(rowIndexFocus,0)
        banRef.current.indexRow = rowIndexFocus
      })

      Main.modifico(FormName);
      if(rowCount === 1){
        banRef.current.idFocus = false;
        addRow({index:-1});
      }
      Main.desactivarSpinner()
    }else if(rowCount === 1){
      banRef.current.idFocus = false;
      refDet.current.hotInstance.alter('remove_row',rowIndex);
      addRow({index:-1});
      Main.desactivarSpinner()
    }else{
      Main.desactivarSpinner()
      refDet.current.hotInstance.alter('remove_row',rowIndex);
      refDet.current.hotInstance.selectCell(rowIndexFocus,0)
    }   
  }
  const cancelar = ()=>{
    refCab.current.deleteDet= [];
    banRef.current.manejaF7 = false;
    Main.setModifico(FormName)
    getData();
  }
  const getParams = async (idCabecera = false, indexRow = 0)=>{
    var newKey        = Main.uuidID();
    var valor         = JSON.parse(JSON.stringify(mainIncial.ObjetoInical))
    valor.key	        = newKey;
    valor.cod_empresa	= sessionStorage.getItem('cod_empresa');
    return valor;
  }
  const getData = async (data = {})=>{
    var content = [];
    try {
      data.cod_empresa = sessionStorage.getItem('cod_empresa');
      Main.activarSpinner()
      await Main.Request(mainUrl.url_listar_cab,'POST',data).then(async(info)=>{
        Main.desactivarSpinner()
        if(info?.data?.length === 0 || info?.data === undefined){
          let dataParams = await getParams()
          content = [dataParams]
          setTimeout(()=>habilitarCampo(),1)
        } else content = info?.data
        refCab.current.dataCanDet = JSON.parse(JSON.stringify(content));
        refDet.current?.hotInstance.loadData(content);
        setTimeout(()=>{
          refDet.current.hotInstance.selectCell(0, 0)
        })        
      });      
    } catch (error) {
      console.error(error);
    }
  }
  const setLastFocusNext = React.useCallback((e,row,rowCount,rowindex)=>{
    if(e.keyCode === 13){
      setTimeout(()=>{        
        addRow({index:rowindex})
      })
    }
    // eslint-disable-next-line
  },[]);
  const setClickCell = React.useCallback((idFocus = false,e)=>{
    if(idFocus){
      banRef.current.indexRow = Main.nvl(e.row,0);
      let total = refDet.current.hotInstance.countRows() === 0 ? 1 : refDet.current.hotInstance.countRows();
      document.getElementById("total_registro").textContent = total;
    }else{
      document.getElementById("total_registro").textContent = "?";
      document.getElementById("mensaje").textContent 				=  "";
    }
    // eslint-disable-next-line 
  },[])
  const setfocusRowIndex = React.useCallback((value,rowsIndex = 0)=>{
    banRef.current.indexRow = rowsIndex < 0 ? 0 : rowsIndex;
    // eslint-disable-next-line
  },[])
  
  return (
    <Main.Layout defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys={defaultOpenKeys}>
      <Main.Spin spinning={false} delay={500}>
        <div className="paper-header">
          <Main.Title level={4} className="title-color">
            {TituloList}<div level={5} className="title-color-forname">{FormName}</div>
          </Main.Title>
        </div>

        <Main.HeaderMenu
          AddForm={()=>addRow()}
          SaveForm={guardar}
          deleteRows={deleteRow}
          cancelar={cancelar}
          formName={FormName}
          vprinf={false}
          refs={{ref:buttonSaveRef}}
        />

        <VALMACEN
          FormName={FormName}
          idComp={idComp}
          refDet={refDet}
          setLastFocusNext={setLastFocusNext}
          setClickCell={setClickCell}
          setfocusRowIndex={setfocusRowIndex}
        /> 

      </Main.Spin>      
    </Main.Layout>     
  );
});

export default ALMACEN;