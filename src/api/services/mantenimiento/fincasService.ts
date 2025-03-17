// src/api/services/fincasService.ts
import { apiClient } from '../../httpClient';
import { BaseService } from '../baseService';



class FincasService extends BaseService<any> {
    constructor() {
        super('/fincas');
    }

    async getFincas(): Promise<any[]> {
        return apiClient.get(this.endpoint);
    }

    async getFincasJoinAll(): Promise<any[]> {
        return apiClient.get(`${this.endpoint}/fincasJoinAll`);
    }

    async postFinca(finca: any): Promise<any> {
        return apiClient.post(this.endpoint, finca);
    }

    async putFinca(finca: any): Promise<any> {
        return apiClient.put(this.endpoint, finca);
    }

    async deleteFincas(fincas: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, fincas);
    }

}

// Exportar una instancia única
export const fincasService = new FincasService();