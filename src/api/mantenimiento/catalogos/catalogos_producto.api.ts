import { baseUrl } from "../config.api";

export function getCatalogosProductoOpciones() {
    return fetch(baseUrl + '/catalogos/productos/opciones', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
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

export function getCatalogosProductoUnidad() {
    return fetch(baseUrl + '/catalogos/productos/unidad', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
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
