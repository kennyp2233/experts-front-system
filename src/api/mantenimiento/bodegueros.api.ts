import { baseUrl } from "./config.api";


export async function getBodegueros(id?: number) {
    try {
        const res = await fetch(baseUrl + '/bodegueros' + (id ? `?id=${id}` : ''), {
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

export async function postBodeguero(bodeguero: any) {
    try {
        const res = await fetch(baseUrl + '/bodegueros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(bodeguero)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putBodeguero(bodeguero: any) {
    try {
        const res = await fetch(baseUrl + '/bodegueros', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(bodeguero)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteBodegueros(ids: number[]) {
    try {
        const res = await fetch(baseUrl + '/bodegueros', {
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

