import React, { memo }         from 'react';
import { HotTable, HotColumn } from '@handsontable/react';
import iconDelete              from '../assets/icons/delete.svg';
import iconsBinoculars         from '../assets/icons/icons-binoculars.svg';
import iconsDescarga           from '../assets/icons/icons-downloads-folder.png';
import iconsReport             from '../assets/icons/printer.png';
import iconsRefresh            from '../assets/icons/icons-refresh.svg';
import Main                    from '../Main';
import './hadsontable.css';

const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const diasSemanaCorto = ["Dom", "Lun", "Mar", "Mier", "Juev", "Vier", "Sab"];


const Hadsontable = memo((props) => {
  const currentColumn = React.useRef({index:0})

  const acciontButton =  React.useCallback((row,col)=>{
    let rowValue = props.hotRef.current.__hotInstance.getSourceDataAtRow(row)
    if(props.buttomAccion){      
      props.buttomAccion(rowValue,row,col,props.idComp);
    }
    // eslint-disable-next-line
  },[]);

  const customRenderer = (instance, TD, row, col, icon) => {
    const buttonIcon = TD.querySelector('button') || document.createElement('button');
    buttonIcon.className = `${props.columns[col].data}${props.idComp}`;
    buttonIcon.id = "button_iconsBinoculars";
    const rowIndex = props.hotRef.current.hotInstance.toPhysicalRow(row);
    buttonIcon.onclick = () => acciontButton(rowIndex, col);
    buttonIcon.innerHTML = `<img src=${icon === 'BI' ? iconsBinoculars : 
                                       icon === 'IM' ? iconsReport     : 
                                       icon === 'DE' ? iconsDescarga   :
                                       icon === 'BO' ? iconDelete      : 
                                       icon === 'RE' ? iconsRefresh    : ''
                                      } className="img-icon bi-${props.idComp}" width="18px" id="right-arrow"/>`;
    TD.appendChild(buttonIcon);
  };

  const handleAfterSelection = ( row, col) => {
    if(props.hotRef){
      const indiceFilaFuenteDeDatos = props.hotRef.current.hotInstance.toPhysicalRow(row !== -1 ? row : 0);
      const valor = props.hotRef.current.hotInstance.getSourceDataAtRow(indiceFilaFuenteDeDatos);
      if(props.setfocusRowIndex)props.setfocusRowIndex(valor,row,col,false);    
    }
  };
  const getHeaderAlignment = (col,TH) => {
    if(TH.colSpan > 1) TH.classList.add(`HEADER_${props.idComp}_${props.columns[col].data}`)
      switch (props.columns[col]?.className) {
      case "htLeft":
        return 'left';
      case "htCenter":
        return 'center';
      case "htRight":
        return 'right';
      default:
        return 'left';
    }
  };
  const removeColumnMenuButton = (col, TH) => {
    if (!props.columns[col].filter) {
      const button = TH.querySelector('.changeType');
      button && button.parentElement.removeChild(button);
    }

    if (['numeric', 'htRight'].includes(props.columns[col].type)) {
      const button = TH.querySelector('span');
      button && button.classList.add('withStyles');
    }
  };
  const customAfterGetColHeader = (col, TH) => {
    TH.style.textAlign = getHeaderAlignment(col,TH);
    removeColumnMenuButton(col, TH);
  };
  const beforeKeyDown = React.useCallback((event) => {
    if (props.onCellKeyDown) props.onCellKeyDown(event);
    if (props.navigationIndexes && props.navigationIndexes.length > 0) {
      if (event.keyCode === 13 || event.keyCode === 9){
        const hotInstance = props.hotRef?.current?.hotInstance;
        const selected = hotInstance?.getSelected()[0];
        event.preventDefault();
        navegacion(event,selected[0],selected[1]);
      } 
    }
    const { key } = event;
    if (key === ' ') {
      const selection = props.hotRef.current.hotInstance.getSelected();
      const [startRow, startColumn] = selection[0];
      const cellMeta = props.hotRef.current.hotInstance.getCellMeta(startRow, startColumn);
      if (props.columns[cellMeta.visualCol] &&  props.hotRef && props.columns[cellMeta.visualCol].type === 'radio') {
        // console.log(cellMeta);
        let opcionName = props.columns[cellMeta.visualCol].id_valor
        let values     = props.columns[cellMeta.visualCol].valor
        props.hotRef.current.hotInstance.view.settings.data[cellMeta.visualRow][opcionName] = values
        props.hotRef.current.hotInstance.setDataAtRowProp(cellMeta.visualRow,cellMeta.visualCol,values);
        props.hotRef.current.hotInstance.updateSettings({
          cellRow:cellMeta.visualRow,
        },);
      }
    }
    // eslint-disable-next-line
  }, [props.onCellKeyDown]);
  const navegacion = (e, rowIndex, columnIndex) => {
    if (props.navigationIndexes && props.navigationIndexes.length > 0) {
      const hotInstance = props.hotRef?.current?.hotInstance;
      // const totalColumns = hotInstance.countCols();
      const totalRows = hotInstance.countRows();
      const currentColumnIndex = props.navigationIndexes.indexOf(columnIndex);
  
      let newIndex;
  
      if (e.key === 'Enter' && e.shiftKey) {
        // Flecha izquierda
        newIndex = (currentColumnIndex - 1 + props.navigationIndexes.length) % props.navigationIndexes.length;
        rowIndex = newIndex < currentColumnIndex ? rowIndex - 1 : rowIndex;
      } else if (e.keyCode === 13 || e.keyCode === 9) {
        // Flecha derecha
        newIndex = (currentColumnIndex + 1) % props.navigationIndexes.length;
        rowIndex = newIndex < currentColumnIndex ? rowIndex + 1 : rowIndex;
      }
  
      // Verificar si la nueva fila es válida
      if (rowIndex < 0) {
        rowIndex = 0;
      } else if (rowIndex >= totalRows) {
        rowIndex = totalRows - 1;
      }

      // Verificar si la nueva columna es editable
      while (props.navigationIndexes.indexOf(props.navigationIndexes[newIndex]) === -1) {
        if (e.key === 'Enter' && e.shiftKey) {
          // Flecha izquierda
          newIndex = (newIndex - 1 + props.navigationIndexes.length) % props.navigationIndexes.length;
          rowIndex = newIndex < currentColumnIndex ? rowIndex - 1 : rowIndex;
        } else if (e.keyCode === 13 || e.keyCode === 9) {
          // Flecha derecha
          newIndex = (newIndex + 1) % props.navigationIndexes.length;
          rowIndex = newIndex < currentColumnIndex ? rowIndex + 1 : rowIndex;
        }
  
        if (rowIndex < 0) {
          rowIndex = 0;
        }
      }

      e.stopImmediatePropagation();      
      currentColumn.current.index = newIndex
      // Cambiar la celda seleccionada
      if(props.refhasontable){
        if(props.refhasontable?.current?.stopFoscus) props.refhasontable.current.stopFoscus = false
        else hotInstance?.selectCell(rowIndex, props.navigationIndexes[newIndex]);
      }else hotInstance?.selectCell(rowIndex, props.navigationIndexes[newIndex]);      
    }
  };
  const isValidDate = (dateString)=> {
    let valor = {isDate:false,date:''}

    const dateRegex = /^(\d{2})(\/)?(\d{2})\2(\d{4})$/;
    if (!dateRegex.test(dateString)) {
      return valor;
    }
  
    const [, day, , month, year] = dateString.match(dateRegex);
  
    const dateObject = new Date(`${year}-${month}-${day}T00:00:00`);
    
    
    if( dateObject.getDate()     === parseInt(day, 10)       &&
        dateObject.getMonth()    === parseInt(month, 10) - 1 &&
        dateObject.getFullYear() === parseInt(year, 10)){
  
      let date     = `${day}/${month}/${year}`
      valor.date   = date;     
      valor.isDate = true
    }
  
    return valor
  }
  const onBeforeChange = React.useCallback((changes,source) => {
    for (let i = 0; i < changes.length; i++) {
      // eslint-disable-next-line
      const [row, prop, oldVal, newVal] = changes[i];
      let columnIndex = props.hotRef?.current?.hotInstance.propToCol(prop)
      if (props.columns[columnIndex] && props.columns[columnIndex].type === 'numeric' && !Main._.isNumeric(newVal)) {
        // Rechazar el cambio si el nuevo valor no es numérico
        if(newVal !== "") return false;
      }else if(props.columns[columnIndex] && props.columns[columnIndex].type === 'date'){
        let valor = isValidDate(newVal)
        if(valor.isDate){
          changes[i][3] = valor.date;
        }else{
          return valor.date
        }        
      }else if(props.columns[columnIndex] && props.columns[columnIndex].type === 'select'){
        const item = props.columns[columnIndex].options.find(({ id }) => id === newVal);
        if(!item) return false
      }
    }
    
    if(props.handlechangeDet)props.handlechangeDet(changes);
    // eslint-disable-next-line
  },[props.handlechangeDet])

  const handleCellClick = React.useCallback((event, coords, td)=>{
    if(props.setClickCell)props.setClickCell(props.id,coords);

    const selection = props.hotRef.current.hotInstance.getSelected();
    const [startRow, startColumn] = selection[0];      
    if(startRow !== -1){
      const cellMeta = props.hotRef.current.hotInstance.getCellMeta(startRow, startColumn);
      if (props.columns[cellMeta.visualCol] &&  props.hotRef && props.columns[cellMeta.visualCol].type === 'radio') {      
        let opcionName = props.columns[cellMeta.visualCol].id_valor
        let values     = props.columns[cellMeta.visualCol].valor
        props.hotRef.current.hotInstance.view.settings.data[cellMeta.visualRow][opcionName] = values
        props.hotRef.current.hotInstance.setDataAtRowProp(cellMeta.visualRow,cellMeta.visualCol,values);
        props.hotRef.current.hotInstance.updateSettings({
          cellRow:cellMeta.visualRow,
        },);
      }
    }
    // eslint-disable-next-line
  },[props.setClickCell]);

  const renderRadioButton = (td, row, optionName,id_valor,hotInstance,className,columnIndex)=> {
    const selRadio   = td.querySelector('input[type="radio"]') ? td.querySelector('input[type="radio"]') : document.createElement('input') ; 
    selRadio.type    = 'radio';
    selRadio.id      = id_valor
    selRadio.name    = `selectedOptionRow${row}`;    
    selRadio.value   = optionName;
    selRadio.checked = hotInstance.getSourceDataAtRow(row)[id_valor] === optionName ? true : false;
    selRadio.classList.add(`custom-radio-button`)
    selRadio.addEventListener('focus', (event) => {
      event.stopPropagation();
    })
    selRadio.addEventListener('keydown', (event) => {
      if(['ArrowLeft','ArrowUp','ArrowRight','ArrowDown'].includes(event.key)) hotInstance.selectCell(row, columnIndex);
    })
    td.classList.add(`custom-radio-button_${className}`)
    td.appendChild(selRadio);
  }
  // MULTIPLE HEADER
  const getkeysValue = (value)=>{
    var arrayValue = []
    if(value.length > 0){
      // eslint-disable-next-line
      value.map((items)=>{
        let keys = items.title;
        arrayValue.push(keys);
      })
    }
    return arrayValue;
  }
  const generateNestedHeaders = ()=>{
    var rowArray = []
    var banArray = false;
    // eslint-disable-next-line
    props.columns.map((itemSubTitle)=>{
      if(itemSubTitle.subTitle){
        banArray      = true;
        if(itemSubTitle.subTitle.length > 0){
          rowArray.push(itemSubTitle.subTitle)
        }
      }
    });

    if(banArray){
      let keyColumn = getkeysValue(props.columns)
      rowArray.push(keyColumn);
    }

    if(!banArray)return false
    else return rowArray;
  }
  const nestedHeaders = props.multipleHeader ? generateNestedHeaders() : false;  
  
  return (
    <div className={`componente-handsontable handsontable-large`}>
      <HotTable
        ref={props.hotRef}
        data={props.hotRef?.current?.hotInstance ? props.hotRef?.current?.hotInstance.getSourceData() : []}
        height={props.height}
        copyPaste={true}
        trimRows={true}
        snapToBottom={true}
        enterBeginsEditing={false}
        autoWrapRow={true}
        autoWrapCol={false}
        dragToScroll={true}
        language="es-MX"
        stretchH={'all'}
        filters={true}
        contextMenu={['alignment','undo','copy']}
        dropdownMenu={['filter_by_value', 'filter_action_bar']}
        afterDropdownMenuShow={(instance) => instance.hot.getPlugin('filters').components.get('filter_by_value').elements[0].onClearAllClick({ preventDefault: () => {} })}
        colHeaders={props.columns.map((col) => `<div class="handsontable_${col.className}">${col.title}</div>`)}
        enterMoves={() => ({ row: 0, col: 1 })}        
        afterOnCellMouseDown={handleCellClick}
        afterGetColHeader={customAfterGetColHeader}
        beforeKeyDown={beforeKeyDown}
        beforeChange={onBeforeChange}
        afterSelection={handleAfterSelection}
        nestedHeaders={nestedHeaders}
        
        licenseKey="non-commercial-and-evaluation"
      >
        {props.columns.map((col, index) => (
          
          col.type === 'date' ?
            <HotColumn
              key={index}
              data={col.data}
              type={col.type}
              title={col.title}
              width={col.width}
              className={`${col.className}`}
              readOnly={col.readOnly}
              correctFormat={true}
              columnSorting={col.sorter ? { headerAction: true } : { headerAction: false }}
              dateFormat="DD/MM/YYYY" 
              allowHtml={false}
              datePickerConfig={{
                showOnFocus: false,
                showWeekNumber: false,
                i18n: {
                  previousMonth: 'Mes Anterior',
                  nextMonth: "Próximo Mes",
                  months: meses,
                  weekdays: ["Domingo", "lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado"],
                  weekdaysShort: diasSemanaCorto                  
                },
                onOpen:()=>{
                  const datePicker = document.querySelector('.htDatepickerHolder');
                  if (datePicker) datePicker.classList.add(`${props.id}_htDatepickerHolder`);
                }
              }}
            />
            : col.type === 'numeric' ?
              <HotColumn
                key={index}
                data={col.data}
                type={col.type}
                title={col.title}
                width={col.width}
                className={col.className}
                readOnly={col.readOnly}
                columnSorting={col.sorter ? { headerAction: true } : { headerAction: false }}
                numericFormat={ col.format ?  col.format : { pattern:'0,0',culture:'de-DE' }}
              />
            : col.type === 'button' ?
              <HotColumn
                key={index}
                data={col.data}
                title={col.title}
                width={col.width}
                className={col.className}
                renderer={(instance, TD, row, colum) => customRenderer(instance, TD, row, colum, col.icon)}
                readOnly={true}
              />
            : col.type === 'radio' ?
              <HotColumn
                key={index}
                data={col.data}
                title={col.title}
                width={col.width}
                className={col.className}
                renderer={(instance, TD, row) => renderRadioButton(TD, row, col.valor, col.id_valor, instance,col.className,index)} // Usar col.optionName en lugar de col.value
                readOnly={true}
              />
            :
              <HotColumn
                key={index}
                data={col.data}
                title={col.title}
                type={col.type}
                width={col.width}
                readOnly={col.readOnly || false}
                // eslint-disable-next-line
                className={`${col.className, col.textWrap ? 'unwraptext' : col.className}`}
                checkedTemplate  ={col?.checkbox?.length > 0 ? col?.checkbox[0] : ''}
                uncheckedTemplate={col?.checkbox?.length > 0 ? col?.checkbox[1] : ''}
              />
        ))}
      </HotTable>
    </div>
  );
});

export default Hadsontable;