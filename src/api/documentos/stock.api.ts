import { baseUrl } from "../mantenimiento/config.api";

export async function getStock() {
    return fetch(baseUrl + '/catalogos/documento-base/stock', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log(err);
        });
}