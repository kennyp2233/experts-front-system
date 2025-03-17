import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class AcuerdosArancelarios extends BaseService<any> {
    constructor() {
        super('/acuerdos_arancelarios');
    }

    /**
     * Obtener acuerdos arancelarios con paginación
     */
    async getAcuerdosArancelarios(): Promise<any> {
        return apiClient.get<any>(this.endpoint);
    }

    /**
     * Crear un acuerdo arancelario
     */

    async postAcuerdoArancelario(acuerdoArancelario: any): Promise<any> {
        return apiClient.post<any>(this.endpoint, acuerdoArancelario);
    }

    /**
     * Actualizar un acuerdo arancelario
     */
    async putAcuerdoArancelario(acuerdoArancelario: any): Promise<any> {
        return apiClient.put<any>(this.endpoint, acuerdoArancelario);
    }

    /**
     * Eliminar un acuerdo arancelario
     */
    async deleteAcuerdosArancelarios(acuerdosArancelarios: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, acuerdosArancelarios);
    }

}

export const acuerdosArancelariosService = new AcuerdosArancelarios();
