import { baseUrl } from '../mantenimiento/config.api';
export async function login(usuario: string, pass: string, recordar: boolean) {
    const res = await fetch(baseUrl + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
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
        body: JSON.stringify({ usuario, email, pass })
    });
    return await res.json();
}

export async function checkJwt(token: string) {
    const res = await fetch(baseUrl + '/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ token })
    });
    return await res.json();

}
export async function isAdmin(token: string) {
    const res = await fetch(baseUrl + '/isAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({ token })
    });
    return await res.json();
}