import { baseUrl } from "./config.api";

export function getFincasJoinAll(){
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/fincasJoinAll', {
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

export function postFinca(finca: any){
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/fincas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(finca)
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function putFinca(finca: any){
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/fincas', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(finca)
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function deleteFincas(fincas: number[]){
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/fincas', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(fincas)
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}