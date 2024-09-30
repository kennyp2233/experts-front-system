import { baseUrl } from "./config.api";

export function getAerolineasJoinAll() {
    return fetch(baseUrl + '/aerolineas/joinAll', {
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

export function putAerolineasJoinAll(aerolinea: any) {
    return fetch(baseUrl + '/aerolineas/joinAll', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(aerolinea),
        credentials: 'include'
    })
        .then(response => response.json())
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function getAerolineas() {
    return fetch(baseUrl + '/aerolineas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function postAerolinea(aerolinea: any) {
    return fetch(baseUrl + '/aerolineas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(aerolinea),
        credentials: 'include'
    })
        .then(response => response.json())
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function putAerolinea(aerolinea: any) {
    return fetch(baseUrl + '/aerolineas', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(aerolinea),
        credentials: 'include'
    })
        .then(response => response.json())
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function deleteAerolineas(ids: any[]) {
    return fetch(baseUrl + '/aerolineas', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ids),
        credentials: 'include'
    })
        .then(response => response.json())
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function postAerolineaJoinAll(aerolinea: any) {
    return fetch(baseUrl + '/aerolineas/joinAll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(aerolinea),
        credentials: 'include'
    })
        .then(response => response.json())
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function deleteAerolineasJoinAll(ids: any[]) {
    return fetch(baseUrl + '/aerolineas/joinAll', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ids),
        credentials: 'include'
    })
        .then(response => response.json())
        .catch((err) => {
            console.log("ERROR", err);
        });
}
