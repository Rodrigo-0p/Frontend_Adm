var claseOcultarMostrar = "button-buscar-ocultar-visible"

export const setBuscar = (forname,e) => {
  if(e){
    document.getElementsByClassName(`${forname}_search`)[0].classList.remove(claseOcultarMostrar)    
    document.getElementsByClassName(`${forname}_prepare_search`)[0].classList.add(claseOcultarMostrar)    
  }else{
    document.getElementsByClassName(`${forname}_search`)[0].classList.add(claseOcultarMostrar)    
    document.getElementsByClassName(`${forname}_prepare_search`)[0].classList.remove(claseOcultarMostrar)
  }
  
};

export const getViewBuscar = (forname)=>{
  let valor = document.getElementsByClassName(`${forname}_search`);  
  if(valor){
    return (!valor[0].classList.value.includes([claseOcultarMostrar]))
  }
}