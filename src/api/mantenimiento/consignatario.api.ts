import { baseUrl } from "./config.api";

export function getConsignatarioJoinAll() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/consignatariosJoinAll', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
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
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/consignatariosJoinAll', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
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
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/consignatariosJoinAll', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
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
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/consignatariosJoinAll', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(ids)
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