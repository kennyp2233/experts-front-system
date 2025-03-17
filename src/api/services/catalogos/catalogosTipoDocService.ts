import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class CatalogosTipoDocumentoService extends BaseService<any> {
    constructor() {
        super('/catalogos/tipo-documento');
    }

    async getCatalogosTipoDocumento(): Promise<any[]> {
        return apiClient.get(this.endpoint);
    }

    async postCatalogosTipoDocumento(catalogosTipoDocumento: any): Promise<any> {
        return apiClient.post(this.endpoint, catalogosTipoDocumento);
    }

    async putCatalogosTipoDocumento(catalogosTipoDocumento: any): Promise<any> {
        return apiClient.put(this.endpoint, catalogosTipoDocumento);
    }

    async deleteCatalogosTipoDocumento(catalogosTipoDocumento: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, catalogosTipoDocumento);
    }

}

export const catalogosTipoDocumentoService = new CatalogosTipoDocumentoService();