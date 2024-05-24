import { baseUrl } from "./config.api";

export function getAerolineasJoinAll() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/aerolineas/joinAll', {
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

export function getAerolineas() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/aerolineas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        }
    })
        .then(response => response.json())
        .catch((err) => {
            console.log("ERROR", err);
        });

}

export function postAerolinea(aerolinea: any) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/aerolineas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(aerolinea)
    })
        .then(response => response.json())
        .catch((err) => {
            console.log("ERROR", err);
        });

}

export function putAerolinea(aerolinea: any) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/aerolineas', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(aerolinea)
    })
        .then(response => response.json())
        .catch((err) => {
            console.log("ERROR", err);
        });

}

export function deleteAerolineas(ids: any[]) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/aerolineas', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(ids)
    })
        .then(response => response.json())
        .catch((err) => {
            console.log("ERROR", err);
        });
}
