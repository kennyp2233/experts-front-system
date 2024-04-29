import { baseUrl } from "./config.api";

export function getPaises() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/paises', {
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

export function getPaisesJoinAcuerdos() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/paises-acuerdos', {
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

export function postPais(pais: any) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/paises', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(pais)
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function putPais(pais: any) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/paises', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(pais)
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function deletePaises(paises: any[]) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/paises', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(paises)
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}