import { apiClient } from "../../httpClient";
import { BaseService } from "../baseService";

class OrigenesService extends BaseService<any> {
    constructor() {
        super('/origenes');
    }

    async getOrigenes(): Promise<any[]> {
        return apiClient.get(this.endpoint);
    }

    async postOrigen(origen: any): Promise<any> {
        return apiClient.post(this.endpoint, origen);
    }

    async putOrigen(origen: any): Promise<any> {
        return apiClient.put(this.endpoint, origen);
    }

    async deleteOrigenes(origenes: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, origenes);
    }

    async getOrigenesJoinPaisesAduanas(): Promise<any[]> {
        return apiClient.get(`${this.endpoint}/paises-aduanas`);
    }
}

export const origenesService = new OrigenesService();