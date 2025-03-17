import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class PaisesService extends BaseService<any> {
    constructor() {
        super('/paises');
    }

    async getPaises(): Promise<any[]> {
        return apiClient.get(this.endpoint);
    }

    async getPaisesJoinAcuerdos(): Promise<any[]> {
        return apiClient.get(`${this.endpoint}/join/acuerdos`);
    }


    async postPais(pais: any): Promise<any> {
        return apiClient.post(this.endpoint, pais);
    }

    async putPais(pais: any): Promise<any> {
        return apiClient.put(this.endpoint, pais);
    }

    async deletePaises(paises: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, paises);
    }

}

export const paisesService = new PaisesService();