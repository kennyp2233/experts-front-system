import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class DestinoService extends BaseService<any> {
    constructor() {
        super('/destinos');
    }

    async getDestinos(): Promise<any[]> {
        return apiClient.get(this.endpoint);
    }

    async getDestinosJoinPaisesAduanas(): Promise<any[]> {
        return apiClient.get(`${this.endpoint}/paises`);
    }

    async postDestino(destino: any): Promise<any> {
        return apiClient.post(this.endpoint, destino);
    }

    async putDestino(destino: any): Promise<any> {
        return apiClient.put(this.endpoint, destino);
    }

    async deleteDestinos(destinos: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, destinos);
    }

}

export const destinosService = new DestinoService();