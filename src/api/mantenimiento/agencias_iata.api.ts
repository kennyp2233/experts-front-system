import { baseUrl } from "./config.api";

/*
Context
import { Router, Request, Response, NextFunction } from 'express';
import { query, body } from 'express-validator';
import validationMiddleware from '@middlewares/validationMiddleware';

import { createAgenciaIata, getAgenciaIata, getAgenciasIata, updateAgenciaIata, deleteAgenciasIata } from '@services/mantenimiento/agencias_iata.servicio';

import { AgenciaIata, AgenciaIataAtributosCreacion } from '@typesApp/mantenimiento/agencia_iata.types';

const router = Router();

// Obtener agencias IATA
router.get('/',
    [
        query('id').optional().isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
    ],
    validationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.query.id ? Number.parseInt(req.query.id as string) : undefined;
            const response = id ? await getAgenciaIata(id) : await getAgenciasIata();
            res.json(response);
        } catch (error) {
            next(error);
        }
    }
);

// Crear agencia IATA
router.post('/',
    [
    ],
    validationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await createAgenciaIata(req.body as AgenciaIataAtributosCreacion);
            res.status(201).json({ ok: true, msg: 'Creando agencia IATA' });
        } catch (error) {
            next(error);
        }
    }
);

// Actualizar agencia IATA
router.put('/',
    [
        body('id_agencia_iata').isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),
    ],
    validationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await updateAgenciaIata(req.body as AgenciaIata);
            res.status(200).json({ ok: true, msg: 'Actualizando agencia IATA' });
        } catch (error) {
            next(error);
        }
    }
);

// Eliminar agencias IATAs
router.delete('/',
    [
        body('ids').isArray().withMessage('Los IDs deben ser un arreglo de números enteros positivos'),
        body('ids.*').isInt({ min: 1 }).withMessage('Cada ID debe ser un número entero positivo'),
    ],
    validationMiddleware,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteAgenciasIata(req.body.ids as number[]);
            res.status(200).json({ ok: true, msg: 'Eliminando agencias IATA' });
        } catch (error) {
            next(error);
        }
    }
);

export default router;
*/

// Obtener agencias IATA
export async function getAgenciasIata(id?: number) {
    try {
        const response = await fetch(baseUrl + '/agencias_iata' + (id ? `?id=${id}` : ''), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        return await response.json();
    } catch (err) {
        console.log("ERROR", err);
    }
}

// Crear agencia IATA
export async function postAgenciaIata(agenciaIata: any) {
    try {
        const response = await fetch(baseUrl + '/agencias_iata', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agenciaIata),
            credentials: 'include'
        });
        return await response.json();
    } catch (err) {
        console.log("ERROR", err);
    }
}

// Actualizar agencia IATA
export async function putAgenciaIata(agenciaIata: any) {
    try {
        const response = await fetch(baseUrl + '/agencias_iata', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agenciaIata),
            credentials: 'include'
        });
        return await response.json();
    } catch (err) {
        console.log("ERROR", err);
    }
}

// Eliminar agencias IATA
export async function deleteAgenciasIata(ids: number[]) {
    try {
        const response = await fetch(baseUrl + '/agencias_iata', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ids),
            credentials: 'include'
        });
        return await response.json();
    } catch (err) {
        console.log("ERROR", err);
    }
}
