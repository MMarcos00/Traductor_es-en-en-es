import enEsDict from '../data/en-es.json';
import esEnDict from '../data/es-en.json';

export class Dictionary {
    private enEs: Record<string, string>;
    private esEn: Record<string, string>;

    constructor() {
        this.enEs = enEsDict as Record<string, string>;
        this.esEn = esEnDict as Record<string, string>;
    }

    traducirPalabra(palabra: string, direccion: 'en-es' | 'es-en'): string {
        const palabraLower = palabra.toLowerCase();

        if (direccion === 'en-es') {
            return this.enEs[palabraLower] || palabra;
        } else {
            return this.esEn[palabraLower] || palabra;
        }
    }

    existePalabra(palabra: string, idioma: 'en' | 'es'): boolean {
        const palabraLower = palabra.toLowerCase();
        if (idioma === 'en') {
            return palabraLower in this.enEs;
        } else {
            return palabraLower in this.esEn;
        }
    }

    obtenerSugerencias(palabra: string, idioma: 'en' | 'es'): string[] {
        const palabraLower = palabra.toLowerCase();
        const diccionario = idioma === 'en' ? this.enEs : this.esEn;

        return Object.keys(diccionario)
            .filter(key => {
                const distancia = this.calcularDistanciaLevenshtein(palabraLower, key);
                return distancia <= 2 && distancia > 0;
            })
            .slice(0, 3);
    }

    private calcularDistanciaLevenshtein(a: string, b: string): number {
        const matriz = Array.from({ length: a.length + 1 }, () =>
            Array.from({ length: b.length + 1 }, () => 0)
        );

        for (let i = 0; i <= a.length; i++) matriz[i][0] = i;
        for (let j = 0; j <= b.length; j++) matriz[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const costo = a[i - 1] === b[j - 1] ? 0 : 1;
                matriz[i][j] = Math.min(
                    matriz[i - 1][j] + 1,
                    matriz[i][j - 1] + 1,
                    matriz[i - 1][j - 1] + costo
                );
            }
        }

        return matriz[a.length][b.length];
    }
}