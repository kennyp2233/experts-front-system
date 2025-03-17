import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class CatalogosTiposEmbarqueService extends BaseService<any> {
    constructor() {
        super('/catalogos/tipos-embarque');
    }

    async getCatalogosEmbarqueCarga() {
        return apiClient.get(`${this.endpoint}/carga`);
    }

    async getCatalogosEmbarqueEmbalaje() {
        return apiClient.get(`${this.endpoint}/embalaje`);
    }
}

export const catalogosTiposEmbarqueService = new CatalogosTiposEmbarqueService();