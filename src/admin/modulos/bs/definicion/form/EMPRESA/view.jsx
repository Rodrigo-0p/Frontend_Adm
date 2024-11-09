import React, {memo} from "react";
import Main          from '../../../../../util/Main';
import './styles/styles.css'
const View_Empresas = memo(({form , FormName  , onChange    , handleKeyDown,handleCheckbox ,
                             handleInputChange, handleKeyUp , fileList     , onPreview      ,
                             setPreviewImage  , previewImage, handleupload , })=>{
		return(
				<Main.Form size="small" autoComplete="off" form={form} style={{ marginTop: '1px', paddingLeft: '10px', paddingRight: '10px', paddingTop: '10px'}}>
					<Main.Row gutter={[24, 2]}>
						
						<Main.Col span={12} style={{padding:'30px'}}>
							<Main.Row gutter={[2,2]}>
								
								<Main.Col span={8}>
									<Main.Form.Item name="cod_empresa" label={<label style={{ width: '20px', marginLeft:'100px'}}>ID</label>}>
									<Main.Input onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} className={`${FormName}_BLOQUEO`} style={{width:'calc(104% - 5px)',textAlign:'right'}}/>
									</Main.Form.Item>
								</Main.Col>
								<Main.Col span={4}>
									<Main.Form.Item name="activo" style={{marginLeft:'65px'}} valuePropName="checked" onChange={(e)=>handleCheckbox(e,['S','N'])}>
									<Main.Checkbox onKeyDown={handleKeyDown} disabled>¿Activo?</Main.Checkbox>
									</Main.Form.Item>
								</Main.Col>
								
								<Main.Col span={12}/>

								<Main.Col span={20}>
								
									<Main.Form.Item name="nombre" label={ <label style={{width: '120px'}}> <span style={{color: 'red'}}>*</span>Nombre de Empresa</label>}>
										<Main.Input style={{width:'calc(104% - 13px)'}} 
										onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onInput={Main.mayuscula} onChange={handleInputChange} className={`requerido`}/>
									</Main.Form.Item>

								
									{/* <Main.Form.Item name="tipo_empresa" label={<label style={{width: '120px'}}><span style={{color:'red'}}>*</span>Tipo Empresa</label>}>
										<Main.Input style={{width:'calc(104% - 13px)'}}
										onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onInput={Main.mayuscula} onChange={handleInputChange} className={`requerido`}/>
									</Main.Form.Item> */}
								
									<Main.Form.Item name="ruc" label={<label style={{width: '120px'}}><span style={{color:'red'}}>*</span>RUC</label>}>
										<Main.Input style={{width:'calc(104% - 13px)'}}
										onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onChange={handleInputChange} className={`requerido`}/>
									</Main.Form.Item>
									
									<Main.Form.Item name="direccion" label={ <label style={{width: '120px'}}> <span style={{color: 'red'}}></span>Direccion</label>}>
										<Main.Input style={{width:'calc(104% - 13px)'}} 
										onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onChange={handleInputChange} />
									</Main.Form.Item>

									<Main.Form.Item name="latitud" label={<label style={{width: '120px'}}><span style={{color:'red'}}>*</span>Latitud</label>}>
										<Main.Input style={{width:'calc(104% - 13px)'}}
										onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onInput={Main.mayuscula} onChange={handleInputChange} className={`requerido`}/>
									</Main.Form.Item>

									<Main.Form.Item name="longitud" label={<label style={{width: '120px'}}><span style={{color:'red'}}>*</span>Longitud</label>}>
										<Main.Input style={{width:'calc(104% - 13px)'}}
										onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onInput={Main.mayuscula} onChange={handleInputChange} className={`requerido`}/>
									</Main.Form.Item>

									<Main.Form.Item name="telefono" label={<label style={{width: '120px'}}>Telefono</label>}>
										<Main.Input style={{width:'calc(104% - 13px)'}}
										onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onChange={handleInputChange}/>
									</Main.Form.Item>
								
									<Main.Form.Item name="correo" label={<label style={{width: '120px'}}>Correo</label>}>
										<Main.Input style={{width:'calc(104% - 13px)'}}
										onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onChange={handleInputChange}/>
									</Main.Form.Item>

							
									<Main.Form.Item name="timbrado" label={<label style={{width: '120px'}}><span style={{color:'red'}}>*</span>Timbrado</label>}>
										<Main.Input style={{width:'calc(104% - 13px)'}}
										onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} onChange={handleInputChange} className={`requerido`}/>
									</Main.Form.Item>

									<Main.Form.Item name="descripcion" label={ <label style={{width: '120px'}}>Descripción</label>}>
										 <Main.Input.TextArea
											maxLength={250}
											style={{ height: 120, resize: 'none'}}
											onChange={handleInputChange}
											onKeyDown={handleKeyDown}
											className={`requerido`}
										/>
									</Main.Form.Item>

								</Main.Col>

								<Main.Col span={4} />

							</Main.Row>
						</Main.Col>

						<Main.Col span={12} style={{textAlign:'center'}}>

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
		)
	});
export default View_Empresas;