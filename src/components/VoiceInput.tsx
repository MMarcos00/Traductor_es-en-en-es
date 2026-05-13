import { useState, useRef, useCallback } from 'react';

interface VoiceInputProps {
    onTextoReconocido: (texto: string) => void;
    idioma: 'en' | 'es';
    estaDeshabilitado: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const VoiceInput: React.FC<VoiceInputProps> = ({ onTextoReconocido, idioma, estaDeshabilitado }) => {
    const [escuchando, setEscuchando] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reconocimientoRef = useRef<any>(null);

    const iniciarReconocimiento = useCallback(() => {
        setError(null);

        if (!SpeechRecognitionAPI) {
            setError('Reconocimiento de voz no soportado. Use Chrome.');
            return;
        }

        if (reconocimientoRef.current) {
            reconocimientoRef.current.stop();
            reconocimientoRef.current = null;
            setEscuchando(false);
            return;
        }

        try {
            const reconocimiento = new SpeechRecognitionAPI();
            reconocimiento.continuous = false;
            reconocimiento.interimResults = false;
            reconocimiento.lang = idioma === 'en' ? 'en-US' : 'es-ES';

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reconocimiento.onresult = (event: any) => {
                const transcripcion = event.results[0][0].transcript;
                onTextoReconocido(transcripcion);
                setEscuchando(false);
                reconocimientoRef.current = null;
            };

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reconocimiento.onerror = (event: any) => {
                setError(`Error: ${event.error}`);
                setEscuchando(false);
                reconocimientoRef.current = null;
            };

            reconocimiento.onend = () => {
                setEscuchando(false);
                reconocimientoRef.current = null;
            };

            reconocimiento.onstart = () => {
                setEscuchando(true);
            };

            reconocimientoRef.current = reconocimiento;
            reconocimiento.start();
        } catch {
            setError('Error al iniciar el micrófono');
            setEscuchando(false);
        }
    }, [idioma, onTextoReconocido]);

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={iniciarReconocimiento}
                disabled={estaDeshabilitado}
                className={`p-3 rounded-full transition-all duration-300 ${
                    escuchando
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse scale-110'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                } text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                title={escuchando ? 'Grabando... Click para detener' : 'Click para hablar'}
            >
                {escuchando ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 6a4 4 0 118 0v6a4 4 0 01-8 0V6z" />
                        <path d="M19 11a1 1 0 012 0 9 9 0 01-8 8.945V21h3a1 1 0 010 2H8a1 1 0 010-2h3v-1.055A9 9 0 013 11a1 1 0 012 0 7 7 0 1014 0z" />
                    </svg>
                ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                )}
            </button>

            {escuchando && (
                <span className="text-sm text-red-500 font-medium animate-pulse">
                    Escuchando...
                </span>
            )}

            {error && (
                <span className="text-sm text-red-500">
                    {error}
                </span>
            )}
        </div>
    );
};

export default VoiceInput;