import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class AduanasSevice extends BaseService<any> {
    constructor() {
        super('/aduanas');
    }

    async getAduanas(): Promise<any[]> {
        return apiClient.get<any[]>(this.endpoint);
    }

    async postAduana(aduana: any): Promise<any> {
        return apiClient.post<any>(this.endpoint, aduana);
    }

    async putAduana(aduana: any): Promise<any> {
        return apiClient.put<any>(this.endpoint, aduana);
    }

    async deleteAduanas(aduanas: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, aduanas);
    }

}

export const aduanasService = new AduanasSevice();