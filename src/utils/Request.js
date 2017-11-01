import axios from 'axios'
import Qs from 'qs'
const token = localStorage.getItem('token')
const headers = {
    'access-token': token
}

class Request {
    constructor(params){
        console.log(params)
        this.options =  Object.assign({},params);
    }

    add(){
        const params = this.options.params,
              url = this.options.url;
        return axios.post(url,params,{headers:headers})
    }

    delete(){
        const params = this.options.params,
              url = this.options.url;
        return axios.delete(url,params,{headers:headers})
    }

    update(){
        const params = this.options.params,
            url = this.options.url;
        return axios.put(url,params,{headers:headers})
    }

    select(){
        const params = this.options.params,
            url = this.options.url;
        return axios.get(url,params,{headers:headers})
    }

}

export default Request