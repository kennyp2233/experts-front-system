import { baseUrl } from "../config.api";

export function getCatalogosTipoDocumento() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/catalogos/tipo-documento', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}