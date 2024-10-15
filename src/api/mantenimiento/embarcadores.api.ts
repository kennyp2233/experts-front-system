import { baseUrl } from "./config.api";

export async function getEmbarcadores() {
    try {
        const res = await fetch(baseUrl + '/embarcadores', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function postEmbarcador(embarcador: any) {
    try {
        const res = await fetch(baseUrl + '/embarcadores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(embarcador),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putEmbarcador(embarcador: any) {
    try {
        const res = await fetch(baseUrl + '/embarcadores', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(embarcador),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteEmbarcadores(ids: number[]) {
    try {
        const res = await fetch(baseUrl + '/embarcadores', {
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
