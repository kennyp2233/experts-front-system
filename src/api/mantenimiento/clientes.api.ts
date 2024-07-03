import { baseUrl } from "./config.api"

export function getClientes() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/clientes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("DATA", data);
            return data;
        }).
        catch(err => {
            console.log("ERROR", err);
        });
}

export function postCliente(cliente: any) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(cliente)
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
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/clientes', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(cliente)
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
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/clientes', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(ids)
    })
        .then(res => res.json())
        .then(data => {
            return data;
        })
        .catch(err => {
            console.log("ERROR", err);
        });
}