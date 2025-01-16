import * as React  from 'react';
import VARTICULO   from './view';
import Main        from '../../../../../util/Main';
import mainColumn  from './column/mainModal';
import mainIncial  from './objetoInicial/mainInicial';
import mainUrl     from './url/mainUrl';
import mainValida  from './inputValida/mainInput';
import stockDisp   from '../../../../../../assets/icons/stockDisp.png';
import stockIcon   from '../../../../../../assets/icons/stockarticulo.png';
import './styles/styles.css';

const FormName   = 'ARTICULO';
const idCompUm   = FormName+'_UM'
const idCompAlm  = FormName+'_ALM'
const TituloList = "Catastro de Articulo";
var vname_img    = 'articulo-img';
var data_len     = 50;

const ARTICULO = React.memo(() => {
  
  const history   = Main.useHistory();
  const [form]    = Main.Form.useForm();

  let defaultSelectedKeys = [FormName]
  let defaultOpenKeys     = Main.getMenuKeysForCodForm(FormName);
  // USEREF
  const buttonSaveRef       = React.useRef();
  const banRef              = React.useRef({indice:0      , id_cabecera:'' , b_bloqueo:false, manejaF7:false, mitad_data:(data_len / 2)
                                           ,idFocus:true  , indexRow:0})
  const refCab              = React.useRef({ data      :[], dataCan  :[]   , delete:[]   , activateCambio:false
                                           , dataCanDet:[], deleteDet:[]   
                                           , dataCanAlm:[], deleteAlm:[]   
                                           });
  const refDet              = React.useRef();
  const refDetAlm           = React.useRef();
  
  // USESTATE
  const [previewImage, setPreviewImage] = React.useState('');
  const [uploadImg   , setUploadImg   ] = React.useState([]);
  const [fileList    , setFileList    ] = React.useState([]);
  // MENSAJES  
  const [shows			 , setShows 		 	] = React.useState(false); 
  const [visible     , setVisible     ] = React.useState(false);
  const [keyImg      , setKeyImg      ] = React.useState(1);
  

  const refModalData = React.useRef()
  const refModal     = React.useRef({// F9
                                    refGrid        : {}
                                  , indexRow       : 0
                                  , columnIndex    : 0
                                  , data           : [] 
                                  , titleSearch    : ''
                                  , searchColumns  : []
                                  , stockDispon    : []
                                  , tipoDeBusqueda : ''
                                  , facturaPendiente : false
                                  // params / url
                                  , params         : {}
                                  , urlBuscador    : ''
                                });
  Main.useHotkeys(Main.guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});
  
  let idGrid = {
    grid:{
      [idCompUm]  : refDet,
      [idCompAlm] : refDetAlm
    },
    columna:{
      [idCompUm]  : mainColumn.columnDet,
      [idCompAlm] : mainColumn.columnAlmacen
    }
  }

  React.useEffect(()=>{
    if(defaultOpenKeys.length <= 0) history.push("/home");
    else{
      Main.activarSpinner()
      inicialForm()
    } 
    // eslint-disable-next-line
  },[])

  const inicialForm =(f7_delete = false, idFocus = 'cod_articulo')=>{
    let valor   = mainIncial.ObjetoInical
    banRef.current.b_bloqueo = false;
    form.resetFields();
    setUploadImg([])
    let newKey              = Main.uuidID();
    valor.key_cab           = newKey;
    valor.usuario           = sessionStorage.getItem('cod_usuario');
    valor.cod_empresa       = sessionStorage.getItem('cod_empresa');
    valor.fecha_alta        = Main.moment().format('DD/MM/YYYY').toString();    
    if(!f7_delete){
      loadForm(valor);
      refCab.current.dataCan  = JSON.parse(JSON.stringify([valor]));
      refCab.current.data     = JSON.parse(JSON.stringify([valor]));
    }else{
      Main.desactivarSpinner();
      refDet.current?.hotInstance.loadData([])
    } 
    setTimeout( ()=> {			
      Main.desactivarSpinner()
      document.getElementById(idFocus).focus();
		},20);
    document.getElementById("indice").textContent         = "1"
		document.getElementById("total_registro").textContent = "?";
		document.getElementById("mensaje").textContent 				= "";
  }
  const ver_bloqueo = (p_bloqueo = true, b_bloqueo = 'input-hidden')=>{
    let inputVisible = document.getElementsByClassName(`${FormName}_VISIBLE`)[0];
    inputVisible.classList.add(b_bloqueo.trim()); 
    banRef.current.b_bloqueo = b_bloqueo == 'input-hidden' ? true : false

    setTimeout(()=>{
      let input      = document.getElementsByClassName(`${FormName}_BLOQUEO`)[0];
      input.readOnly = p_bloqueo;
    },10);
  }
  const loadForm = async (data = [] , indice = false)=>{
    let index  = await indice ? indice : banRef.current.indice;
    let value  = await data[index] === undefined ? data : data[index];

    form.setFieldsValue({
      ...value,
      estado        : value?.estado     === 'S' ? true : false,
      inventariar   : value?.inventariar === 'S' ? true : false,
      stock_inicial : ''
    });

    if(Main.nvl(value.name_img,'-1') !== '-1'){
      let data = [{url:process.env.REACT_APP_BASEURL+value.name_img}]
      setFileList(data)    
      setKeyImg(1)  
    }else{
      setFileList([])
    }
    
    getDetalle(value);
    getAlmacen(value);
    Main.desactivarSpinner();    
    setTimeout(()=>ver_bloqueo(Main.nvl(value.cod_articulo,'-1') !== '-1', Main.nvl(value.cod_articulo,'-1') !== '-1' ?  undefined : 'input-visible'))
  }
  
  // **********************************************************************
  //                      UNIDAD DE MEDIDA
  // **********************************************************************
  const getParams = async (idCabecera = false, indexRow = 0)=>{
    var newKey        = Main.uuidID();
    var valor         = JSON.parse(JSON.stringify(mainIncial.ObjetoInicalDet))
    valor.key_cab	    = newKey;
    valor.cod_empresa	= sessionStorage.getItem('cod_empresa');
    valor.cod_sucursal= sessionStorage.getItem('cod_sucursal');
    valor.idCabecera  = idCabecera ? idCabecera : Main.nvl(refCab.current.data[indexRow]?.key_cab,refCab.current.data[indexRow]?.cod_articulo);
    return valor;
  }
  const getDetalle = async (data)=>{
    var content = [];
    try {
      Main.Request(mainUrl.url_listar_det,'POST',data).then(async(info)=>{
        if(info?.data?.length === 0 || info?.data === undefined){
          let dataParams = await getParams(data.key,banRef.current.indice)
          content = JSON.parse(JSON.stringify([dataParams]))
          content[0].cod_unidad    = 1;
          content[0].cantidad      = 1;
          content[0].descripcion   = 'Unidad 1';
          content[0].insertDefault = false
          content[0].inserted      = true
        } else content = info?.data
      
        refCab.current.dataCanDet = JSON.parse(JSON.stringify(content));
        refDet.current?.hotInstance.loadData(content);
        setTimeout(()=>habilitarCampo(),10)
      });      
    } catch (error) {
      Main.desactivarSpinner()
      console.error(error);
    }
  }
  // **********************************************************************
  //                      ARTICULO ALMACEN
  // **********************************************************************
  const getAlmacen = async (data)=>{
    var content = [];
    try {
      Main.Request(mainUrl.url_listar_alm,'POST',data).then(async(info)=>{
        if(info?.data?.length === 0 || info?.data === undefined){
          let dataParams = await getParams(data.key,banRef.current.indice)
          content = JSON.parse(JSON.stringify([dataParams]))
          content[0].insertDefault = false
          content[0].inserted      = true
        } else content = info?.data
        refCab.current.dataCanAlm = JSON.parse(JSON.stringify(content));
        refDetAlm.current?.hotInstance.loadData(content);
      });      
    } catch (error) {
      Main.desactivarSpinner()
      console.error(error);
    }
  }

  const guardar = async ()=>{

    Main.finalFocusDet(refDet.current.hotInstance);
    let rowCab = []
    if(refCab.current.delete.length === 0){
      let verificar_input_requerido = Main.validarCamposRequeridos();
      if(!verificar_input_requerido) return
      rowCab = JSON.parse(JSON.stringify(refCab.current.data[banRef.current.indice]));
    }
        
    let update_insert_detalle = []    
    if(refDet.current){
      update_insert_detalle = refDet.current.hotInstance.getSourceData();
      const valor = await Main.hotTableRequerido(idGrid,idCompUm,true);
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

    let url_cab         = mainUrl.url_get_serialCab+sessionStorage.getItem('cod_empresa');
    let row_cab         = await Main.GenerarUpdateInsert([rowCab],url_cab,'cod_articulo',[],['cod_empresa']);
    let updateInsertCab = row_cab.updateInsert;
    let delete_cab      = refCab.current.delete[0] && refCab.current.delete?.length > 0 && refCab.current.delete !== undefined ? refCab.current.delete : []
    let keyCabecera 		= row_cab.rowsAux.length > 0 ? row_cab.rowsAux[0]?.cod_articulo : form.getFieldValue('cod_articulo');

    if(updateInsertCab.length > 0 && updateInsertCab[0].inserted ){
      let p_mensaje = false;
      if(Main.nvl(updateInsertCab[0].stock_inicial,null) === null) p_mensaje = true;
      if(p_mensaje){
        Main.message.warning({
          content  : 'Es necesario que cargue el stock inicial',
          className: 'custom-class',
          duration : `${2}`,
          style    : {
              marginTop: '2vh',
          },
        });
        document.getElementById('stock_inicial').focus();
        return 
      }
    }
  
    let url_det         = mainUrl.url_get_serialDet+`${sessionStorage.getItem('cod_empresa')}/${sessionStorage.getItem('cod_sucursal')}/${keyCabecera}`;
    let row_det         = await Main.GenerarUpdateInsert(update_insert_detalle,url_det,'cod_unidad',[],['cod_unidad'],false,['cod_articulo'],row_cab.rowsAux);
    let updateInsertDet = row_det.updateInsert;
    let delete_det      = refCab.current.deleteDet[0] && refCab.current.deleteDet?.length > 0 && refCab.current.deleteDet !== undefined ? refCab.current.deleteDet : []

    let auditoria       = {"usuario" : sessionStorage.getItem('usuario') ,"cod_empresa": sessionStorage.getItem('cod_empresa')};
   
    if(row_cab.insertar || row_cab.actualizar){
      if((row_cab.insertar || row_cab.actualizar) && (Object.keys(uploadImg).length > 0)){
        let cod_empresa =  sessionStorage.getItem('cod_empresa');
        row_cab.updateInsert[0].name_img = `/private/${cod_empresa}/${FormName}/${vname_img}${row_cab.updateInsert[0].cod_articulo}.${uploadImg.name.split('.')[1]}`
        row_cab.rowsAux[0]['name_img']   = `/private/${cod_empresa}/${FormName}/${vname_img}${row_cab.updateInsert[0].cod_articulo}.${uploadImg.name.split('.')[1]}`
      }
    }

    let data = {
      updateInsertCab ,
      aux_updateInsertCab : [refCab.current.dataCan[banRef.current.indice]],
      delete_cab      ,
      // --
      updateInsertDet ,
      aux_updateInsertDet : refCab.current.dataCanDet,
      delete_det      ,
      // --
      auditoria,
    }
    Main.activarSpinner()
    if(updateInsertCab.length > 0 || delete_cab.length > 0 ||
       updateInsertDet.length > 0 || delete_det.length > 0
      ){
      Main.Request(mainUrl.url_abm,"POST",data).then(async(resp) =>{
        Main.desactivarSpinner()
        if(resp.data.res >= 1){
          Main.message.success({
            content  : `Procesando Correctamente!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {
                marginTop: '2vh',
            },
          });
          refCab.current.activateCambio = false;

          if(row_cab.actualizar || row_cab.insertar){
            
            if(row_cab.insertar){        
              form.setFieldsValue({
                ...form.getFieldsValue(),
                cod_articulo:row_cab.updateInsert[0].cod_articulo
              });        
            }            
            refCab.current.data     = JSON.parse(JSON.stringify(row_cab.rowsAux)); 
            refCab.current.dataCan  = JSON.parse(JSON.stringify(row_cab.rowsAux));

            saveImg(row_cab.updateInsert[0].cod_articulo,false);
            setTimeout(()=>ver_bloqueo(),20);
          }
          if(refCab.current.delete.length > 0){
            getData();
          }else{
            let param           = getParmas(true)
            param.cod_articulo  = row_cab.rowsAux[0].cod_articulo
            getData(param);
          }
          Main.setModifico(FormName);
          refCab.current.delete   = [];          
          refCab.current.deleteDet= [];
        }else if(uploadImg.name && uploadImg.name.length > 0 && row_cab.actualizar){
          saveImg(row_cab.updateInsert[0].cod_articulo).then(()=>{
            let param = getParmas(true)
            param.cod_articulo  = row_cab.rowsAux[0].cod_articulo
            getData(param)
          }).catch(()=>{
            Main.desactivarSpinner()
          });
        }else if(resp.data.res === -1){
          Main.desactivarSpinner();
          Main.setModifico(FormName);
          Main.message.info({
            content  : `No encontramos cambios para guardar`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {
                marginTop: '2vh',
            },
          });
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
      Main.desactivarSpinner();
      Main.message.info({
        content  : `No encontramos cambios para guardar`,
        className: 'custom-class',
        duration : `${2}`,
        style    : {
            marginTop: '2vh',
        },
      });
    }

  }
  const addRow = async (index = false)=>{
    if(banRef.current.idFocus){
      refCab.current.delete   = [];
      banRef.current.manejaF7 = false;
      mainValida.limpiarInputAnt();
      inicialForm()
    }else{
      let valor = await  Main.hotTableRequerido(idGrid,idCompUm);
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
      let newRow    = await getParamsDetalle(false,banRef.current.indice);
      let rowIndex  = index !== false ? index.index + 1 : banRef.current.indexRow === 0 ? banRef.current.indexRow + 1  : banRef.current.indexRow === -1 ? 0 : banRef.current.indexRow;
      newRow.insertDefault  = true
      newRow.cod_empresa    = sessionStorage.getItem('cod_empresa')
      newRow.cod_sucursal   = sessionStorage.getItem('cod_sucursal')
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
  const deleteRow = async ()=>{
    if(refCab.current.activateCambio){
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,()=>Main.Modal.destroyAll())
      return
    }
    if(banRef.current.idFocus){
      let indice = banRef.current.indice;
      refCab.current.delete = [refCab.current.data[indice]]
      refCab.current.activateCambio = true;
      form.resetFields();
      Main.modifico(FormName)
      setFileList([])
      inicialForm(true)
    }else{
      let rowCount      = refDet.current.hotInstance.countRows();
      let rowIndex      = banRef.current.indexRow;
      let rowData       = refDet.current.hotInstance.view.settings.data[Main.nvl(rowIndex,0)];
      let rowIndexFocus = rowIndex - 1 < 0 ? 0 : rowIndex - 1;

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
  }
  const cancelar = ()=>{
    Main.activarSpinner()
    let indice = Main.nvl(banRef.current.indice,0);
    refCab.current.delete         = [];
    refCab.current.deleteDet      = [];
    banRef.current.manejaF7       = false;
    refCab.current.activateCambio = false;
    banRef.current.b_bloqueo      = false;
    mainValida.limpiarInputAnt();
    Main.setBuscar(FormName,false);
    Main.setModifico(FormName)
    if(refCab.current.data[indice] && refCab.current.data[indice].insertDefault || refCab.current.data[indice].inserted){
      inicialForm()
    }else{
      form.resetFields();
      refCab.current.data    = JSON.parse(JSON.stringify(refCab.current.dataCan));
      refCab.current.dataCan = JSON.parse(JSON.stringify(refCab.current.data))   ;
      loadForm(refCab.current.data,indice) 
      setTimeout(()=>{
        Main.desactivarSpinner()
        document.getElementById('cod_articulo').focus();  
      },200)
    }
  }
  const saveImg = async (cod_articulo,activarMensaje = true)=> new Promise(async(resolve,reject)=>{
    if(fileList && fileList.length > 0 && fileList[0].uid !== '-1' && (uploadImg.name && uploadImg.name.length > 0)){
      try {
        let vcod_empresa    = sessionStorage.getItem('cod_empresa');
        let extemcionImg    = uploadImg.name.split('.')[1]; 
        let urlImg          = mainUrl.url_post_img+`${vcod_empresa}/${vname_img}${cod_articulo}.${extemcionImg}`;
        await Main.RequestImg(urlImg, 'POST', uploadImg).then(async(resp) => {
            if(resp.status === 200){    
              Main.setModifico(FormName);
              refCab.current.activateCambio = false;
              if(activarMensaje){
                Main.message.success({
                  content  : `Procesando Correctamente!! ${resp.data.mensaje}`,
                  className: 'custom-class',
                  duration : `${2}`,
                  style    : {
                      marginTop: '2vh',
                  },
                });
              }
              setKeyImg(-1);
              setTimeout(()=>{         
                setUploadImg([]);
                resolve(true)
              });
            }
        });  
      } catch (error) {
        console.log(error);
        reject(error)
      }      
    }
  })
  const funcionBuscar = (e)=>{
    if(e){
      if(!refCab.current.activateCambio){
    		Main.setModifico(FormName);
    		getData(false,true);
    	}else{
        Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,()=>Main.Modal.destroyAll())
    	}
    }else{
      manejaF7('cod_articulo')
    };
    Main.setBuscar(FormName,!e)
  }
  const NavigateArrow = (id)=>{
    Main.activarSpinner()
    switch (id) {
      case 'left':
         leftData();  
        break;
      case 'right':
         rightData();
        break;
      case 'next-left':
        if(refCab.current.data.length > 1){
          banRef.current.indice = 0;
          leftData();
        } else Main.desactivarSpinner();
        break;
      case 'next-right':
        if(refCab.current.data.length > 1){
          let index =  refCab.current.data.length - 1
          banRef.current.indice = index;
          loadForm(refCab.current.data[index],index);
          document.getElementById("indice").textContent = refCab.current.data.length;
        } else Main.desactivarSpinner();
        break;
      default:
        break;
    }
  }
  const getParmas = (retornaNull = false) =>{
    var data = {
      cod_articulo  : retornaNull ? null : form.getFieldValue('cod_articulo')  !== undefined ? form.getFieldValue('cod_articulo')  : null,
      descripcion   : retornaNull ? null : form.getFieldValue('descripcion')   !== undefined ? form.getFieldValue('descripcion')   : null,
      stock_minimo  : retornaNull ? null : form.getFieldValue('stock_minimo')  !== undefined ? form.getFieldValue('stock_minimo')  : null,
      codigo_barras : retornaNull ? null : form.getFieldValue('codigo_barras') !== undefined ? form.getFieldValue('codigo_barras') : null,
    }
    return data
  }
  const getData = (param = false, buttonF8 = false)=>{
    try {
      let data = param === false ?  getParmas(false) : param;
      data.indice     = 0;
      data.limite     = data_len;  
      data.cod_empresa = sessionStorage.cod_empresa;      
      Main.Request(mainUrl.url_listar_cab,'POST',data).then((resp)=>{
        Main.desactivarSpinner()
        if(resp.data.length > 0){
          banRef.current.manejaF7 = false        
          Main.setBuscar(FormName,false);
          if(resp.length === 1) document.getElementById("total_registro").textContent = "1";
          else document.getElementById("total_registro").textContent = resp.data.length
          refCab.current.data    = resp.data;		
          refCab.current.dataCan = JSON.parse(JSON.stringify(resp.data));          
          banRef.current.indice  = 0;
          loadForm(refCab.current.data,0);           
          if(buttonF8) document.getElementById('cod_articulo').focus();
        }else{
          Main.message.info({
            content  : `No encontramos datos!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {
                marginTop: '2vh',
            },
          });
        }        
      })
    } catch (error) {
      banRef.current.manejaF7 = false
      Main.desactivarSpinner()
      console.log(error)
    }
  }
  const manejaF7 = (idfocus)=>{
    try {
      form.resetFields()
      banRef.current.manejaF7 = true;
      setFileList([])
      Main.setBuscar(FormName,true);
      refDet.current?.hotInstance.loadData([])
      setTimeout(()=>{      
        banRef.current.id_cabecera = -1;
        banRef.current.indice = 0;
        document.getElementById(idfocus).focus();
        document.getElementById("indice").textContent         = "1"
		    document.getElementById("total_registro").textContent = "?";
        ver_bloqueo(false)
      })  
    } catch (error) {
      Main.desactivarSpinner()
      console.log(error)
    }
    
  }
  const handleKeyDown = (e)=>{
    
    if(e.target.id === 'cod_articulo'  && !banRef.current.manejaF7) e.preventDefault();
    if(['codigo_barras'].includes(e.target.id) && !banRef.current.manejaF7 && banRef.current.b_bloqueo) e.preventDefault();
    if(['stock_inicial'].includes(e.target.id) && banRef.current.b_bloqueo) e.preventDefault();
    let id_validacion = ['cod_categoria','cod_impuesto'];

    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault()
      try {
        switch (e.target.id) {
          case "cod_articulo":
            document.getElementById('descripcion').focus();
          break;
          case "descripcion":
            document.getElementById('stock_minimo').focus();
          break;
          case "stock_minimo":
            document.getElementById('codigo_barras').focus();
          break;
          case "codigo_barras":
            document.getElementById('cod_categoria').focus();
          break;
          case "stock_inicial":
            document.getElementById('estado').focus();
          break;
          case "estado":
            document.getElementById('inventariar').focus();
          break;
          case "inventariar":
            document.getElementById('cod_impuesto').focus();
          break;
          default:
            break;
        }
        if(id_validacion.includes(e.target.id)){
          e.preventDefault()
          validarInput(e.target.id);
        }  
      } catch (error) {
        Main.desactivarSpinner()
        console.log(error)
      }
      
    }else if(['F7','F8'].includes(e.key)){
      e.preventDefault()
      if('F7' === e.key) manejaF7(e.target.id);
      else {
        let data = form.getFieldsValue()
        data.cod_empresa = sessionStorage.cod_empresa;
        getData(data);
      }
    }else if(['F9'].includes(e.key) && id_validacion.includes(e.target.id)){
      e.preventDefault();
      let modalInput = mainValida.ValidaInput.find( item => item.input == e.target.id);
      let params = {}
      modalInput.data.map( keyCode => {
        params = { ...params, [keyCode]:form.getFieldValue(keyCode) }
      });
      params.cod_empresa               = sessionStorage.getItem('cod_empresa')
      refModal.current.form            = form
      refModal.current.tipoDeBusqueda  = e.target.id
      refModal.current.params          = params;
      refModal.current.urlBuscador     = modalInput.column.url
      refModal.current.titleSearch     = modalInput.column.title;
      refModal.current.searchColumns   = modalInput.column.columna;
      refModal.current.refGrid         = {}
      try {
        Main.activarSpinner()        
        Main.getDataModal(refModal.current.params, refModal.current.urlBuscador).then((resp)=>{
          if(resp && Object.keys(resp).length > 0) refModal.current.data = resp;
          else refModal.current.data = [];
          setTimeout(()=>{
            Main.desactivarSpinner();            
            setShows(true)
          },20)
        });
      } catch (error) {
        Main.desactivarSpinner()
        console.log(error);
      }
    }    
  }
  //*****************************************************************/
  const typeEvent = ()=>{
    if(banRef.current.manejaF7) return
    let indice = banRef.current.indice;
    if(refCab.current.data[indice] && refCab.current.data[indice]['insertDefault']){
      refCab.current.data[indice].insertDefault  = false;
      refCab.current.data[indice].inserted 		   = true;
    }
    if(refCab.current.data[indice] && !refCab.current.data[indice]['updated'] && refCab.current.data[indice]['inserted'] !== true){
      refCab.current.data[indice]['updated']     = true;
      refCab.current.activateCambio              = true;
      refCab.current.data[indice].usuario     	 = sessionStorage.getItem('usuario');
      refCab.current.activateCambio = true;
    }
    Main.modifico(FormName);
  }
  const handleInputChange = (e) => {
    try {
      refCab.current.data[banRef.current.indice][e?.target?.id ? e?.target?.id : e.target.name ] = e?.target?.value.trim();  
    } catch (error) {
      console.log(error)
    }
    typeEvent()
  }
  //*****************************************************************/
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if(newFileList.length === 0){
      let indice = banRef.current.indice;
      if(refCab.current.data[indice] && !refCab.current.data[indice]['updated'] && refCab.current.data[indice]['inserted'] !== true){
        refCab.current.data[indice].name_img = '';
      }
    }
    typeEvent()
  };
  const handleupload = async (file, fileList) => {
    setUploadImg(file)
  }
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      if (!file.url && !file.preview) {
        file.url = await Main.getBase64(file.originFileObj);
      }
    }
    setPreviewImage(file.url);
  };
  //*****************************************************************/
  const handleCheckbox = (e,value)=>{
    try {
      refCab.current.data[banRef.current.indice][e?.target?.id] = e.target.checked ? value[0] : value[1];
    } catch (error) {
      console.log(error)
    }
    typeEvent();
  }
  const leftData = async() => {
    if(!refCab.current.activateCambio){
      var index = banRef.current.indice - 1;
			if(index < 0){
				index = 0;
				document.getElementById("mensaje").textContent = "Haz llegado al primer registro";
			}else{
				document.getElementById("mensaje").textContent = "";
			}
			document.getElementById("indice").textContent = index + 1;
      banRef.current.indice = index;
      let row = refCab.current.data[banRef.current.indice]
      if( banRef.current.id_cabecera !== row.cod_articulo ) banRef.current.id_cabecera = row.cod_articulo;
      loadForm(refCab.current.data,index);
    }else{
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,()=>Main.Modal.destroyAll())
    }
  } 
  const rightData = async() => {
    if(!refCab.current.activateCambio){
      if(refCab.current.data.length !== 1){
        let indice = banRef.current.indice + 1
        if(refCab.current.data[indice] !== undefined){
          if(banRef.current.id_cabecera !== refCab.current.data[indice]?.cod_articulo && !Main._.isUndefined(refCab.current.data[indice].cod_articulo)){
            banRef.current.id_cabecera = refCab.current.data[indice]?.cod_articulo;
            banRef.current.indice = indice
            loadForm(refCab.current.data[indice],indice)
            document.getElementById("mensaje").textContent = "";
            document.getElementById("indice").textContent  = indice + 1;
            if(banRef.current.indice >= banRef.current.mitad_data){
              let data = { indice      : refCab.current.data.length, 
                           limite      : data_len,
                           cod_empresa : sessionStorage.getItem('cod_empresa')
                          };  
              try {
                Main.Request(mainUrl.url_listar_cab,'POST',data).then((resp)=>{
                  Main.desactivarSpinner()
                  if(resp.data.length > 0){
                    refCab.current.data       = [...refCab.current.data,...resp.data];		
                    refCab.current.dataCan    = JSON.parse(JSON.stringify(refCab.current.data));
                    banRef.current.mitad_data = refCab.current.data.length / 2
                  }  
                })
              } catch (error) {
                console.log(error);
              }
            }
          }
        }
        Main.desactivarSpinner()
       }else{
        document.getElementById("mensaje").textContent = "";
        Main.desactivarSpinner(); 
       }

    }else{
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,()=>Main.Modal.destroyAll())
		}

  }
  const handleKeyUp = async(e) => {
		if(e.keyCode === 40){e.preventDefault(); Main.activarSpinner(); rightData();}
		if(e.keyCode === 38){e.preventDefault(); Main.activarSpinner(); leftData(); }
	}
  // =============================================================
  // ======================  GRILLA  =============================
  // =============================================================
  const setLastFocusNext = React.useCallback((e,row,rowCount,rowindex)=>{
    if(e.keyCode === 13){
      banRef.current.idFocus = false;
      setTimeout(()=>{        
        addRow({index:rowindex})
      },2)
    }
    // eslint-disable-next-line
  },[]);
  const setClickCell = React.useCallback((idFocus = false,e)=>{
    banRef.current.idFocus = !idFocus;
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

  // =============================================================
  // ======================  F9  =================================
  // =============================================================
  const onChangeModal = async (e) => {
    let valor = e.target.value;
    if (valor.trim().length === 0) valor = 'null';
    let url  = refModal.current.urlBuscador;
    let data = refModal.current.params
    data.valor = valor
    try {
      await Main.Request(url, 'POST', data).then(resp => {
        if (resp.status === 200) {
          refModalData.current.loadData(resp.data)
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  const eventoClick = async (data) => {
    setShows(!shows)
    Main.desactivarSpinner()
    setTimeout(()=>{
      if (Main._.keys(data).length > 0) {
        for (let key in data) {
          refModal.current.form.setFieldsValue({
            ...refModal.current.form.getFieldsValue(),
            [key]: data[key]
          });
          refCab.current.data[banRef.current.indice][key] = data[key];
        }
      }
      setTimeout(()=>{
        document.getElementById(refModal.current.tipoDeBusqueda).focus();           
        typeEvent();
      },10)
    });      
  }
  const validarInput = async(input,inicial = false) => {
    let indice       = banRef.current.indice
    let dataCabecera = refCab.current.data

    let item = await mainValida.ValidaInput.find( item => item.input == input);
    if(!Main._.isObject(item)) return;
    
    if( form.getFieldValue(item.input) !== item.valor_ant && !banRef.current.manejaF7){
      Main.activarSpinner()
      try {
        let data = {}
        item.data.map( keyCode => {
          data = { ...data, [keyCode]:Main.nvl(form.getFieldValue(keyCode),'') }
        });
        data =  {...data, valor:form.getFieldValue(item.input)};
        data.cod_empresa  = sessionStorage.getItem('cod_empresa');
        Main.Request( item.url, 'POST', data ).then( response => {
          Main.desactivarSpinner()

          if(response.data[0] && Main.nvl(response.data[0].p_mensaje) == null){  
            typeEvent();          
            if(item.ejecute) ejecucionValida(item,response.data);              
            item.valor_ant = form.getFieldValue(item.input);
            Object.keys(response.data[0]).map( key => {  
              form.setFieldsValue({
                ...form.getFieldsValue(),
                [key]: response.data[0][key]
              });
              dataCabecera[indice][key] = response.data[key];          
            });
            if(item.next != "" && !inicial){
              document.getElementById(item.next).focus();
              if(item.next !== 'BUTTON') document.getElementById(item.next).select();
            }    
          }else{
            item.valor_ant = null;
            item.band      = false;
            refModal.current.nameError = item.input
            if(Main.nvl(item.outError,true) === true){
              Object.keys(response.data[0]).map((code)=>{
                if(!['ret','p_mensaje'].includes(code)){
                  form.setFieldsValue({
                    ...form.getFieldsValue(),
                      [code]: response.data[code]
                    });
                  dataCabecera[indice][code] = response.data[0][code]
                }
              })
            }            
            Main.alert(response.data.length ? response.data[0].p_mensaje : 'Favor intente mas tarde!!','Atencion!','info','','Ok','',()=>Main.Modal.destroyAll());
          }
        });
      } catch (error) {
        Main.desactivarSpinner()
        console.log(error);
      }
    }else{
      if(item.next !== ""){
        document.getElementById(item.next).focus();
        if(item.next !== "BUTTON") document.getElementById(item.next).select();
      }
      if(item.ejecute) ejecucionValida(item,{});
    }
  }
  // =============================================================
  const generateRandomBarcode = () => {
    let randomBarcode = '';
    for (let i = 0; i < 12; i++) {
      randomBarcode += Math.floor(Math.random() * 10);  // Genera un dígito entre 0-9
    }
    if(!banRef.current.b_bloqueo){
      form.setFieldsValue({
        ...form.getFieldsValue(),
        'codigo_barras':randomBarcode
      })
      refCab.current.data[banRef.current.indice].codigo_barras = randomBarcode;
      typeEvent()
    }    
  };

  const getStockDisponible = ()=>{
    try {
      const params = form.getFieldValue()
      Main.activarSpinner()
      Main.Request(mainUrl.url_buscar_stockDisp,'POST',params).then((resp)=>{
        Main.desactivarSpinner()
        if(resp.data.length > 0){
          console.log(resp.data);
          refModal.current.stockDispon = resp.data
          setVisible(true);
        }else{
          Main.message.info({
            content  : `No encontramos datos disponibles!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {
                marginTop: '2vh',
            },
          });
        }
      });
    } catch (error) {
      console.log(error)
      Main.desactivarSpinner()
    }
  }

  return (
    <>
        <Main.Modal 
          title="Stock Disponible"
          visible={visible}
          onCancel={() => setVisible(false)} // Cierra el modal cuando se da click en cerrar
          footer={null} // Elimina los botones del modal (como el de "Ok" y "Cancelar")
        >
          <Main.List
            itemLayout="horizontal"
            dataSource={visible ? refModal.current.stockDispon : []}
            renderItem={(item, index) => (
              <Main.List.Item>
                <Main.List.Item.Meta
                  avatar={<Main.Avatar icon={<img alt='#' src={stockIcon} width="15" height="15" />} />}
                  title={<div>{item.desc_almacen}</div>} 
                  description={<div>Stock Disponible : {item.stock_disponible}</div>} />
              </Main.List.Item>
            )}
          />
        </Main.Modal>
      
      <Main.FormModalSearch
        setShowsModal={(e)=>{Main.desactivarSpinner(); setShows(e)}}
        open={shows}
        title={shows ? refModal.current.titleSearch : refModal.current.titleSearch}
        className='Modal-contenet'
        component={
          <Main.ModalHadsontable
            refData={refModalData}
            data={shows ? refModal.current.data : refModal.current.data}
            columns={shows ? refModal.current.searchColumns : refModal.current.searchColumns}
            onChange={onChangeModal}
            eventoClick={eventoClick}
            idComp={FormName}
          />
        }
        footer={null}
      />
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
            funcionBuscar={funcionBuscar}
            NavigateArrow={NavigateArrow}
            addButton={<>
              <Main.Button onClick={getStockDisponible} icon={<img alt='#' src={stockDisp} width="15" height="15" />} className={`paper-header-menu-button ${FormName}_menu`} />
            </>
          }
          />

          <VARTICULO
            form={form} 
            FormName={FormName}
            //  IMG 
            fileList={fileList}
            onPreview={onPreview}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            handleupload={handleupload}
            onChange={onChange}
            //=====================
            setLastFocusNext={setLastFocusNext}
            setClickCell={setClickCell}
            setfocusRowIndex={setfocusRowIndex}
            //=====================
            handleInputChange={handleInputChange}          
            handleKeyDown={handleKeyDown}
            handleCheckbox={handleCheckbox}
            handleKeyUp={handleKeyUp}
            generateRandomBarcode={generateRandomBarcode}
            refDet={refDet}
            refDetAlm={refDetAlm}
            idComp={idCompUm}
            idCompAlm={idCompAlm}
            keyImg={keyImg}
          />

        </Main.Spin>
      </Main.Layout>    
    </>
  );
});

export default ARTICULO;