import { baseUrl } from "../config.api";


export function getCatalogosEmbarqueCarga() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/catalogos/tipos-embarque/carga', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function getCatalogosEmbarqueEmbalaje() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/catalogos/tipos-embarque/embalaje', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}