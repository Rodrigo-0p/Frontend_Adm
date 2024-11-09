import React,{ memo} from "react";
import View from "./view";
// import Main         from '../../../../util/Main';
import Main        from "../../../../../util/Main";
import mainInicial from './objetoInicial/mainInicial'
import mainUrl     from './url/mainUrl';

// import styles

const FormName   = 'EMPRESA';
const TituloList = "Empresa";
var   vname_img  = 'empresa-img';
var   data_len   = '50';

const EMPRESAS  = memo(() => {
    const history = Main.useHistory();
    const [form]  = Main.Form.useForm();

    let defaultSelectedKeys = ['EMPRESA'];
    let defaultOpenKeys     = Main.getMenuKeysForCodForm('EMPRESA');
    
    Main.useHotkeys(Main.guardar, (e) =>{
      e.preventDefault();
      buttonSaveRef.current.click();
    },{enableOnFormTags: ['input', 'select', 'textarea']});
    Main.useHotkeys('f7', (e) => {
      e.preventDefault();
    });
      //USEREF
      const buttonSaveRef = React.useRef();

      // USESTATE
    const [previewImage, setPreviewImage] = React.useState('');
    const [uploadImg   , setUploadImg   ] = React.useState([]);
    const [fileList    , setFileList    ] = React.useState([
                                                            // {  uid: '-1',
                                                            //   name: '',
                                                            // status: 'done',
                                                            //   //  url: Main.Igmpredefault
                                                            //   // process.env.REACT_APP_IMAGE_URL+'acercade-img.jpg',
                                                            //   }
                                                            ]);
  const banRef = React.useRef({indice:0 , id_cabecera:'', b_bloqueo:false, manejaF7:false, mitad_data:(data_len /2) });
  const refCab = React.useRef({data:[], dataCan:[], delete:[], activateCambio:false});
  React.useEffect(()=>{
    if(defaultOpenKeys.length <= 0) history.push("/home");
    else{
      Main.activarSpinner()
      inicialForm()
      getData()
    } 
    // eslint-disable-next-line
  },[]) 
  const inicialForm = (f7_delete= false, idFocus = 'nombre')=>{
    let valor       = mainInicial.objetoInicial;
    form.resetFields();
    setUploadImg([]);
    let newKey        = Main.uuidID();
    valor.key         = newKey;
    valor.usuario     = sessionStorage.usuario;
    valor.fecha_alta  = Main.moment().format('DD/MM/YYYY').toString();
    if(!f7_delete){
      ver_bloqueo();
      loadForm(valor);
    }else Main.desactivarSpinner();
    refCab.current.data   = JSON.parse(JSON.stringify([valor]));
    refCab.current.dataCan = JSON.parse(JSON.stringify([valor]));
    setTimeout(()=>{
      Main.desactivarSpinner();
      document.getElementById(idFocus).focus();
    },20);
    document.getElementById("indice").textContent         ="1"
    document.getElementById("total_registro").textContent = "?";
    document.getElementById("mensaje").textContent        = "";
  }
  const addRow = () =>{
    return
    refCab.current.delete     = [];
    banRef.current.manejaF7  = false;
    inicialForm()
  }
  const getParmas = (retornaNull = false) =>{
    var data = {
      cod_empresa     : retornaNull ? null : Main.nvl(form.getFieldValue('cod_empresa'),null)         ,
      cod_funcionario : retornaNull ? null : Main.nvl(sessionStorage.getItem('cod_funcionario'), null),
      cod_usuario     : retornaNull ? null : Main.nvl(sessionStorage.getItem('cod_usuario'),null)     ,
      nombre          : retornaNull ? null : Main.nvl(form.getFieldValue('nombre'),null)              ,
      tipo_empresa    : retornaNull ? null : Main.nvl(form.getFieldValue('tipo_empresa'),null)        ,
      ruc             : retornaNull ? null : Main.nvl(form.getFieldValue('ruc'),null)                 ,
      direccion       : retornaNull ? null : Main.nvl(form.getFieldValue('direccion'),null)           ,
      latitud         : retornaNull ? null : Main.nvl(form.getFieldValue('latitud'), null)            ,
      longitud        : retornaNull ? null : Main.nvl(form.getFieldValue('longitud'), null)           ,
      telefono        : retornaNull ? null : Main.nvl(form.getFieldValue('telefono'),null)            ,
      correo          : retornaNull ? null : Main.nvl(form.getFieldValue('correo'),null)              ,
      timbrado        : retornaNull ? null : Main.nvl(form.getFieldValue('timbrado'),null)            ,
      descripcion     : retornaNull ? null : Main.nvl(form.getFieldValue('descripcion'),null)         ,
    }
    return data;
  }
  const getData = async (param = false, buttonF8= false) => {
    try {
      let data = param === false ? getParmas(false) : param;
      data.indice   = 0;
      data.limite   = data_len;
      Main.Request(mainUrl.url_listar_cab, 'POST', data).then((resp)=>{
        banRef.current.manejaF7 = false
        Main.desactivarSpinner()
        if(resp.data.length > 0){
          if(resp.length === 1) document.getElementById("total_registro").textContent = "1";
          else document.getElementById("total_registro").textContent = resp.data.length
          refCab.current.data     = resp.data;
          refCab.current.dataCan  = JSON.parse(JSON.stringify(resp.data));
          banRef.current.indice =0;
          loadForm(refCab.current.data, 0);
          if(buttonF8) document.getElementById('cod_empresa').focus();
        }else{
          Main.message.info({
            content   : `No encontramos datos!!!`,
            className : 'custom-class',
            duration  :`${2}`,
            style     : {
              marginTop: '2hv',
            },
          });
        }
      })
    } catch (error) {
      banRef.current.manejaF7 = false;
      Main.desactivarSpinner()
      console.log(error);
    }
  }
  const guardar = async()=>{

    let rowCab = []
    if(refCab.current.delete.length === 0){
      let verificar_input_requerido = Main.validarCamposRequeridos();
      if(!verificar_input_requerido) return
      rowCab = JSON.parse(JSON.stringify(refCab.current.data[banRef.current.indice]));
    }
    
    let url           = mainUrl.url_get_serial+sessionStorage.getItem('cod_empresa');
    let row           = await Main.GenerarUpdateInsert([rowCab],url,'cod_empresa',[],['nombre']);
    let updateInsert  = row.updateInsert;
    let delete_cab    = refCab.current.delete[0] && refCab.current.delete?.length > 0 && refCab.current.delete !== undefined ? refCab.current.delete : []
    let AditionalData = [{ "cod_usuario"    : sessionStorage.getItem('cod_usuario')
                          , "usuario"       : sessionStorage.getItem('usuario')
                          ,"cod_funcionario": sessionStorage.getItem('cod_funcionario')
                          ,"cod_empresa"    : row.insertar ? row.updateInsert[0].cod_empresa : refCab.current.data[banRef.current.indice].cod_empresa
                        }];
    
    if(row.insertar || row.actualizar){
      let p_mensaje = false;
      if((row.insertar || row.actualizar) && (Object.keys(uploadImg).length > 0)){
        let v_empresa = row.updateInsert[0].cod_empresa;
        row.updateInsert[0].name_img=`/private/${v_empresa}/${FormName}/${vname_img}${v_empresa}.${uploadImg.name.split('.')[1]}`
        row.rowsAux[0]['name_img']  =`/private/${v_empresa}/${FormName}/${vname_img}${v_empresa}.${uploadImg.name.split('.')[1]}`
      }else if(row.actualizar && (Object.keys(fileList).length <= 0)){
        p_mensaje = true;
      }else if(!row.actualizar){
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
      updateInsert,
      aux_updateInsert : [refCab.current.dataCan[banRef.current.indice]],
      delete_cab,
      AditionalData,
    }

    Main.activarSpinner()
    if(updateInsert.length > 0 ||  delete_cab.length > 0 ){
      Main.Request(mainUrl.url_abm,"POST",data).then(async(resp) => {
        Main.desactivarSpinner()
        if(resp.data.res >= 1){
          refCab.current.delete = []
          Main.message.success({
            content  : 'Procesando Correctamente!!',
            className: 'custom-class',
            duration : `${2}`,
            style    : {
                marginTop: '2vh',
            },
          });
          refCab.current.activateCambio = false;
          if(row.actualizar || row.insertar){
            
            if(row.insertar){            
              form.setFieldsValue({
                ...form.getFieldsValue(),
                cod_empresa:row.updateInsert[0].cod_empresa
              });        
            }            
            refCab.current.data     = JSON.parse(JSON.stringify(row.rowsAux)); 
            refCab.current.dataCan  = JSON.parse(JSON.stringify(row.rowsAux));
            saveImg(row.updateInsert[0].cod_empresa,false)
          }else{
            getData(false)
          } 
          Main.setModifico(FormName);
        }else if(uploadImg.name && uploadImg.name.length > 0 && row.actualizar){
          saveImg(row.updateInsert[0].cod_empresa).then(()=>{
            let param = getParmas(true)
            param.cod_funcionario = sessionStorage.getItem('cod_funcionario');
            param.cod_empresa     = row.rowsAux[0].cod_empresa;
            getData(param)
          }).catch(()=>{
            Main.desactivarSpinner()
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
      // eslint-disable-next-line 
      Main.message.info({
        content  : 'No encontramos cambios para guardar',
        className: 'custom-class',
        duration : `${2}`,
        style    : {
            marginTop: '2vh',
        },
      });
      Main.desactivarSpinner();
      Main.setModifico(FormName);
    }
  }; 
  const saveImg= async (cod_empresa, acticatemensaje = true) => new Promise(async(resolve,reject)=>{
    if(fileList && fileList.length > 0 && fileList[0].uid !== '-1' && (uploadImg.name && uploadImg.name.length > 0)){
      try {
        let extemcionImg    = uploadImg.name.split('.')[1];
        let urlImg          = mainUrl.url_post_img+`/${cod_empresa}/${vname_img}${cod_empresa}.${extemcionImg}`;
        await Main.RequestImg(urlImg, 'POST', uploadImg).then(async(resp) => {
          if(resp.status === 200){
            Main.setModifico(FormName);
            refCab.current.activateCambio = false;
            if(acticatemensaje){
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
            })
          }
        });  
      } catch (error) {
        console.log(error);
        reject(error);
      }
    }
        
  })
  const deleteRow = ()=>{
    let indice = banRef.current.indice;
    refCab.current.delete = [refCab.current.data[indice]]
    refCab.current.activateCambio = true;
    form.resetFields();
    Main.modifico(FormName);
    setFileList([]);
  }
  const ver_bloqueo = (p_bloqueo = true) => {
    setTimeout(()=>{
      let input       = document.getElementsByClassName(`${FormName}_BLOQUEO`)[0];
      input.readOnly  = p_bloqueo
    }, 100)
  }
  const loadForm  = async(data =[], indice =false)=>{
    let index = await indice ? indice : banRef.current.indice;
    // eslint-disable-next-line 
    let value = await data[index] === undefined ? data : data [index];
    form.setFieldsValue({
      ...value,
      activo : value?.activo === 'S' ? true : false,
    });
    if(Main.nvl(value.name_img, '-1') !=='-1'){
      setFileList([{
        url:process.env.REACT_APP_BASEURL+value.name_img
      }])
    }else{
      setFileList([])
    }

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
      if( banRef.current.cod_empresa !== row.cod_empresa ) banRef.current.id_cabecera = row.cod_empresa;
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
          if(banRef.current.id_cabecera !== refCab.current.data[indice]?.cod_empresa && !Main._.isUndefined(refCab.current.data[indice].cod_empresa)){
            banRef.current.id_cabecera = refCab.current.data[indice]?.cod_empresa;
            banRef.current.indice = indice
            loadForm(refCab.current.data[indice],indice)
            document.getElementById("mensaje").textContent = "";
            document.getElementById("indice").textContent  = indice + 1;
            if(banRef.current.indice >= banRef.current.mitad_data){
              let data = { indice     : refCab.current.data.length, 
                            limite     : data_len,
                            cod_empresa: sessionStorage.cod_empresa
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
  const manejaF7 = (e)=>{
    form.resetFields()
    banRef.current.manejaF7 = true;
    setFileList([])
    ver_bloqueo(false)
    setTimeout(()=>{      
      document.getElementById('cod_empresa').focus()
    })
  }
  const cancelar = ()=>{
    Main.activarSpinner()
    let indice = banRef.current.indice;    
    refCab.current.delete   = [];
    banRef.current.manejaF7 = false;
    refCab.current.activateCambio = false;
    Main.setBuscar(FormName,false);
    Main.setModifico(FormName)
    if(refCab.current.data[indice].insertDefault || refCab.current.data[indice].inserted){// 
      inicialForm()      
    }else{
      form.resetFields();
      refCab.current.data    = JSON.parse(JSON.stringify(refCab.current.dataCan));
      refCab.current.dataCan = JSON.parse(JSON.stringify(refCab.current.data))   ;
      loadForm(refCab.current.data,indice) 
      setTimeout(()=>{
        Main.desactivarSpinner()
        document.getElementById('nombre').focus();  
      },200)
    }
  }
  const funcionBuscar = (e)=>{
    if(e){
      
        Main.setModifico(FormName);
        getData(false, true);
      
    }else{
      if(!refCab.current.activateCambio){
        manejaF7('COD_PERSONA')
      }else{
        Main.desactivarSpinner()
        e = true
        Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,()=>Main.Modal.destroyAll())
      }
      
    };
    Main.setBuscar(FormName, !e)
  }
  const NavigateArrow = (id) =>{
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
  const handleKeyDown = (e)=>{
    if(e.target.id === 'cod_empresa' && !banRef.current.manejaF7) e.preventDefault();      
    if(['Enter','Tab'].includes(e.key)){
      e.preventDefault();
      switch(e.target.id){
        case "nombre":
          document.getElementById('ruc').focus();
          break;
        // case "tipo_empresa":
        //   document.getElementById('ruc').focus();
        //   break;
        case 'ruc':
          document.getElementById('direccion').focus();
          break;
        case 'direccion':
          document.getElementById('latitud').focus();
          break;
        case "latitud":
          document.getElementById('longitud').focus();
          break;
        case "longitud":
          document.getElementById('telefono').focus();
          break;
        case 'telefono':
          document.getElementById('correo').focus();
          break;
        case 'correo':
          document.getElementById('timbrado').focus();
          break;
        case 'timbrado':
          document.getElementById('descripcion').focus();
          break;
          default:
          break;
      }
    }else if(['F7','F8'].includes(e.key)){
      e.preventDefault();
      if('F7' === e.key) manejaF7(e);
      else {
        getData(); 
      }
    }
  }
  const handleCheckbox = (e,options)=>{
  
    if(form.getFieldValue('cod_empresa') !== '' && !banRef.current.manejaF7){
      if(form.getFieldValue(e.target.id)){
        let rowValue = {target:{'cod_empresa':e.target.id,'value': form.getFieldValue(e.target.id) === true ? options[0] : options[1]}}        
        Main.alert('Favor confirma la operación','Atencion!','confirm','Confirmar','Cancelar',()=>procesarCambio(rowValue))
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
      let data = form.getFieldValue()
      data.activo     = 'S';
      data.updated    = true;
      data.name_img   = refCab.current.dataCan[banRef.current.indice].name_img
      data.aux_update = [refCab.current.dataCan[banRef.current.indice]];
      Main.activarSpinner()
      Main.Request(mainUrl.url_activar,'POST',data).then((resp)=>{
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
          let param = getParmas(true)
          param.cod_empresa     = form.getFieldValue('cod_empresa');
          param.cod_usuario     = sessionStorage.getItem('cod_usuario')
          param.cod_funcionario = sessionStorage.getItem('cod_funcionario')
          getData(param);
        }else{
          Main.message.info({
            content  : `No encontramos nada para Procesar!!`,
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
  const handleInputChange = (e)=>{
    try { 
      refCab.current.data[banRef.current.indice][e?.target?.id ? e?.target?.id : e.target.name]= e?.target?.value.trim();
    } catch (error) {
      console.log(error)
    }
    typeEvent();
  }
  const handleKeyUp = async(e)=>{
    if(e.keyCode === 40){e.preventDefault(); Main.activarSpinner(); rightData();}
    if(e.keyCode === 38){e.preventDefault(); Main.activarSpinner(); leftData(); }
  }
   // --- Img
  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      if (!file.url && !file.preview) {
        file.url = await Main.getBase64(file.originFileObj);
      }
    }
    setPreviewImage(file.url);
  };
   const handleupload = async (file, fileList) => {
    setUploadImg(file)
  }
  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    typeEvent()
  };


    return (
        <Main.Layout defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys ={defaultOpenKeys}>
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
                    //---
                />
                <View
                form={form}
                FormName={FormName}
                onChange={onChange}
                fileList={fileList}
                onPreview={onPreview}
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                handleupload={handleupload}
                handleKeyDown={handleKeyDown}
                handleCheckbox={handleCheckbox}
                handleInputChange={handleInputChange}
                handleKeyUp={handleKeyUp}                
           />
            </Main.Spin>                      
        </Main.Layout>
    )
});
export default EMPRESAS