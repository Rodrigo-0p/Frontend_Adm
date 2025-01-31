import * as React      from 'react';
import VACERCADE       from './view'
import Main            from '../../../../../util/Main';
import mainIncial      from './objetoInicial/mainInical'
import mainUrl         from './url/mainUrl';
import './styles/styles.css';

const FormName   = 'ACERCADE';
const TituloList = "Acerca De";
var vname_img    = 'acercade-img';
var data_len     = 50;

const ACECADE =  React.memo(() => {

  const history   = Main.useHistory();
  const [form]    = Main.Form.useForm();

  let defaultSelectedKeys = ['ACERCADE']
  let defaultOpenKeys     = Main.getMenuKeysForCodForm('ACERCADE');
 
  Main.useHotkeys(Main.guardar, (e) =>{
		e.preventDefault();
		buttonSaveRef.current.click();
	},{enableOnFormTags: ['input', 'select', 'textarea']});
	Main.useHotkeys('f7', (e) => {
    e.preventDefault();
	});

  // USEREF
  const buttonSaveRef       = React.useRef();
  // USESTATE
  const [previewImage, setPreviewImage] = React.useState('');
  const [uploadImg   , setUploadImg   ] = React.useState([]);
  const [fileList    , setFileList    ] = React.useState([]);
  const banRef              = React.useRef({indice:0      , id_cabecera:'' , b_bloqueo:false, manejaF7:false, mitad_data:(data_len / 2)})
  const refCab              = React.useRef({ data      :[], dataCan  :[]   , delete:[]   , activateCambio:false});  
 
  React.useEffect(()=>{
    if(defaultOpenKeys.length <= 0) history.push("/home");
    else{
      Main.activarSpinner()
      inicialForm()
    } 
    // eslint-disable-next-line
  },[])

  const inicialForm =(f7_delete = false, idFocus = 'titulo')=>{
    let valor   = mainIncial.ObjetoInical
    form.resetFields();
    setUploadImg([])
    let newKey              = Main.uuidID();
    valor.key               = newKey;
    valor.usuario           = sessionStorage.usuario;
    valor.fecha_alta        = Main.moment().format('DD/MM/YYYY').toString();    
    if(!f7_delete){
      ver_bloqueo()
      loadForm(valor);  
    }else Main.desactivarSpinner();
    refCab.current.data     = JSON.parse(JSON.stringify([valor]));
    refCab.current.dataCan  = JSON.parse(JSON.stringify([valor]));
    setTimeout( ()=> {				
      Main.desactivarSpinner()
      document.getElementById(idFocus).focus();
		},20);
    document.getElementById("indice").textContent         = "1"
		document.getElementById("total_registro").textContent = "?";
		document.getElementById("mensaje").textContent 				= "";
  }
  const addRow = ()=>{
    refCab.current.delete   = [];
    banRef.current.manejaF7 = false;
    inicialForm()
  }
  const getParmas = (retornaNull = false) =>{
    var data = {
      cod_acercade : retornaNull ? null : form.getFieldValue('cod_acercade') !== undefined ? form.getFieldValue('cod_acercade')  : null,
      titulo       : retornaNull ? null : form.getFieldValue('titulo')       !== undefined ? form.getFieldValue('titulo')        : null,
      subtitulo    : retornaNull ? null : form.getFieldValue('subtitulo')    !== undefined ? form.getFieldValue('subtitulo')     : null,
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
          if(buttonF8) document.getElementById('cod_acercade').focus();
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
  const guardar = async()=>{

    let rowCab = []
    if(refCab.current.delete.length === 0){
      let verificar_input_requerido = Main.validarCamposRequeridos();
      if(!verificar_input_requerido) return
      rowCab = JSON.parse(JSON.stringify(refCab.current.data[banRef.current.indice]));
    }
    
    let url          = mainUrl.url_get_serial+sessionStorage.cod_empresa;
    let row          = await Main.GenerarUpdateInsert([rowCab],url,'cod_acercade',[],['titulo']);
    let updateInsert = row.updateInsert;
    let delete_cab   = refCab.current.delete[0] && refCab.current.delete?.length > 0 && refCab.current.delete !== undefined ? refCab.current.delete : []
    let AditionalData = {"usuario"    : sessionStorage.getItem('usuario')
                        ,"cod_empresa": sessionStorage.getItem('cod_empresa')};
    
    if(row.insertar || row.actualizar){
      let p_mensaje = false;
      if((row.insertar || row.actualizar) && (Object.keys(uploadImg).length > 0)){
        let cod_empresa =  sessionStorage.getItem('cod_empresa');
        row.updateInsert[0].name_img = `/private/${cod_empresa}/${FormName}/${vname_img}${row.updateInsert[0].cod_acercade}.${uploadImg.name.split('.')[1]}`
        row.rowsAux[0]['name_img']   = `/private/${cod_empresa}/${FormName}/${vname_img}${row.updateInsert[0].cod_acercade}.${uploadImg.name.split('.')[1]}`
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
            content  : `Procesando Correctamente!!`,
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
                cod_acercade:row.updateInsert[0].cod_acercade
              });        
            }            
            refCab.current.data     = JSON.parse(JSON.stringify(row.rowsAux)); 
            refCab.current.dataCan  = JSON.parse(JSON.stringify(row.rowsAux));

            saveImg(row.updateInsert[0].cod_acercade,false)
          }else{
            getData(false)
          } 
          Main.setModifico(FormName);
        }else if(uploadImg.name && uploadImg.name.length > 0 && row.actualizar){
          saveImg(row.updateInsert[0].cod_acercade);
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
  const saveImg = async (cod_acercade,activarMensaje = true)=>{
    if(fileList && fileList.length > 0 && fileList[0].uid !== '-1' && (uploadImg.name && uploadImg.name.length > 0)){
      try {
        let vcod_empresa    = sessionStorage.getItem('cod_empresa');
        let extemcionImg    = uploadImg.name.split('.')[1]; 
        let urlImg          = mainUrl.url_post_img+`${vcod_empresa}/${vname_img}${cod_acercade}.${extemcionImg}`;
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
              setTimeout(()=>setUploadImg([]));
            }
        });  
      } catch (error) {
        console.log(error);
      }      
    }
  }
  const deleteRow = ()=>{
    let indice = banRef.current.indice;
    refCab.current.delete = [refCab.current.data[indice]]
    refCab.current.activateCambio = true;
    form.resetFields();
    Main.modifico(FormName)
    setFileList([])
    inicialForm(true)
  }
  const cancelar = ()=>{
    Main.activarSpinner()
    let indice = banRef.current.indice;    
    refCab.current.delete   = [];
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
        e = true
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
    form.resetFields()
    banRef.current.manejaF7 = true;
    setFileList([])
    ver_bloqueo(false)
    setTimeout(()=>{      
      banRef.current.id_cabecera = -1;
      banRef.current.indice = 0;
      document.getElementById('cod_acercade').focus()
      document.getElementById("indice").textContent         = "1"
		  document.getElementById("total_registro").textContent = "?";
    })
  }
  const ver_bloqueo = (p_bloqueo = true)=>{    
    setTimeout(()=>{
      let input      = document.getElementsByClassName(`${FormName}_BLOQUEO`)[0];
      input.readOnly = p_bloqueo;
    },100)    
  }
  const handleKeyDown = (e)=>{
    if(e.target.id === 'id' && !banRef.current.manejaF7) e.preventDefault();
    if (['Enter', 'Tab'].includes(e.key)) {
      e.preventDefault()
      switch (e.target.id) {
        case "titulo":
          document.getElementById('subtitulo').focus();
          break;
        case "subtitulo":
          document.getElementById('descripcion').focus();
        break;
        case "descripcion":
          document.getElementById('titulo').focus();
        break;
        case "id":
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
  const handleCheckbox = (e,options)=>{
    if(form.getFieldValue('cod_acercade') !== '' && !banRef.current.manejaF7){
      Main.modifico(FormName)
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
      let data = form.getFieldValue()
      data.activo     = 'S';
      data.updated    = true;
      data.usuario    = sessionStorage.getItem('usuario');
      data.name_img   = refCab.current.dataCan[banRef.current.indice].name_img
      data.aux_update = [refCab.current.dataCan[banRef.current.indice]];
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
          param.cod_acercade  = form.getFieldValue('cod_acercade');
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
  const loadForm = async (data = [] , indice = false)=>{
    let index  = await indice ? indice : banRef.current.indice;
    let value  = await data[index] === undefined ? data : data[index];

    form.setFieldsValue({
      ...value,
      activo : value?.activo === 'S' ? true : false,
    });

    if(Main.nvl(value.name_img,'-1') !== '-1'){
      const imgUrl = `${process.env.REACT_APP_BASEURL}${value.name_img}?t=${new Date().getTime()}`;
      // process.env.REACT_APP_BASEURL+value.name_img
      setFileList([{
        url:imgUrl
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
      if( banRef.current.id_cabecera !== row.cod_acercade ) banRef.current.id_cabecera = row.cod_acercade;
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
          if(banRef.current.id_cabecera !== refCab.current.data[indice]?.cod_acercade && !Main._.isUndefined(refCab.current.data[indice].cod_acercade)){
            banRef.current.id_cabecera = refCab.current.data[indice]?.cod_acercade;
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
      Main.desactivarSpinner();
      Main.alert('Hay cambios pendientes. ¿Desea guardar los cambios?','Atencion!','confirm','Guardar','Cancelar',guardar,()=>Main.Modal.destroyAll())
		}

  }
  const handleKeyUp = async(e) => {
		if(e.keyCode === 40){e.preventDefault(); Main.activarSpinner(); rightData();}
		if(e.keyCode === 38){e.preventDefault(); Main.activarSpinner(); leftData(); }
	}
  
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

      <VACERCADE 
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
  );
});

export default ACECADE;