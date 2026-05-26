import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import type { NodoArbol } from '../types';

interface ParseTreeProps {
    arbol: NodoArbol | null;
}

const ParseTree: React.FC<ParseTreeProps> = ({ arbol }) => {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!arbol || !svgRef.current) return;

        // Limpiar SVG anterior
        d3.select(svgRef.current).selectAll('*').remove();

        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 90, bottom: 30, left: 90 };

        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Convertir el árbol al formato de D3
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const root: any = d3.hierarchy(arbol, (d) => d.hijos);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const treeLayout: any = d3.tree().size([
            height - margin.top - margin.bottom,
            width - margin.left - margin.right
        ]);

        treeLayout(root);

        // Dibujar enlaces
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        g.selectAll('.link')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .data(root.links() as any)
            .enter()
            .append('path')
            .attr('class', 'link')
            .attr('fill', 'none')
            .attr('stroke', '#555')
            .attr('stroke-width', 1.5)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('d', (d: any) => {
                return `M${d.source.y},${d.source.x}C${(d.source.y + d.target.y) / 2},${d.source.x} ${(d.source.y + d.target.y) / 2},${d.target.x} ${d.target.y},${d.target.x}`;
            });

        // Dibujar nodos
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const node = g.selectAll('.node')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .data(root.descendants() as any)
            .enter()
            .append('g')
            .attr('class', 'node')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

        node.append('circle')
            .attr('r', 20)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .attr('fill', (d: any) => d.data.esHoja ? '#4CAF50' : '#2196F3')
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);

        node.append('text')
            .attr('dy', 5)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .attr('font-weight', 'bold')
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .text((d: any) => {
                const partes = d.data.nombre.split(': ');
                return partes.length > 1 ? partes[1] : d.data.nombre;
            });

    }, [arbol]);

    if (!arbol) {
        return (
            <div className="text-center text-gray-500 py-8">
                No hay arbol de derivacion disponible
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Arbol de Derivacion Sintactica
            </h3>
            <div className="bg-white rounded-lg border border-gray-200 overflow-auto p-4" style={{ WebkitOverflowScrolling: 'touch' }}>
                <svg ref={svgRef} style={{ minHeight: '400px', minWidth: '600px' }}></svg>
            </div>
        </div>
    );
};

export default ParseTree;