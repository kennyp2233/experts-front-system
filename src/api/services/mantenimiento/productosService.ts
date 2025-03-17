import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class ProductosService extends BaseService<any> {
    constructor() {
        super('/productos');
    }

    async getProductos(): Promise<any[]> {
        return apiClient.get<any[]>(this.endpoint);
    }

    async getProductosJoinAll(): Promise<any[]> {
        return apiClient.get<any[]>(`${this.endpoint}/productosJoinAll`);
    }

    async postProducto(producto: any): Promise<any> {
        return apiClient.post<any>(this.endpoint, producto);
    }

    async putProducto(producto: any): Promise<any> {
        return apiClient.put<any>(this.endpoint, producto);
    }

    async deleteProductos(productos: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, productos);
    }

}

export const productosService = new ProductosService();