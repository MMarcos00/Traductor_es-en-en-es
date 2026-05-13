import { TokenLexico, CategoriaGramatical } from '../lexer/TokenTypes';
import { NodoGramatical, TipoNodoGramatical, PATRONES_VALIDOS } from './Grammar';

export class Parser {
    private erroresSintacticos: string[] = [];

    analizar(tokens: TokenLexico[]): { arbol: NodoGramatical | null; errores: string[] } {
        this.erroresSintacticos = [];

        if (tokens.length === 0) {
            this.erroresSintacticos.push('Error sintáctico: la oración está vacía');
            return { arbol: null, errores: this.erroresSintacticos };
        }

        // Verificar patrón sintáctico
        const secuenciaCategorias = tokens.map(t => t.categoria).join(' ');
        let patronValido = false;

        for (const patron of PATRONES_VALIDOS) {
            if (patron.test(secuenciaCategorias)) {
                patronValido = true;
                break;
            }
        }

        if (!patronValido) {
            this.erroresSintacticos.push(
                'Estructura de oración no válida. Estructuras aceptadas:\n' +
                '- [Artículo] + Sujeto + Verbo + [Complemento]\n' +
                '- Pronombre + Verbo + [Objeto]\n' +
                'Ejemplo: "The dog runs" o "I read the book"'
            );
        }

        const arbol = this.construirArbol(tokens);
        return { arbol, errores: this.erroresSintacticos };
    }

    private construirArbol(tokens: TokenLexico[]): NodoGramatical {
        const raiz: NodoGramatical = {
            tipo: TipoNodoGramatical.ORACION,
            valor: 'O',
            hijos: []
        };

        let indice = 0;

        // Construir sujeto
        const resultadoSujeto = this.construirSujeto(tokens, indice);
        if (resultadoSujeto) {
            raiz.hijos.push(resultadoSujeto.nodo);
            indice = resultadoSujeto.indice;
        }

        // Construir predicado
        if (indice < tokens.length) {
            const resultadoPredicado = this.construirPredicado(tokens, indice);
            if (resultadoPredicado) {
                raiz.hijos.push(resultadoPredicado.nodo);
                indice = resultadoPredicado.indice;
            }
        }

        // Construir complemento si hay preposición
        if (indice < tokens.length && tokens[indice].categoria === CategoriaGramatical.PREPOSICION) {
            const resultadoComplemento = this.construirComplemento(tokens, indice);
            if (resultadoComplemento) {
                raiz.hijos.push(resultadoComplemento.nodo);
                indice = resultadoComplemento.indice;
            }
        }

        // Agregar puntuación final
        if (indice < tokens.length && tokens[indice].categoria === CategoriaGramatical.PUNTUACION) {
            raiz.hijos.push({
                tipo: TipoNodoGramatical.PUNTUACION,
                valor: tokens[indice].valor,
                hijos: []
            });
        }

        return raiz;
    }

    private construirSujeto(tokens: TokenLexico[], indice: number): { nodo: NodoGramatical; indice: number } | null {
        if (indice >= tokens.length) return null;

        const sujeto: NodoGramatical = {
            tipo: TipoNodoGramatical.SUJETO,
            valor: 'S',
            hijos: []
        };

        // Verificar artículo
        if (tokens[indice].categoria === CategoriaGramatical.ARTICULO) {
            sujeto.hijos.push({
                tipo: TipoNodoGramatical.ARTICULO,
                valor: tokens[indice].valor,
                hijos: []
            });
            indice++;
        }

        // Núcleo del sujeto
        if (indice < tokens.length) {
            const nucleo: NodoGramatical = {
                tipo: TipoNodoGramatical.NUCLEO,
                valor: 'N',
                hijos: []
            };

            const token = tokens[indice];
            if (token.categoria === CategoriaGramatical.PRONOMBRE) {
                nucleo.hijos.push({
                    tipo: TipoNodoGramatical.PRONOMBRE,
                    valor: token.valor,
                    hijos: []
                });
            } else if (token.categoria === CategoriaGramatical.SUSTANTIVO) {
                nucleo.hijos.push({
                    tipo: TipoNodoGramatical.SUSTANTIVO,
                    valor: token.valor,
                    hijos: []
                });
            }

            sujeto.hijos.push(nucleo);
            indice++;
        }

        return { nodo: sujeto, indice };
    }

    private construirPredicado(tokens: TokenLexico[], indice: number): { nodo: NodoGramatical; indice: number } | null {
        if (indice >= tokens.length) return null;

        const predicado: NodoGramatical = {
            tipo: TipoNodoGramatical.PREDICADO,
            valor: 'P',
            hijos: []
        };

        // Verbo
        if (tokens[indice].categoria === CategoriaGramatical.VERBO) {
            predicado.hijos.push({
                tipo: TipoNodoGramatical.VERBO,
                valor: tokens[indice].valor,
                hijos: []
            });
            indice++;

            // Verificar si hay adjetivo después del verbo
            if (indice < tokens.length && tokens[indice].categoria === CategoriaGramatical.ADJETIVO) {
                predicado.hijos.push({
                    tipo: TipoNodoGramatical.ADJETIVO,
                    valor: tokens[indice].valor,
                    hijos: []
                });
                indice++;
            }
            // O si hay un objeto directo (artículo + sustantivo)
            else if (indice < tokens.length && tokens[indice].categoria === CategoriaGramatical.ARTICULO) {
                const resultadoSujeto = this.construirSujeto(tokens, indice);
                if (resultadoSujeto) {
                    predicado.hijos.push(resultadoSujeto.nodo);
                    indice = resultadoSujeto.indice;
                }
            }
        }

        return { nodo: predicado, indice };
    }

    private construirComplemento(tokens: TokenLexico[], indice: number): { nodo: NodoGramatical; indice: number } | null {
        if (indice >= tokens.length) return null;

        const complemento: NodoGramatical = {
            tipo: TipoNodoGramatical.COMPLEMENTO,
            valor: 'C',
            hijos: []
        };

        // Preposición
        if (tokens[indice].categoria === CategoriaGramatical.PREPOSICION) {
            complemento.hijos.push({
                tipo: TipoNodoGramatical.PREPOSICION,
                valor: tokens[indice].valor,
                hijos: []
            });
            indice++;

            // Sujeto del complemento
            const resultadoSujeto = this.construirSujeto(tokens, indice);
            if (resultadoSujeto) {
                complemento.hijos.push(resultadoSujeto.nodo);
                indice = resultadoSujeto.indice;
            }
        }

        return { nodo: complemento, indice };
    }
}