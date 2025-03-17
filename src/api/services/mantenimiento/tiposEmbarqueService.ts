import { BaseService } from "../baseService";
import { apiClient } from "@/api/httpClient";

class TiposEmbarqueService extends BaseService<any> {
    constructor() {
        super('/tipos_embarque');
    }

    async getTiposEmbarque() {
        return apiClient.get(this.endpoint);
    }

    async putTiposEmbarque(data: any) {
        return apiClient.put(this.endpoint, data);
    }

    async postTiposEmbarque(data: any) {
        return apiClient.post(this.endpoint, data);
    }

    async deleteTiposEmbarque(ids: number[]) {
        return apiClient.delete(this.endpoint, ids);
    }
}

export const tiposEmbarqueService = new TiposEmbarqueService();