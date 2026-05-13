import { useState } from 'react';
import TokenTable from './TokenTable';
import SymbolTable from './SymbolTable';
import ErrorTable from './ErrorTable';
import ParseTree from './ParseTree';
import type { Token, EntradaTablaSimbolos, ErrorCompilador, NodoArbol } from '../types';

interface AnalysisTabsProps {
    tokens: Token[];
    tablaSimbolos: EntradaTablaSimbolos[];
    errores: ErrorCompilador[];
    arbolDerivacion: NodoArbol | null;
}

type TabType = 'tokens' | 'simbolos' | 'errores' | 'arbol';

const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ tokens, tablaSimbolos, errores, arbolDerivacion }) => {
    const [tabActiva, setTabActiva] = useState<TabType>('tokens');

    const tabs = [
        { id: 'tokens' as TabType, label: 'Tokens', icon: '🔤', count: tokens.length },
        { id: 'simbolos' as TabType, label: 'Tabla Simbolos', icon: '📊', count: tablaSimbolos.length },
        { id: 'errores' as TabType, label: 'Errores', icon: '⚠️', count: errores.length },
        { id: 'arbol' as TabType, label: 'Arbol', icon: '🌳', count: arbolDerivacion ? 1 : 0 },
    ];

    return (
        <div className="glass-effect p-6">
            <h2 className="panel-title">Analisis del Compilador</h2>

            <div className="flex flex-wrap gap-2 mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setTabActiva(tab.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                            tabActiva === tab.id
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        <span>{tab.icon}</span>
                        <span>{tab.label}</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                            tabActiva === tab.id ? 'bg-white text-blue-600' : 'bg-gray-200 text-gray-600'
                        }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            <div className="mt-4">
                {tabActiva === 'tokens' && <TokenTable tokens={tokens} />}
                {tabActiva === 'simbolos' && <SymbolTable simbolos={tablaSimbolos} />}
                {tabActiva === 'errores' && <ErrorTable errores={errores} />}
                {tabActiva === 'arbol' && <ParseTree arbol={arbolDerivacion} />}
            </div>
        </div>
    );
};

export default AnalysisTabs;