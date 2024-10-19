import React, { memo } from 'react';
import Main            from '../../../../../util/Main';
import mainColumn      from './column/mainModal';

const view = memo((props) => {
  return (
    <Main.Form size="small" autoComplete="off" form={props.form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row gutter={[8,2]}>

        <Main.Col span={15} style={{padding:'30px'}}>
          
          <Main.Row gutter={[12,2]}>

            <Main.Col span={16}>
              <Main.Form.Item name="titulo_precios" label={<label style={{ width: '126px' }}><span style={{ color: 'red' }}>* </span>Titulo Precios</label>}>
                <Main.Input  style={{width:'calc(104% - 13px)'}}
                    onInput={Main.mayuscula} className={`requerido`}
                    onKeyDown={props.handleKeyDown} 
                    onKeyUp={props.handleKeyUp} 
                    onChange={props.handleInputChange}
                  />
              </Main.Form.Item>
            </Main.Col>
            
            <Main.Col span={2}>
              <Main.Form.Item name="activo" valuePropName="checked">
                <Main.Checkbox disabled >¿Activo?</Main.Checkbox>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={6}>
              <Main.Form.Item name="cod_servicio" label={<label style={{ width: '70px' }}>N° Servcio</label>}>
                <Main.Input  onKeyDown={props.handleKeyDown}  onKeyUp={props.handleKeyUp} 
                className={`${props.FormName}_BLOQUEO`} style={{width:'calc(104% - 4px)',textAlign:'right'}}/>
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={24} style={{padding:'22px 0px 0px 60px'}} >
              <Main.HandsontableGrid
                refData={props.refDet}
                columns={mainColumn.columnDet}
                FormName={props.FormName}
                idComp={props.idComp}// id del componente
                height={180}
                // maxFocus={maxFocus}
                // setLastFocusNext={setLastFocusNext}
                // columnModal={mainColumn.columnModalDet}
                // columnNavigationEnter={mainColumn.nextEnter}
                // setClickCell={setClickCell}
              />         
            </Main.Col>

          </Main.Row>

        </Main.Col>
        
        <Main.Col span={8} style={{textAlign:'center'}} >
          <Main.Row>
            <Main.Col span={24} style={{height:'224px',overflow:'auto'}} >
              <Main.Divider className='ant-Divider' orientation="left">Img Precio</Main.Divider>
              <Main.Image
                  className="NoViewpreviewImg"
                  alt="example"
                  width={200}
                  preview={{
                    visible: props.previewImage.length > 0 ? true : false,
                    onVisibleChange: (e) => props.setPreviewImage(false),
                  }}
                  src={props.previewImage}
                />
                <Main.ImgCrop 
                  modalTitle='Editar Imagen'
                  showGrid 
                  rotationSlider 
                  aspectSlider 
                  showReset
                  wrapperStyle={{
                    display: 'none',
                  }}
                >

                  <Main.Upload
                    className={`${props.FormName}_upload`}
                    style={{width:'50%',height: '290px'}}
                    action={Main.Igmpredefault}
                    listType="picture-card"
                    fileList={props.fileList}
                    onChange={props.onChange}
                    beforeUpload={props.handleupload}
                    onPreview={props.onPreview}
                  >
                    {props.fileList.length < 1 && '+ Upload'}

                  </Main.Upload>
                  
                </Main.ImgCrop>
            </Main.Col>
            {/*****************************************************************/}
            <Main.Col span={24} style={{height:'224px',overflow:'auto'}}>
              <Main.Divider className='ant-Divider' orientation="right">Fondo</Main.Divider>
              <Main.Image
                className="NoViewpreviewImg"
                alt="example"
                width={200}
                preview={{
                  visible: props.previewImageFondo.length > 0 ? true : false,
                  onVisibleChange: (e) => props.setPreviewImageFondo(false),
                }}
                src={props.previewImageFondo}
              />
              <Main.ImgCrop 
                wrapperStyle={{
                display: 'none',
              }}
                modalTitle='Editar Imagen'
                showGrid 
                rotationSlider 
                aspectSlider 
                showReset
              >

                <Main.Upload
                  className={`${props.FormName}_upload`}
                  style={{width:'50%',height: '290px'}}
                  action={Main.Igmpredefault}
                  listType="picture-card"
                  fileList={props.fileListFondo}
                  onChange={(e)=>props.onChange(e,false)}
                  beforeUpload={(e)=>props.handleupload(e,false)}
                  onPreview={(e)=>props.onPreview(e,false)}
                >
                  {props.fileListFondo.length < 1 && '+ Upload'}
                </Main.Upload>
                  
              </Main.ImgCrop>
            </Main.Col>
          </Main.Row>          

        </Main.Col>

        <Main.Col span={24}>
          <div className={`pagina_${props.FormName}`}>
            Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
          </div>
        </Main.Col>

      </Main.Row>
    </Main.Form>
  );
});

export default view;