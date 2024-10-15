import { baseUrl } from "./config.api";

export async function getFuncionarioAgrocalidad(id?: number) {
    try {
        const res = await fetch(baseUrl + '/funcionarios_agrocalidad' + (id ? `?id=${id}` : ''), {
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

export async function postFuncionarioAgrocalidad(funcionario: any) {
    try {
        const res = await fetch(baseUrl + '/funcionarios_agrocalidad', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(funcionario)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putFuncionarioAgrocalidad(funcionario: any) {
    try {
        const res = await fetch(baseUrl + '/funcionarios_agrocalidad', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(funcionario)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteFuncionariosAgrocalidad(ids: number[]) {
    try {
        const res = await fetch(baseUrl + '/funcionarios_agrocalidad', {
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

