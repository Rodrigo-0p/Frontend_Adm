import React, { memo } from 'react';
import Handsontable   from 'handsontable';
import Input          from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon     from '@mui/icons-material/Search';

import 'handsontable/dist/handsontable.full.min.css';
import 'handsontable/dist/handsontable.full.css';
import './ModalHadsontable.css';

const ModalHadsontable = memo(({ refData = null, columns=[] , data        ,
                                 onChange      , eventoClick, idComp = '' }) => {
  const hotRef      = React.useRef();
  const inputFocus  = React.useRef();

  React.useEffect(() => {
  
    let beforeKeyDownHook = null;

    const hotElement = hotRef.current;
    const hot = new Handsontable(hotElement, {
      data: [],
      columns:columns,
      colHeaders: columns.map(col => { return `<div class="handsontable_${col.className}" >${col.title}<div/> ` }),
      contextMenu: false,
      readOnly: true,
      copyPaste: true,
      trimRows: true,
      snapToBottom: true,
      enterBeginsEditing: false,
      autoWrapRow: true,
      autoWrapCol: false,
      dragToScroll: true,
      outsideClickDeselects: false,
      selectionMode: 'none',
      disableVisualSelection: 'auto',// Deshabilita la selección visual
      viewportColumnRenderingOffset: 'auto',
      stretchH: 'all',
      className: `handsontable_${idComp}`,
      afterChange:afterChange,

      height: 190,
      viewportRowRenderingOffset: 350,
      enterMoves: { row: 0, col: 0 },

      afterOnCellMouseDown: handleCellClick,      
      licenseKey: 'non-commercial-and-evaluation',
    });

    if (hotRef) {
      setTimeout(()=>{
        hot.loadData(data)
      },12)
      refData.current = hot;
    }

    setTimeout(()=>{
      let input = document.getElementsByClassName('input-change')[0].querySelector('input')
      input.value = ''
      input.focus()
    },50)

    beforeKeyDownHook = async (e) => {
      if (e?.keyCode === 13) {
        e?.stopImmediatePropagation();
        e?.preventDefault()
        let valor = await refData?.current?.getSelected()[0][0];
        clickEvent(refData?.current?.getSourceDataAtRow(valor))
        hot.deselectCell();
        hot.removeHook("beforeKeyDown", beforeKeyDownHook);
      }
    }

    hot.addHook("afterSelection", (r, c) => {
      hot.addHook("beforeKeyDown", beforeKeyDownHook);
    });


    inputFocus.current.querySelector('input').value = ''
    setTimeout(()=>{
      inputFocus.current.querySelector('input').focus()
    },100)
    return () => {hot.destroy();};
    // eslint-disable-next-line
  }, [data]);

  const afterChange = (changes, source)=>{
    setTimeout(()=>{      
      let row = document.getElementById(`no-data-message`);
      if (!refData.current.getSourceData()?.length){
        row.style.visibility = 'visible';
      }else{
        row.style.visibility = 'hidden';
      } 
    },100)  
  } 
  const clickEvent = (e) => {
    eventoClick(e)    
  }
  const InputOnkeyDown = (e) => {
    if (e.keyCode === 13) {
      let valor = refData?.current?.getSelected()
      if (valor === undefined) clickEvent(refData?.current?.getSourceDataAtRow(0) ? refData?.current?.getSourceDataAtRow(0) : []);
      else clickEvent(refData?.current?.getSourceDataAtRow(valor[0][0]))
    } else if (e.keyCode === 40) {
      setTimeout(() => {
        refData?.current?.selectCell(0, 0);
      })
    }

  }
  const handleCellClick = (event, coords, td) => {
    var now = new Date().getTime();
    if (!(td.lastClick && now - td.lastClick < 200)) {
      td.lastClick = now;
      return; // no double-click detected
    }
    let valor = refData?.current?.getSourceDataAtRow(coords.row)
    clickEvent(valor)
  }

  return (
    <div>
      <div className='buscador-input'>
        <Input className='input-change'
          autoComplete="off"
          ref={inputFocus}
          onKeyDown={InputOnkeyDown}
          onChange={onChange}
          startAdornment={
            <InputAdornment position="start" >
              <SearchIcon />
            </InputAdornment>
          } />
      </div>

      <div ref={hotRef} />

      <div id="no-data-message" style={{visibility:'hidden'}}>No hay datos disponibles</div>
    </div>
  );
});

export default ModalHadsontable;