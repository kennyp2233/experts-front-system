import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class UnidadesMedidaService extends BaseService<any> {
    constructor() {
        super('/catalogos/productos/unidad');
    }

    async getUnidadesMedida(): Promise<any[]> {
        return apiClient.get(this.endpoint);
    }

    async getUnidadMedida(id: number): Promise<any> {
        return apiClient.get(`${this.endpoint}/${id}`);
    }

    async postUnidadMedida(unidadMedida: any): Promise<any> {
        return apiClient.post(this.endpoint, unidadMedida);
    }

    async putUnidadMedida(unidadMedida: any): Promise<any> {
        return apiClient.put(this.endpoint, unidadMedida);
    }

    async deleteUnidadMedida(id: number): Promise<any> {
        return apiClient.delete(`${this.endpoint}/${id}`);
    }

    async deleteUnidadesMedida(unidadesMedida: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, unidadesMedida);
    }

}

export const unidadesMedidaService = new UnidadesMedidaService();