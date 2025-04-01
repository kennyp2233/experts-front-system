import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

interface ClientesQueryParams {
    search?: string;
    page?: number;
    limit?: number;
}

class ClientesService extends BaseService<any> {
    constructor() {
        super('/clientes');
    }

    async getClientes(params?: ClientesQueryParams): Promise<any> {
        const queryParams = new URLSearchParams();

        if (params?.search) queryParams.append('search', params.search);
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const queryString = queryParams.toString();
        const url = queryString ? `${this.endpoint}?${queryString}` : this.endpoint;

        return apiClient.get(url);
    }

    async getClienteById(id: string): Promise<any> {
        return apiClient.get(`${this.endpoint}/${id}`);
    }

    async postCliente(cliente: any): Promise<any> {
        return apiClient.post(this.endpoint, cliente);
    }

    async putCliente(cliente: any): Promise<any> {
        return apiClient.patch(this.endpoint, cliente);
    }

    async deleteClientes(clientes: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, clientes);
    }
}

export const clientesService = new ClientesService();