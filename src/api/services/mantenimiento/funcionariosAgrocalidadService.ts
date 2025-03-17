import { apiClient } from "@/api/httpClient";
import { BaseService } from "../baseService";

class FuncionariosAgrocalidadService extends BaseService<any> {
    constructor() {
        super('/funcionarios_agrocalidad');
    }

    async getFuncionariosAgrocalidad(): Promise<any[]> {
        return apiClient.get<any[]>(this.endpoint);
    }

    async postFuncionarioAgrocalidad(funcionario: any): Promise<any> {
        return apiClient.post<any>(this.endpoint, funcionario);
    }

    async putFuncionarioAgrocalidad(funcionario: any): Promise<any> {
        return apiClient.put<any>(this.endpoint, funcionario);
    }

    async deleteFuncionariosAgrocalidad(funcionarios: any[]): Promise<any> {
        return apiClient.delete(this.endpoint, funcionarios);
    }

}

export const funcionariosAgrocalidadService = new FuncionariosAgrocalidadService();