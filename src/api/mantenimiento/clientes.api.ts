import { baseUrl } from "./config.api"

export async function getClientes() {
    try {
        const res = await fetch(baseUrl + '/clientes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const data = await res.json();
        console.log("DATA", data);
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function postCliente(cliente: any) {
    try {
        const res = await fetch(baseUrl + '/clientes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putCliente(cliente: any) {
    try {
        const res = await fetch(baseUrl + '/clientes', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteClientes(ids: number[]) {
    try {
        const res = await fetch(baseUrl + '/clientes', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ids),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}
