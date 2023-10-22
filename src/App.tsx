import './App.css';
import { Graphviz } from 'graphviz-react';
import React, { useState } from 'react';

const App = () => {

  interface Node {
    name: string
  }

  const [nodes, setNodes] = useState<Node[]>([]);
  const [nodeName, setNodeName] = useState('');
  const [isShowForm, setIsShowForm] = useState(true);
  const [isShowFormArista, setIsShowFormArista] = useState(true);
  const [connections, setConnections] = useState<{ from: string, to: string }[]>([]);

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

    if (!connections.some(conn => conn.from === fromNode && conn.to === toNode)) {
      setConnections([...connections, { from: fromNode, to: toNode }]);
    }
  }

  let dotString = 'digraph {';
  for (let i = 0; i < nodes.length; i++) {
    dotString += `${nodes[i].name};`;
  }
  for (const connection of connections) {
    dotString += `${connection.from} -> ${connection.to};`;
  }
  dotString += '}';

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
            </div>
            <button type="submit" className='bg-red-400 px-4 py-2 rounded-md'>Conectar</button>
          </form>
        )}
        <div>
          <h5>Nodos</h5>
          <div>
            {nodes.length > 0 && nodes.map((node, index) => (
              <div key={index} className='border-2 rounded-md border-red-400 w-fit'>
                <span>{node.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='w-[80%]'>
        <div style={{ width: '600px', height: '400px' }}> {/* Set your desired width and height */}
          <Graphviz dot={dotString} options={{ width: 600, height: 400 }} />
        </div>
      </div>
    </div>
  );
}

export default App;
