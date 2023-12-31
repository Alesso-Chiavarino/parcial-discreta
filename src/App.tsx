import './App.css';
import { Graphviz } from 'graphviz-react';
import React, { useState, useEffect } from 'react';
import { Connection, Node } from './types/graph';
import { useAlgorithm } from './hooks/useAlgorithm';
import { MagicMotion } from "react-magic-motion";
import { ChevronDown, ChevronUp, CollapseDown, CollapseUp } from './icons/Icons';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { graphModels } from './models/graph.models';

const App = () => {

    const [nodes, setNodes] = useState<Node[]>([]);
    const [nodeName, setNodeName] = useState<string>('');
    const [isShowForm, setIsShowForm] = useState<boolean>(true);
    const [isShowFormArista, setIsShowFormArista] = useState<boolean>(true);
    const [isShowActions, setIsShowActions] = useState<boolean>(true);
    const [isShowCollapse, setIsShowCollapse] = useState<boolean>(true);
    const [connections, setConnections] = useState<Connection[]>([]);
    const [edgeWeight, setEdgeWeight] = useState<number>(1);
    const [addBothDirections, setAddBothDirections] = useState<boolean>(false);
    const [dotGraph, setDotGraph] = useState<string>('digraph {}');
    const [adjacencyMatrix, setAdjacencyMatrix] = useState<number[][]>([]);
    const [startDijkstraNode, setStartDijkstraNode] = useState<string>();
    const [initialGraph, setInitialGraph] = useState<{ nodes: Node[]; connections: Connection[] }>({ nodes: [], connections: [] });
    const [selectedModel, setSelectedModel] = useState('');
    const [dijkstraResults, setDijkstraResults] = useState<{ node: string; distance: number }[]>([]);


    const { buildAdjacencyMatrix, primAlgorithm, kruskalAlgorithm, dijkstraAlgorithm, setIsMSTAlgorithm, minWeight, isMSTAlgorithm, isDijkstraAlgorithm, setIsDijkstraAlgorithm } = useAlgorithm(nodes);


    const handleNodes = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNodeName(e.target.value);
    };

    const handleShowForm = () => {
        setIsShowForm(!isShowForm);
    };

    const handleShowFormArista = () => {
        setIsShowFormArista(!isShowFormArista);
    };

    const handleShowActions = () => {
        setIsShowActions(!isShowActions);
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newNode = { name: nodeName };
        setNodes([...nodes, newNode]);
        setNodeName('');
        setInitialGraph((prev) => ({ nodes: [...prev.nodes, newNode], connections: prev.connections }));
    };

    const handleConnectNodes = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const fromNode = e.currentTarget.fromNode.value;
        const toNode = e.currentTarget.toNode.value;
        const weight = parseFloat(e.currentTarget.weight.value);

        const updatedConnections = [...connections];

        if (addBothDirections) {
            const connectionAtoB = { from: fromNode, to: toNode, weight };
            const connectionBtoA = { from: toNode, to: fromNode, weight };
            updatedConnections.push(connectionAtoB, connectionBtoA);
        } else {
            if (!updatedConnections.some((conn) => conn.from === fromNode && conn.to === toNode)) {
                updatedConnections.push({ from: fromNode, to: toNode, weight });
            }
        }

        setConnections(updatedConnections);
        setInitialGraph((prev) => ({ nodes: prev.nodes, connections: updatedConnections }));
    };

    const handleCollapseForms = () => {

        setIsShowCollapse(!isShowCollapse);

        isShowForm ? setIsShowForm(false) : setIsShowForm(true);
        isShowFormArista ? setIsShowFormArista(false) : setIsShowFormArista(true);
        isShowActions ? setIsShowActions(false) : setIsShowActions(true);
    }

    const handleRunPrim = () => {
        const primEdges = primAlgorithm(adjacencyMatrix);

        const primDotGraph = generateDotGraph(nodes, primEdges);
        setDotGraph(primDotGraph);
    };

    const handleRunKruskal = () => {
        const kruskalEdges = kruskalAlgorithm(nodes, connections); // Ejecuta el algoritmo de Kruskal
        const kruskalDotGraph = generateDotGraph(nodes, kruskalEdges); // Genera el gráfico resultante
        setDotGraph(kruskalDotGraph); // Actualiza el gráfico
    };

    const handleRunDijkstra = (initialNode?: string) => {
        const startNode = initialNode ? nodes.find((node) => node.name === initialNode) : nodes[0];

        if (!startNode) {
            console.log(`El nodo inicial ${initialNode} no se encontró en la lista de nodos.`);
            return;
        }

        const dijkstraEdges = dijkstraAlgorithm(adjacencyMatrix, startNode);

        // Calcula y almacena los resultados en el orden correcto
        const dijkstraResultsData = calculateDijkstraResults(dijkstraEdges, startNode);

        setDijkstraResults(dijkstraResultsData);

        const dijkstraDotGraph = generateDotGraph(nodes, dijkstraEdges);
        setDotGraph(dijkstraDotGraph);
    };

    const calculateDijkstraResults = (dijkstraEdges: Connection[], startNode: Node) => {
        const visitedNodes = new Set();
        const resultData: { node: string; distance: number }[] = [];

        visitedNodes.add(startNode.name);
        resultData.push({
            node: startNode.name,
            distance: 0,
        });

        while (visitedNodes.size < nodes.length) {
            for (const node of nodes) {
                if (visitedNodes.has(node.name)) continue;

                const dijkstraResult = dijkstraEdges.find((edge) => edge.to === node.name);
                if (dijkstraResult) {
                    visitedNodes.add(node.name);
                    resultData.push({
                        node: node.name,
                        distance: dijkstraResult.weight,
                    });
                }
            }
        }

        return resultData;
    };


    useEffect(() => {
        const newAdjacencyMatrix = buildAdjacencyMatrix(nodes, connections);
        setAdjacencyMatrix(newAdjacencyMatrix);

        const newDotGraph = generateDotGraph(nodes, connections);
        setDotGraph(newDotGraph);
    }, [nodes, connections]);

    const generateDotGraph = (nodes: Node[], connections: Connection[]) => {
        const nodeStatements = nodes.map((node) => `${node.name};`).join(' ');
        const edgeStatements = connections.map(
            (connection) => `${connection.from} -> ${connection.to} [label="${connection.weight}"];`
        ).join(' ');

        return `
      digraph {
        ${nodeStatements}
        ${edgeStatements}
      }
    `;
    };

    const handleRollBackGraph = () => {
        setIsMSTAlgorithm(false);
        setIsDijkstraAlgorithm(false)
        setNodes([...initialGraph.nodes]);
        setConnections([...initialGraph.connections]);
        setDijkstraResults([]);
    };

    const handleStartDijkstraNode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDijkstraNode(e.target.value);
    }

    const handleResetGraph = () => {
        setNodes([]);
        setIsMSTAlgorithm(false);
        setConnections([]);
        setAdjacencyMatrix([]);
        setInitialGraph({ nodes: [], connections: [] });
        setDotGraph('digraph {}');
        setSelectedModel('');
    };



    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setSelectedModel(selected);

        if (selected === '') {
            setNodes([]);
            setConnections([]);
            setInitialGraph({ nodes: [], connections: [] });
        } else if (graphModels[selected]) {
            const { nodes, connections } = graphModels[selected];

            setNodes(nodes);
            setConnections(connections);
            setInitialGraph({ nodes, connections });
        }
    };


    return (
        <>
            <div className='flex h-screen'>
                <MagicMotion>
                    <aside className='w-[30%] rounded-md p-5 flex flex-col gap-10 overflow-y-scroll px-10'>
                        <div className='flex justify-between items-center'>
                            <h1 className='font-extrabold text-2xl self-start py-4'>Herramientas</h1>
                            <span className='cursor-pointer' onClick={handleCollapseForms}>{isShowCollapse ? <CollapseDown /> : <CollapseUp />}</span>
                        </div>
                        <div className='flex flex-col gap-20'>
                            <div className='flex flex-col gap-5'>
                                <div onClick={handleShowForm} className='flex text-xl font-semibold text-violet-400 items-center gap-2 cursor-pointer'>
                                    <button>
                                        Añadir Nodo
                                    </button>
                                    {isShowForm ? <ChevronDown /> : <ChevronUp />}
                                </div>

                                {isShowForm && (
                                    <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                                        <div className='flex flex-col gap-2'>
                                            <label className='self-start' htmlFor='numNodes'>Nombre del nodo</label>
                                            <input
                                                onChange={handleNodes}
                                                value={nodeName}
                                                placeholder='Inserte nombre del nodo'
                                                className=' bg-transparent border-[1px] border-gray-100 rounded-lg placeholder:text-gray-300 py-1 px-2'
                                                name='numNodes'
                                                id='numNodes' />
                                        </div>
                                        <button className='bg-gray-200 transition-all hover:bg-violet-400 duration-200 hover:text-white text-black px-8 py-2 rounded-md w-fit font-bold'>Añadir</button>
                                    </form>
                                )}
                                <hr />
                            </div>
                            <div className='flex flex-col gap-5'>
                                <div onClick={handleShowFormArista} className='flex font-semibold text-violet-400 items-center gap-2 text-xl cursor-pointer'>
                                    <button>
                                        Añadir Arista
                                    </button>
                                    {isShowFormArista ? <ChevronDown /> : <ChevronUp />}
                                </div>
                                {isShowFormArista && (
                                    <form className='flex flex-col gap-5' onSubmit={handleConnectNodes}>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex gap-5'>
                                                <div className='w-[50%] flex flex-col gap-2 items-center'>
                                                    <label className='self-start' htmlFor='fromNode'>Desde</label>
                                                    <select
                                                        className=' bg-[#131313] border-[1px] border-gray-100 rounded-lg placeholder:text-gray-300 py-1 px-2 w-full'
                                                        name='fromNode'>
                                                        {nodes.length > 0 &&
                                                            nodes.map((node, index) => (
                                                                <option key={index} value={node.name}>
                                                                    {node.name}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                                <div className='w-[50%] flex flex-col gap-2 items-center'>
                                                    <label className='self-start' htmlFor='toNode'>Hasta</label>
                                                    <select
                                                        className=' bg-[#131313] border-[1px] border-gray-100 rounded-lg placeholder:text-gray-300 py-1 px-2 w-full'
                                                        name='toNode'>
                                                        {nodes.length > 0 &&
                                                            nodes.map((node, index) => (
                                                                <option key={index} value={node.name}>
                                                                    {node.name}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='flex items-center gap-10'>
                                                <div className='flex flex-col gap-1 w-[50%]'>
                                                    <label className='self-start' htmlFor='weight'>Peso de la arista</label>
                                                    <input
                                                        type='number'
                                                        className=' bg-transparent border-[1px] border-gray-100 rounded-lg placeholder:text-gray-300 py-1 px-2 w-fit'
                                                        name='weight'
                                                        id='weight'
                                                        value={edgeWeight}
                                                        onChange={(e) => setEdgeWeight(parseFloat(e.target.value))} />
                                                </div>
                                                <div className='flex flex-col gap-1 w-[50%] items-start'>
                                                    <label htmlFor="bothDirections">Ambas Direcciones</label>
                                                    <input
                                                        type="checkbox"
                                                        checked={addBothDirections}
                                                        onChange={() => setAddBothDirections(!addBothDirections)}
                                                        className='border-2 border-gray-400 bg-transparent'
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type='submit'
                                            className='bg-gray-200 transition-all hover:bg-violet-400 duration-200 hover:text-white text-black px-8 py-2 rounded-md w-fit font-bold'>
                                            Conectar
                                        </button>
                                    </form>
                                )}
                                <hr />
                            </div>

                            <div className='flex flex-col gap-5'>
                                <div onClick={handleShowActions} className='flex text-xl font-semibold text-violet-400 items-center gap-2 cursor-pointer'>
                                    <button>
                                        Ejecutar Acciones
                                    </button>
                                    {isShowActions ? <ChevronDown /> : <ChevronUp />}
                                </div>

                                {isShowActions && (
                                    <div className='flex flex-col gap-10'>

                                        <div className='flex flex-col gap-1 items-start'>
                                            <label className='font-semibold' htmlFor="">Prim</label>
                                            <div className='flex flex-col gap-2 mx-2'>
                                                <button onClick={handleRunPrim} className='font-bold transition-all duration-200 bg-violet-400 hover:bg-gray-200 hover:text-black  hover_bg- px-4 py-2 rounded-md'>
                                                    Ejecutar Prim
                                                </button>
                                            </div>
                                            <hr className='w-[70%] mt-2' />
                                        </div>

                                        <div className='flex flex-col gap-1 items-start'>
                                            <label className='font-semibold' htmlFor="">Kruskal</label>
                                            <div className='flex flex-col gap-2 mx-2'>
                                                <button onClick={handleRunKruskal} className='font-bold transition-all duration-200 bg-violet-400 hover:bg-gray-200 hover:text-black  hover_bg- px-4 py-2 rounded-md'>
                                                    Ejecutar Kruskal
                                                </button>
                                            </div>
                                            <hr className='w-[70%] mt-2' />
                                        </div>

                                        <div className='flex flex-col gap-1 items-start'>
                                            <label className='font-semibold' htmlFor="">Dijkstra</label>
                                            <div className='flex flex-col gap-2 mx-2'>
                                                <label className='self-start' htmlFor='fromNode'>Nodo Inicio</label>
                                                <input
                                                    type="text"
                                                    className=' bg-transparent border-[1px] border-gray-100 rounded-lg placeholder:text-gray-300 py-1 px-2 w-fit'
                                                    onChange={handleStartDijkstraNode}
                                                    placeholder='Inserte el nodo de inicio'
                                                />
                                                <button onClick={() => handleRunDijkstra(startDijkstraNode)} className='font-bold transition-all duration-200 bg-violet-400 hover:bg-gray-200 hover:text-black  hover_bg- px-4 py-2 rounded-md'>
                                                    Ejecutar Dijkstra
                                                </button>
                                            </div>
                                            <hr className='w-[70%] mt-2' />
                                        </div>

                                        {isMSTAlgorithm || isDijkstraAlgorithm ? (
                                            <div className='flex flex-col gap-1 items-start'>
                                                <label className='font-semibold' htmlFor="">Restaurar Grafo</label>
                                                <div className='flex flex-col gap-2 mx-2'>
                                                    <button onClick={handleRollBackGraph} className='font-bold transition-all duration-200 bg-violet-400 hover:bg-gray-200 hover:text-black  hover_bg- px-4 py-2 rounded-md'>
                                                        Volver al Grafo Inicial
                                                    </button>
                                                </div>
                                                <hr className='w-[70%] mt-2' />
                                            </div>
                                        ) : null}


                                        {nodes.length > 0 && (
                                            <div className='flex flex-col gap-1 items-start'>
                                                <label className='font-semibold' htmlFor="">Limpiar Grafo</label>
                                                <div className='flex flex-col gap-2 mx-2'>
                                                    <button onClick={handleResetGraph} className='font-bold transition-all duration-200 bg-violet-400 hover:bg-gray-200 hover:text-black  hover_bg- px-4 py-2 rounded-md'>
                                                        Limpiar Grafo
                                                    </button>
                                                </div>
                                                <hr className='w-[70%] mt-2' />
                                            </div>)}

                                        <div className='flex flex-col gap-1 items-start'>
                                            <label className='font-semibold' htmlFor="selectModel">Seleccionar Modelo de Grafo</label>
                                            <div className='mx-2'>
                                                <select
                                                    id="selectModel"
                                                    value={selectedModel}
                                                    onChange={handleModelChange}
                                                    className='bg-[#131313] border-[1px] border-gray-100 rounded-lg placeholder:text-gray-300 py-1 px-2 w-fit'>
                                                    <option value="">Seleccionar un modelo</option>
                                                    {Object.keys(graphModels).map((model) => (
                                                        <option key={model} value={model}>
                                                            {model}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <hr className='w-[70%] mt-2' />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </aside >
                </MagicMotion>
                <main className='w-[70%] min-h-screen'>

                    <header>
                        <Navbar />
                    </header>

                    <div className='min-h-[90vh]'>
                        <div>
                            {nodes.length > 0 ? (
                                dijkstraResults.length > 0 ? (
                                    <div className='p-10'>
                                        <table className="min-w-full bg-violet-800 overflow-hidden text-white shadow-md rounded-md">
                                            <thead>
                                                <tr>
                                                    <th className="px-6 py-3 border-b border-violet-600">Nodo</th>
                                                    <th className="px-6 py-3 border-b border-violet-600">Distancia Mínima</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dijkstraResults.map((result, index) => (
                                                    <tr key={index} className={index % 2 === 0 ? 'bg-violet-700' : 'bg-violet-800'}>
                                                        <td className="px-6 py-4 whitespace-nowrap">{result.node}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">{result.distance}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>


                                ) : (
                                    <div className='graph-container flex flex-col'>
                                        <span className='self-end p-5 font-semibold'>PESO MÍNIMO: {minWeight}</span>
                                        <Graphviz dot={dotGraph} options={{ width: 600, height: 400 }} />
                                    </div>
                                )
                            ) : (
                                <div className='flex flex-col gap-10 items-center py-20'>
                                    <span className='text-2xl font-semibold'>No hay ningún grafo cargado.</span>
                                    <span className='text-md text-gray-300'>Prueba agregándolo en el menú de herramientas.</span>
                                    <div className='w-[400px]'>
                                        <img src="https://res.cloudinary.com/dotaebdx8/image/upload/v1699224953/empty_tovhdf.svg" alt="" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>


                    <Footer />

                </main>
            </div>
        </>


    );
};

export default App;