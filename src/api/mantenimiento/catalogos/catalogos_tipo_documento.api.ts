import { baseUrl } from "../config.api";

export function getCatalogosTipoDocumento() {
    return fetch(baseUrl + '/catalogos/tipo-documento', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
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