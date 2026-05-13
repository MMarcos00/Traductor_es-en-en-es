import type React from 'react';
import type { EntradaTablaSimbolos } from '../types';

interface SymbolTableProps {
    simbolos: EntradaTablaSimbolos[];
}

const SymbolTable: React.FC<SymbolTableProps> = ({ simbolos }) => {
    if (simbolos.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                No hay simbolos en la tabla
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Tabla de Simbolos ({simbolos.length} entradas)
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Token
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Categoria
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Posicion
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ambito
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {simbolos.map((simbolo, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {simbolo.token}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {simbolo.tipo}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {simbolo.categoria}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {simbolo.posicion}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {simbolo.valor}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {simbolo.ambito}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SymbolTable;