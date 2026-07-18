import axios from "axios";

const axiosInstance = axios.create({

    baseURL:"https://api.coingecko.com/api/v3",

    headers:{
        "x-cg-demo-api-key":import.meta.env.VITE_COINGECKO_API_KEY
    }

})

export default axiosInstance;