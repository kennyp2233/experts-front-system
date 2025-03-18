import React from "react";
import { useEffect } from "react";

interface TableInterface {
    visibleColumns: { [key: string]: any },
    data: { [key: string]: any }[],
    className?: string,
    setSelectedRow?: (id: number) => void,
    selectedRow?: number | any[],
    selectedRowData?: any,
    setSelectedRowData?: (data: any) => void,
    selectedRows?: any[],
    setSelectedRows?: (data: any) => void,
    controlState?: string,
    classNameTableContainer?: string
}

export default function Tabla({
    visibleColumns,
    data,
    className,
    classNameTableContainer,
    setSelectedRow,
    selectedRow,
    selectedRowData,
    setSelectedRowData,
    selectedRows,
    setSelectedRows,
    controlState
}: TableInterface) {

    const handleSelectedRow = (e: any) => {
        const rowIndex = e.currentTarget.rowIndex - 1;

        if (setSelectedRowData && setSelectedRow && controlState !== "eliminar") {
            setSelectedRow(rowIndex);
            setSelectedRowData(data[rowIndex]);

        }


        if (setSelectedRows && selectedRows && controlState === "eliminar") {
            const id = data[rowIndex][Object.keys(data[rowIndex])[0]];

            if (!selectedRows.includes(id)) {
                setSelectedRows([...selectedRows, id]);
            } else {
                setSelectedRows(selectedRows.filter((row) => row !== id));
            }
        }

    }

    const renderCellContent = (cellData: any) => {
        if (typeof cellData === 'object' && cellData !== null) {
            return cellData[Object.keys(cellData).find((key: any) => key.startsWith('codigo')) || ''] || cellData.nombre || cellData[Object.keys(cellData).find((key: any) => key.startsWith('id')) || ''] || "-";
        }
        if (cellData !== null && cellData !== undefined) {
            if (typeof cellData === 'boolean') {
                return cellData ? 'Si' : 'No';
            }
            return cellData.toString();
        }
        return cellData;
    };
    useEffect(() => {
        // console.log(selectedRowData);
    }, [selectedRowData]);


    return (
        <div className={`card card-body shadow-2xl bg-base-100 ${className}`}>
            <div className={`overflow-auto ${classNameTableContainer}`}>
                <table className="table table-pin-rows w-full table-auto">
                    {/* head */}
                    <thead>
                        <tr>
                            <th></th>
                            {Object.values(visibleColumns).map((column, index) => (
                                <th key={index}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                //data-id={row.id} // Asume que cada objeto tiene una propiedad 'id'
                                onClick={handleSelectedRow}
                                className={

                                    controlState === "eliminar" ?
                                        (selectedRows?.includes(row[Object.keys(row)[0]]) ? 'bg-secondary text-secondary-content' : '') :
                                        (selectedRow === rowIndex ? 'bg-base-200' : '')
                                }
                            >
                                <th>{rowIndex + 1}</th>
                                {Object.keys(visibleColumns).map((column, columnIndex) => (
                                    <td key={columnIndex}>
                                        {renderCellContent(row[column])}

                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
