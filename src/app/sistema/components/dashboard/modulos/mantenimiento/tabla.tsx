import { useEffect } from "react";

interface TableInterface {
    visibleColumns: { [key: string]: any },
    data: { [key: string]: any }[],
    className?: string,
    setSelectedRow: (id: number) => void,
    selectedRow: number,
    selectedRowData?: any,
    setSelectedRowData?: (data: any) => void
}

export default function Tabla({
    visibleColumns,
    data,
    className,
    setSelectedRow,
    selectedRow,
    selectedRowData,
    setSelectedRowData,
}: TableInterface) {

    const handleSelectedRow = (e: any) => {
        const rowIndex = e.currentTarget.rowIndex - 1;
        setSelectedRow(rowIndex);
        setSelectedRowData && setSelectedRowData(data[rowIndex]);
    }

    useEffect(() => {
        console.log(selectedRowData);
    }, [selectedRowData]);


    return (
        <>
            <div className={"card card-body shrink-0 shadow-2xl bg-base-100 " + className}>
                <div className="overflow-x-auto h-96">
                    <table className="table table-pin-rows ">
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
                                    data-id={row.id} // Asume que cada objeto tiene una propiedad 'id'
                                    onClick={handleSelectedRow}
                                    className={selectedRow === rowIndex ? 'bg-base-200' : ''}
                                >
                                    <th>{rowIndex + 1}</th>
                                    {Object.keys(visibleColumns).map((column, columnIndex) => (
                                        <td key={columnIndex}>
                                            {typeof row[column] === 'object' && row[column] !== null ? row[column].nombre : row[column].toString()}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
