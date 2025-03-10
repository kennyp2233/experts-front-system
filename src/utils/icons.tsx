// src/utils/icons.tsx
// Archivo centralizado de iconos para toda la aplicación

import React from 'react';

// Importaciones de diferentes librerías de iconos
import {
    FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiPlus, FiEdit,
    FiTrash2, FiSearch, FiSettings, FiLogOut, FiHome,
    FiFileText, FiChevronRight, FiChevronLeft, FiCheck, FiX,
    FiExternalLink, FiLink, FiLink2, FiCalendar, FiClock
} from 'react-icons/fi';

import {
    FaBuilding, FaTractor, FaShippingFast, FaNetworkWired,
    FaUsers, FaServer, FaDatabase, FaPlaneArrival, FaPlaneDeparture,
    FaMapMarkedAlt, FaBoxOpen, FaTruckMoving, FaWarehouse, FaBoxes,
    FaUserCog, FaUserEdit, FaUserPlus, FaUserMinus, FaUserCheck,
    FaClipboardList, FaClipboardCheck, FaTasks, FaBolt
} from 'react-icons/fa';

import {
    MdDashboard, MdOutlineLocalShipping, MdOutlineAddCircle,
    MdDirectionsBoat, MdAirplanemodeActive, MdDescription,
    MdInventory, MdAssignment, MdAssignmentTurnedIn, MdAssignmentLate,
    MdFormatListBulleted, MdOutlineSettings, MdHistory
} from 'react-icons/md';

import {
    BiSolidPlaneAlt, BiPackage, BiExport, BiImport,
    BiBarcode, BiCode, BiScan, BiPrinter
} from 'react-icons/bi';

import {
    BsBoxSeam, BsClipboardData, BsClipboardCheck,
    BsGearFill, BsPersonFill, BsShieldLock, BsShieldCheck
} from 'react-icons/bs';

import {
    HiOutlineDocumentText, HiOutlineDocumentDuplicate,
    HiOutlineClipboardList, HiOutlineClipboardCheck
} from 'react-icons/hi';

// Exportamos todos los iconos que usamos en la aplicación
export const AppIcons = {
    // Usuario e Identidad
    User: FiUser,
    UserAdd: FaUserPlus,
    UserEdit: FaUserEdit,
    UserCog: FaUserCog,
    Email: FiMail,
    Lock: FiLock,
    Phone: FiPhone,

    // Navegación
    Dashboard: MdDashboard,
    Home: FiHome,
    Settings: FiSettings,
    Logout: FiLogOut,
    ChevronRight: FiChevronRight,
    ChevronLeft: FiChevronLeft,

    // Tipo de organización 
    Building: FaBuilding,
    Farm: FaTractor,

    // Documentos
    Document: HiOutlineDocumentText,
    DocumentDuplicate: HiOutlineDocumentDuplicate,
    ClipboardList: FaClipboardList,
    ClipboardCheck: FaClipboardCheck,
    Tasks: FaTasks,

    // Transporte
    Shipping: MdOutlineLocalShipping,
    FastShipping: FaShippingFast,
    Truck: FaTruckMoving,
    Plane: BiSolidPlaneAlt,
    Ship: MdDirectionsBoat,
    PlaneArrival: FaPlaneArrival,
    PlaneDeparture: FaPlaneDeparture,

    // Ubicación
    Location: FiMapPin,
    Map: FaMapMarkedAlt,

    // Almacenes e Inventario
    Warehouse: FaWarehouse,
    Box: BsBoxSeam,
    Boxes: FaBoxes,
    Package: BiPackage,
    Inventory: MdInventory,
    Barcode: BiBarcode,
    QrCode: BiCode,

    // Coordinación
    Network: FaNetworkWired,
    Link: FiLink,
    Link2: FiLink2,
    ExternalLink: FiExternalLink,
    Bolt: FaBolt,

    // Datos
    Database: FaDatabase,
    Server: FaServer,

    // Acciones
    Add: FiPlus,
    Edit: FiEdit,
    Delete: FiTrash2,
    Search: FiSearch,
    Check: FiCheck,
    Close: FiX,
    Scan: BiScan,
    Print: BiPrinter,

    // Tiempo
    Calendar: FiCalendar,
    Clock: FiClock,
    History: MdHistory,

    // Exportación/Importación
    Export: BiExport,
    Import: BiImport
};

// Componente Icon que simplifica el uso de iconos
interface IconProps {
    name: keyof typeof AppIcons;
    size?: number;
    className?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, className = "" }) => {
    const IconComponent = AppIcons[name];
    return <IconComponent size={size} className={className} />;
};

// Ejemplo de uso:
// import { Icon, AppIcons } from '@/utils/icons';
//
// <Icon name="Dashboard" size={32} className="text-primary" />
// <AppIcons.User size={24} className="text-secondary" />