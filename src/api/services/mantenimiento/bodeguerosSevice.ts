import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class BodeguerosService extends BaseService<any> {
    constructor() {
        super('/bodegueros');
    }

    async getBodegueros() {
        return apiClient.get(this.endpoint);
    }

    async postBodeguero(bodeguero: any) {
        return apiClient.post(this.endpoint, bodeguero);
    }

    async putBodeguero(bodeguero: any) {
        return apiClient.put(this.endpoint, bodeguero);
    }

    async deleteBodegueros(ids: number[]) {
        return apiClient.delete(this.endpoint, ids);
    }

}

export const bodeguerosService = new BodeguerosService();