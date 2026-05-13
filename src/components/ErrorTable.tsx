import type React from 'react';
import type { ErrorCompilador } from '../types';
import { TipoError } from '../types';

interface ErrorTableProps {
    errores: ErrorCompilador[];
}

const ErrorTable: React.FC<ErrorTableProps> = ({ errores }) => {
    if (errores.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-green-600 font-semibold">No se encontraron errores</p>
            </div>
        );
    }

    const getTipoErrorColor = (tipo: TipoError): string => {
        switch (tipo) {
            case TipoError.LEXICO:
                return 'bg-red-100 text-red-800 border-red-300';
            case TipoError.SINTACTICO:
                return 'bg-orange-100 text-orange-800 border-orange-300';
            case TipoError.SEMANTICO:
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Errores Encontrados ({errores.length})
            </h3>
            <div className="space-y-3">
                {errores.map((error) => (
                    <div
                        key={error.id}
                        className={`p-4 rounded-lg border ${getTipoErrorColor(error.tipo)}`}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <span className="font-bold text-sm uppercase">{error.tipo}</span>
                                <span className="text-xs ml-2">- {error.fase}</span>
                                <p className="text-sm font-medium mt-1">{error.descripcion}</p>
                                {error.sugerencia && (
                                    <p className="text-xs mt-2">Sugerencia: {error.sugerencia}</p>
                                )}
                            </div>
                            <span className="text-xs">#{error.id}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ErrorTable;