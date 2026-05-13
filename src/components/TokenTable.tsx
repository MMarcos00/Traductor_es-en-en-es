import React from 'react';
import { Token } from '../types';

interface TokenTableProps {
    tokens: Token[];
}

const TokenTable: React.FC<TokenTableProps> = ({ tokens }) => {
    if (tokens.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                No hay tokens para mostrar
            </div>
        );
    }

    const getTipoColor = (tipo: string): string => {
        const colores: Record<string, string> = {
            'SUSTANTIVO': 'bg-blue-100 text-blue-800',
            'VERBO': 'bg-green-100 text-green-800',
            'PRONOMBRE': 'bg-purple-100 text-purple-800',
            'ADJETIVO': 'bg-yellow-100 text-yellow-800',
            'ARTICULO': 'bg-pink-100 text-pink-800',
            'PREPOSICION': 'bg-indigo-100 text-indigo-800',
            'CONJUNCION': 'bg-orange-100 text-orange-800',
            'ADVERBIO': 'bg-teal-100 text-teal-800',
            'PUNTUACION': 'bg-gray-100 text-gray-800',
            'DESCONOCIDO': 'bg-red-100 text-red-800'
        };
        return colores[tipo] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Tokens Encontrados ({tokens.length})
            </h3>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Token
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tipo
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Posición
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {tokens.map((token) => (
                        <tr key={token.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {token.id}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                {token.palabra}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTipoColor(token.tipo)}`}>
                    {token.tipo}
                  </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                Col {token.columna}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {token.valor}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TokenTable;