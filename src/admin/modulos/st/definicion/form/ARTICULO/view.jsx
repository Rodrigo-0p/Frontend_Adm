import * as React from 'react';
import Main       from '../../../../../util/Main';
import mainColumn from './column/mainModal';
import codbarra   from '../../../../../../assets/icons/barra1.svg'

const View_Articulo = React.memo((props) => {
    const maxFocus = [
      {
        id       :props.idComp,
        hasta    :'cantidad',
        newAddRow: true,
      },
    ];
    
    return (
      <Main.Form size="small" autoComplete="off" form={props.form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px' }}>
        <Main.Row gutter={[8, 2]}>
          
          <Main.Col span={15} style={{ padding: '30px' }} onClick={() => props.setClickCell()}>
            <Main.Row gutter={[12, 2]}>

              {/* Código del Artículo */}
              <Main.Col span={6}>
                <Main.Form.Item name="cod_articulo" label={ <label style={{ width: '80px' }}> Código <span style={{ color: 'red' }}> *</span> </label>}>
                  <Main.Input
                    onKeyDown={props.handleKeyDown}
                    onKeyUp={props.handleKeyUp}
                    onChange={props.handleInputChange}
                    style={{ width: 'calc(104% - 4px)', textAlign: 'right' }}
                    className={`${props.FormName}_BLOQUEO`}
                  />
                </Main.Form.Item>
              </Main.Col>

              {/* Descripción del Artículo */}
              <Main.Col span={18}>
                <Main.Form.Item name="descripcion" label={ <label style={{ width: '70px' }}> Descripción <span style={{ color: 'red' }}> *</span> </label>}>
                  <Main.Input
                    className="search_input requerido"
                    onKeyDown={props.handleKeyDown}
                    onChange={props.handleInputChange} 
                    onKeyUp={props.handleKeyUp}
                    maxLength={200} />
                </Main.Form.Item>
              </Main.Col>

              {/* Stock Mínimo */}
              <Main.Col span={6}>
                <Main.Form.Item name="stock_minimo" label={<label style={{ width: '80px' }}>Stock Mínimo</label>}>
                  <Main.Input
                    onKeyDown={props.handleKeyDown}
                    onKeyUp={props.handleKeyUp}
                    onChange={props.handleInputChange}
                    style={{ textAlign: 'right' }}
                  />
                </Main.Form.Item>
              </Main.Col>

              {/* codigo de barra */}
              <Main.Col span={7}>
                <Main.Form.Item name="codigo_barras" label={<label style={{ width: '70px' }}>Cod. de Barra<span style={{color:'red'}}>*</span></label>}>
                  <Main.Input
                    className="search_input requerido"
                    onKeyDown={props.handleKeyDown}
                    onKeyUp={props.handleKeyUp}
                    onChange={props.handleInputChange}
                    onKeyPress={Main.soloNumero} 
                  />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={1} style={{margin:'0px',padding:'0px',textAlign:'center'}}>
              <Main.Button                 
                icon={<img alt='delete' src={codbarra} width="26" height="18" style={{borderRadius:'5px'}}/>}
                className="menu-button-barra"
                onClick={props.generateRandomBarcode}
                />
              </Main.Col>

              <Main.Col span={10}>
                <Main.Form.Item label={<label style={{width:'60px'}}>Categoria<span style={{color:'red'}}>*</span></label>}>
                  <Main.Form.Item name="cod_categoria" style={{width:'80px',display:'inline-block', marginRight:'4px'}}>
                    <Main.Input 
                      className="search_input requerido"
                      onChange={props.handleInputChange}
                      onKeyUp={props.handleKeyUp} 
                      onKeyDown={props.handleKeyDown}
                    />
                  </Main.Form.Item>
                  <Main.Form.Item name="desc_categoria" style={{width:'calc(100% - 85px)', display:'inline-block'}}>
                    <Main.Input disabled/>
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={6}>
                <Main.Form.Item className={`${props.FormName}_VISIBLE`} name={`stock_inicial`} label={<label style={{ width: '80px' }}>Stock inicial</label>}>
                  <Main.Input
                    onKeyDown={props.handleKeyDown}
                    onKeyUp={props.handleKeyUp}
                    onChange={props.handleInputChange}
                    style={{ textAlign: 'right' }}
                    className={`search_input`}
                  />
                </Main.Form.Item>
              </Main.Col>

              {/* Estado */}
              <Main.Col span={3}>
               <Main.Form.Item name="estado" valuePropName="checked" label={<label style={{ width: '70px', fontWeight:'bold'}}>Activo</label>}
                  onChange={(e) => props.handleCheckbox(e, ['S', 'N'])}
                  onKeyDown={props.handleKeyDown}
                  >
                  <Main.Checkbox />
                </Main.Form.Item>
              </Main.Col>

              {/* Inventario */}
              <Main.Col span={3}>
               <Main.Form.Item name="inventariar" valuePropName="checked" label={<label style={{ width: '66px', fontWeight:'bold'}}>inventario</label>} 
                  onChange={(e) => props.handleCheckbox(e, ['S', 'N'])}
                  onKeyDown={props.handleKeyDown} >
                  <Main.Checkbox />
                </Main.Form.Item>
              </Main.Col>

              <Main.Col span={12}>
                <Main.Form.Item label={<label style={{width:'125px'}}>Impuesto</label>}>
                  <Main.Form.Item name="cod_impuesto" style={{width:'80px',display:'inline-block', marginRight:'4px'}}>
                    <Main.Input
                      className="search_input"
                      onChange={props.handleInputChange}
                      onKeyUp={props.handleKeyUp} 
                      onKeyDown={props.handleKeyDown}
                    />
                  </Main.Form.Item>
                  <Main.Form.Item name="desc_impuesto" style={{width:'calc(100% - 85px)', display:'inline-block'}}>
                    <Main.Input disabled/>
                  </Main.Form.Item>
                </Main.Form.Item>
              </Main.Col>
              

              {/* Detalle de Unidades de Medida */}
              <Main.Col span={24} style={{ paddingTop: '20px' }}>
                <Main.HandsontableGrid
                  refData={props.refDet}
                  columns={mainColumn.columnDet} // Define aquí las columnas para las unidades de medida.
                  FormName={props.FormName}
                  idComp={props.idComp}
                  height={120}
                  maxFocus={maxFocus}
                  setLastFocusNext={props.setLastFocusNext}
                  columnModal={mainColumn.columnModalDet}
                  columnNavigationEnter={mainColumn.nextEnter}
                  setClickCell={props.setClickCell}
                  setfocusRowIndex={props.setfocusRowIndex}
                />
              </Main.Col>

              <Main.Col span={24}>
                <Main.Divider className={`${props.FormName}_ant-Divider ant-Divider`} orientation="right">Almacen / Proveedor</Main.Divider>
                <Main.HandsontableGrid
                  refData={props.refDetAlm}
                  columns={mainColumn.columnAlmacen} // Define aquí las columnas para las unidades de medida.
                  FormName={props.FormName}
                  idComp={props.idCompAlm}
                  height={120}
                  maxFocus={maxFocus}
                  // setLastFocusNext={props.setLastFocusNext}
                  columnModal={mainColumn.columnModalDet}
                  columnNavigationEnter={mainColumn.nextEnterAlm}
                  // setClickCell={props.setClickCell}
                  // setfocusRowIndex={props.setfocusRowIndex}
                />
              </Main.Col>

            </Main.Row>
          </Main.Col>

          {/* Vista de Imagen */}
          <Main.Col span={9} onClick={() => props.setClickCell()}>
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

            <Main.ImgCrop modalTitle='Editar Imagen' showGrid rotationSlider aspectSlider showReset >

              <Main.Upload
                key={props.keyImg}
                className={`${props.FormName}_upload`}
                style={{width:'90%',height: '300px'}}
                action={Main.Igmpredefault}
                listType="picture-card"
                fileList={props.fileList}
                onChange={props.onChange}
                beforeUpload={props.handleupload}
                onPreview={props.onPreview} >

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
  }
);

export default View_Articulo;
