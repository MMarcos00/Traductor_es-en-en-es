import { TokenLexico, CategoriaGramatical } from '../lexer/TokenTypes';
import { NodoGramatical } from '../parser/Grammar';

export class SemanticAnalyzer {
    private erroresSemanticos: string[] = [];
    private advertencias: string[] = [];

    analizar(tokens: TokenLexico[], arbol: NodoGramatical | null): { errores: string[]; advertencias: string[] } {
        this.erroresSemanticos = [];
        this.advertencias = [];

        if (!arbol) {
            this.erroresSemanticos.push('No se puede realizar análisis semántico sin estructura válida');
            return { errores: this.erroresSemanticos, advertencias: this.advertencias };
        }

        this.verificarConcordancia(tokens);
        this.verificarCoherencia(tokens);
        this.verificarElementosObligatorios(tokens);

        return { errores: this.erroresSemanticos, advertencias: this.advertencias };
    }

    private verificarConcordancia(tokens: TokenLexico[]): void {
        for (let i = 0; i < tokens.length - 1; i++) {
            // Verificar concordancia artículo-sustantivo en español
            if (tokens[i].categoria === CategoriaGramatical.ARTICULO &&
                tokens[i + 1].categoria === CategoriaGramatical.SUSTANTIVO) {

                const articulo = tokens[i].valor.toLowerCase();
                const sustantivo = tokens[i + 1].valor.toLowerCase();

                if (articulo === 'el' && (sustantivo.endsWith('a') || sustantivo.endsWith('ción'))) {
                    this.advertencias.push(`Posible discordancia: "${articulo}" es masculino pero "${sustantivo}" parece femenino`);
                }
                if (articulo === 'la' && sustantivo.endsWith('o')) {
                    this.advertencias.push(`Posible discordancia: "${articulo}" es femenino pero "${sustantivo}" parece masculino`);
                }
            }

            // Verificar concordancia pronombre-verbo
            if (tokens[i].categoria === CategoriaGramatical.PRONOMBRE &&
                tokens[i + 1].categoria === CategoriaGramatical.VERBO) {

                const pronombre = tokens[i].valor.toLowerCase();
                const verbo = tokens[i + 1].valor.toLowerCase();

                if (pronombre === 'yo' && verbo === 'es') {
                    this.erroresSemanticos.push(`Error de concordancia: con "yo" se usa "soy", no "es"`);
                }
                if (pronombre === 'tú' && verbo === 'soy') {
                    this.erroresSemanticos.push(`Error de concordancia: con "tú" se usa "eres", no "soy"`);
                }
                if (pronombre === 'i' && verbo === 'is') {
                    this.erroresSemanticos.push(`Concordance error: with "I" use "am", not "is"`);
                }
            }
        }
    }

    private verificarCoherencia(tokens: TokenLexico[]): void {
        // Verificar palabras repetidas
        const palabras = tokens.map(t => t.valor.toLowerCase());
        const repetidas = palabras.filter((palabra, index) =>
            palabras.indexOf(palabra) !== index && palabra.length > 2
        );

        if (repetidas.length > 0) {
            this.advertencias.push(`Palabras repetidas: ${[...new Set(repetidas)].join(', ')}`);
        }

        // Verificar combinaciones ilógicas
        for (let i = 0; i < tokens.length - 1; i++) {
            if (tokens[i].categoria === CategoriaGramatical.ARTICULO &&
                tokens[i + 1].categoria === CategoriaGramatical.VERBO) {
                this.erroresSemanticos.push(`Combinación ilógica: artículo "${tokens[i].valor}" seguido de verbo "${tokens[i+1].valor}"`);
            }
            if (tokens[i].categoria === CategoriaGramatical.PREPOSICION &&
                tokens[i + 1].categoria === CategoriaGramatical.VERBO) {
                this.advertencias.push(`Estructura inusual: preposición seguida de verbo`);
            }
        }
    }

    private verificarElementosObligatorios(tokens: TokenLexico[]): void {
        const tieneSujeto = tokens.some(t =>
            t.categoria === CategoriaGramatical.PRONOMBRE ||
            t.categoria === CategoriaGramatical.SUSTANTIVO
        );

        const tieneVerbo = tokens.some(t => t.categoria === CategoriaGramatical.VERBO);

        if (!tieneSujeto) {
            this.erroresSemanticos.push('La oración no tiene sujeto explícito');
        }
        if (!tieneVerbo) {
            this.erroresSemanticos.push('La oración no tiene verbo');
        }

        // Verificar que no termine en preposición
        const ultimoToken = tokens[tokens.length - 1];
        if (ultimoToken && ultimoToken.categoria === CategoriaGramatical.PREPOSICION) {
            this.erroresSemanticos.push('La oración no debe terminar con una preposición');
        }
    }
}