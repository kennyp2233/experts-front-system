import { useAuth } from "../../../authProvider";
import { useSistemState } from "../../../sistemStateContext";
import { useAdminModules } from "../../../adminModulesProvider";
import { useMantenimiento } from "../../../mantenimientoProvider";
import MantenimientoInit from "./mantenimiento/mantenimientoInit";
import Paises from "./mantenimiento/paises";
import CaeAduanas from "./mantenimiento/cae_aduanas";

export default function Mantenimiento() {
    const { sistemState, handleSistemState, } = useSistemState();
    const { isLoggedIn, setIsLoggedIn, isAdministrator } = useAuth();
    const { adminState, setAdminState } = useAdminModules();
    const { mantenimientoState, setMantenimientoState } = useMantenimiento();


    return (
        <>
            {mantenimientoState === 0 && <MantenimientoInit />}
            {mantenimientoState === 1 && <Paises />}
            {mantenimientoState === 2 && <CaeAduanas />}


        </>
    );
}