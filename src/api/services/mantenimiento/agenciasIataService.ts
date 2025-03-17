import { apiClient } from "../../httpClient";
import { BaseService } from "../baseService";

class AgenciaIataService extends BaseService<any> {
    constructor() {
        super('agencias_iata');
    }

    async getAgenciasIata(): Promise<any[]> {
        return apiClient.get(this.endpoint);
    }

    async postAgenciaIata(agenciaIata: any): Promise<any> {
        return apiClient.post(this.endpoint, agenciaIata);
    }

    async putAgenciaIata(agenciaIata: any): Promise<any> {
        return apiClient.put(this.endpoint, agenciaIata);
    }


    async deleteAgenciasIata(agenciasIata: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, agenciasIata);
    }
}

export const agenciaIataService = new AgenciaIataService();