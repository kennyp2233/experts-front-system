import { useAuth } from "../../../providers/authProvider";
import { useSistemState } from "../../../providers/sistemStateContext";
import { useAdminModules } from "../../../providers/adminModulesProvider";
import { useMantenimiento } from "../../../providers/mantenimientoProvider";
import MantenimientoInit from "./mantenimiento/mantenimientoInit";
import Paises from "./mantenimiento/datos/paises";
import Origenes from "./mantenimiento/datos/origenes";
import Destinos from "./mantenimiento/datos/destinos";
import Aerolineas from "./mantenimiento/datos/aerolineas";

export default function Mantenimiento() {
    const { sistemState, handleSistemState, } = useSistemState();
    const { isLoggedIn, setIsLoggedIn, isAdministrator } = useAuth();
    const { adminState, setAdminState } = useAdminModules();
    const { mantenimientoState, setMantenimientoState } = useMantenimiento();


    return (
        <>
            {mantenimientoState === "init" && <MantenimientoInit />}
            {mantenimientoState === "paises" && <Paises />}
            {mantenimientoState === "origenes" && <Origenes />}
            {mantenimientoState === "destinos" && <Destinos />}
            {mantenimientoState === "aerolineas" && <Aerolineas />}
        </>
    );
}