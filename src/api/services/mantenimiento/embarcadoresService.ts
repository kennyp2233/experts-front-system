import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class EmbarcadoresService extends BaseService<any> {
    constructor() {
        super('/embarcadores');
    }

    async getEmbarcadores(): Promise<any[]> {
        return apiClient.get(this.endpoint);
    }

    async postEmbarcador(embarcador: any): Promise<any> {
        return apiClient.post(this.endpoint, embarcador);
    }

    async putEmbarcador(embarcador: any): Promise<any> {
        return apiClient.put(this.endpoint, embarcador);
    }

    async deleteEmbarcadores(embarcadores: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, embarcadores);
    }

}

export const embarcadoresService = new EmbarcadoresService();