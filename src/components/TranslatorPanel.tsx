import { useState } from 'react';
import VoiceInput from './VoiceInput';
import AnalysisTabs from './AnalysisTabs';
import { Translator } from '../translator/Translator';
import type { ResultadoAnalisis } from '../types';

const TranslatorPanel: React.FC = () => {
    const [textoEntrada, setTextoEntrada] = useState('');
    const [textoTraducido, setTextoTraducido] = useState('');
    const [direccion, setDireccion] = useState<'en-es' | 'es-en'>('en-es');
    const [resultadoAnalisis, setResultadoAnalisis] = useState<ResultadoAnalisis | null>(null);
    const [cargando, setCargando] = useState(false);
    const [traductor] = useState(() => new Translator());
    const [hablando, setHablando] = useState(false);
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [modoOscuro, setModoOscuro] = useState(true);

    const handleTraducir = () => {
        if (!textoEntrada.trim()) return;

        setCargando(true);

        setTimeout(() => {
            const resultado = traductor.traducir(textoEntrada, direccion);
            setTextoTraducido(resultado.textoTraducido);
            setResultadoAnalisis(resultado);
            setCargando(false);
        }, 500);
    };
    const handleCargarArchivo = (event: React.ChangeEvent<HTMLInputElement>) => {
        const archivo = event.target.files?.[0];
        if (!archivo) return;

        const lector = new FileReader();
        lector.onload = (e) => {
            const contenido = e.target?.result as string;
            setTextoEntrada(contenido);
        };
        lector.readAsText(archivo);

        // Limpiar el input para permitir cargar el mismo archivo de nuevo
        event.target.value = '';
    };
    const handleTextoVoz = (texto: string) => {
        setTextoEntrada(texto);
    };

    const handleCambiarDireccion = () => {
        setDireccion(direccion === 'en-es' ? 'es-en' : 'en-es');
        setTextoEntrada('');
        setTextoTraducido('');
        setResultadoAnalisis(null);
    };

    const handleLimpiar = () => {
        setTextoEntrada('');
        setTextoTraducido('');
        setResultadoAnalisis(null);
    };

    const handleEscucharTraduccion = () => {
        if (!textoTraducido || hablando) return;

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textoTraducido);
            utterance.lang = direccion === 'en-es' ? 'es-ES' : 'en-US';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.onstart = () => setHablando(true);
            utterance.onend = () => setHablando(false);
            utterance.onerror = () => setHablando(false);
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Tu navegador no soporta lectura de voz');
        }
    };

    const handleEscucharOriginal = () => {
        if (!textoEntrada || hablando) return;

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textoEntrada);
            utterance.lang = direccion === 'en-es' ? 'en-US' : 'es-ES';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.onstart = () => setHablando(true);
            utterance.onend = () => setHablando(false);
            utterance.onerror = () => setHablando(false);
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div className={`min-h-screen p-4 md:p-8 transition-all duration-500 ${
            modoOscuro
                ? 'bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900'
                : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
        }`}>
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8 animate-fadeIn">
                    <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="text-6xl animate-bounce">⚒️</div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600">
                                WordFORGE
                            </h1>

                        </div>
                        <div className="text-6xl animate-bounce">⚒️</div>
                    </div>
                    <p className="text-gray-500 text-sm md:text-base text-center italic">
                        "Forjando palabras, compilando significados"
                    </p>
                </div>

                {/* Panel de Traduccion */}
                <div className="glass-effect p-6 mb-8 animate-fadeIn">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Panel Izquierdo - Entrada */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    {direccion === 'en-es' ? 'Ingles' : 'Espanol'}
                                </label>
                                <div className="flex items-center gap-2">
                                    {/* Boton cargar archivo .txt */}
                                    <label
                                        className="p-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
                                        title="Cargar archivo .txt"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <input
                                            type="file"
                                            accept=".txt"
                                            onChange={handleCargarArchivo}
                                            className="hidden"
                                            disabled={cargando}
                                        />
                                    </label>
                                    <button
                                        onClick={handleEscucharOriginal}
                                        disabled={!textoEntrada.trim() || hablando}
                                        className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Escuchar texto original"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                        </svg>
                                    </button>
                                    <VoiceInput
                                        onTextoReconocido={handleTextoVoz}
                                        idioma={direccion === 'en-es' ? 'en' : 'es'}
                                        estaDeshabilitado={cargando}
                                    />
                                </div>
                            </div>
                            <textarea
                                value={textoEntrada}
                                onChange={(e) => setTextoEntrada(e.target.value)}
                                placeholder={direccion === 'en-es' ? 'Escribe en ingles...' : 'Escribe en espanol...'}
                                className="input-area h-40"
                                disabled={cargando}
                            />
                        </div>

                        {/* Boton de intercambio */}
                        <div className="flex items-center justify-center">
                            <button
                                onClick={handleCambiarDireccion}
                                className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-110"
                                title="Cambiar direccion de traduccion"
                            >
                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </button>
                        </div>

                        {/* Panel Derecho - Traduccion */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    {direccion === 'en-es' ? 'Espanol' : 'Ingles'}
                                </label>
                                <button
                                    onClick={handleEscucharTraduccion}
                                    disabled={!textoTraducido.trim() || hablando}
                                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Escuchar traduccion"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                </button>
                            </div>
                            <textarea
                                value={textoTraducido}
                                readOnly
                                placeholder="Traduccion..."
                                className="input-area h-40 bg-gray-50"
                            />
                        </div>
                    </div>

                    {/* Botones de accion */}
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={handleTraducir}
                            disabled={!textoEntrada.trim() || cargando}
                            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {cargando ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    <span>Analizando...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                    <span>Traducir y Analizar</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleLimpiar}
                            className="btn-secondary flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Limpiar</span>
                        </button>
                    </div>
                </div>

                {/* Resultados del Analisis */}
                {resultadoAnalisis && (
                    <div className="animate-fadeIn">
                        <AnalysisTabs
                            tokens={resultadoAnalisis.tokens}
                            tablaSimbolos={resultadoAnalisis.tablaSimbolos}
                            errores={resultadoAnalisis.errores}
                            arbolDerivacion={resultadoAnalisis.arbolDerivacion}
                        />
                    </div>
                )}
                {/* Boton Modo Oscuro/Claro */}
                <button
                    onClick={() => setModoOscuro(!modoOscuro)}
                    className="fixed bottom-6 left-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50"
                    title={modoOscuro ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
                >
                    {modoOscuro ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>
                {/* Boton de Informacion */}
                <button
                    onClick={() => setMostrarInfo(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50 flex items-center gap-2"
                    title="Informacion del Proyecto"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden md:inline font-semibold">Info</span>
                </button>

                {/* Modal de Informacion */}
                {mostrarInfo && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Header del Modal */}
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
                                        <span className="text-4xl">🌐</span>
                                        Traductor Compilador
                                    </h2>
                                    <button
                                        onClick={() => setMostrarInfo(false)}
                                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="text-blue-100 mt-2">Proyecto de Simulacion de Compilador</p>
                            </div>

                            {/* Contenido */}
                            <div className="p-6">
                                {/* Descripcion */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <span>📋</span> Descripcion del Proyecto
                                    </h3>
                                    <p className="text-gray-600">
                                        Aplicacion web que simula el funcionamiento de un compilador realizando
                                        analisis lexico, sintactico y semantico para traducir oraciones entre
                                        ingles y espanol.
                                    </p>
                                </div>

                                {/* Tecnologias */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <span>⚙️</span> Tecnologias Utilizadas
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">React</span>
                                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">TypeScript</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Vite</span>
                                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">Tailwind CSS</span>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">D3.js</span>
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Web Speech API</span>
                                    </div>
                                </div>

                                {/* Integrantes */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <span>👥</span> Integrantes del Equipo
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            'KEVEN RYAN LOPEZ PINEDA',
                                            'LUIS ALFONSO MORAN JUAREZ',
                                            'MARCOS EMANUEL MENDEZ ORTEGA'
                                        ].map((nombre, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg hover:shadow-md transition-all"
                                            >
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                                    {nombre.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">{nombre}</p>
                                                    <p className="text-xs text-gray-500">Desarrollador</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Caracteristicas */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <span>✨</span> Caracteristicas
                                    </h3>
                                    <ul className="space-y-2 text-gray-600">
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✅</span> Analisis Lexico
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✅</span> Analisis Sintactico con Arbol de Derivacion
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✅</span> Analisis Semantico
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✅</span> Tabla de Simbolos y Tokens
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✅</span> Deteccion de Errores
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✅</span> Reconocimiento de Voz
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✅</span> Lectura de Texto en Voz Alta
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="bg-gray-50 p-4 rounded-b-2xl text-center">
                                <button
                                    onClick={() => setMostrarInfo(false)}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TranslatorPanel;