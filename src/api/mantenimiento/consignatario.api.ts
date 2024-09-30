import { baseUrl } from "./config.api";

export function getConsignatarioJoinAll() {
    return fetch(baseUrl + '/consignatariosJoinAll', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("DATA", data);
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function postConsignatarioJoinAll(data: any) {
    return fetch(baseUrl + '/consignatariosJoinAll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("DATA", data);
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function updateConsignatarioJoinAll(data: any) {
    return fetch(baseUrl + '/consignatariosJoinAll', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("DATA", data);
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function deleteConsigantarioJoinAll(ids: any[]) {
    return fetch(baseUrl + '/consignatariosJoinAll', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids),
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("DATA", data);
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}
