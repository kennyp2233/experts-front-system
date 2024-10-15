import { baseUrl } from "./config.api";

export async function getSubAgencias() {
    try {
        const res = await fetch(baseUrl + '/subagencias', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function postSubAgencia(subagencia: any) {
    try {
        const res = await fetch(baseUrl + '/subagencias', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(subagencia)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putSubAgencia(subagencia: any) {
    try {
        const res = await fetch(baseUrl + '/subagencias', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(subagencia)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteSubAgencias(ids: number[]) {
    try {
        const res = await fetch(baseUrl + '/subagencias', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(ids)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}



