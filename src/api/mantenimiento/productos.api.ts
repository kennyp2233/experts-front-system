import { baseUrl } from "./config.api";

export async function getProductos() {
    try {
        const res = await fetch(baseUrl + '/productos', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function getProductosJoinAll() {
    try {
        const res = await fetch(baseUrl + '/productos/productosJoinAll', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function postProducto(producto: any) {
    try {
        const res = await fetch(baseUrl + '/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(producto)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function putProducto(producto: any) {
    try {
        const res = await fetch(baseUrl + '/productos', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(producto)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}

export async function deleteProducto(id: number) {
    try {
        const res = await fetch(baseUrl + '/productos/' + id, {
            method: 'DELETE',
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

export async function deleteProductos(productos: any[]) {
    try {
        const res = await fetch(baseUrl + '/productos', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(productos)
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
}
