import { baseUrl } from "../config.api";

export function getCatalogosAerolineasModo() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/catalogos/aerolineas/modo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => res.json())
        .then((data) => { return data })
        .catch((err) => {
            console.log("ERROR", err);
        });

}

export function getCatalogosAerolineasMult() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/catalogos/aerolineas/multiplicador', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    })
        .then((res) => res.json())
        .then((data) => { return data })
        .catch((err) => {
            console.log("ERROR", err);
        });

}



