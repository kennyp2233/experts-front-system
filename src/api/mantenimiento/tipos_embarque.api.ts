import { baseUrl } from "./config.api";

export function getTiposEmbarqueJoinAll() {
    return fetch(baseUrl + '/tipos_embarque', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // Esto enviará automáticamente las cookies, incluyendo el JWT
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

export function putTiposEmbarque(data: any) {
    return fetch(baseUrl + '/tipos_embarque', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Esto enviará automáticamente las cookies, incluyendo el JWT
        body: JSON.stringify(data)
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

export function postTiposEmbarque(data: any) {
    return fetch(baseUrl + '/tipos_embarque', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Esto enviará automáticamente las cookies, incluyendo el JWT
        body: JSON.stringify(data)
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

export function deleteTiposEmbarque(ids: number[]) {
    return fetch(baseUrl + '/tipos_embarque', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // Esto enviará automáticamente las cookies, incluyendo el JWT
        body: JSON.stringify(ids)
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
