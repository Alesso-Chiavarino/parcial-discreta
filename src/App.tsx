import './App.css';
import { Graphviz } from 'graphviz-react';
import React, { useState, useEffect } from 'react';

type Node = {
  name: string;
};

type Connection = {
  from: string;
  to: string;
  weight: number;
};

const App: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [nodeName, setNodeName] = useState<string>('');
  const [isShowForm, setIsShowForm] = useState<boolean>(true);
  const [isShowFormArista, setIsShowFormArista] = useState<boolean>(true);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [edgeWeight, setEdgeWeight] = useState<number>(1);
  const [dotString, setDotString] = useState<string>('digraph {}'); // Esto es solo un valor de ejemplo

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

  useEffect(() => {
    // Crear la cadena DOT basada en los nodos y conexiones
    const dot = `digraph {
      ${nodes.map(node => `"${node.name}"`).join('; ')}
      ${connections.map(conn => `"${conn.from}" -> "${conn.to}" [label="${conn.weight}"]`).join('; ')}
    }`;
    setDotString(dot);
  }, [nodes, connections]);

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
        <div>
          <Graphviz dot={dotString} />
        </div>
      </div>
    </div>
  );
}

export default App;
