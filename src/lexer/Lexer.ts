import {
    TokenLexico,
    CategoriaGramatical,
    PALABRAS_CLAVE,
    VERBOS_INGLES,
    VERBOS_ESPANOL,
    ADJETIVOS_INGLES,
    ADJETIVOS_ESPANOL,
    SUSTANTIVOS_INGLES,
    SUSTANTIVOS_ESPANOL,
    SIGNOS_PUNTUACION
} from './TokenTypes';

export class Lexer {
    private tokens: TokenLexico[] = [];
    private errores: string[] = [];
    private contadorId = 0;

    analizar(texto: string): { tokens: TokenLexico[]; errores: string[] } {
        this.tokens = [];
        this.errores = [];
        this.contadorId = 0;

        const palabras = this.tokenizarTexto(texto);

        palabras.forEach((palabra, indice) => {
            this.procesarPalabra(palabra, 1, indice + 1);
        });

        return { tokens: this.tokens, errores: this.errores };
    }

    private tokenizarTexto(texto: string): string[] {
        let textoSeparado = texto;
        SIGNOS_PUNTUACION.forEach(signo => {
            textoSeparado = textoSeparado.replace(new RegExp(`\\${signo}`, 'g'), ` ${signo} `);
        });

        return textoSeparado
            .split(/\s+/)
            .filter(palabra => palabra.length > 0);
    }

    private procesarPalabra(palabra: string, linea: number, columna: number): void {
        const palabraLower = palabra.toLowerCase();
        let categoria = CategoriaGramatical.DESCONOCIDO;

        // Verificar signos de puntuación
        if (SIGNOS_PUNTUACION.includes(palabra)) {
            categoria = CategoriaGramatical.PUNTUACION;
        }
        // Verificar palabras clave
        else if (PALABRAS_CLAVE[palabraLower]) {
            categoria = PALABRAS_CLAVE[palabraLower];
        }
        // Verificar verbos
        else if (VERBOS_INGLES.includes(palabraLower) || VERBOS_ESPANOL.includes(palabraLower)) {
            categoria = CategoriaGramatical.VERBO;
        }
        // Verificar adjetivos
        else if (ADJETIVOS_INGLES.includes(palabraLower) || ADJETIVOS_ESPANOL.includes(palabraLower)) {
            categoria = CategoriaGramatical.ADJETIVO;
        }
        // Verificar sustantivos
        else if (SUSTANTIVOS_INGLES.includes(palabraLower) || SUSTANTIVOS_ESPANOL.includes(palabraLower)) {
            categoria = CategoriaGramatical.SUSTANTIVO;
        }
        // Verificar si tiene caracteres inválidos
        else if (palabra.match(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ.,!?;:\s]/)) {
            this.errores.push(`Error léxico: símbolo inválido '${palabra}' en columna ${columna}`);
            categoria = CategoriaGramatical.DESCONOCIDO;
        }

        const token: TokenLexico = {
            id: ++this.contadorId,
            palabra: palabra,
            categoria: categoria,
            linea: linea,
            columna: columna,
            valor: palabra
        };

        this.tokens.push(token);

        if (categoria === CategoriaGramatical.DESCONOCIDO) {
            this.errores.push(`Palabra no reconocida: '${palabra}' en columna ${columna}`);
        }
    }
}