import { baseUrl } from "./config.api";

export function getPaisesJoinAcuerdos() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/paises-acuerdos', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log(err);
        });
}