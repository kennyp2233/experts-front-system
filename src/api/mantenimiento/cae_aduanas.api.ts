import { baseUrl } from "./config.api";

/*CONTEXT

router.get('/aduanas', async (req, res) => {
    try {
        if (req.query.id) {
            res.send(await getAduana(Number.parseInt(req.query.id as string)));
        } else {
            res.send(await getAduanas());
        }

    } catch (error: any) {
        res.status(400).json({ ok: false, msg: error.message });
    }
});

router.post('/aduanas', async (req, res) => {
    try {
        const resultado = createAduana(req.body as CaeAduanaCreationAttributes);
        res.status(201).json({ ok: true, msg: 'Aduana creada', resultado });
    }
    catch (error: any) {
        res.status(400).json({ ok: false, msg: error.message });
    }
});

router.put('/aduanas', async (req, res) => {
    try {
        await updateAduana(req.body as CaeAduana);
        res.status(200).json({ ok: true, msg: 'Aduana actualizada' });
    }
    catch (error: any) {
        res.status(400).json({ ok: false, msg: error.message });
    }
});

router.delete('/aduanas', async (req, res) => {
    try {
        if (req.query.id) {
            res.send(await deleteAduana(Number.parseInt(req.query.id as string)));
        } else {
            res.send(await deleteAduanas(req.body as number[]));
        }
    } catch (error: any) {
        res.status(400).json({ ok: false, msg: error.message });
    }
});
    
    */

export function getAduanas() {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/aduanas', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function postAduana(aduana: any) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/aduanas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(aduana)
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function putAduana(aduana: any) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/aduanas', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(aduana)
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}

export function deleteAduanas(aduanas: any[]) {
    const token = localStorage.getItem('jwt');
    return fetch(baseUrl + '/aduanas', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(aduanas)
    })
        .then((res) => res.json())
        .then((data) => {
            return data;
        })
        .catch((err) => {
            console.log("ERROR", err);
        });
}