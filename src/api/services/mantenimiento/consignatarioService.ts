import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class ConsignatarioService extends BaseService<any> {
    constructor() {
        super('/consignatarios');
    }

    async getConsignatarios(): Promise<any[]> {
        return apiClient.get(this.endpoint);
    }

    async postConsignatario(consignatario: any): Promise<any> {
        return apiClient.post(this.endpoint, consignatario);
    }

    async putConsignatario(consignatario: any): Promise<any> {
        return apiClient.put(this.endpoint, consignatario);
    }

    async deleteConsignatarios(consignatarios: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, consignatarios);
    }

}

export const consignatarioService = new ConsignatarioService();