import { baseUrl } from "./config.api";

export async function getFincasJoinAll() {
    try {
        const res = await fetch(baseUrl + '/fincas/fincasJoinAll', {
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

export async function postFinca(finca: any) {
    try {
        const res = await fetch(baseUrl + '/fincas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finca),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putFinca(finca: any) {
    try {
        const res = await fetch(baseUrl + '/fincas', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finca),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteFincas(fincas: number[]) {
    try {
        const res = await fetch(baseUrl + '/fincas', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(fincas),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}
