import { baseUrl } from '../mantenimiento/config.api';

export async function login(usuario: string, pass: string, recordar: boolean) {
    const res = await fetch(baseUrl + '/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ usuario, pass, recordar })
    });
    return await res.json();

}

export async function register(usuario: string, email: string, pass: string, nombre: string, empresa: string, telefono: string, selectedRole: string, additionalData: any) {
    const res = await fetch(baseUrl + '/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ usuario, email, pass, nombre, empresa, telefono, selectedRole, additionalData })
    });
    return await res.json();
}

export async function logout() {
    const res = await fetch(baseUrl + '/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    return await res.json();
}

export async function getMe() {
    const res = await fetch(baseUrl + '/auth/me', {
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    });
    return await res.json();
}

