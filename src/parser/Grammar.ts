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
    /^ADVERBIO$/,
    /^SUSTANTIVO$/,
    /^ADVERBIO PUNTUACION$/,
    /^SUSTANTIVO PUNTUACION$/,
    /^PRONOMBRE$/,
    /^PRONOMBRE PUNTUACION$/,
    // Artículo + Sustantivo + Verbo
    /^ARTICULO SUSTANTIVO VERBO PUNTUACION?$/,
    /^ARTICULO SUSTANTIVO VERBO ADJETIVO PUNTUACION?$/,
    // Pronombre + Verbo
    /^PRONOMBRE VERBO PUNTUACION?$/,
    /^PRONOMBRE VERBO ADJETIVO PUNTUACION?$/,
    // Pronombre + Verbo + Artículo + Sustantivo
    /^PRONOMBRE VERBO ARTICULO SUSTANTIVO PUNTUACION?$/,
    // Artículo + Sustantivo + Verbo + Preposición + Artículo + Sustantivo
    /^ARTICULO SUSTANTIVO VERBO PREPOSICION ARTICULO SUSTANTIVO PUNTUACION?$/,
    // Sustantivo + Verbo
    /^SUSTANTIVO VERBO PUNTUACION?$/,
    // Pronombre + Sustantivo + Verbo + Sustantivo: "My name is Luis"
    /^PRONOMBRE SUSTANTIVO VERBO SUSTANTIVO PUNTUACION?$/,
    // Saludo + Pronombre + Sustantivo + Verbo + Sustantivo: "Hi my name is Luis"
    /^SUSTANTIVO PRONOMBRE SUSTANTIVO VERBO SUSTANTIVO PUNTUACION?$/,
    // Saludo + Pronombre + Verbo + Artículo + Sustantivo
    /^SUSTANTIVO PRONOMBRE VERBO ARTICULO SUSTANTIVO PUNTUACION?$/,
    // Adverbio + Pronombre + Sustantivo + Verbo + Sustantivo
    /^ADVERBIO PRONOMBRE SUSTANTIVO VERBO SUSTANTIVO PUNTUACION?$/,
    // Adverbio + Artículo + Sustantivo + Verbo + Adjetivo
    /^ADVERBIO ARTICULO SUSTANTIVO VERBO ADJETIVO PUNTUACION?$/,
    // Cualquier combinación de 3+ tokens (acepta todo)
    /^(SUSTANTIVO|PRONOMBRE|VERBO|ADJETIVO|ARTICULO|ADVERBIO|PREPOSICION|CONJUNCION)\s+(SUSTANTIVO|PRONOMBRE|VERBO|ADJETIVO|ARTICULO|ADVERBIO|PREPOSICION|CONJUNCION)\s+(SUSTANTIVO|PRONOMBRE|VERBO|ADJETIVO|ARTICULO|ADVERBIO|PREPOSICION|CONJUNCION)/,
    // Palabra suelta (saludo, interjección)
    /^PRONOMBRE PUNTUACION?$/,
];