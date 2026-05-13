export class VoiceRecognizer {
    private recognition: SpeechRecognition | null = null;
    private escuchando: boolean = false;

    constructor() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.configurarReconocimiento();
        }
    }

    private configurarReconocimiento(): void {
        if (!this.recognition) return;

        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
    }

    cambiarIdioma(idioma: 'en' | 'es'): void {
        if (!this.recognition) return;

        if (idioma === 'en') {
            this.recognition.lang = 'en-US';
        } else {
            this.recognition.lang = 'es-ES';
        }
    }

    iniciarEscucha(onResultado: (texto: string) => void, onError?: (error: string) => void): void {
        if (!this.recognition) {
            onError?.('Reconocimiento de voz no soportado en este navegador');
            return;
        }

        if (this.escuchando) {
            this.detenerEscucha();
            return;
        }

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcripcion = event.results[0][0].transcript;
            onResultado(transcripcion);
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            onError?.(`Error de reconocimiento: ${event.error}`);
            this.escuchando = false;
        };

        this.recognition.onend = () => {
            this.escuchando = false;
        };

        try {
            this.recognition.start();
            this.escuchando = true;
        } catch {
            onError?.('Error al iniciar el reconocimiento de voz');
        }
    }

    detenerEscucha(): void {
        if (this.recognition && this.escuchando) {
            this.recognition.stop();
            this.escuchando = false;
        }
    }

    estaEscuchando(): boolean {
        return this.escuchando;
    }

    estaSoportado(): boolean {
        return this.recognition !== null;
    }
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
}

interface SpeechRecognitionEvent {
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
}

interface SpeechRecognitionResult {
    [index: number]: SpeechRecognitionAlternative;
    isFinal: boolean;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition;
        webkitSpeechRecognition: new () => SpeechRecognition;
    }
}