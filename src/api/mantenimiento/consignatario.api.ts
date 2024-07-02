import { baseUrl } from "./config.api";

export function getConsignatarioJoinAll() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/consignatariosJoinAll', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("DATA", data);
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}