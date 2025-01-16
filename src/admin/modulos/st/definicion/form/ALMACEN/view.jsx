import  * as React from 'react';
import Main        from '../../../../../util/Main';
import mainColumn  from './column/mainModal'

const View_ALMACEN = React.memo((props) => {
  
  const maxFocus = [{
    id:props.idComp,
    hasta:"estado" ,
    newAddRow:true ,    
  }];


  return (
    <Main.Row gutter={[8,2]}>
       <Main.Col span={24} style={{padding:'20px 90px'}} >
          <Main.HandsontableGrid
            refData={props.refDet}
            columns={mainColumn.columnDet}
            FormName={props.FormName}
            idComp={props.idComp}// id del componente
            height={410}
            maxFocus={maxFocus}
            setLastFocusNext={props.setLastFocusNext}
            columnModal={mainColumn.columnModalDet}
            columnNavigationEnter={mainColumn.nextEnter}
            setClickCell={props.setClickCell}
            setfocusRowIndex={props.setfocusRowIndex}
          />         
        </Main.Col>
        <Main.Col span={24} >
          <div className={`pagina_${props.FormName}`}>
            Registro: <span id="indice"></span> / <span id="total_registro"></span> <span id="mensaje"></span>
          </div>
        </Main.Col>
    </Main.Row>
  );
});

export default View_ALMACEN;