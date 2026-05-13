// ===== TIPOS DE TOKENS =====
export enum TipoToken {
    SUSTANTIVO = 'SUSTANTIVO',
    VERBO = 'VERBO',
    PRONOMBRE = 'PRONOMBRE',
    ADJETIVO = 'ADJETIVO',
    ARTICULO = 'ARTICULO',
    PREPOSICION = 'PREPOSICION',
    CONJUNCION = 'CONJUNCION',
    ADVERBIO = 'ADVERBIO',
    PUNTUACION = 'PUNTUACION',
    DESCONOCIDO = 'DESCONOCIDO'
}

// ===== ESTRUCTURA DE UN TOKEN =====
export interface Token {
    id: number;
    palabra: string;
    tipo: TipoToken;
    linea: number;
    columna: number;
    valor: string;
}

// ===== ENTRADA DE LA TABLA DE SÍMBOLOS =====
export interface EntradaTablaSimbolos {
    token: string;
    tipo: string;
    categoria: string;
    posicion: string;
    valor: string;
    ambito: string;
}

// ===== TIPOS DE ERROR =====
export enum TipoError {
    LEXICO = 'LÉXICO',
    SINTACTICO = 'SINTÁCTICO',
    SEMANTICO = 'SEMÁNTICO'
}

// ===== ESTRUCTURA DE UN ERROR =====
export interface ErrorCompilador {
    id: number;
    tipo: TipoError;
    ubicacion: string;
    descripcion: string;
    fase: string;
    sugerencia?: string;
}

// ===== NODO DEL ÁRBOL DE DERIVACIÓN =====
export interface NodoArbol {
    nombre: string;
    hijos: NodoArbol[];
    token?: Token;
    esHoja: boolean;
}

// ===== RESULTADO DEL ANÁLISIS =====
export interface ResultadoAnalisis {
    textoOriginal: string;
    textoTraducido: string;
    tokens: Token[];
    tablaSimbolos: EntradaTablaSimbolos[];
    errores: ErrorCompilador[];
    arbolDerivacion: NodoArbol | null;
    idiomaOrigen: 'en' | 'es';
    idiomaDestino: 'en' | 'es';
}

// ===== DIRECCIÓN DE TRADUCCIÓN =====
export type DireccionTraduccion = 'en-es' | 'es-en';