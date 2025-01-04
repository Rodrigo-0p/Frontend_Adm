import * as React  from 'react';
import Main        from '../../../../../util/Main';

const View_Acercade =  React.memo(({ form        , FormName    , onChange     ,fileList,onPreview,setPreviewImage  ,
                              previewImage, handleupload, handleKeyDown,handleCheckbox    ,handleInputChange,
                              handleKeyUp}) => {
  return (
    <>
      <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
        <Main.Row gutter={[8,2]}>
          
          <Main.Col span={14} style={{padding:'40px'}}>
            <Main.Row gutter={[12,2]}>
              
              <Main.Col span={12}>
                <Main.Form.Item name="titulo" label={<label style={{ width: '62px' }}><span style={{ color: 'red' }}>*</span>Titulo</label>}>
                  <Main.Input  style={{width:'calc(104% - 13px)'}}
                    onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onInput={Main.mayuscula}  onChange={handleInputChange} className={`requerido`}/>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={6}>
                <Main.Form.Item name="activo" valuePropName="checked" onChange={(e)=>handleCheckbox(e,['S','N'])}>
                  <Main.Checkbox onKeyDown={handleKeyDown} >¿Activo?</Main.Checkbox>
                </Main.Form.Item>
              </Main.Col>
              <Main.Col span={6}>
                <Main.Form.Item name="cod_acercade" label={<label style={{ width: '62px' }}>Codigo</label>}>
                  <Main.Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} className={`${FormName}_BLOQUEO`} style={{width:'calc(104% - 4px)',textAlign:'right'}}/>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item name="subtitulo" label={<label style={{ width: '62px' }}><span style={{ color: 'red' }}>*</span>Sub Titulo</label>}>
                  <Main.Input 
                    onChange={handleInputChange} onKeyUp={handleKeyUp} onKeyDown={handleKeyDown} style={{width:'calc(100% - 0px)'}}
                    className={`requerido`}
                    />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24} >
                <Main.Form.Item name="descripcion" label={<label style={{width:'62px'}}>descripción</label>}>
                  <Main.Input.TextArea
                    maxLength={500}
                    style={{ height: 120, resize: 'none'}}
                    onChange={handleInputChange}
                  />
                </Main.Form.Item>
              </Main.Col>

            </Main.Row>
          </Main.Col>   

          <Main.Col span={10} style={{textAlign:'center', height:'380px',overflow:'auto'}}>
            <Main.Image
              className="NoViewpreviewImg"
              alt="example"
              width={200}
              preview={{
                visible: previewImage.length > 0 ? true : false,
                onVisibleChange: (e) => setPreviewImage(false),
              }}
              src={previewImage}
            />
            <Main.ImgCrop 
              modalTitle='Editar Imagen'
              showGrid 
              rotationSlider 
              aspectSlider 
              showReset
            >

              <Main.Upload
                className={`${FormName}_upload`}
                style={{width:'48%',height: '300px'}}
                action={Main.Igmpredefault}
                listType="picture-card"
                fileList={fileList}
                onChange={onChange}
                beforeUpload={handleupload}
                onPreview={onPreview}
              >
                {fileList.length < 1 && '+ Upload'}

              </Main.Upload>
              
            </Main.ImgCrop>

          </Main.Col>
          
          <Main.Col span={24} >
            <div className={`pagina_${FormName}`}>
              Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
            </div>
          </Main.Col>

        </Main.Row>      
      </Main.Form> 
    </>   
  );
});

export default View_Acercade;