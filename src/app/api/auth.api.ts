const baseUrl = 'http://localhost:3001/api/v1';
export function login(usuario: string, password: string, recordar: boolean) {
    return fetch(baseUrl + '/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, password, recordar })
    }).then((res) => res.json());

}



export function register(usuario: string, email: string, pass: string) {
    return fetch(baseUrl + '/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, email, pass })
    }).then((res) => res.json());
}