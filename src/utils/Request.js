import axios from 'axios'
import Qs from 'qs'
const token = localStorage.getItem('token');
class Request {
    constructor(params){
        console.log(params)
        this.options =  Object.assign({},params);
    }

    add(){
        const params = this.options.params,
              url = this.options.url;
        return axios.post(url,params)
    }

    delete(){
        const params = this.options.params,
              url = this.options.url;
        return axios.delete(url,params)
    }

    update(){
        const params = this.options.params,
            url = this.options.url;
        return axios.put(url,params)
    }

    select(){
        const params = this.options.params,
            url = this.options.url;
        return axios.get(url,{
            params: params
        })
    }

}

export default Request
