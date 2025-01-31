import * as React from 'react';
import { Link }   from 'react-router-dom';
import { Menu,Layout
        ,Dropdown,Space
        ,Avatar }        from 'antd';
import {
  AppstoreOutlined, AppstoreAddOutlined,DesktopOutlined   }    from '@ant-design/icons';
import './Sider.css';
import Main from '../../util/Main';

  const { Sider } = Layout;

  
const SiderMain     =  React.memo(({defaultSelectedKeys, defaultOpenKeys,CloseSession}) => {

  const cod_empresa = sessionStorage.getItem('cod_empresa');
  const extencion   = sessionStorage.getItem('extencion_img');
  
  const imgEmpresa  = process.env.REACT_APP_BASEURL+`/private/${cod_empresa}/EMPRESA/empresa-img${cod_empresa}.${extencion}`;


 const resulMenu    = JSON.parse(sessionStorage.getItem('menu'));
 let countModulo    = Main._.uniq( resulMenu, (item)=>{ return item.id_modulo });

 const items = resulMenu.reduce((acc, curr) => {
  // Verifica si el módulo ya existe
  let modulo = acc.find((mod) => mod.key === curr.id_modulo);
  if (!modulo) {
    modulo = {
      key: curr.id_modulo,
      icon: React.createElement(AppstoreAddOutlined),
      label: curr.desc_modulo,
      children: [],
    };
    acc.push(modulo);
  }

  // Caso especial: Si es "Configuración", no tiene submódulo
  if (Main._.isNull(curr.id_submodulo)) {
    modulo.children.push({
      key: curr.cod_form,
      icon: React.createElement(AppstoreOutlined),
      label: <Link to={curr.ruta}>{curr.desc_form}</Link>,
    });
  } else {
    // Encuentra o crea el submódulo
    let submodulo = modulo.children.find((sub) => sub.key === curr.id_submodulo);
    if (!submodulo) {
      submodulo = {
        key: curr.id_submodulo,
        icon: React.createElement(AppstoreAddOutlined),
        label: curr.desc_submodulo,
        children: [],
      };
      modulo.children.push(submodulo);
    }

    // Agrega el formulario al submódulo
    submodulo.children.push({
      key: curr.cod_form,
      icon: React.createElement(AppstoreOutlined),
      label: <Link to={curr.ruta}>{curr.desc_form}</Link>,
    });
  }

  return acc;
}, []);


  // const items = countModulo.map((modulo) => {
  // // Filtrar submódulos asociados al módulo actual
  // const subModulosDelModulo = resulMenu.filter((item) => item.id_modulo === modulo.id_modulo);

  // // Submódulos principales (sin id_submodulo)
  // const itemaModulos = subModulosDelModulo.filter((item_modulo) =>
  //   Main._.isNull(item_modulo.id_submodulo)
  // );

  // // Submódulos únicos del módulo
  // const contenetSubModulos = Main._.uniq(subModulosDelModulo, (item) => item.id_modulo);

  // // Concatenar submódulos y módulos principales
  // let arrayConcatenado = [];
  // if (itemaModulos.length > 0) {
  //   arrayConcatenado = itemaModulos.concat(contenetSubModulos);
  // } else {
  //   arrayConcatenado = contenetSubModulos;
  // }

  // // Crear submódulos con sus respectivos children (formularios)
  // const sub_children = arrayConcatenado.map((submodulo) => {
  //   const items_children = resulMenu.filter(
  //     (items_sub) => items_sub.id_submodulo === submodulo.id_submodulo
  //   );

  //   // Formularios asociados al submódulo
  //   const children = items_children.map((item) => ({
  //     key: String(item.cod_form),
  //     icon: React.createElement(AppstoreOutlined),
  //     label: <Link to={item.ruta}>{item.desc_form}</Link>,
  //   }));

  //   return {
  //     key: String(submodulo.id_submodulo === null ? submodulo.cod_form : submodulo.id_submodulo),
  //     icon: submodulo.desc_submodulo === null
  //       ? React.createElement(AppstoreOutlined)
  //       : React.createElement(AppstoreAddOutlined),
  //     label: submodulo.desc_submodulo === null
  //       ? <Link to={submodulo.ruta}>{submodulo.desc_form}</Link>
  //       : submodulo.desc_submodulo,
  //     children: children.length > 0 ? children : undefined, // Solo agregar children si hay elementos
  //   };
  // });

  // return {
  //   key: String(modulo.id_modulo),
  //   icon: React.createElement(AppstoreAddOutlined),
  //   label: modulo.desc_modulo,
  //   children: sub_children.length > 0 ? sub_children : undefined, // Solo agregar children si hay elementos
  // };
  // });


  // const items = countModulo.map((modulo) => {

  //   const subModulosDelModulo = resulMenu.filter((item) => item.id_modulo === modulo.id_modulo);
  //   const itemaModulos        = subModulosDelModulo.filter((item_modulo)=>{ return Main._.isNull(item_modulo.id_submodulo) });      
  //   const contenetSubModulos  = Main._.uniq( subModulosDelModulo, (item)=>{ return item.id_modulo });
  //   var arrayConcatenado      =  []
  //   if(itemaModulos.length > 0) arrayConcatenado = itemaModulos.concat(contenetSubModulos);
  //   else arrayConcatenado = contenetSubModulos
    
  //   const sub_children = arrayConcatenado.map((submodulo) => ({
  //       key: String(submodulo.id_submodulo === null ? submodulo.cod_form : submodulo.id_submodulo),
  //       icon: submodulo.desc_submodulo === null ? (
  //               React.createElement(AppstoreOutlined)
  //             ) : (
  //               React.createElement(AppstoreAddOutlined)
  //             ),
  //       label: submodulo.desc_submodulo === null ? (
  //           <Link to={submodulo.ruta}>{submodulo.desc_form}</Link>
  //       ) : (
  //           submodulo.desc_submodulo
  //       ),
  //   }));

  //   if(sub_children.length > 0){
  //     // eslint-disable-next-line
  //     sub_children.map((items_sub_children , index_chi)=>{
  //       let items_children = resulMenu.filter((items_sub)=>items_sub.id_submodulo === items_sub_children.key );                            
  //       // eslint-disable-next-line
  //       items_children.map((itemsDelSubModulo)=>{
  //         let data = { key: String(itemsDelSubModulo.cod_form),
  //                      icon: React.createElement(AppstoreOutlined),
  //                      label: <Link to={itemsDelSubModulo.ruta}>{itemsDelSubModulo.desc_form}</Link>
  //                    }
  //         if (!sub_children[index_chi].children) {
  //           sub_children[index_chi].children = [data];
  //         } else if (sub_children[index_chi].children.length > 0) {
  //           sub_children[index_chi].children.unshift(data);
  //         }          
  //       })        
  //     })

  //     // let ItemSubModulo   = contenetSubModulos.filter((item) => item.id_submodulo !== null);
  //     // ItemSubModulo.map((itemsSubModulo)=>{        
  //     //   let result  =  resulMenu.filter((items_children)=>items_children.id_menu === itemsSubModulo.id_menu );
  //     //   result[0].children = [{
  //     //     key: String(itemsSubModulo.cod_form),
  //     //     icon: React.createElement(AppstoreOutlined),
  //     //     label: <Link to={itemsSubModulo.ruta}>{itemsSubModulo.desc_form}</Link>
  //     //   }]
  //     // })
  //   }

  //   return {
  //       key: String(modulo.id_modulo),
  //       icon: React.createElement(AppstoreAddOutlined),
  //       label: modulo.desc_modulo,
  //       children: sub_children,
  //   };
  // });

  const items_home = [{
    key: 'HOME',
    icon: <DesktopOutlined />,
    label: <Link to="/home">Home</Link>,
  },]
  
 const items_session = [
  {
    key: '#',
    label: (<button className='buttonDropdown' onClick={CloseSession} > Cerrar Sesion </button>),
  },
 ];

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      mode={'inline'}
    >
      <div className="demo-logo-vertical" >
        <Dropdown menu={{ items:items_session }} placement="bottomLeft" trigger={['click']} arrow>            
          <Space className='spaceAvatar' wrap size={16} >
              <Avatar size={50} icon={<img alt='avatar' src={imgEmpresa} />} />
              <div className='contentUserName' >
                  <div className='user'>
                      {sessionStorage.getItem('usuario')}
                  </div>
                  <div className='nombreDeusuario'>
                      - {sessionStorage.getItem('nombre')}
                  </div>
              </div>
          </Space>            
        </Dropdown>
      </div>
      {/*  // eslint-disable-next-line */}
      <Menu theme="dark" mode="inline" defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys={defaultOpenKeys} items={items_home}/>
      <Menu theme="dark" mode="inline" inlineIndent={12} defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys={defaultOpenKeys} items={items} />
    </Sider>
  );
});

export default SiderMain;

// import * as React ,{memo}  from 'react';
// import { Link } from 'react-router-dom';
// import { Menu,Layout
//         ,Dropdown,Space
//         ,Avatar }        from 'antd';
// import {
//   AppstoreOutlined, AppstoreAddOutlined,DesktopOutlined   }    from '@ant-design/icons';
// import './Sider.css';
// import Main from '../../util/Main';

// const { Sider } = Layout;

  
// const SiderMain =  React.memo(({defaultSelectedKeys, defaultOpenKeys,CloseSession}) => {

//   const cod_empresa = sessionStorage.getItem('cod_empresa');
//   const imgEmpresa  = process.env.REACT_APP_BASEURL+`/private/${cod_empresa}/EMPRESA/logoEmpresa.jpg`;

//   const resulMenu   = JSON.parse(sessionStorage.getItem('menu'));
//   let countModulo   = Main._.uniq( resulMenu, (item)=>{ return item.id_modulo });

//   const items = countModulo.map((modulo) => {

//     const subModulosDelModulo = resulMenu.filter((item) => item.id_modulo === modulo.id_modulo);
//     const itemaModulos        = subModulosDelModulo.filter((item_modulo)=>{ return Main._.isNull(item_modulo.id_submodulo) });      
//     const contenetSubModulos  = Main._.uniq( subModulosDelModulo, (item)=>{ return item.id_modulo });
//     var arrayConcatenado      =  []
//     if(itemaModulos.length > 0) arrayConcatenado = itemaModulos.concat(contenetSubModulos);
//     else arrayConcatenado = contenetSubModulos
    
//     const sub_children = arrayConcatenado.map((submodulo) => ({
//         key: String(submodulo.id_submodulo === null ? submodulo.cod_form : submodulo.id_submodulo),
//         icon: submodulo.desc_submodulo === null ? (
//                 React.createElement(AppstoreOutlined)
//               ) : (
//                 React.createElement(AppstoreAddOutlined)
//               ),
//         label: submodulo.desc_submodulo === null ? (
//             <Link to={submodulo.ruta}>{submodulo.desc_form}</Link>
//         ) : (
//             submodulo.desc_submodulo
//         ),
//     }));

//     if(sub_children.length > 0){
//       // eslint-disable-next-line
//       sub_children.map((items_sub_children , index_chi)=>{
//         let items_children = resulMenu.filter((items_sub)=>items_sub.id_submodulo === items_sub_children.key );                            
//         // eslint-disable-next-line
//         items_children.map((itemsDelSubModulo)=>{
//           let data = { key: String(itemsDelSubModulo.cod_form),
//                        icon: React.createElement(AppstoreOutlined),
//                        label: <Link to={itemsDelSubModulo.ruta}>{itemsDelSubModulo.desc_form}</Link>
//                      }
//           if (!sub_children[index_chi].children) {
//             sub_children[index_chi].children = [data];
//           } else if (sub_children[index_chi].children.length > 0) {
//             sub_children[index_chi].children.unshift(data);
//           }          
//         })        
//       })

//       // let ItemSubModulo   = contenetSubModulos.filter((item) => item.id_submodulo !== null);
//       // ItemSubModulo.map((itemsSubModulo)=>{        
//       //   let result  =  resulMenu.filter((items_children)=>items_children.id_menu === itemsSubModulo.id_menu );
//       //   result[0].children = [{
//       //     key: String(itemsSubModulo.cod_form),
//       //     icon: React.createElement(AppstoreOutlined),
//       //     label: <Link to={itemsSubModulo.ruta}>{itemsSubModulo.desc_form}</Link>
//       //   }]
//       // })
//     }

//     return {
//         key: String(modulo.id_modulo),
//         icon: React.createElement(AppstoreAddOutlined),
//         label: modulo.desc_modulo,
//         children: sub_children,
//     };
//   });
       
//   const items_home = [{
//       key: 'HOME',
//       icon: <DesktopOutlined />,
//       label: <Link to="/home">Home</Link>,
//     },
//     {
//       key: 'BS',
//       icon: <DesktopOutlined />,
//       label: <>Base</>,    
//       children:[{
//         key: 'CONFIGUR',
//         icon: <DesktopOutlined />,
//         label: <Link to="/bs/configur">Configuracion</Link>,
//       }]
//     }
// ]

//  const items_session = [{key: '#', label: (<button className='buttonDropdown' onClick={CloseSession} > Cerrar Sesion </button>)}];

//   return (
//     <>
//       <Sider breakpoint="lg" collapsedWidth="0" mode={'inline'} >
//         <div className="demo-logo-vertical" >
//           <Dropdown menu={{ items:items_session }} placement="bottomLeft" trigger={['click']} arrow>            
//             <Space className='spaceAvatar' wrap size={16} >
//                 <Avatar size={50} icon={<img alt='avatar' src={imgEmpresa} />} />
//                 <div className='contentUserName' >
//                     <div className='user'>
//                         {sessionStorage.getItem('usuario')}
//                     </div>
//                     <div className='nombreDeusuario'>
//                         - {sessionStorage.getItem('nombre')}
//                     </div>
//                 </div>
//             </Space>            
//           </Dropdown>
//         </div>
//         <Menu theme="dark" mode="inline" defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys={defaultOpenKeys} items={items_home}/>
//         {/* <Menu theme="dark" mode="inline" inlineIndent={12} defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys={defaultOpenKeys} items={items} /> */}
//       </Sider>
//     </>
//   );
// });

// export default SiderMain;