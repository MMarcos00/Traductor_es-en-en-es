// Gramática BNF para oraciones simples inglés-español
/*
<oracion> ::= <sujeto> <predicado> [<complemento>] [<puntuacion>]
<sujeto> ::= [<articulo>] <nucleo>
<nucleo> ::= <sustantivo> | <pronombre>
<predicado> ::= <verbo> [<adjetivo>] | <verbo> <sujeto>
<complemento> ::= <preposicion> <sujeto>
<puntuacion> ::= "." | "!" | "?" | ""
*/

export enum TipoNodoGramatical {
    ORACION = 'Oración',
    SUJETO = 'Sujeto',
    PREDICADO = 'Predicado',
    COMPLEMENTO = 'Complemento',
    NUCLEO = 'Núcleo',
    ARTICULO = 'Artículo',
    SUSTANTIVO = 'Sustantivo',
    PRONOMBRE = 'Pronombre',
    VERBO = 'Verbo',
    ADJETIVO = 'Adjetivo',
    PREPOSICION = 'Preposición',
    PUNTUACION = 'Puntuación'
}

export interface NodoGramatical {
    tipo: TipoNodoGramatical;
    valor: string;
    hijos: NodoGramatical[];
}

// Patrones de oraciones válidas
export const PATRONES_VALIDOS = [
    // Artículo + Sustantivo + Verbo: "The dog runs"
    /^ARTICULO SUSTANTIVO VERBO PUNTUACION?$/,
    /^ARTICULO SUSTANTIVO VERBO ADJETIVO PUNTUACION?$/,
    // Pronombre + Verbo: "I run"
    /^PRONOMBRE VERBO PUNTUACION?$/,
    /^PRONOMBRE VERBO ADJETIVO PUNTUACION?$/,
    // Pronombre + Verbo + Artículo + Sustantivo: "I read the book"
    /^PRONOMBRE VERBO ARTICULO SUSTANTIVO PUNTUACION?$/,
    // Artículo + Sustantivo + Verbo + Preposición + Artículo + Sustantivo: "The cat is in the house"
    /^ARTICULO SUSTANTIVO VERBO PREPOSICION ARTICULO SUSTANTIVO PUNTUACION?$/,
    // Sin artículo: Sustantivo + Verbo
    /^SUSTANTIVO VERBO PUNTUACION?$/,
];