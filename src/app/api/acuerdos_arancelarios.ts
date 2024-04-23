import { baseUrl } from "./config.api";

export async function getAcuerdosArancelarios() {
    const token = localStorage.getItem('jwt');
    console.log(token);
    return fetch(baseUrl + '/acuerdos_arancelarios', {
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