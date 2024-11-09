import React, { memo } from 'react';
import VPRECIOS        from './view'
import Main            from '../../../../../util/Main';
import mainIncial      from './objetoInicial/mainInicial';
import mainUrl         from './url/mainUrl'
import './styles/styles.css';

const FormName      = 'PRECIOS';
const idComp        = FormName+'_DET'
const TituloList    = "Precios";
var vname_img       = 'precios-img';
var vname_img_fondo = 'precios-fondo-img';
var data_len     = 50;


const PRECIOS = memo(() => {
  
  const history   = Main.useHistory();
  const [form]    = Main.Form.useForm();
  
  let defaultSelectedKeys = [FormName]
  let defaultOpenKeys     = Main.getMenuKeysForCodForm(FormName);
  // USEREF
  const buttonSaveRef       = React.useRef();
  const banRef              = React.useRef({indice:0      , id_cabecera:'' , b_bloqueo:false, manejaF7:false, mitad_data:(data_len / 2)
                                           ,idFocus:true  , indexRow:0})
  const refCab              = React.useRef({ data      :[], dataCan  :[]   , delete:[]   , activateCambio:false
                                          , dataCanDet:[], deleteDet:[]});
  const refDet              = React.useRef()
  // USESTATE
  const [previewImage, setPreviewImage          ] = React.useState('');
  const [uploadImg   , setUploadImg             ] = React.useState([]);
  const [fileList    , setFileList              ] = React.useState([]);
  // USESTATE
  const [previewImageFondo, setPreviewImageFondo] = React.useState('');
  const [uploadImgFondo   , setUploadImgFondo   ] = React.useState([]);
  const [fileListFondo    , setFileListFondo    ] = React.useState([]);

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
      getData()
    } 
    // eslint-disable-next-line
  },[])

  const guardar = async ()=>{
    Main.finalFocusDet(refDet.current.hotInstance);
    if(refCab.current.delete.length === 0){
      let verificar_input_requerido = Main.validarCamposRequeridos();
      if(!verificar_input_requerido) return          
    }
    let rowCab                = JSON.parse(JSON.stringify(refCab.current.data[banRef.current.indice]));
    let update_insert_detalle = refDet.current.hotInstance.getSourceData() || [];   

    let url_cab         = undefined;
    let row_cab         = await Main.GenerarUpdateInsert([rowCab],url_cab,'cod_servicio',[],['titulo_precios']);
    let updateInsertCab = row_cab.updateInsert;

    let url_det         = undefined;
    let row_det         = await Main.GenerarUpdateInsert(update_insert_detalle,url_det,'nro_orden',[],['nro_orden'],false,[],row_cab.rowsAux);
    let updateInsertDet = row_det.updateInsert;

    if(row_cab.actualizar){
      let p_mensaje = false;
      if((Object.keys(uploadImg).length > 0) || (Object.keys(uploadImgFondo).length > 0)){
        let cod_empresa =  sessionStorage.getItem('cod_empresa');
        if((Object.keys(uploadImg).length > 0)) row_cab.updateInsert[0].name_img_precios             = `/private/${cod_empresa}/${FormName}/${vname_img}${row_cab.updateInsert[0].cod_servicio}.${uploadImg.name.split('.')[1]}`;
        if((Object.keys(uploadImgFondo).length > 0)) row_cab.updateInsert[0].name_img_fondo_precios  = `/private/${cod_empresa}/${FormName}/${vname_img_fondo}${row_cab.updateInsert[0].cod_servicio}.${uploadImgFondo.name.split('.')[1]}`;
      }else if(row_cab.actualizar && ((Object.keys(fileList).length <= 0) || (Object.keys(fileListFondo).length <= 0))){
        p_mensaje = true;
      }else if(!row_cab.actualizar){
        p_mensaje = true;
      }

      if(p_mensaje){
        Main.message.warning({
          content  : 'Es necesario que cargue las dos Imagen!!',
          className: 'custom-class',
          duration : `${2}`,
          style    : {
              marginTop: '2vh',
          },
        });
        return 
      }
    }

    let AditionalData = {"usuario": sessionStorage.getItem('usuario'),"cod_empresa": sessionStorage.getItem('cod_empresa')};
    
    let data = {
      updateInsertCab,
      aux_updateInsertCab : [refCab.current.dataCan[banRef.current.indice]],      
      // --
      updateInsertDet,
      aux_updateInsertDet : refCab.current.dataCanDet,
      // --
      AditionalData,
    }

    Main.activarSpinner()
    if(updateInsertCab.length > 0 || updateInsertDet.length > 0){
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
          refCab.current.activateCambio = false;
          if(row_cab.actualizar){
            saveImg(row_cab.updateInsert[0].cod_servicio,false)
            saveImg2(row_cab.updateInsert[0].cod_servicio,false);
          } 
          let param = getParmas(true)
          param.cod_servicio  = row_cab.rowsAux[0].cod_servicio
          setTimeout(()=>getData(param),10);
          Main.setModifico(FormName);
        }else if(row_cab.actualizar && ((uploadImg.name && uploadImg.name.length > 0) || (uploadImgFondo.name && uploadImgFondo.name.length > 0))){

          if(uploadImg.name && uploadImg.name.length > 0) saveImg(row_cab.updateInsert[0].cod_servicio);
          if(uploadImgFondo.name && uploadImgFondo.name.length > 0){
            saveImg2(row_cab.updateInsert[0].cod_servicio);
          }
          let param = getParmas(true)
          param.cod_servicio  = row_cab.rowsAux[0].cod_servicio
          setTimeout(()=>getData(param),10);
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
  const saveImg = async (cod_servicio,activarMensaje = true)=>{
    if(fileList && fileList.length > 0 && fileList[0].uid !== '-1' && (uploadImg.name && uploadImg.name.length > 0)){
      try {
        let vcod_empresa    = sessionStorage.getItem('cod_empresa');
        let extemcionImg    = uploadImg.name.split('.')[1]; 
        let urlImg          = mainUrl.url_post_img+`${vcod_empresa}/${vname_img}${cod_servicio}.${extemcionImg}`;
        await Main.RequestImg(urlImg, 'POST', uploadImg).then(async(resp) => {
          if(resp.status === 200){
            setTimeout(()=>setUploadImg([]));
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
          }
        });  
      } catch (error) {
        console.log(error);
      }      
    }
  }
  const saveImg2 = async (cod_servico,activarMensaje = true)=>{
    if(fileListFondo && fileListFondo.length > 0 && fileListFondo[0].uid !== '-1' && (uploadImgFondo.name && uploadImgFondo.name.length > 0)){
      try {
        let vcod_empresa    = sessionStorage.getItem('cod_empresa');
        let extemcionImg    = uploadImgFondo.name.split('.')[1]; 
        let urlImg          = mainUrl.url_post_img+`${vcod_empresa}/${vname_img_fondo}${cod_servico}.${extemcionImg}`;
        await Main.RequestImg(urlImg, 'POST', uploadImgFondo).then(async(resp) => {
          if(resp.status === 200){  
            setTimeout(()=>setUploadImgFondo([]));
            Main.setModifico(FormName);
            refCab.current.activateCambio = false;
            if(activarMensaje){
              Main.message.success({
                content  : `Procesando Correctamente !! ${resp.data.mensaje}`,
                className: 'custom-class',
                duration : `${2}`,
                style    : {
                    marginTop: '2vh',
                },
              });
            }
          }
        });  
      } catch (error) {
        console.log(error);
      }      
    }
  }
  const cancelar = ()=>{
    refCab.current.activateCambio = false;
    Main.setBuscar(FormName,false);
    Main.setModifico(FormName);
    getData()
  }
  const funcionBuscar = (e)=>{
    if(e){
      Main.setModifico(FormName);
      getData(false,true);
    }else{
      if(!refCab.current.activateCambio){
        manejaF7()
      }else{
        Main.desactivarSpinner()
        e = true;
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
        } 
        else Main.desactivarSpinner();
        break;
      case 'next-right':
        if(refCab.current.data.length > 1){
          let index =  refCab.current.data.length - 1
          banRef.current.indice = index;
          loadForm(refCab.current.data[index],index);
          document.getElementById("indice").textContent = refCab.current.data.length;
        }
        else Main.desactivarSpinner();
        break;
      default:
        break;
    }
  }
  const manejaF7 = (e)=>{
    form.resetFields()
    banRef.current.manejaF7 = true;
    setFileList([])
    setFileListFondo([])
    refDet.current?.hotInstance.loadData([])
    setTimeout(()=>{      
      banRef.current.id_cabecera = '-1'
      banRef.current.indice = 0
      document.getElementById("indice").textContent         = "1"
		  document.getElementById("total_registro").textContent = "?";
      document.getElementById('cod_servicio').focus();
    })
  }
  const getParmas = (retornaNull = false) =>{
    var data = {
      id        : retornaNull ? null : form.getFieldValue('cod_servicio')   !== undefined ? form.getFieldValue('cod_servicio')  : null,
      titulo    : retornaNull ? null : form.getFieldValue('titulo_precios') !== undefined ? form.getFieldValue('titulo_precios'): null,
    }
    return data
  }
  const getData = (param = false, buttonF8 = false)=>{
    try {
      let data = param === false ?  getParmas(false) : param;
      data.indice     = 0;
      data.limite     = data_len;  
      data.cod_empresa = sessionStorage.cod_empresa;      
      Main.activarSpinner()
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
  const getParamsDetalle = async (idCabecera = false, indexRow = 0)=>{
    var newKey        = Main.uuidID();
    var valor         = JSON.parse(JSON.stringify(mainIncial.ObjetoInicalDet))
    valor.key	        = newKey;
    valor.cod_empresa	= sessionStorage.getItem('cod_empresa');
    valor.idCabecera  = idCabecera ? idCabecera : Main.nvl(refCab.current.data[indexRow]?.key_cab,refCab.current.data[indexRow]?.id);
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
      console.error(error);
    }
  }
  const handleKeyDown = (e)=>{
    if(e.target.id === 'id' && !banRef.current.manejaF7) e.preventDefault();
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault()
      switch (e.target.id) {
        case "titulo_precios":
          document.getElementById('id').focus();
          break;
        case "id":
          document.getElementById('titulo_precios').focus();
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
  const loadForm = async (data = [] , indice = false)=>{
    let index  = await indice ? indice : banRef.current.indice;
    let value  = await data[index] === undefined ? data : data[index];

    form.setFieldsValue({
      ...value,
      activo : value?.activo === 'S' ? true : false,
    });

  
    let rimg      = Main.nvl(value.name_img_precios,null) !== null ? process.env.REACT_APP_BASEURL+value.name_img_precios             : null
    let rimgFondo = Main.nvl(value.name_img_fondo_precios,null) !== null ? process.env.REACT_APP_BASEURL+value.name_img_fondo_precios : null
    setFileList([{
      url: rimg
    }])
    setFileListFondo([{
      url: rimgFondo
    }])
    
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
      if( banRef.current.id_cabecera !== row.id ) banRef.current.id_cabecera = row.id;
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
          if(banRef.current.id_cabecera !== refCab.current.data[indice]?.id && !Main._.isUndefined(refCab.current.data[indice].id)){
            banRef.current.id_cabecera = refCab.current.data[indice]?.id;
            banRef.current.indice = indice
            loadForm(refCab.current.data[indice],indice)
            document.getElementById("mensaje").textContent = "";
            document.getElementById("indice").textContent  = indice + 1;
            if(banRef.current.indice >= banRef.current.mitad_data){
              let data = { indice     : refCab.current.data.length, 
                           limite     : data_len,
                           cod_empresa : sessionStorage.cod_empresa
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
  // ===========================================
  const onChange = ({ fileList: newFileList },idImge = true) => {
    if(idImge) setFileList(newFileList);
    else setFileListFondo(newFileList);
    typeEvent()
  };
  const handleupload = async (file,idImge = true) => {
    if(idImge)setUploadImg(file);
    else setUploadImgFondo(file);
  }
  const onPreview = async (file,idImge = true) => {
    let src = file.url;
    if (!src) {
      if (!file.url && !file.preview) {
        file.url = await Main.getBase64(file.originFileObj);
      }
    }
    if(idImge)setPreviewImage(file.url);
    else setPreviewImageFondo(file.url);
  };

  return (
    <Main.Layout defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys={defaultOpenKeys}>
      <Main.Spin spinning={false} delay={500}>
        <div className="paper-header">
          <Main.Title level={4} className="title-color">
            {TituloList}<div level={5} className="title-color-forname">{FormName}</div>
          </Main.Title>
        </div>
      
        <Main.HeaderMenu
          SaveForm={guardar}
          cancelar={cancelar}
          formName={FormName}
          vprinf={false}
          refs={{ref:buttonSaveRef}}
          funcionBuscar={funcionBuscar}
          NavigateArrow={NavigateArrow}
        />

        <VPRECIOS
          form={form} 
          FormName={FormName}
          // ====
          fileList={fileList}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}          
          // ====
          fileListFondo={fileListFondo}
          previewImageFondo={previewImageFondo}
          setPreviewImageFondo={setPreviewImageFondo}
          // ====
          idComp={idComp}
          refDet={refDet}
          // ====
          handleKeyUp={handleKeyUp}
          handleKeyDown={handleKeyDown}          
          handleInputChange={handleInputChange}
          // ====
          onChange={onChange}
          onPreview={onPreview}
          handleupload={handleupload}
        />

      </Main.Spin>
    </Main.Layout>     
  );
});

export default PRECIOS;