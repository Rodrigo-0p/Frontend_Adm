import axios from "axios";
export const Request    = async(url, method, data ) =>{
    try {
        return await axios({
            method: method,
            url: process.env.REACT_APP_BASEURL + url,
            data: data,
            headers:{
                     'auth_token': sessionStorage.getItem("token"),
                     'auth-user' : sessionStorage.getItem("usuario"),
                     'hash'      : sessionStorage.getItem("hash"),
                    },
        }).then( response =>{
            return response;
        })    
    } catch (error) {
        console.log(error);
        return {data:[]};
    }
    
}
export const RequestImg = async(url, method, data ) =>{
    try {
        var formData = new FormData();
        formData.append("image",data);
        return await axios({
            method: method,
            url: process.env.REACT_APP_BASEURL + url,
            data: formData,
            headers: {
                auth_token    : sessionStorage.getItem("token"),
                'Content-Type': 'multipart/form-data',
                auth_user     : sessionStorage.getItem("cod_usuario"),
                hash          : sessionStorage.getItem("hash"),
            }
        })
        .then( response =>{
            return response;
        })    
    } catch (error) {        
        console.log(error);
        return {data:[]}
    }
}