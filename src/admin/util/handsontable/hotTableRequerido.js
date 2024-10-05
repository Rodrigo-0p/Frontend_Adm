export const hotTableRequerido = async (ref,formName,importa_insertDefault = false)=>{
  var Addband = false
  var columnaRequerido = [] 
  if(ref.columna[formName]){
    var rowDet = ref.grid[formName].current.__hotInstance.getSourceData() !== undefined ? ref.grid[formName].current.__hotInstance.getSourceData() : []

    for (let index = 0; index < ref.columna[formName].length; index++) {
      const element = ref.columna[formName][index];
      if(element.requerido){

        if(importa_insertDefault){

          for (let i = 0; i < rowDet.length; i++) {
            const items = rowDet[i];
            if(items[element.data]){              
              if(items[element.data] === '' && !items?.insertDefault){
                Addband  = true;
                let IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);
                columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn}
                break
              }
            }else if( (items[element.data]?.length < 0   || 
                       items[element.data] === undefined || 
                       items[element.data] === null      || 
                       items[element.data] === ""          )  && !items?.insertDefault){//vtmonocr
              Addband  = true;
              let IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);              ;
              columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn}
              break
            }
          }

        }else{

          for (let i = 0; i < rowDet.length; i++) {
            const items = rowDet[i];
            
            if(items[element.data] === ''){
              Addband  = true;
              let IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);
              columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn}
              break          
            }else if( (items[element.data]?.length < 0  || 
                      items[element.data] === undefined || 
                      items[element.data] === null      || 
                      items[element.data] === ""        ) && !items.insertDefault){//vtmonocr
              Addband  = true;
              var IndexColumn  =  ref.grid[formName].current.hotInstance.propToCol(element.data);              ;
              columnaRequerido = {'label':element.title,'ID':element.data, indexRow:i, indexComun:IndexColumn}
              break
            }
          }
        }
       
        if(Addband) break
      }
    }
  }
  return {Addband, columnaRequerido}
}