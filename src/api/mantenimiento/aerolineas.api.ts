import { baseUrl } from "./config.api";

export async function getAerolineasJoinAll() {
    try {
        const res = await fetch(baseUrl + '/aerolineas/joinAll', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putAerolineasJoinAll(aerolinea: any) {
    try {
        const response = await fetch(baseUrl + '/aerolineas/joinAll', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aerolinea),
            credentials: 'include'
        });
        return await response.json();
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function getAerolineas() {
    try {
        const response = await fetch(baseUrl + '/aerolineas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        return await response.json();
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function postAerolinea(aerolinea: any) {
    try {
        const response = await fetch(baseUrl + '/aerolineas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aerolinea),
            credentials: 'include'
        });
        return await response.json();
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putAerolinea(aerolinea: any) {
    try {
        const response = await fetch(baseUrl + '/aerolineas', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aerolinea),
            credentials: 'include'
        });
        return await response.json();
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteAerolineas(ids: any[]) {
    try {
        const response = await fetch(baseUrl + '/aerolineas', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ids),
            credentials: 'include'
        });
        return await response.json();
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function postAerolineaJoinAll(aerolinea: any) {
    try {
        const response = await fetch(baseUrl + '/aerolineas/joinAll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(aerolinea),
            credentials: 'include'
        });
        return await response.json();
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteAerolineasJoinAll(ids: any[]) {
    try {
        const response = await fetch(baseUrl + '/aerolineas/joinAll', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ids),
            credentials: 'include'
        });
        return await response.json();
    } catch (err) {
        console.log("ERROR", err);
    }
}
