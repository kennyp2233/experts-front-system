import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class CatalogoProductoService extends BaseService<any> {
    constructor() {
        super('/catalogos/productos');
    }

    async getCatalogosProductoOpciones() {
        return apiClient.get(`${this.endpoint}/opciones`);
    }

    async getCatalogosProductoUnidad() {
        return apiClient.get(`${this.endpoint}/unidad`);
    }
}

export const catalogoProductoService = new CatalogoProductoService();