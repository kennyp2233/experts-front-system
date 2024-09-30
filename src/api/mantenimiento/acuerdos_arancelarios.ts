import { baseUrl } from "./config.api";

export async function getAcuerdosArancelarios() {
    return fetch(baseUrl + '/acuerdos_arancelarios', {
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
