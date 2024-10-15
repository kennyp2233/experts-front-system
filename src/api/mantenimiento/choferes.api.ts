import { baseUrl } from "./config.api";

export async function getChoferes() {
    try {
        const res = await fetch(baseUrl + '/choferes', {
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

export async function postChofer(chofer: any) {
    try {
        const res = await fetch(baseUrl + '/choferes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chofer),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putChofer(chofer: any) {
    try {
        const res = await fetch(baseUrl + '/choferes', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chofer),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteChoferes(choferes: number[]) {
    try {
        const res = await fetch(baseUrl + '/choferes', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(choferes),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}
