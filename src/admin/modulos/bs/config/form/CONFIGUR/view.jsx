import React, { memo } from 'react';
import Main            from '../../../../../util/Main';
import mainColumn      from './column/mainModal';

const View_Confugur = memo((props) => {
  const maxFocus = [{
    id:props.idComp      ,
    hasta:"activar" ,
    newAddRow:true ,    
  }];

  return (
    <Main.Form size="small" autoComplete="off" form={props.form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row gutter={[8,2]}>

        <Main.Col span={14} style={{padding:'40px'}}>
          <Main.Row gutter={[12,2]}>

            <Main.Col span={16}>
              <Main.Form.Item name="titulo" label={<label style={{ width: '62px' }}><span style={{ color: 'red' }}>*</span>Titulo</label>}>
                <Main.Input  style={{width:'calc(104% - 13px)'}}
                      onKeyDown={props.handleKeyDown} 
                      onKeyUp={props.handleKeyUp} 
                      onChange={props.handleInputChange} 
                      onInput={Main.mayuscula} className={`requerido`}                        
                  />
              </Main.Form.Item>
            </Main.Col>

            <Main.Col span={3}>
                <Main.Form.Item name="activo" valuePropName="checked" onChange={(e)=>props.handleCheckbox(e,['S','N'])}>
                  <Main.Checkbox  >¿Activo?</Main.Checkbox>
                </Main.Form.Item>
              </Main.Col>

            <Main.Col span={5}>
              <Main.Form.Item name="cod_configuracion" label={<label style={{ width: '62px' }}>Codigo</label>}>
                <Main.Input onKeyDown={props.handleKeyDown} onKeyUp={props.handleKeyUp}
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
                maxFocus={maxFocus}
                setLastFocusNext={props.setLastFocusNext}
                columnModal={mainColumn.columnModal}
                columnNavigationEnter={mainColumn.nextEnter}
                setClickCell={props.setClickCell}
              />         
            </Main.Col>


          </Main.Row>
        </Main.Col>
        
        <Main.Col span={10} style={{textAlign:'center', height:'380px',overflow:'auto'}}>
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
          >

            <Main.Upload
              className={`${props.FormName}_upload`}
              style={{width:'48%',height: '300px'}}
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
        


        <Main.Col span={24} >
          <div className={`pagina_${props.FormName}`}>
            Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
          </div>
        </Main.Col>

      </Main.Row>
    </Main.Form>
  );
});

export default View_Confugur;