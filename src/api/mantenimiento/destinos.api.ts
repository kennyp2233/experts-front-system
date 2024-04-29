import { baseUrl } from "./config.api";

export function getDestinosJoinPaisesAduanas() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/destinos/paises', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function postDestino(destino: any) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/destinos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(destino)
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function putDestino(destino: any) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/destinos', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(destino)
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function deleteDestinos(destino: any[]) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/destinos', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(destino)
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}
