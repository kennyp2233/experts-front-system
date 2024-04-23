import { useAuth } from "../../../authProvider";
import { useSistemState } from "../../../sistemStateContext";
import { useAdminModules } from "../../../adminModulesProvider";
import { useMantenimiento } from "../../../mantenimientoProvider";
import MantenimientoInit from "./mantenimiento/mantenimientoInit";
import Paises from "./mantenimiento/paises";

export default function Mantenimiento() {
    const { sistemState, handleSistemState, } = useSistemState();
    const { isLoggedIn, setIsLoggedIn, verifyAdmin, isAdministrator } = useAuth();
    const { adminState, setAdminState } = useAdminModules();
    const { mantenimientoState, setMantenimientoState } = useMantenimiento();


    return (
        <>
            {mantenimientoState === 0 && <MantenimientoInit />}

            {mantenimientoState === 1 && <Paises />}
        </>
    );
}