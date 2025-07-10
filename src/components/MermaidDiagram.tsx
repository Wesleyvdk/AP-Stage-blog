"use client";
import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
interface MermaidDiagramProps {
    chart: string;
    id?: string;
}
const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, id }) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (!isInitialized) {
            mermaid.initialize({
                startOnLoad: false,
                theme: 'default',
                securityLevel: 'loose',
                fontFamily: 'inherit',
                fontSize: 14,
                flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true,
                },
                sequence: {
                    useMaxWidth: true,
                },
                gantt: {
                    useMaxWidth: true,
                },
                journey: {
                    useMaxWidth: true,
                },
                gitGraph: {
                    useMaxWidth: true,
                },
                er: {
                    useMaxWidth: true,
                },
                pie: {
                    useMaxWidth: true,
                },
                quadrantChart: {
                    useMaxWidth: true,
                },
                xyChart: {
                    useMaxWidth: true,
                },
                mindmap: {
                    useMaxWidth: true,
                },
                timeline: {
                    useMaxWidth: true,
                },
            });
            setIsInitialized(true);
        }
    }, [isInitialized]);
    useEffect(() => {
        if (!isInitialized || !elementRef.current || !chart.trim()) return;
        const renderDiagram = async () => {
            try {
                setError(null);
                const diagramId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`;
                if (elementRef.current) {
                    elementRef.current.innerHTML = '';
                }
                const isValid = await mermaid.parse(chart);
                if (!isValid) {
                    throw new Error('Invalid Mermaid syntax');
                }
                const { svg } = await mermaid.render(diagramId, chart);
                if (elementRef.current) {
                    elementRef.current.innerHTML = svg;
                }
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError(err instanceof Error ? err.message : 'Failed to render diagram');
                if (elementRef.current) {
                    elementRef.current.innerHTML = `
            <div class="p-4 border border-red-200 rounded-md bg-red-50 text-red-700">
              <p class="font-medium">Diagram Error:</p>
              <p class="text-sm mt-1">${error || 'Failed to render Mermaid diagram'}</p>
              <details class="mt-2">
                <summary class="cursor-pointer text-sm font-medium">Show diagram code</summary>
                <pre class="mt-2 text-xs bg-red-100 p-2 rounded overflow-x-auto">${chart}</pre>
              </details>
            </div>
          `;
                }
            }
        };
        renderDiagram();
    }, [chart, id, isInitialized, error]);
    if (!chart.trim()) {
        return (
            <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50 text-yellow-700">
                <p className="text-sm">Empty Mermaid diagram</p>
            </div>
        );
    }
    return (
        <div className="my-6">
            <div
                ref={elementRef}
                className="flex justify-center items-center min-h-[100px] mermaid-diagram"
                style={{
                    maxWidth: '100%',
                    overflow: 'auto',
                    background: 'transparent'
                }}
            />
        </div>
    );
};
export default MermaidDiagram;
