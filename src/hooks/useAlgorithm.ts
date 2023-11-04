import { Connection, Node } from "../types/graph";

export const useAlgorithm = (nodes: Node[]) => {

    const buildAdjacencyMatrix = (nodes: Node[], connections: Connection[]) => {
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

    return {
        buildAdjacencyMatrix,
        runPrimAlgorithm,
    }
}