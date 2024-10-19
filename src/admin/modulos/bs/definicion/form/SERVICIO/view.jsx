import React, { memo } from 'react';
import Main            from '../../../../../util/Main';
import mainColumn      from './column/mainModal';

const View_Servicio = memo(({form , FormName  , onChange    , handleKeyDown,handleCheckbox ,
                             handleInputChange, handleKeyUp , fileList     ,onPreview      ,
                             setPreviewImage  , previewImage, handleupload ,idComp         ,
                             refDet           , setLastFocusNext           ,setClickCell}) => {
  const maxFocus = [{
    id:idComp      ,
    hasta:"descripcion" ,
    newAddRow:true ,    
  }];
  return (
    <Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
      <Main.Row gutter={[8,2]}>

        <Main.Col span={15} style={{padding:'30px'}} onClick={()=>setClickCell()}>
            <Main.Row gutter={[12,2]}>
              
              <Main.Col span={12}>
                <Main.Form.Item name="titulo" label={<label style={{ width: '40px' }}><span style={{ color: 'red' }}>*</span>Titulo</label>}>
                  <Main.Input  style={{width:'calc(104% - 13px)'}}
                     onInput={Main.mayuscula} className={`requerido`}
                     onKeyDown={handleKeyDown} 
                     onKeyUp={handleKeyUp} 
                     onChange={handleInputChange}
                    />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={6}>
                <Main.Form.Item name="activo" valuePropName="checked" onChange={(e)=>handleCheckbox(e,['S','N'])} >
                  <Main.Checkbox  >¿Activo?</Main.Checkbox>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={6}>
                <Main.Form.Item name="cod_servicio" label={<label style={{ width: '60px' }}>Codigo</label>}>
                  <Main.Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} className={`${FormName}_BLOQUEO`} style={{width:'calc(104% - 4px)',textAlign:'right'}}/>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={24}>
                <Main.Form.Item name="descripcion" label={<label style={{width:'40px'}}>descrip.</label>}>
                  <Main.Input.TextArea  onChange={handleInputChange} maxLength={500} style={{ height: 120, resize: 'none'}} />
                </Main.Form.Item>
              </Main.Col>
              
              <Main.Col span={24} style={{padding:'22px 0px 0px 60px'}} >
                <Main.HandsontableGrid
                    refData={refDet}
                    columns={mainColumn.columnDet}
                    FormName={FormName}
                    idComp={idComp}// id del componente
                    height={180}
                    maxFocus={maxFocus}
                    setLastFocusNext={setLastFocusNext}
                    columnModal={mainColumn.columnModalDet}
                    columnNavigationEnter={mainColumn.nextEnter}
                    setClickCell={setClickCell}
                  />         
              </Main.Col>

            </Main.Row>
        </Main.Col> 

        <Main.Col span={9} style={{textAlign:'center', height:'380px',overflow:'auto'}}>

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
              style={{width:'90%',height: '300px'}}
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
  );
});

export default View_Servicio;