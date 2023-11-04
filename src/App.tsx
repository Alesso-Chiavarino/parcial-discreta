import './App.css';
import { Graphviz } from 'graphviz-react';
import React, { useState, useEffect } from 'react';
import { Connection, Node } from './types/graph';
import { useAlgorithm } from './hooks/useAlgorithm';

const App = () => {

  const [nodes, setNodes] = useState<Node[]>([]);
  const [nodeName, setNodeName] = useState<string>('');
  const [isShowForm, setIsShowForm] = useState<boolean>(true);
  const [isShowFormArista, setIsShowFormArista] = useState<boolean>(true);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [edgeWeight, setEdgeWeight] = useState<number>(1);
  const [addBothDirections, setAddBothDirections] = useState<boolean>(false);
  const [dotGraph, setDotGraph] = useState<string>('digraph {}');
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<number[][]>([]);

  const { buildAdjacencyMatrix, primAlgorithm, kruskalAlgorithm } = useAlgorithm(nodes);


  const handleNodes = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(e.target.value);
  };

  const handleShowForm = () => {
    setIsShowForm(!isShowForm);
  };

  const handleShowFormArista = () => {
    setIsShowFormArista(!isShowFormArista);
  };

  const toggleBothDirections = () => {
    setAddBothDirections(true)
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNodes([...nodes, { name: nodeName }]);
    setNodeName('');
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
      setAddBothDirections(false);
    } else {
      if (!updatedConnections.some((conn) => conn.from === fromNode && conn.to === toNode)) {
        updatedConnections.push({ from: fromNode, to: toNode, weight });
      }
    }

    setConnections(updatedConnections);
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
    return `digraph { ${nodeStatements} ${edgeStatements} }`;
  };

  return (
    <div className='flex justify-between'>
      <div className='w-[20%]'>
        <button onClick={handleShowForm} className='bg-green-400 px-4 py-2 rounded-md'>
          Form
        </button>
        <button onClick={handleShowFormArista} className='bg-green-400 px-4 py-2 rounded-md'>
          Form arista
        </button>
        {isShowForm && (
          <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
              <label htmlFor='numNodes'>Nombre del nodo</label>
              <input onChange={handleNodes} value={nodeName} className='text-black' name='numNodes' id='numNodes' />
            </div>
            <button className='bg-red-400 px-4 py-2 rounded-md'>Añadir</button>
          </form>
        )}
        {isShowFormArista && (
          <form className='flex flex-col gap-5' onSubmit={handleConnectNodes}>
            <h1>Conexiones</h1>
            <div className='flex flex-col gap-2'>
              <label htmlFor='fromNode'>Desde</label>
              <select className='text-black' name='fromNode'>
                {nodes.length > 0 &&
                  nodes.map((node, index) => (
                    <option key={index} value={node.name}>
                      {node.name}
                    </option>
                  ))}
              </select>
              <label htmlFor='toNode'>Hasta</label>
              <select className='text-black' name='toNode'>
                {nodes.length > 0 &&
                  nodes.map((node, index) => (
                    <option key={index} value={node.name}>
                      {node.name}
                    </option>
                  ))}
              </select>
              <label htmlFor='weight'>Peso de la arista</label>
              <input type='number' className='text-black' name='weight' id='weight' value={edgeWeight} onChange={(e) => setEdgeWeight(parseFloat(e.target.value))} />
              <button onClick={toggleBothDirections} className={`bg-${addBothDirections ? 'green' : 'red'}-400 px-4 py-2 rounded-md`}>
                Ambas Direcciones
              </button>
            </div>
            <button type='submit' className='bg-red-400 px-4 py-2 rounded-md'>
              Conectar
            </button>
          </form>
        )}
        <button onClick={handleRunPrim} className='bg-blue-400 px-4 py-2 rounded-md'>
          Ejecutar Prim
        </button>
        <button onClick={handleRunKruskal} className='bg-blue-400 px-4 py-2 rounded-md'>
          Ejecutar Kruskal
        </button>
      </div>
      <div className='w-[80%]'>
        <div>
          <Graphviz dot={dotGraph} options={{ width: 600, height: 400 }} />
        </div>
      </div>
    </div>
  );
};

export default App;
