import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class CatalogosStockService extends BaseService<any> {
    constructor() {
        super('/catalogos/documento-base');
    }

    /**
     * Obtener tipos de stock
     */
    async getStockTypes(): Promise<any[]> {
        return apiClient.get<any[]>(`${this.endpoint}/stock`);
    }
}

export const catalogosStockService = new CatalogosStockService();