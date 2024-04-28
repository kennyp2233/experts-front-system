import { useAuth } from "../../../authProvider";
import { useSistemState } from "../../../sistemStateContext";
import { useAdminModules } from "../../../adminModulesProvider";
import { useMantenimiento } from "../../../mantenimientoProvider";
import MantenimientoInit from "./mantenimiento/mantenimientoInit";
import Paises from "./mantenimiento/datos/paises";
import Origenes from "./mantenimiento/datos/origenes";

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


        </>
    );
}