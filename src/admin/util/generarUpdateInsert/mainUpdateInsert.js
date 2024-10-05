import Main from "../Main";

export const GenerarUpdateInsert = async (rowData = [],url = null, key = '', updateDependencia = [], keyNotNull = [] ,nro_serial = false, cod_cabecera = [], rowCabecera = [])=>{
  var updateInsert  = [];
  var rowsAux       = [];
  var update        = false
  var insert        = false

  var codigo        = null;
  var contentInsert = rowData.filter(item => item.inserted === true);

  if (contentInsert.length > 0) {
    if (url !== null) {
        try {
          codigo = await Main.Request(url, 'GET', {}).then(response => {
            return response.data;
          })        
        } catch (error) {
          console.log(error);
        }
        codigo = codigo[0].id
      } else if (nro_serial) { //En caso que ya sepa el nro que persigue.
        codigo = nro_serial 
      }
    }


  for (let index = 0; index < rowData.length; index++) {
    const item = rowData[index];
    if (item.updated === true) {
      update = true
      if (keyNotNull.length > 0) {
        for (let i = 0; i < keyNotNull.length; i++) {
          const element = keyNotNull[i];
          if ((item[element] !== undefined && item[element] !== null && item[element] !== "")) {
            updateInsert.push(item);
          }
        }
      }
    }

    if (item.inserted === true && !item[key] && (url !== null || nro_serial !== false)) {
      insert = true;
      item[key] = codigo;
      codigo++;       
    }

    if (item.inserted === true) {
      insert = true;
      if (keyNotNull.length > 0) {
        for (let i = 0; i < keyNotNull.length; i++) {
          const element = keyNotNull[i];
          if ((item[element] !== undefined && item[element] !== null && item[element] !== "")) {            
              // eslint-disable-next-line 
              let datosCabecera = await rowCabecera.filter((index) => { if (index.key_cab == item.idCabecera) return index });
              if (datosCabecera.length > 0 && cod_cabecera.length > 0) {                
                for (let key_cab = 0; key_cab < cod_cabecera.length; key_cab++) {
                  let keyCab = cod_cabecera[key_cab];
                  item[keyCab] = datosCabecera[0][keyCab]
                }                
              }
            updateInsert.push(item);
          }
        }
      }
    }

    if (rowData.length > 1) {
      if (!item.insertDefault) {
        rowsAux.push(Main._.omit(item, 'updated', 'inserted','insertDefault'));
        for (let i = 0; i < updateDependencia.length; i++) {
          var ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
          var ObjectValueKey = Object.keys(updateDependencia[i])[0];
          if (rowsAux[index]) {
            if (rowsAux[index][ObjectKey] !== rowsAux[index][ObjectValueKey]) {
              rowsAux[index][ObjectKey] = rowsAux[index][ObjectValueKey];
            }
          }
        }
      }
    } else {
      rowsAux.push(Main._.omit(item, 'updated', 'inserted','insertDefault'));
      for (let i = 0; i < updateDependencia.length; i++) {
        let ObjectKey = updateDependencia[i][Object.keys(updateDependencia[i])[0]];
        let ObjectValueKey = Object.keys(updateDependencia[i])[0];
        if (rowsAux[index]) {
          if (rowsAux[index][ObjectKey] !== rowsAux[index][ObjectValueKey]) {
            rowsAux[index][ObjectKey] = rowsAux[index][ObjectValueKey];
          }
        }
      }
    }
  }

  return {
    updateInsert: updateInsert,
    rowsAux     : rowsAux,
    actualizar  : update,
    insertar    : insert,
  }
  
}



  