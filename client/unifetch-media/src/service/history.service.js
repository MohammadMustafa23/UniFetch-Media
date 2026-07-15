import api from './axios.js'

export function getHistory(params = {}) {return api.get("/history/get", {params});
}