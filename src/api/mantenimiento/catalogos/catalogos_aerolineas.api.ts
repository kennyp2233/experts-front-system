import { baseUrl } from "../config.api";

export function getCatalogosAerolineasModo() {
    return fetch(baseUrl + '/catalogos/aerolineas/modo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((data) => { return data })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function getCatalogosAerolineasMult() {
    return fetch(baseUrl + '/catalogos/aerolineas/multiplicador', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((data) => { return data })
        .catch((err) => {
            console.log("ERROR", err);
        });
}
