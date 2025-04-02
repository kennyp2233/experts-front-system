// src/components/sistema/centro_guias_components/common/ClientSelector.tsx
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { AppIcons } from '@/utils/icons';
import { clientesService } from "@/api/services/mantenimiento/clientesService";
import { dispatchMenssage } from '@/utils/menssageDispatcher';

interface ClientSelectorProps {
    disabled?: boolean;
}

export const ClientSelector: React.FC<ClientSelectorProps> = ({ disabled = false }) => {
    const { setValue, watch } = useFormContext();
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredClients, setFilteredClients] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalClients, setTotalClients] = useState(0);

    // Get the currently selected clients from form state
    const selectedClientIds = watch('id_clientes') || [];

    // Load clients from API
    useEffect(() => {
        const fetchClients = async () => {
            setLoading(true);
            try {
                const result = await clientesService.getClientes({
                    limit: 50 // Obtener un número razonable de clientes
                });
                setClients(result.data);
                setFilteredClients(result.data);
                setTotalClients(result.total);
            } catch (error) {
                console.error('Error loading clients:', error);
                dispatchMenssage('error', 'Error al cargar clientes');
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    // Fetch selected clients that might not be in the initial load
    useEffect(() => {
        const fetchSelectedClients = async () => {
            if (!selectedClientIds.length) return;

            // Filter out IDs that are already in our clients list
            const missingIds = selectedClientIds.filter(
                (id: any) => !clients.some(client => client.id_clientes === id)
            );

            if (!missingIds.length) return;

            // Fetch each missing client individually
            const missingClients = await Promise.all(
                missingIds.map((id: any) => clientesService.getClienteById(id))
            );

            // Add missing clients to our client list
            setClients(prevClients => [
                ...prevClients,
                ...missingClients.filter(Boolean)
            ]);
        };

        fetchSelectedClients();
    }, [selectedClientIds, clients]);

    // Handle search with debounce
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchTerm) {
                handleSearch();
            } else {
                // If search is cleared, reset to initial clients list
                const fetchClients = async () => {
                    setLoading(true);
                    try {
                        const result = await clientesService.getClientes({
                            limit: 50
                        });
                        setFilteredClients(result.data);
                    } catch (error) {
                        console.error('Error loading clients:', error);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchClients();
            }
        }, 500);

        return () => clearTimeout(delaySearch);
    }, [searchTerm]);

    // Function to handle search
    const handleSearch = async () => {
        setLoading(true);
        try {
            const result = await clientesService.getClientes({
                search: searchTerm,
                limit: 50
            });
            setFilteredClients(result.data);
        } catch (error) {
            console.error('Error searching clients:', error);
            dispatchMenssage('error', 'Error al buscar clientes');
        } finally {
            setLoading(false);
        }
    };

    // Execute search when button is clicked
    const handleSearchButtonClick = () => {
        if (searchTerm.trim()) {
            handleSearch();
        }
    };

    // Toggle client selection
    const handleToggleClient = (clientId: number) => {
        const updatedSelection = selectedClientIds.includes(clientId)
            ? selectedClientIds.filter((id: number) => id !== clientId)
            : [...selectedClientIds, clientId];

        setValue('id_clientes', updatedSelection);
    };

    // Select/deselect all visible clients
    const handleToggleAllClients = () => {
        const filteredIds = filteredClients.map(client => client.id_clientes);
        const allSelected = filteredIds.every(id => selectedClientIds.includes(id));

        if (allSelected) {
            // Deselect all filtered clients
            setValue('id_clientes', selectedClientIds.filter((id: any) => !filteredIds.includes(id)));
        } else {
            // Select all filtered clients that aren't already selected
            const newSelection = [
                ...selectedClientIds,
                ...filteredIds.filter(id => !selectedClientIds.includes(id))
            ];
            setValue('id_clientes', newSelection);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">Selección de Clientes</h3>
                <div className="flex items-center">
                    <span className="mr-2 text-sm opacity-70">
                        {selectedClientIds.length} / {totalClients} seleccionados
                    </span>
                    <button
                        type="button"
                        className="btn btn-sm btn-outline"
                        onClick={handleToggleAllClients}
                        disabled={disabled || loading || filteredClients.length === 0}
                    >
                        {filteredClients.length > 0 &&
                            filteredClients.every(client => selectedClientIds.includes(client.id_clientes))
                            ? 'Deseleccionar todos'
                            : 'Seleccionar todos'}
                    </button>
                </div>
            </div>

            <div className="input-group mb-4">
                <input
                    type="text"
                    placeholder="Buscar cliente por nombre, email o teléfono..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    disabled={disabled || loading}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearchButtonClick();
                        }
                    }}
                />
                <button
                    className="btn btn-square"
                    type="button"
                    onClick={handleSearchButtonClick}
                    disabled={disabled || loading}
                >
                    <AppIcons.Search className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-80 overflow-y-auto p-2 border rounded-lg">
                {loading ? (
                    <div className="col-span-full text-center py-4">
                        <span className="loading loading-spinner loading-md"></span>
                    </div>
                ) : filteredClients.length === 0 ? (
                    <div className="col-span-full text-center py-4 text-sm opacity-70">
                        No se encontraron clientes con ese término de búsqueda
                    </div>
                ) : (
                    filteredClients.map((client) => {
                        const isSelected = selectedClientIds.includes(client.id_clientes);

                        return (
                            <div
                                key={client.id_clientes}
                                className={`border rounded-lg p-3 cursor-pointer hover:bg-base-200 transition-colors ${isSelected ? "bg-primary/10 border-primary" : ""}`}
                                onClick={() => !disabled && handleToggleClient(client.id_clientes)}
                            >
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary mr-2"
                                        checked={isSelected}
                                        onChange={() => { }} // Controlled by the onClick of the parent div
                                        onClick={(e) => e.stopPropagation()}
                                        disabled={disabled}
                                    />
                                    <div>
                                        <p className="font-medium">{client.nombre}</p>
                                        {client.ruc && (
                                            <p className="text-xs opacity-70">RUC: {client.ruc}</p>
                                        )}
                                        {client.email && (
                                            <p className="text-xs opacity-70">{client.email}</p>
                                        )}
                                        {client.telefono && (
                                            <p className="text-xs opacity-70">{client.telefono}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Display selected clients as badges */}
            {selectedClientIds.length > 0 && (
                <div className="mt-2">
                    <p className="text-sm font-medium mb-1">Clientes seleccionados:</p>
                    <div className="flex flex-wrap gap-1">
                        {selectedClientIds.map((clientId: number) => {
                            const client = clients.find(c => c.id_clientes === clientId);
                            if (!client) return null;

                            return (
                                <div key={clientId} className="badge badge-primary gap-1">
                                    {client.nombre}
                                    <button
                                        type="button"
                                        className="btn btn-xs btn-ghost btn-circle"
                                        onClick={() => handleToggleClient(clientId)}
                                        disabled={disabled}
                                    >
                                        <AppIcons.Close className="w-3 h-3" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};