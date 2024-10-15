import { baseUrl } from "./config.api";

export async function getConsignatarioJoinAll() {
    try {
        const res = await fetch(baseUrl + '/consignatariosJoinAll', {
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

export async function postConsignatarioJoinAll(data: any) {
    try {
        const res = await fetch(baseUrl + '/consignatariosJoinAll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        const data_1 = await res.json();
        console.log("DATA", data_1);
        return data_1;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function updateConsignatarioJoinAll(data: any) {
    try {
        const res = await fetch(baseUrl + '/consignatariosJoinAll', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        const data_1 = await res.json();
        console.log("DATA", data_1);
        return data_1;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteConsigantarioJoinAll(ids: any[]) {
    try {
        const res = await fetch(baseUrl + '/consignatariosJoinAll', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ids),
            credentials: 'include'
        });
        const data = await res.json();
        console.log("DATA", data);
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}
