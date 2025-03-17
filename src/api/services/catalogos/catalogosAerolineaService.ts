import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class CatalogosAerolineaService extends BaseService<any> {
    constructor() {
        super('/catalogos/aerolineas');
    }

    async getCatalogosAerolineasModo() {
        return apiClient.get<any[]>(`${this.endpoint}/modo`);
    }

    async getCatalogosAerolineasMult() {
        return apiClient.get<any[]>(`${this.endpoint}/multiplicador`);
    }


}

export const catalogosAerolineaService = new CatalogosAerolineaService();