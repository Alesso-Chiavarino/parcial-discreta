import './App.css';
import { Graphviz } from 'graphviz-react';
import React, { useState, useEffect } from 'react';

const App = () => {
  interface Node {
    name: string;
  }

  const [nodes, setNodes] = useState<Node[]>([]);
  const [nodeName, setNodeName] = useState('');
  const [isShowForm, setIsShowForm] = useState(true);
  const [isShowFormArista, setIsShowFormArista] = useState(true);
  const [connections, setConnections] = useState<{ from: string; to: string; weight: number }[]>([]);
  const [edgeWeight, setEdgeWeight] = useState(1);
  const [dotString, setDotString] = useState('digraph {}'); // Esto es solo un valor de ejemplo

  // Matriz de adyacencia
  const [adjacencyMatrix, setAdjacencyMatrix] = useState<number[][]>([]);

  console.log('ADJECTENCY MATRIX =>', adjacencyMatrix)

  // Función para construir la matriz de adyacencia
  function buildAdjacencyMatrix(nodes: Node[], connections: { from: string; to: string; weight: number }[]) {
    const matrix = Array(nodes.length)
      .fill(0)
      .map(() => Array(nodes.length).fill(Infinity));

    for (const connection of connections) {
      const fromIndex = nodes.findIndex(node => node.name === connection.from);
      const toIndex = nodes.findIndex(node => node.name === connection.to);
      const weight = connection.weight;
      matrix[fromIndex][toIndex] = weight;
      matrix[toIndex][fromIndex] = weight; // Para grafos no dirigidos
    }

    for (let i = 0; i < nodes.length; i++) {
      matrix[i][i] = 0;
    }

    return matrix;
  }

  // Actualizar la matriz de adyacencia cuando cambian los nodos o conexiones
  useEffect(() => {
    const newAdjacencyMatrix = buildAdjacencyMatrix(nodes, connections);
    setAdjacencyMatrix(newAdjacencyMatrix);
  }, [nodes, connections]);

  // Actualizar la matriz de adyacencia cuando cambia el valor de dotString (debes implementar la lógica para extraer nodos y conexiones)
  useEffect(() => {
    // Implementa la lógica para extraer nodos y conexiones de dotString aquí
    // Luego, construye la matriz de adyacencia
    const newAdjacencyMatrix = buildAdjacencyMatrix(nodes, connections);
    setAdjacencyMatrix(newAdjacencyMatrix);
  }, [dotString]);

  const handleNodes = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(e.target.value);
  }

  const handleShowForm = () => {
    setIsShowForm(!isShowForm);
  }

  const handleShowFormArista = () => {
    setIsShowFormArista(!isShowFormArista);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNodes([...nodes, { name: nodeName }]);
    setNodeName('');
  }

  const handleConnectNodes = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fromNode = e.currentTarget.fromNode.value;
    const toNode = e.currentTarget.toNode.value;
    const weight = parseFloat(e.currentTarget.weight.value);

    if (!connections.some(conn => conn.from === fromNode && conn.to === toNode)) {
      setConnections([...connections, { from: fromNode, to: toNode, weight }]);
    }
  }

  return (
    <div className='flex justify-between'>
      <div className='w-[20%]'>
        <button onClick={handleShowForm} className='bg-green-400 px-4 py-2 rounded-md'>Form</button>
        <button onClick={handleShowFormArista} className='bg-green-400 px-4 py-2 rounded-md'>Form arista</button>
        {isShowForm && (
          <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-2'>
              <label htmlFor="numNodes">Nombre del nodo</label>
              <input onChange={handleNodes} value={nodeName} className='text-black' name="numNodes" id="numNodes" />
            </div>
            <button className='bg-red-400 px-4 py-2 rounded-md'>Añadir</button>
          </form>
        )}
        {isShowFormArista && (
          <form className='flex flex-col gap-5' onSubmit={handleConnectNodes}>
            <h1>Conexiones</h1>
            <div className='flex flex-col gap-2'>
              <label htmlFor="fromNode">Desde</label>
              <select name="fromNode">
                {nodes.length > 0 && nodes.map((node, index) => (
                  <option key={index} value={node.name}>{node.name}</option>
                ))}
              </select>
              <label htmlFor="toNode">Hasta</label>
              <select name="toNode">
                {nodes.length > 0 && nodes.map((node, index) => (
                  <option key={index} value={node.name}>{node.name}</option>
                ))}
              </select>
              <label htmlFor="weight">Peso de la arista</label>
              <input type="number" name="weight" id="weight" value={edgeWeight} onChange={(e) => setEdgeWeight(parseFloat(e.target.value))} />
            </div>
            <button type="submit" className='bg-red-400 px-4 py-2 rounded-md'>Conectar</button>
          </form>
        )}
      </div>
      <div className='w-[80%]'>
        <div style={{ width: '600px', height: '400px' }}>
          <Graphviz dot={dotString} options={{ width: 600, height: 400 }} />
        </div>
      </div>
    </div>
  );
}

export default App;
