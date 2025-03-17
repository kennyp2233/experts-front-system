import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class SubagenciasService extends BaseService<any> {
    constructor() {
        super('/subagencias');
    }

    async getSubagencias(): Promise<any[]> {
        return apiClient.get(this.endpoint);
    }

    async postSubagencia(subagencia: any): Promise<any> {
        return apiClient.post(this.endpoint, subagencia);
    }

    async putSubagencia(subagencia: any): Promise<any> {
        return apiClient.put(this.endpoint, subagencia);
    }

    async deleteSubagencias(subagencias: any[]): Promise<any[]> {
        return apiClient.delete(this.endpoint, subagencias);
    }

}

export const subagenciasService = new SubagenciasService();