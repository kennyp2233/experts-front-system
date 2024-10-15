import { baseUrl } from "./config.api";

export async function getUnidadesMedida() {
    try {
        const res = await fetch(baseUrl + '/unidadesMedida', {
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

export async function getUnidadMedida(id: number) {
    try {
        const res = await fetch(baseUrl + '/unidadesMedida/' + id, {
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

export async function postUnidadMedida(data: any) {
    try {
        const res = await fetch(baseUrl + '/unidadesMedida', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });
        const data_1 = await res.json();
        console.log(data_1);
        return data_1;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putUnidadMedida(unidadMedida: any) {
    try {
        const res = await fetch(baseUrl + '/unidadesMedida', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(unidadMedida)
        });
        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteUnidadMedida(ids: number[]) {
    try {
        const res = await fetch(baseUrl + '/unidadesMedida', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(ids)
        });
        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}
