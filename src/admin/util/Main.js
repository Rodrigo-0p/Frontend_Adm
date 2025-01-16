import _                    from 'underscore';
import {Request,RequestImg} from '../../config/request'
import { Redirect }         from 'react-router-dom';
import iconAdve             from '../../assets/icons/advertencia.svg';
import info           			from '../../assets/icons/icon-advertencia.png';
import error           			from '../../assets/icons/error.svg';
import confirmar 						from '../../assets/icons/icon-Exclamacion.png';
import alerta          			from '../../assets/icons/advertencia.svg';
import iconInfo             from '../../assets/images/info.png';
import iconError            from '../../assets/icons/error.svg';
import Layout               from '../../admin/componente/Layout';
import { useHistory }       from 'react-router-dom';
import 	  FormModalSearch 	from './ModalForm/FormModalSearch.js';
import 	  ModalHadsontable  from './ModalForm/ModalHadsontable';
import HandsontableGrid     from './handsontable/Handsontable.js';
import { hotTableRequerido }from './handsontable/hotTableRequerido.js';

import HeaderMenu           from './HeaderMenu/HeaderMenu';
import {  useHotkeys }      from 'react-hotkeys-hook';
import ImgCrop              from 'antd-img-crop';
import { v4 as uuidID } 		from "uuid";
import moment               from 'moment'
import {  modifico
        , setModifico 	}   from './ButtonCancelar/cancelar'
import { setBuscar
        ,getViewBuscar	}   from './HeaderMenu/iconButtonBuscar';
import   validarCamposRequeridos,
      {  quitarClaseRequerido		
                         }	from './campoRequerido/mainCampRequerido.js'
import {GenerarUpdateInsert}from './generarUpdateInsert/mainUpdateInsert'


import {
	message		, Spin	    , Row	    , Col	   ,
	Form			, Card	    , Input   , Button ,
	Modal			, Divider   , Radio   , Select ,
	Checkbox	, List 		  , Tooltip	, Tabs 	 , 
	Typography, DatePicker,	ConfigProvider   ,
  Upload    , Image     , Avatar} 
                                 from 'antd';
import locale	 		               from 'antd/lib/locale/es_ES';
const { TabPane } = Tabs;
const { Title }   = Typography;

                                 
const mayuscula = (e)=>{
    e.target.value = e.target.value.toUpperCase();
}

const alert = (content = '',titulo = '',  type = 'info', desc_ok = 'Aceptar', desc_cancel = 'Cancelat', funcionAceptar = false , funcionCancelar= false,FormName = '') => {
	setTimeout(()=>{
		Modal[type === 'alert' ? 'info' : type]({
			title:<div className='titleModal'>{titulo}</div>,
			icon: <img alt='' src={ type === 'info' ? info : type === 'alert' ? alerta : type === 'error' ? error : confirmar } width="25" style={{float:'left',margin:"0px 15px 0px 0px"}}/>,
			content: content,
			okText: desc_ok,
			style : {marginTop: '15vh'},		
			okType: 'primary',
			onOk(){ 
				if(funcionAceptar) funcionAceptar()
				else Modal.destroyAll() 
			},
			okButtonProps:{className:`${FormName}_alert`},
			cancelText:desc_cancel,
			onCancel() {
				if(funcionCancelar) funcionCancelar()
				else Modal.destroyAll()}
		})
	})	
}
export const desactivarSpinner = ()=>{
    let classNameContent  = 'ant-spin-blur';
    document.getElementsByClassName(classNameContent)[0]?.classList?.remove(classNameContent);
}
export const activarSpinner = ()=>{
    let AddclassNameContent = 'ant-spin-blur'
    let classNameContent    = 'ant-spin-container'
    let valorClass          = document.getElementsByClassName(classNameContent);  
    valorClass[0]?.classList?.add(AddclassNameContent);
}

const modal = (content = '',titulo = '',  type = 'info', desc_ok = 'Aceptar', desc_cancel = 'Cancelar', funcionAceptar = false , funcionCancelar= false) => {
	setTimeout(()=>{
		Modal[type === 'alert' ? 'info' : type]({
			title:<div className='titleModal'>{titulo}</div>,
			icon: <img alt='' src={ type === 'info'    ? iconInfo 
                                  : type === 'alert'   ? iconAdve 
                                  : type === 'error'   ? iconError 
                                  : type === 'confirm' ? iconAdve 
                                  : '' } width="25" style={{float:'left',margin:"0px 15px 0px 0px"}}/>,
			content: content,
			style  : {marginTop: '15vh'},
            okText : desc_ok ? desc_ok : "",
			cancelText:desc_cancel,
			okType : 'primary',
            // maskClosable:false,
            closable:true,
			onOk(closeModal){ 
				if(funcionAceptar) funcionAceptar(closeModal)
				else Modal.destroyAll() 
			},
            
			onCancel() {
				if(funcionCancelar) funcionCancelar()
				else Modal.destroyAll()}
		})
	})	
}

const getMenuKeysForCodForm = (cod_form) => {
    let resulMenu = JSON.parse(sessionStorage.getItem('menu'));
    let moduleKey = null;
    let submoduleKey = null;
  
    if(!resulMenu) return []

    // Recorre el array de objetos resulMenu para buscar el cod_form
    resulMenu.forEach((item,index) => {
      if (item.cod_form === cod_form) {
        moduleKey = item.id_modulo;
        submoduleKey = item.id_submodulo;
      }
    });
  
    // Si se encontró el cod_form en el resulMenu, genera los keys correspondientes
    if (moduleKey) {
      if (submoduleKey) {
        return [moduleKey, submoduleKey, cod_form];
      } else {
        return [moduleKey,cod_form];
      }
    }
  
    // Si no se encontró el cod_form, devuelve un array vacío
    return [];
};
  
let guardar = 'f10';


const Igmpredefault = "data:image/png;base64,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"

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    // reader.onerror = error => reject(error);
  });
}

const onKeyDownBloqueo = (e)=>{e.preventDefault()}


const nvl = (value, defaultValue)=> {
	return (value !== null && value !== undefined && value !== "") ? value : defaultValue;
}

const finalFocusDet = async(hotInstance)=>{
  hotInstance.deselectCell();
  let activeEditor = hotInstance?.getActiveEditor();
  if (activeEditor) activeEditor.finishEditing();
}

const getDataModal = async (data, url) => {
  try {
    return await Request(url,"POST",data).then((resp) => {return resp.data});
  } catch (error) {
    console.log(error);
    return [];
  }
};

const soloNumero = (e) =>{
  var key = window.event ? e.which : e.keyCode;
  if (key < 48 || key > 57) e.preventDefault();
}

const main = {
  mayuscula,
  _,
  Request,
  RequestImg,
  Redirect,
  activarSpinner,
  desactivarSpinner,
  modal,
  getDataModal,
// ANT
  Spin,
  message,
  Row, 
  Col,
  Form,
  Card, 
  Input, 
  Button, 
  Modal,
  Radio, 
  Divider, 
  Select, 
  Checkbox,
  List, 
  Tooltip, 
  Tabs, 
  TabPane,
  Avatar,
  DatePicker,	
  ConfigProvider, 
  locale,
  Title,
  getMenuKeysForCodForm,
  useHistory,
  Layout,
  HeaderMenu,
  	// --------------------
  FormModalSearch,
  ModalHadsontable,
	HandsontableGrid,
  hotTableRequerido,
	// --
  guardar,
  useHotkeys,
  Upload,
  Igmpredefault,
  ImgCrop,
  getBase64,
  Image,
  uuidID,
  moment,
  modifico,
	setModifico,
  setBuscar,
  getViewBuscar,
  validarCamposRequeridos,
  quitarClaseRequerido,
  GenerarUpdateInsert,
  onKeyDownBloqueo,
  nvl,
  alert,
  finalFocusDet,
  soloNumero
};
  
export default main;
