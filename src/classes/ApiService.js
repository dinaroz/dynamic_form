import axios from 'axios'

export default class ApiService {
    Url = "";

    constructor(url) {
        this.Url = url;
    }

    async getRequest() {
        try {
            const response = await axios.get(this.Url, {})
            return response.data;
        }catch(e){
            return false;
        }
    }
    async postRequest(data) {
        console.log(data)
        try {
            const response = await axios.post(this.Url, data)
            return response.data;
        }catch(e){
            return false;
        }
    }

}