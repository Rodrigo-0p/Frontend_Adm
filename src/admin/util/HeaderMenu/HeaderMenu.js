import React, { memo }   from 'react';
import { Button }        from 'antd';
import nuevo             from '../assets/icons/add.svg';
import deleteIcon        from '../assets/icons/delete.svg';
import guardarIcon       from '../assets/icons/diskette.svg';
import cancelarEdit      from '../assets/icons/iconsCancelar.svg';
import next_left         from '../assets/icons/iconsLeft.png';
import doble_next_left   from '../assets/icons/doubleLeft.png';
import doble_next_right  from '../assets/icons/doubleRight.png';
import next_right        from '../assets/icons/nextRight.png';
import printer           from '../assets/icons/printer.png';
import printerPdf        from '../assets/icons/pdf.png';
import excel             from '../assets/icons/excel.svg';
import expotTxt          from '../assets/icons/txt.svg';
import iconBuscar        from '../assets/icons/iconsDetective.png';
import iconBinacular     from '../assets/icons/detective.png';
import atras             from '../assets/icons/logout.svg';
// import Main              from '../Main';

import './headerMenu.css';

const HeaderMenu = memo(({AddForm, SaveForm , deleteRows    , cancelar     , 
                          NavigateArrow     , refs          , formName     ,
                          reporte           , funcionBuscar , 
                          buttonBuscar      , activateAtras , funcionAtras ,
                          excelfuncion      , addButton     , textfuncion  , 
                          pdfreporte
                         }) => {
    

    const funcion_cancelar = async ()=>{
        cancelar()
    }
    // let Permiso  = Main.VerificaPermiso(formName)

    return (
        <div className="paper-header-menu">
             {  AddForm
                 ?
                 <Button
                    icon={<img alt="add" src={nuevo} width="15"/>}         
                    className="paper-header-menu-button"
                    // disabled={Permiso.insert === 'S' ? false : true}
                    onClick={AddForm}
                />
                : null
            }
            {
                SaveForm ?
                    <Button
                        icon={<img alt="save" src={guardarIcon} width="15" />}
                        className="paper-header-menu-button"
                        ref={refs.ref}
                        onClick={SaveForm}
                    />
                : null
            }
            {
                deleteRows ?
                <Button 
                    style={{marginRight:'3px'}}
                    icon={<img alt='delete' src={deleteIcon} width="15"/>}
                    className="paper-header-menu-button" 
                    // disabled={Permiso.delete === 'S' ? false : true}
                    onClick={deleteRows}
                />
                : null 
            }
            {
                NavigateArrow ?
                <>
                    <Button
                        id="left-arrow"
                        icon={<img alt='left' src={doble_next_left} width="15"  id="left-arrow"/>}
                        className="paper-header-menu-button"
                        onClick={()=>NavigateArrow('next-left')}
                    />
                    <Button
                        id="left-arrow"
                        icon={<img alt='left-row' src={next_left} width="15"  id="left-arrow"/>}
                        className="paper-header-menu-button"
                        onClick={()=>NavigateArrow('left')}
                    />
                    <Button 
                        id="right-arrow"
                        icon={<img alt='right' src={next_right} width="15" id="right-arrow"/>}
                        className="paper-header-menu-button"
                        onClick={()=>NavigateArrow('right')}
                    />
                    <Button 
                        id="right-arrow"
                        icon={<img alt='right-arrow' src={doble_next_right} width="15" id="right-arrow"/>}
                        className="paper-header-menu-button"
                        onClick={()=>NavigateArrow('next-right')}
                    />
                </>
                :
                null
            }
            {
                funcionBuscar ?
                <>
                    <Button 
                        id="buscador-f7"
                         // eslint-disable-next-line
                        icon={<img src={iconBinacular} width="15" id="right-arrow"/>}
                        className={`paper-header-menu-button ${formName}_prepare_search`} 
                        onClick={()=>funcionBuscar(false)}
                    />
                    <Button 
                        id="buscador-f7"
                        // eslint-disable-next-line
                        icon={<img src={iconBuscar} width="15" id="right-arrow"/>}
                        className={`button-buscar-ocultar-visible paper-header-menu-button ${formName}_search`}                                     
                        onClick={()=>funcionBuscar(true)}
                    />                    
                </>
                : null
            }
                            
            {
                reporte ? 
                    <Button 
                        style={{marginLeft:'10px'}}
                        icon={<img alt='' src={printer} width="15" id="right-arrow"/>}
                        className="paper-header-menu-button" 
                        onClick={reporte}
                    />
                : null
            }
            {
                pdfreporte ?
                    <Button 
                        style={{marginLeft:'10px'}}
                        icon={<img alt='' src={printerPdf} width="15" id="right-arrow"/>}
                        className="paper-header-menu-button" 
                        onClick={pdfreporte}
                    />
                : null
            }
            {
                excelfuncion ?
                    <Button 
                        style={{marginLeft:'3px'}}
                        icon={<img alt='' src={excel} width="15px"/>} 
                        className="paper-header-menu-button"
                        onClick={excelfuncion}
                    />
                : null
            }
            {
                textfuncion ?
                    <Button 
                        style={{marginLeft:'3px'}}
                        icon={<img alt='' src={expotTxt} width="15px"/>} 
                        className="paper-header-menu-button"
                        onClick={textfuncion}
                    />
                : null
            }
            {
                activateAtras === false || activateAtras === undefined ? null : 
                <Button 
                    id="buscador-f7"
                    icon={<img alt='' src={atras} width="15" id="right-arrow"/>}
                    className="paper-header-menu-button" 
                    onClick={()=>funcionAtras(buttonBuscar)}
                />
            }
            <Button 
                style={{marginLeft:'10px'}}
                icon={<img alt='' src={cancelarEdit} width="15"/>}
                className={`paper-header-menu-button ${formName}-cancelar button-cancelar-ocultar-visible-grid stylesCancelar`}
                onClick={funcion_cancelar}
            />
            {
                addButton ? addButton : null
            }
      </div>
    );
});

export default HeaderMenu;