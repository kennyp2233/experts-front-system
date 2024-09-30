import { baseUrl } from "./config.api"

export function getClientes() {
    return fetch(baseUrl + '/clientes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            console.log("DATA", data);
            return data;
        })
        .catch(err => {
            console.log("ERROR", err);
        });
}

export function postCliente(cliente: any) {
    return fetch(baseUrl + '/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente),
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log("ERROR", err);
        });
}

export function putCliente(cliente: any) {
    return fetch(baseUrl + '/clientes', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cliente),
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log("ERROR", err);
        });
}

export function deleteClientes(ids: number[]) {
    return fetch(baseUrl + '/clientes', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ids),
        credentials: 'include'
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log("ERROR", err);
        });
}
