import { Lexer } from '../lexer/Lexer';
import { Parser } from '../parser/Parser';
import { SemanticAnalyzer } from '../semantic/SemanticAnalyzer';
import { Dictionary } from './Dictionary';
import type {
    Token,
    EntradaTablaSimbolos,
    ErrorCompilador,
    NodoArbol,
    ResultadoAnalisis
} from '../types';
import { TipoError, TipoToken } from '../types';
import type { TokenLexico } from '../lexer/TokenTypes';
import { CategoriaGramatical } from '../lexer/TokenTypes';
import type { NodoGramatical } from '../parser/Grammar';

export class Translator {
    private lexer: Lexer;
    private parser: Parser;
    private semanticAnalyzer: SemanticAnalyzer;
    private dictionary: Dictionary;

    // Frases comunes
    private frasesComunesEnEs: Record<string, string> = {
        'hola mi nombre es': 'hello my name is',
        'hola me llamo': 'hello my name is',
        'mi nombre es': 'my name is',
        'me llamo': 'my name is',
        'hola': 'hello',
        'buenos días': 'good morning',
        'buenas tardes': 'good afternoon',
        'buenas noches': 'good night',
        '¿cómo estás?': 'how are you?',
        '¿cómo está?': 'how are you?',
        'estoy bien': 'i am fine',
        'muchas gracias': 'thank you very much',
        'de nada': 'you are welcome',
        'por favor': 'please',
        'lo siento': 'i am sorry',
        'te quiero': 'i love you',
        'te amo': 'i love you',
        '¿cuántos años tienes?': 'how old are you?',
        '¿de dónde eres?': 'where are you from?',
        '¿dónde vives?': 'where do you live?',
        'me gusta': 'i like',
        'no me gusta': 'i do not like',
        '¿qué hora es?': 'what time is it?',
        'hasta luego': 'see you later',
        'hasta mañana': 'see you tomorrow',
        'feliz cumpleaños': 'happy birthday',
        'feliz navidad': 'merry christmas',
        'feliz año nuevo': 'happy new year',
        '¿cómo te llamas?': 'what is your name?',
        '¿qué tal?': 'how are you?',
        'muy bien': 'very well',
        'más o menos': 'so so',
        'estoy triste': 'i am sad',
        'estoy feliz': 'i am happy',
        'estoy cansado': 'i am tired',
        'tengo hambre': 'i am hungry',
        'tengo sed': 'i am thirsty',
        'tengo sueño': 'i am sleepy',
        '¿te gusta?': 'do you like it?',
        'me encanta': 'i love it',
        'no entiendo': 'i do not understand',
        'no sé': 'i do not know',
        '¿puedes ayudarme?': 'can you help me?',
        'claro que sí': 'of course',
        'por supuesto': 'of course',
        '¿dónde está?': 'where is it?'
    };

    private frasesComunesEsEn: Record<string, string> = {
        'hello my name is': 'hola mi nombre es',
        'my name is': 'me llamo',
        'hello': 'hola',
        'hi': 'hola',
        'good morning': 'buenos días',
        'good afternoon': 'buenas tardes',
        'good evening': 'buenas noches',
        'good night': 'buenas noches',
        'how are you?': '¿cómo estás?',
        'how are you': '¿cómo estás?',
        'i am fine': 'estoy bien',
        'i\'m fine': 'estoy bien',
        'thank you': 'gracias',
        'thank you very much': 'muchas gracias',
        'thanks': 'gracias',
        'you are welcome': 'de nada',
        'you\'re welcome': 'de nada',
        'please': 'por favor',
        'i am sorry': 'lo siento',
        'i\'m sorry': 'lo siento',
        'sorry': 'lo siento',
        'i love you': 'te quiero',
        'how old are you?': '¿cuántos años tienes?',
        'how old are you': '¿cuántos años tienes?',
        'where are you from?': '¿de dónde eres?',
        'where are you from': '¿de dónde eres?',
        'where do you live?': '¿dónde vives?',
        'where do you live': '¿dónde vives?',
        'i like': 'me gusta',
        'i do not like': 'no me gusta',
        'i don\'t like': 'no me gusta',
        'what time is it?': '¿qué hora es?',
        'what time is it': '¿qué hora es?',
        'see you later': 'hasta luego',
        'see you tomorrow': 'hasta mañana',
        'happy birthday': 'feliz cumpleaños',
        'merry christmas': 'feliz navidad',
        'happy new year': 'feliz año nuevo',
        'what is your name?': '¿cómo te llamas?',
        'what is your name': '¿cómo te llamas?',
        'what\'s your name?': '¿cómo te llamas?',
        'very well': 'muy bien',
        'so so': 'más o menos',
        'i am sad': 'estoy triste',
        'i\'m sad': 'estoy triste',
        'i am happy': 'estoy feliz',
        'i\'m happy': 'estoy feliz',
        'i am tired': 'estoy cansado',
        'i\'m tired': 'estoy cansado',
        'i am hungry': 'tengo hambre',
        'i\'m hungry': 'tengo hambre',
        'i am thirsty': 'tengo sed',
        'i\'m thirsty': 'tengo sed',
        'do you like it?': '¿te gusta?',
        'do you like': '¿te gusta',
        'i love it': 'me encanta',
        'i do not understand': 'no entiendo',
        'i don\'t understand': 'no entiendo',
        'i do not know': 'no sé',
        'i don\'t know': 'no sé',
        'can you help me?': '¿puedes ayudarme?',
        'can you help me': '¿puedes ayudarme?',
        'of course': 'por supuesto',
        'where is it?': '¿dónde está?',
        'where is it': '¿dónde está?'
    };

    constructor() {
        this.lexer = new Lexer();
        this.parser = new Parser();
        this.semanticAnalyzer = new SemanticAnalyzer();
        this.dictionary = new Dictionary();
    }

    traducir(texto: string, direccion: 'en-es' | 'es-en'): ResultadoAnalisis {
        const idiomaOrigen = direccion === 'en-es' ? 'en' : 'es';
        const idiomaDestino = direccion === 'en-es' ? 'es' : 'en';

        const resultadoLexico = this.lexer.analizar(texto);
        const tokens = this.convertirTokens(resultadoLexico.tokens);

        const resultadoSintactico = this.parser.analizar(resultadoLexico.tokens);

        const resultadoSemantico = this.semanticAnalyzer.analizar(
            resultadoLexico.tokens,
            resultadoSintactico.arbol
        );

        // Nueva función de traducción mejorada
        const textoTraducido = this.traducirTexto(texto, direccion);

        const tablaSimbolos = this.construirTablaSimbolos(resultadoLexico.tokens);

        const errores = this.construirListaErrores(
            resultadoLexico.errores,
            resultadoSintactico.errores,
            resultadoSemantico.errores.concat(resultadoSemantico.advertencias)
        );

        const arbolDerivacion = resultadoSintactico.arbol
            ? this.convertirArbol(resultadoSintactico.arbol)
            : null;

        return {
            textoOriginal: texto,
            textoTraducido,
            tokens,
            tablaSimbolos,
            errores,
            arbolDerivacion,
            idiomaOrigen,
            idiomaDestino
        };
    }

    private traducirTexto(texto: string, direccion: 'en-es' | 'es-en'): string {
        // Dividir por líneas
        const lineas = texto.split('\n');

        const lineasTraducidas = lineas.map(linea => {
            if (linea.trim() === '') return '';

            // Intentar traducir la línea completa como frase
            const fraseTraducida = this.traducirFrase(linea.trim(), direccion);
            if (fraseTraducida) return fraseTraducida;

            // Si no es frase, traducir palabra por palabra
            return this.traducirPalabraPorPalabra(linea, direccion);
        });

        return lineasTraducidas.join('\n');
    }

    private traducirFrase(texto: string, direccion: 'en-es' | 'es-en'): string | null {
        const textoLower = texto.toLowerCase();

        if (direccion === 'es-en') {
            return this.frasesComunesEnEs[textoLower] || null;
        } else {
            return this.frasesComunesEsEn[textoLower] || null;
        }
    }

    private traducirPalabraPorPalabra(texto: string, direccion: 'en-es' | 'es-en'): string {
        const palabras = texto.split(/(\s+)/);
        let resultado = '';

        for (let i = 0; i < palabras.length; i++) {
            const palabra = palabras[i];

            // Mantener espacios en blanco
            if (palabra.trim() === '') {
                resultado += ' ';
                continue;
            }

            // Intentar frases de 4 palabras
            if (i + 6 < palabras.length) {
                const frase = [
                    palabras[i], palabras[i+1], palabras[i+2], palabras[i+3]
                ].join(' ').toLowerCase().trim().replace(/\s+/g, ' ');

                const traduccion = direccion === 'es-en'
                    ? this.frasesComunesEnEs[frase]
                    : this.frasesComunesEsEn[frase];

                if (traduccion) {
                    resultado += traduccion;
                    i += 3;
                    continue;
                }
            }

            // Intentar frases de 3 palabras
            if (i + 4 < palabras.length) {
                const frase = [
                    palabras[i], palabras[i+1], palabras[i+2]
                ].join(' ').toLowerCase().trim().replace(/\s+/g, ' ');

                const traduccion = direccion === 'es-en'
                    ? this.frasesComunesEnEs[frase]
                    : this.frasesComunesEsEn[frase];

                if (traduccion) {
                    resultado += traduccion;
                    i += 2;
                    continue;
                }
            }

            // Intentar frases de 2 palabras
            if (i + 2 < palabras.length) {
                const frase = [
                    palabras[i], palabras[i+1]
                ].join(' ').toLowerCase().trim().replace(/\s+/g, ' ');

                const traduccion = direccion === 'es-en'
                    ? this.frasesComunesEnEs[frase]
                    : this.frasesComunesEsEn[frase];

                if (traduccion) {
                    resultado += traduccion;
                    i += 1;
                    continue;
                }
            }

// Traducir palabra individual
            const palabraLimpia = palabra.replace(/[.,!?;:¿¡]$/g, '');
            const puntuacionFinal = palabra.match(/[.,!?;:¿¡]+$/g) || [''];
            const puntuacionInicial = palabra.match(/^[¿¡]+/g) || [''];

            const traduccion = this.dictionary.traducirPalabra(palabraLimpia, direccion);

// Agregar un espacio después de cada palabra traducida
            if (resultado.length > 0 && !resultado.endsWith(' ')) {
                resultado += ' ';
            }
            resultado += puntuacionInicial[0] + traduccion + puntuacionFinal[0];
        }

        return resultado;
    }

    private convertirTokens(tokensLexicos: TokenLexico[]): Token[] {
        return tokensLexicos.map(tl => ({
            id: tl.id,
            palabra: tl.palabra,
            tipo: this.mapearCategoriaATipo(tl.categoria),
            linea: tl.linea,
            columna: tl.columna,
            valor: tl.valor
        }));
    }

    private mapearCategoriaATipo(categoria: CategoriaGramatical): TipoToken {
        const mapeo: Record<CategoriaGramatical, TipoToken> = {
            [CategoriaGramatical.SUSTANTIVO]: TipoToken.SUSTANTIVO,
            [CategoriaGramatical.VERBO]: TipoToken.VERBO,
            [CategoriaGramatical.PRONOMBRE]: TipoToken.PRONOMBRE,
            [CategoriaGramatical.ADJETIVO]: TipoToken.ADJETIVO,
            [CategoriaGramatical.ARTICULO]: TipoToken.ARTICULO,
            [CategoriaGramatical.PREPOSICION]: TipoToken.PREPOSICION,
            [CategoriaGramatical.CONJUNCION]: TipoToken.CONJUNCION,
            [CategoriaGramatical.ADVERBIO]: TipoToken.ADVERBIO,
            [CategoriaGramatical.PUNTUACION]: TipoToken.PUNTUACION,
            [CategoriaGramatical.DESCONOCIDO]: TipoToken.DESCONOCIDO
        };
        return mapeo[categoria] || TipoToken.DESCONOCIDO;
    }

    private construirTablaSimbolos(tokens: TokenLexico[]): EntradaTablaSimbolos[] {
        const simbolosUnicos = new Map<string, TokenLexico>();

        tokens.forEach(token => {
            const key = token.valor.toLowerCase();
            if (!simbolosUnicos.has(key) && token.categoria !== CategoriaGramatical.PUNTUACION) {
                simbolosUnicos.set(key, token);
            }
        });

        return Array.from(simbolosUnicos.values()).map(token => ({
            token: token.valor,
            tipo: token.categoria,
            categoria: token.categoria,
            posicion: `Linea ${token.linea}, Columna ${token.columna}`,
            valor: token.valor,
            ambito: 'Global'
        }));
    }

    private construirListaErrores(
        erroresLexicos: string[],
        erroresSintacticos: string[],
        erroresSemanticos: string[]
    ): ErrorCompilador[] {
        const errores: ErrorCompilador[] = [];
        let id = 0;

        erroresLexicos.forEach(error => {
            errores.push({
                id: ++id,
                tipo: TipoError.LEXICO,
                ubicacion: 'Analisis Lexico',
                descripcion: error,
                fase: 'Lexer',
                sugerencia: 'Verifique que todas las palabras esten escritas correctamente'
            });
        });

        erroresSintacticos.forEach(error => {
            errores.push({
                id: ++id,
                tipo: TipoError.SINTACTICO,
                ubicacion: 'Analisis Sintactico',
                descripcion: error,
                fase: 'Parser',
                sugerencia: 'Revise la estructura de la oracion'
            });
        });

        erroresSemanticos.forEach(error => {
            errores.push({
                id: ++id,
                tipo: TipoError.SEMANTICO,
                ubicacion: 'Analisis Semantico',
                descripcion: error,
                fase: 'Semantico',
                sugerencia: 'Verifique la coherencia y concordancia de la oracion'
            });
        });

        return errores;
    }

    private convertirArbol(nodoGramatical: NodoGramatical): NodoArbol {
        return {
            nombre: `${nodoGramatical.tipo}: ${nodoGramatical.valor}`,
            esHoja: nodoGramatical.hijos.length === 0,
            hijos: nodoGramatical.hijos.map(h => this.convertirArbol(h))
        };
    }
}