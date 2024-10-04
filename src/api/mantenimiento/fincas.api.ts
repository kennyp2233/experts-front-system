import { baseUrl } from "./config.api";

export function getFincasJoinAll() {
    return fetch(baseUrl + '/fincas/fincasJoinAll', {
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

export function postFinca(finca: any) {
    return fetch(baseUrl + '/fincas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(finca),
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function putFinca(finca: any) {
    return fetch(baseUrl + '/fincas', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(finca),
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function deleteFincas(fincas: number[]) {
    return fetch(baseUrl + '/fincas', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fincas),
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}
