import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class ClientesService extends BaseService<any> {
    constructor() {
        super('/clientes');
    }

    async getClientes(): Promise<any[]> {
        return apiClient.get(this.endpoint);
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