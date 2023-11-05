import './App.css';
import { Graphviz } from 'graphviz-react';
import React, { useState, useEffect } from 'react';
import { Connection, Node } from './types/graph';
import { useAlgorithm } from './hooks/useAlgorithm';
import { MagicMotion } from "react-magic-motion";
import { ChevronDown, ChevronUp } from './icons/Icons';

const App = () => {

  const [nodes, setNodes] = useState<Node[]>([]);
  const [nodeName, setNodeName] = useState<string>('');
  const [isShowForm, setIsShowForm] = useState<boolean>(true);
  const [isShowFormArista, setIsShowFormArista] = useState<boolean>(true);
  const [isShowActions, setIsShowActions] = useState<boolean>(true);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [edgeWeight, setEdgeWeight] = useState<number>(1);
  const [addBothDirections, setAddBothDirections] = useState<boolean>(false);
  const [dotGraph, setDotGraph] = useState<string>('digraph {}');
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<number[][]>([]);
  const [startDijkstraNode, setStartDijkstraNode] = useState<string>();
  const [initialGraph, setInitialGraph] = useState<{ nodes: Node[]; connections: Connection[] }>({ nodes: [], connections: [] });


  const { buildAdjacencyMatrix, primAlgorithm, kruskalAlgorithm, dijkstraAlgorithm } = useAlgorithm(nodes);


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


  const handleRunPrim = () => {
    // Ejecuta el algoritmo de Prim y obtén las aristas seleccionadas
    const primEdges = primAlgorithm(adjacencyMatrix);

    // Actualiza el gráfico con las aristas seleccionadas por el algoritmo de Prim
    const primDotGraph = generateDotGraph(nodes, primEdges);
    setDotGraph(primDotGraph);
  };

  const handleRunKruskal = () => {
    const kruskalEdges = kruskalAlgorithm(nodes, connections); // Ejecuta el algoritmo de Kruskal
    const kruskalDotGraph = generateDotGraph(nodes, kruskalEdges); // Genera el gráfico resultante
    setDotGraph(kruskalDotGraph); // Actualiza el gráfico
  };

  const handleRunDijkstra = (initialNode?: string) => {
    // Ejecuta el algoritmo de Dijkstra desde un nodo específico

    const startNode = initialNode ? nodes.find((node) => node.name === initialNode) : nodes[0];

    if (!startNode) {
      console.log(`El nodo inicial ${initialNode} no se encontró en la lista de nodos.`);
      return;
    }

    // Ejecuta el algoritmo de Dijkstra con el nodo de inicio encontrado
    const dijkstraEdges = dijkstraAlgorithm(adjacencyMatrix, startNode);

    // Actualiza el gráfico con las aristas resultantes del algoritmo de Dijkstra
    const dijkstraDotGraph = generateDotGraph(nodes, dijkstraEdges);
    setDotGraph(dijkstraDotGraph);
  };


  useEffect(() => {
    const newAdjacencyMatrix = buildAdjacencyMatrix(nodes, connections);
    setAdjacencyMatrix(newAdjacencyMatrix);

    // Actualiza el gráfico Graphviz
    const newDotGraph = generateDotGraph(nodes, connections);
    setDotGraph(newDotGraph);
  }, [nodes, connections]);

  // Genera el gráfico en el formato correcto para Graphviz
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
    setNodes([...initialGraph.nodes]);
    setConnections([...initialGraph.connections]);
  };

  const handleStartDijkstraNode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDijkstraNode(e.target.value);
  }

  const handleResetGraph = () => {
    // Restaura el grafo y la matriz a su estado inicial (vacío)
    setNodes([]);
    setConnections([]);
    setAdjacencyMatrix([]);
    setInitialGraph({ nodes: [], connections: [] });
    setDotGraph('digraph {}');
  };

  return (
    <div className='flex h-screen'>
      <MagicMotion>
        <aside className='w-[30%] rounded-md p-5 flex flex-col gap-10 overflow-y-scroll px-10'>
          <h1 className='font-extrabold text-2xl self-start py-4'>Herramientas</h1>
          <div className='flex flex-col gap-20'>
            <div className='flex flex-col gap-5'>
              <div onClick={handleShowForm} className='flex text-xl items-center gap-2 cursor-pointer'>
                <button className=''>
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
                      placeholder='A, B, C, ...'
                      className=' bg-transparent border-[1px] border-gray-100 rounded-lg placeholder:text-gray-300 py-1 px-2'
                      name='numNodes'
                      id='numNodes' />
                  </div>
                  <button className='bg-gray-200 transition-all hover:bg-gray-300 text-black px-8 py-2 rounded-md w-fit font-bold'>Añadir</button>
                </form>
              )}
              <hr />
            </div>
            <div className='flex flex-col gap-5'>
              <div onClick={handleShowFormArista} className='flex items-center gap-2 text-xl cursor-pointer'>
                <button className=''>
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
                          className=' bg-transparent border-[1px] border-gray-100 rounded-lg placeholder:text-gray-300 py-1 px-2 w-full'
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
                          className=' bg-transparent border-[1px] border-gray-100 rounded-lg placeholder:text-gray-300 py-1 px-2 w-full'
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
                    className='bg-gray-200 text-black hover:bg-gray-300 transition-all px-8 py-2 rounded-md w-fit font-bold'>
                    Conectar
                  </button>
                </form>
              )}
              <hr />
            </div>

            <div className='flex flex-col gap-5'>
              <div onClick={handleShowActions} className='flex text-xl items-center gap-2 cursor-pointer'>
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
                      <button onClick={handleRunPrim} className='bg-violet-400 px-4 py-2 rounded-md'>
                        Ejecutar Prim
                      </button>
                    </div>
                    <hr className='w-[70%] mt-2' />
                  </div>

                  <div className='flex flex-col gap-1 items-start'>
                    <label className='font-semibold' htmlFor="">Kruskal</label>
                    <div className='flex flex-col gap-2 mx-2'>
                      <button onClick={handleRunKruskal} className='bg-violet-400 px-4 py-2 rounded-md'>
                        Ejecutar Kruskal
                      </button>
                    </div>
                    <hr className='w-[70%] mt-2' />
                  </div>

                  <div className='flex flex-col gap-1 items-start'>
                    <label className='font-semibold' htmlFor="">Dijkstra</label>
                    <div className='flex flex-col gap-2 mx-2'>
                      <label className='self-start' htmlFor='fromNode'>Nodo Inicio</label>
                      <input type="text" className=' bg-transparent border-[1px] border-gray-100 rounded-lg placeholder:text-gray-300 py-1 px-2 w-fit' onChange={handleStartDijkstraNode} />
                      <button onClick={() => handleRunDijkstra(startDijkstraNode)} className='bg-violet-400 px-4 py-2 rounded-md'>
                        Ejecutar Dijkstra
                      </button>
                    </div>
                    <hr className='w-[70%] mt-2' />
                  </div>

                  <div className='flex flex-col gap-1 items-start'>
                    <label className='font-semibold' htmlFor="">Restaurar Grafo</label>
                    <div className='flex flex-col gap-2 mx-2'>
                      <button onClick={handleRollBackGraph} className='bg-violet-400 px-4 py-2 rounded-md'>
                        Volver al Grafo Inicial
                      </button>
                    </div>
                    <hr className='w-[70%] mt-2' />
                  </div>

                  <div className='flex flex-col gap-1 items-start'>
                    <label className='font-semibold' htmlFor="">Limpiar Grafo</label>
                    <div className='flex flex-col gap-2 mx-2'>
                      <button onClick={handleResetGraph} className='bg-violet-400 px-4 py-2 rounded-md'>
                        Limpiar Grafo
                      </button>
                    </div>
                    <hr className='w-[70%] mt-2' />
                  </div>
                </div>
              )}
            </div>
          </div>

        </aside >
      </MagicMotion>
      <div className='w-[70%]'>
        <div>
          {nodes.length > 0 ? (
            <div className='graph-container'>
              <Graphviz dot={dotGraph} options={{ width: 600, height: 400 }} />
            </div>
          ) : (
            <div className='flex flex-col gap-10 items-center py-20'>
              <span className='text-xl'>No hay ningun un grafo cargado!</span>
              <span>Prueba agregandolo en el menú herramientas.</span>
              <div className='w-[400px]'>
                <img src="https://res.cloudinary.com/dotaebdx8/image/upload/v1699224953/empty_tovhdf.svg" alt="" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div >

  );
};

export default App;
