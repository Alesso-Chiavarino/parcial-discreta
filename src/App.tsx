import './App.css';
import { Graphviz } from 'graphviz-react';
import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  type Node = {
    name: string;
  };

  type Connection = {
    from: string;
    to: string;
    weight: number;
  };

  const [nodes, setNodes] = useState<Node[]>([]);
  const [nodeName, setNodeName] = useState<string>('');
  const [isShowForm, setIsShowForm] = useState<boolean>(true);
  const [isShowFormArista, setIsShowFormArista] = useState<boolean>(true);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [edgeWeight, setEdgeWeight] = useState<number>(1);
  const [addBothDirections, setAddBothDirections] = useState<boolean>(false); // Opción "Ambas Direcciones"
  // const [dotString, setDotString] = useState<string>(''); // Inicialmente vacío
  const [dotGraph, setDotGraph] = useState<string>('digraph {}'); // Inicialmente un gráfico vacío
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<number[][]>([]);
  // const [runPrim, setRunPrim] = useState<boolean>(false);

  // Función para construir la matriz de adyacencia
  function buildAdjacencyMatrix(nodes: Node[], connections: Connection[]) {
    const matrixSize = nodes.length;
    const matrix = Array(matrixSize)
      .fill(0)
      .map(() => Array(matrixSize).fill(Infinity));

    for (const connection of connections) {
      const fromIndex = nodes.findIndex((node) => node.name === connection.from);
      const toIndex = nodes.findIndex((node) => node.name === connection.to);
      const weight = connection.weight;
      matrix[fromIndex][toIndex] = weight;
      matrix[toIndex][fromIndex] = weight; // Para grafos no dirigidos
    }

    for (let i = 0; i < matrixSize; i++) {
      matrix[i][i] = 0;
    }

    return matrix;
  }

  // Función para ejecutar el algoritmo de Prim y obtener las aristas seleccionadas
  const runPrimAlgorithm = (adjacencyMatrix: number[][]) => {
    const numNodes = adjacencyMatrix.length;
    const selectedNodes = new Array(numNodes).fill(false);
    const selectedEdges: Connection[] = [];

    selectedNodes[0] = true;

    while (selectedEdges.length < numNodes - 1) {
      let minWeight = Infinity;
      let fromNode = -1;
      let toNode = -1;

      for (let i = 0; i < numNodes; i++) {
        if (selectedNodes[i]) {
          for (let j = 0; j < numNodes; j++) {
            if (!selectedNodes[j] && adjacencyMatrix[i][j] < minWeight) {
              minWeight = adjacencyMatrix[i][j];
              fromNode = i;
              toNode = j;
            }
          }
        }
      }

      if (fromNode !== -1 && toNode !== -1) {
        selectedEdges.push({
          from: nodes[fromNode].name,
          to: nodes[toNode].name,
          weight: adjacencyMatrix[fromNode][toNode],
        });
        selectedNodes[toNode] = true;
      }
    }

    return selectedEdges;
  };

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
    const primEdges = runPrimAlgorithm(adjacencyMatrix);

    // Actualiza el gráfico con las aristas seleccionadas por el algoritmo de Prim
    const primDotGraph = generateDotGraph(nodes, primEdges);
    setDotGraph(primDotGraph);
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
