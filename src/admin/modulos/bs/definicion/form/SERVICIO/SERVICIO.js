import * as React      from 'react';
import VSERVICIO       from './view'
import Main            from '../../../../../util/Main';
import mainIncial      from './objetoIncial/mainInicial';
import mainColumn      from './column/mainModal';
import mainUrl         from './url/mainUrl'
import './styles/styles.css';

const FormName   = 'SERVICIO';
const idComp     = FormName+'_DET'
const TituloList = "Nuestro Servicio";
var vname_img    = 'servicio-img';
var data_len     = 50;

const SERVICIO =  React.memo(() => {
  
  const history   = Main.useHistory();
  const [form]    = Main.Form.useForm();
  
  let defaultSelectedKeys = ['SERVICIO']
  let defaultOpenKeys     = Main.getMenuKeysForCodForm('SERVICIO');
  // USEREF
  const buttonSaveRef       = React.useRef();
  const banRef              = React.useRef({indice:0      , id_cabecera:'' , b_bloqueo:false, manejaF7:false, mitad_data:(data_len / 2)
                                           ,idFocus:true  , indexRow:0})
  const refCab              = React.useRef({ data      :[], dataCan  :[]   , delete:[]   , activateCambio:false
                                           , dataCanDet:[], deleteDet:[]});
  const refDet              = React.useRef()
  // USESTATE
  const [previewImage, setPreviewImage] = React.useState('');
  const [uploadImg   , setUploadImg   ] = React.useState([]);
  const [fileList    , setFileList    ] = React.useState([]);

  Main.useHotkeys(Main.guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});
  
  React.useEffect(()=>{
    if(defaultOpenKeys.length <= 0) history.push("/home");
    else{
      Main.activarSpinner()
      inicialForm()
    } 
    // eslint-disable-next-line
  },[])
  let idGrid = {
    grid:{
      [idComp] : refDet
    },
    columna:{
      [idComp] : mainColumn.columnDet
    }
  }
  const inicialForm =(f7_delete = false, idFocus = 'titulo')=>{
    let valor   = mainIncial.ObjetoInical
    form.resetFields();
    setUploadImg([])
    let newKey              = Main.uuidID();
    valor.key_cab           = newKey;
    valor.usuario           = sessionStorage.usuario;
    valor.fecha_alta        = Main.moment().format('DD/MM/YYYY').toString();    
    if(!f7_delete){
      ver_bloqueo()      
      loadForm(valor);
      refCab.current.dataCan  = JSON.parse(JSON.stringify([valor]));
    }else{
      Main.desactivarSpinner();
      refDet.current?.hotInstance.loadData([])
    } 
    refCab.current.data     = JSON.parse(JSON.stringify([valor]));    
    setTimeout( ()=> {			
      Main.desactivarSpinner()
      document.getElementById(idFocus).focus();
		},20);
    document.getElementById("indice").textContent         = "1"
		document.getElementById("total_registro").textContent = "?";
		document.getElementById("mensaje").textContent 				= "";
  }
  const getParamsDetalle = async (idCabecera = false, indexRow = 0)=>{
    var newKey        = Main.uuidID();
    var valor         = JSON.parse(JSON.stringify(mainIncial.ObjetoInicalDet))
    valor.key_cab	    = newKey;
    valor.cod_empresa	= sessionStorage.getItem('cod_empresa');    
    valor.idCabecera  = idCabecera ? idCabecera : Main.nvl(refCab.current.data[indexRow]?.key_cab,refCab.current.data[indexRow]?.cod_servicio);
    return valor;
  }
  const getDetalle = async (data)=>{
    var content = [];
    try {
      var info = await Main.Request(mainUrl.url_listar_det,'POST',data);
      if(info?.data?.length === 0 || info?.data === undefined){
        let dataParams = await getParamsDetalle(data.key,banRef.current.indice)
        content = [dataParams]
      } else content = info?.data
    
      refCab.current.dataCanDet = JSON.parse(JSON.stringify(content));
      refDet.current?.hotInstance.loadData(content);
      
    } catch (error) {
      Main.desactivarSpinner()
      console.error(error);
    }
  }
  const guardar = async()=>{
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

    let url_cab         = mainUrl.url_get_CodCab+sessionStorage.getItem('cod_empresa');
    let row_cab         = await Main.GenerarUpdateInsert([rowCab],url_cab,'cod_servicio',[],['titulo']);
    let updateInsertCab = row_cab.updateInsert;
    let delete_cab      = refCab.current.delete[0] && refCab.current.delete?.length > 0 && refCab.current.delete !== undefined ? refCab.current.delete : []
    let keyCabecera 		= row_cab.rowsAux.length > 0 ? row_cab.rowsAux[0]?.cod_servicio : form.getFieldValue('cod_servicio');

    let url_det         = mainUrl.url_get_CodDet+keyCabecera;
    let row_det         = await Main.GenerarUpdateInsert(update_insert_detalle,url_det,'nro_orden',[],['nro_orden'],false,['cod_servicio'],row_cab.rowsAux);
    let updateInsertDet = row_det.updateInsert;
    let delete_det      = refCab.current.deleteDet[0] && refCab.current.deleteDet?.length > 0 && refCab.current.deleteDet !== undefined ? refCab.current.deleteDet : []


    let AditionalData = {"usuario"    : sessionStorage.getItem('usuario')
                        ,"cod_empresa": sessionStorage.getItem('cod_empresa')};    
    if(row_cab.insertar || row_cab.actualizar){
      let p_mensaje = false;
      if((row_cab.insertar || row_cab.actualizar) && (Object.keys(uploadImg).length > 0)){
        let cod_empresa =  sessionStorage.getItem('cod_empresa');
        row_cab.updateInsert[0].name_img = `/private/${cod_empresa}/${FormName}/${vname_img}${row_cab.updateInsert[0].cod_servicio}.${uploadImg.name.split('.')[1]}`
        row_cab.rowsAux[0]['name_img']   = `/private/${cod_empresa}/${FormName}/${vname_img}${row_cab.updateInsert[0].cod_servicio}.${uploadImg.name.split('.')[1]}`

      }else if(row_cab.actualizar && (Object.keys(fileList).length <= 0)){
        p_mensaje = true;
      }else if(!row_cab.actualizar){
        p_mensaje = true;
      }

      if(p_mensaje){
        Main.message.warning({
          content  : 'Es necesario que cargue una Imagen!!',
          className: 'custom-class',
          duration : `${2}`,
          style    : {
              marginTop: '2vh',
          },
        });
        return 
      }
    }

    let data = {
      updateInsertCab,
      aux_updateInsertCab : [refCab.current.dataCan[banRef.current.indice]],
      delete_cab,
      // --
      updateInsertDet,
      aux_updateInsertDet : refCab.current.dataCanDet,
      delete_det,
      // --
      AditionalData,
    }

    Main.activarSpinner()
    if(updateInsertCab.length > 0 || delete_cab.length > 0 ||
       updateInsertDet.length > 0 || delete_det.length > 0
    ){
      Main.Request(mainUrl.url_abm,"POST",data).then(async(resp) => {
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
                id:row_cab.updateInsert[0].cod_servicio
              });        
            }            
            refCab.current.data     = JSON.parse(JSON.stringify(row_cab.rowsAux)); 
            refCab.current.dataCan  = JSON.parse(JSON.stringify(row_cab.rowsAux));

            saveImg(row_cab.updateInsert[0].cod_servicio,false)            
          } 
          if(refCab.current.delete.length > 0){
            getData();
          }else{
            let param           = getParmas(true)
            param.cod_servicio  = row_cab.rowsAux[0].cod_servicio
            getData(param);          
          }
          Main.setModifico(FormName);
          refCab.current.delete   = [];          
          refCab.current.deleteDet= [];
        }else if(uploadImg.name && uploadImg.name.length > 0 && row_cab.actualizar){
          
          saveImg(row_cab.updateInsert[0].cod_servicio).then(()=>{
            let param = getParmas(true)
            param.cod_servicio  = row_cab.rowsAux[0].cod_servicio
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
      })
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
      Main.setModifico(FormName);
    }

  }
  const saveImg = async (cod_servico,activarMensaje = true)=> new Promise(async(resolve,reject)=>{
    if(fileList && fileList.length > 0 && fileList[0].uid !== '-1' && (uploadImg.name && uploadImg.name.length > 0)){
      try {
        let vcod_empresa    = sessionStorage.getItem('cod_empresa');
        let extemcionImg    = uploadImg.name.split('.')[1]; 
        let urlImg          = mainUrl.url_post_img+`${vcod_empresa}/${vname_img}${cod_servico}.${extemcionImg}`;
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
  const addRow = async (index = false)=>{
    if(banRef.current.idFocus){
      refCab.current.delete   = [];
      banRef.current.manejaF7 = false;
      inicialForm()
    }else{
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
      let newRow    = await getParamsDetalle(false,banRef.current.indice);
      let rowIndex  = index !== false ? index.index + 1 : banRef.current.indexRow === 0 ? banRef.current.indexRow + 1  : banRef.current.indexRow === -1 ? 0 : banRef.current.indexRow;
      newRow.insertDefault  = true
      Main.modifico(FormName);
      refDet.current.hotInstance.alter('insert_row', rowIndex);
      refDet.current.hotInstance.view.settings.data[rowIndex] =  JSON.parse(JSON.stringify({...newRow}));
      refDet.current.hotInstance.updateSettings({
        cellRow:rowIndex,
      });
      setTimeout(()=>{        
        refDet.current.hotInstance.selectCell(rowIndex, 0)
        banRef.current.indexRow = rowIndex;
      },40)
    }
  } 
  const deleteRow = ()=>{
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
      let rowIndexFocus = rowIndex - 1 === -1 ? 0 : rowIndex - 1;

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
        refDet.current.hotInstance.alter('insert_row',rowIndex);
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
    let indice = banRef.current.indice;    
    refCab.current.delete   = [];
    refCab.current.deleteDet= [];
    banRef.current.manejaF7 = false;
    refCab.current.activateCambio = false;
    Main.setBuscar(FormName,false);
    Main.setModifico(FormName)
    if(refCab.current.data[indice].insertDefault || refCab.current.data[indice].inserted){
      inicialForm()
    }else{
      form.resetFields();
      refCab.current.data    = JSON.parse(JSON.stringify(refCab.current.dataCan));
      refCab.current.dataCan = JSON.parse(JSON.stringify(refCab.current.data))   ;
      loadForm(refCab.current.data,indice) 
      setTimeout(()=>{
        Main.desactivarSpinner()
        document.getElementById('titulo').focus();  
      },200)
    }
  }
  const funcionBuscar = (e)=>{
    if(e){     
    		Main.setModifico(FormName);
    		getData(false,true);    	
    }else{
      if(!refCab.current.activateCambio){
        manejaF7()
      }else{
        e =  true
        Main.desactivarSpinner();
        Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,()=>Main.Modal.destroyAll())
      }
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
  const onChange = ({ fileList: newFileList }) => {
   setFileList(newFileList);
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
  const manejaF7 = (e)=>{
    try {
      form.resetFields()
      banRef.current.manejaF7 = true;
      setFileList([])
      refDet.current?.hotInstance.loadData([])
      ver_bloqueo(false)
      setTimeout(()=>{      
        banRef.current.id_cabecera = -1;
        banRef.current.indice = 0;
        document.getElementById('cod_servicio').focus();
        document.getElementById("indice").textContent         = "1"
		    document.getElementById("total_registro").textContent = "?";
      })  
    } catch (error) {
      Main.desactivarSpinner()
      console.log(error)
    }
    
  }
  const ver_bloqueo = (p_bloqueo = true)=>{    
    setTimeout(()=>{
      let input      = document.getElementsByClassName(`${FormName}_BLOQUEO`)[0];
      input.readOnly = p_bloqueo;
    },100)    
  }
  const getParmas = (retornaNull = false) =>{
    var data = {
      cod_servicio : retornaNull ? null : form.getFieldValue('cod_servicio') !== undefined ? form.getFieldValue('cod_servicio'): null,
      titulo       : retornaNull ? null : form.getFieldValue('titulo')       !== undefined ? form.getFieldValue('titulo')      : null,
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
        banRef.current.manejaF7 = false
        Main.desactivarSpinner()
        if(resp.data.length > 0){
          if(resp.length === 1) document.getElementById("total_registro").textContent = "1";
          else document.getElementById("total_registro").textContent = resp.data.length
          refCab.current.data    = resp.data;		
          refCab.current.dataCan = JSON.parse(JSON.stringify(resp.data));          
          banRef.current.indice  = 0;
          loadForm(refCab.current.data,0); 
          if(buttonF8) document.getElementById('cod_servicio').focus();
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
  const handleKeyDown = (e)=>{
    if(e.target.id === 'cod_servicio' && !banRef.current.manejaF7) e.preventDefault();
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault()
      switch (e.target.id) {
        case "titulo":
          document.getElementById('descripcion').focus();
          break;
        case "descripcion":
          document.getElementById('titulo').focus();
        break;
        case "cod_servicio":
          document.getElementById('titulo').focus();
        break;
        default:
          break;
      }
    }else if(['F7','F8'].includes(e.key)){
      e.preventDefault()
      if('F7' === e.key) manejaF7(e);
      else {
        let data = form.getFieldsValue()
        data.cod_empresa = sessionStorage.cod_empresa;
        getData(data);
      }
    }
  }
  const handleInputChange = (e) => {
    try {
      refCab.current.data[banRef.current.indice][e?.target?.id ? e?.target?.id : e.target.name ] = e?.target?.value.trim();  
    } catch (error) {
      console.log(error)
    }
    typeEvent()
  }
  const loadForm = async (data = [] , indice = false)=>{
    let index  = await indice ? indice : banRef.current.indice;
    let value  = await data[index] === undefined ? data : data[index];

    form.setFieldsValue({
      ...value,
      activo : value?.activo === 'S' ? true : false,
    });

    if(Main.nvl(value.name_img,'-1') !== '-1'){
      setFileList([{
        url:process.env.REACT_APP_BASEURL+value.name_img
      }])
    }else{
      setFileList([])
    }
    getDetalle(value); 
    Main.desactivarSpinner();
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
      if( banRef.current.id_cabecera !== row.cod_servicio ) banRef.current.id_cabecera = row.cod_servicio;
      loadForm(refCab.current.data,index);
    }else{
      Main.desactivarSpinner()
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,()=>Main.Modal.destroyAll())
    }
  } 
  const rightData = async() => {
    if(!refCab.current.activateCambio){
      if(refCab.current.data.length !== 1){
        let indice = banRef.current.indice + 1
        if(refCab.current.data[indice] !== undefined){
          if(banRef.current.id_cabecera !== refCab.current.data[indice]?.cod_servicio && !Main._.isUndefined(refCab.current.data[indice].cod_servicio)){
            banRef.current.id_cabecera = refCab.current.data[indice]?.cod_servicio;
            banRef.current.indice = indice
            loadForm(refCab.current.data[indice],indice)
            document.getElementById("mensaje").textContent = "";
            document.getElementById("indice").textContent  = indice + 1;
            if(banRef.current.indice >= banRef.current.mitad_data){
              let data = { indice     : refCab.current.data.length, 
                           limite     : data_len,
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
      Main.desactivarSpinner()
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,()=>Main.Modal.destroyAll())
		}

  }
  const handleCheckbox = (e,options)=>{
    
    if(form.getFieldValue('id') !== '' && !banRef.current.manejaF7){
      Main.modifico(FormName);
      if(form.getFieldValue(e.target.id)){
        Main.alert('Favor confirma la operación','Atencion!','confirm','Confirmar','Cancelar',()=>procesarCambio())    
      }
    }else{
      form.setFieldsValue({
        ...form.getFieldValue(),
        activo : false,
      });
    }
    
  }
  const procesarCambio = ()=>{
    try {
      let data        = form.getFieldValue()
      data.activo     = 'S';
      data.updated    = true;
      data.usuario    = sessionStorage.getItem('usuario');
      data.aux_update = [refCab.current.dataCan[banRef.current.indice]];
      data.detalle    = refDet.current.hotInstance.getSourceData()
      Main.activarSpinner()
      Main.Request(mainUrl.url_activar,'POST',data).then((resp)=>{
        Main.desactivarSpinner();
        if(resp.data.res >= 1){
          Main.setModifico(FormName)     
          Main.message.success({
            content  : `Procesando Correctamente!!`,
            className: 'custom-class',
            duration : `${2}`,
            style    : {
                marginTop: '2vh',
            },
          });
          let param = getParmas(true)
          param.cod_servicio  = form.getFieldValue('cod_servicio');
          getData(param);
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
      })
    } catch (error) {
      console.log(error)
    }
  }
  const handleKeyUp = async(e) => {
		if(e.keyCode === 40){e.preventDefault(); Main.activarSpinner(); rightData();}
		if(e.keyCode === 38){e.preventDefault(); Main.activarSpinner(); leftData(); }
	}
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
          funcionBuscar={funcionBuscar}
          NavigateArrow={NavigateArrow}
        />
        
        <VSERVICIO
            form={form} 
            FormName={FormName}
            onChange={onChange}
            fileList={fileList}
            onPreview={onPreview}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
            handleupload={handleupload}
            // ====
            idComp={idComp}
            refDet={refDet}
            setLastFocusNext={setLastFocusNext}
            setClickCell={setClickCell}
            // ====
            handleKeyDown={handleKeyDown}
            handleCheckbox={handleCheckbox}
            handleInputChange={handleInputChange}
            handleKeyUp={handleKeyUp}
        />

      </Main.Spin>
    </Main.Layout>
  );
});

export default SERVICIO;