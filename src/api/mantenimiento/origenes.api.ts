import { baseUrl } from "./config.api";

export async function getOrigenesJoinPaisesAduanas() {
    try {
        const res = await fetch(baseUrl + '/origenes/paises-aduanas', {
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

export async function getOrigenes() {
    try {
        const res = await fetch(baseUrl + '/origenes', {
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

export async function postOrigen(origen: any) {
    try {
        const res = await fetch(baseUrl + '/origenes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(origen)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putOrigen(origen: any) {
    try {
        const res = await fetch(baseUrl + '/origenes', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(origen)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteOrigenes(origenes: any[]) {
    try {
        const res = await fetch(baseUrl + '/origenes', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(origenes)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}
