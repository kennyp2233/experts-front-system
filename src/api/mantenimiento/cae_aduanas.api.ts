import { baseUrl } from "./config.api";

export async function getAduanas() {
    try {
        const res = await fetch(baseUrl + '/aduanas', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function postAduana(aduana: any) {
    try {
        const res = await fetch(baseUrl + '/aduanas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aduana),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putAduana(aduana: any) {
    try {
        const res = await fetch(baseUrl + '/aduanas', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aduana),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteAduanas(aduanas: any[]) {
    try {
        const res = await fetch(baseUrl + '/aduanas', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(aduanas),
            credentials: 'include'
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}
