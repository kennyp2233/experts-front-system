import { baseUrl } from '../mantenimiento/config.api';

export async function login(usuario: string, pass: string, recordar: boolean) {
    const res = await fetch(baseUrl + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ usuario, pass, recordar })
    });
    return await res.json();

}

export async function register(usuario: string, email: string, pass: string) {
    const res = await fetch(baseUrl + '/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ usuario, email, pass })
    });
    return await res.json();
}

export async function logout() {
    const res = await fetch(baseUrl + '/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    return await res.json();
}

export async function getMe() {
    const res = await fetch(baseUrl + '/me', {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    return await res.json();
}

