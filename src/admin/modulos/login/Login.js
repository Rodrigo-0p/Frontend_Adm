import React, { memo }                 from 'react';
import { Form, Input, Button, message} from 'antd';
import { UserOutlined, LockOutlined
  , EyeTwoTone, EyeInvisibleOutlined}  from '@ant-design/icons';
import './Login.css';
import Main                            from '../../util/Main'


const Login = memo(({history}) => {
  
  const refPass      = React.useRef()
  const refPass_reset= React.useRef()
  const [form]       = Form.useForm();
  const [form_rest]  = Form.useForm();

  React.useEffect(()=>{
    document.getElementById('usuario').focus();
  },[])
  const onFinish = (values) => {
    if(Main._.isUndefined(values.PASSWORD) || Main._.isUndefined(values.USUARIO)){
      message.error({
        content: 'Complete todos los campos',
      });
    }else{
      if(values.PASSWORD.trim().length === 0 || values.USUARIO.trim().length === 0){        
        message.error({
          content: 'Complete todos los campos',
        });
      }else{
        Main.activarSpinner()
        let data = {  usuario  :values.USUARIO,
                      password :values.PASSWORD
                    }
          try {
          let url = '/public/login/usuario';
          Main.Request(url,'POST',data).then((resp)=>{
            Main.desactivarSpinner()
            if(resp.data.res === 1){
              setLocalStora(resp.data.rows)
              Main.message.success({
                content  : resp.data.mensaje,
                className: 'custom-class',
                duration : 2,
                style    : {
                marginTop: '4vh',
                },
              });

              history.push('/home');
                          
            }else if(resp.data.res === -1){              
              Main.modal(                
                <Main.Card className='card-login' style={{marginLeft:'-40px'}}>
                  <Form autoComplete="off" form={form_rest} name="loginForm">
                    <Form.Item name="usuario">
                      <Input
                        id="USUARIO"
                        prefix={<UserOutlined />}
                        placeholder="Nombre de Usuario"
                        className="login-input"
                        readOnly={true}
                      />
                    </Form.Item>
                    <Form.Item name="password">
                        <Input.Password
                          prefix={<LockOutlined />}
                          placeholder="Contraseña"
                          className="login-input login-input-reset"
                          onInput={Main.mayuscula}
                          ref={refPass_reset}         
                          iconRender={(visible) =>visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                      />
                    </Form.Item>
                  </Form>
                </Main.Card>
                ,'Restablecer Contraseña!','confirm','Aceptar','Cancelar',()=>onFinishReset(),()=>Main.Modal.destroyAll());
                setTimeout(()=>{
                  form_rest.setFieldsValue({usuario:values.USUARIO})
                  refPass_reset.current.focus()
                },100);
            }else{
              Main.message.info(resp.data.mensaje);
            }
          })
          } catch (error) {
          Main.desactivarSpinner()
          console.error(error)
          }
      }
    }
  };
  const setLocalStora = (row)=>{
    sessionStorage.setItem("token"        , row.token                );
    sessionStorage.setItem("usuario"      , row.usuario              );
    sessionStorage.setItem("cod_usuario"  , row.cod_usuario          );
    sessionStorage.setItem("nombre"       , row.nombre               );
    sessionStorage.setItem("apellido"     , row.apellido             );
    sessionStorage.setItem("img"          , row.img                  );
    sessionStorage.setItem("hash"         , row.hash                 );
    sessionStorage.setItem("cod_empresa"  , row.cod_empresa          );
    sessionStorage.setItem("empresa"      , row.empresa              );
    sessionStorage.setItem("desc_empresa" , row.desc_empresa         );
    sessionStorage.setItem("menu"         , JSON.stringify(row.menu) ); 
  }
  const onFinishReset = (modal)=>{
    Main.activarSpinner()
    try {
      let url  = '/public/reset/usuario'
      let data = form_rest.getFieldValue();
      // data.id  = 
      Main.Request(url,'POST',data).then((resp)=>{
        Main.desactivarSpinner()
        if(resp.data.res === 1){
          Main.message.success({
            content  : resp.data.mensaje,
            className: 'custom-class',
            duration : 2,
            style    : {
            marginTop: '4vh',
            },
          });
          setTimeout(()=>{
            Main.Modal.destroyAll();
            history.push('/home');
            setLocalStora(resp.data.rows)
          },5)
        }else{
          Main.message.info(resp.data.mensaje);
        }
      })
    } catch (error) {
      Main.desactivarSpinner()
      console.error(error)
    }
  }
  const onKeyDown = (e)=>{
    if(e.keyCode === 13){
      e.preventDefault()
      if(e.target.value.trim().length > 0){
        switch (e.target.name) {
          case "USUARIO":
              refPass.current.focus()  
            break;
          case "PASSWORD":
            onFinish(form.getFieldsValue());
            break;
          default:
            break;
        } 
      }
    }
  }
  if (sessionStorage.getItem("token")) history.push("/home");

  return (
    <Main.Spin spinning={false} delay={500}>
      {/* <Particles/> */}
      <div className="login-container">
        <div className="login-form-container">          
          <div className="login-header">
            <h1 className="login-title" >Iniciar Sesión</h1>
          </div>
          <Form autoComplete="off" form={form} name="loginForm" onFinish={onFinish}>
            <Form.Item name="USUARIO">
              <Input
                name="USUARIO"
                id="usuario"
                prefix={<UserOutlined />}
                placeholder="Nombre de Usuario"
                className="login-input"
                onKeyDown={onKeyDown}
                onInput={Main.mayuscula}
              />
            </Form.Item>
  
            <Form.Item name="PASSWORD">
              <Input.Password
                name="PASSWORD"
                prefix={<LockOutlined />}
                placeholder="Contraseña"
                className="login-input"
                ref={refPass}
                onKeyDown={onKeyDown}
                onInput={Main.mayuscula}                
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
            />
            </Form.Item>
  
            <Form.Item>
              <Button type="primary" htmlType="submit" block className="login-button">
                Iniciar Sesión
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Main.Spin>
  );
});

export default Login;