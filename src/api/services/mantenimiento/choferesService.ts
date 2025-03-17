import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class ChoferesService extends BaseService<any> {
    constructor() {
        super('/choferes');
    }

    async getChoferes(): Promise<any[]> {
        return apiClient.get(this.endpoint);
    }

    async postChofer(chofer: any): Promise<any> {
        return apiClient.post(this.endpoint, chofer);
    }

    async putChofer(chofer: any): Promise<any> {
        return apiClient.put(this.endpoint, chofer);
    }

    async deleteChoferes(choferes: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, choferes);
    }

}

export const choferesService = new ChoferesService();