import { Connection, DisjointSet, Node } from "../types/graph";

export const useAlgorithm = (nodes: Node[]) => {

    const makeSet = (n: number): DisjointSet[] => {
        return Array(n)
            .fill(0)
            .map((_, index) => ({ parent: index, rank: 0 }));
    };

    const find = (sets: DisjointSet[], i: number): number => {
        if (sets[i].parent !== i) {
            sets[i].parent = find(sets, sets[i].parent);
        }
        return sets[i].parent;
    };

    const union = (sets: DisjointSet[], x: number, y: number): void => {
        const rootX = find(sets, x);
        const rootY = find(sets, y);

        if (rootX !== rootY) {
            if (sets[rootX].rank < sets[rootY].rank) {
                sets[rootX].parent = rootY;
            } else if (sets[rootX].rank > sets[rootY].rank) {
                sets[rootY].parent = rootX;
            } else {
                sets[rootY].parent = rootX;
                sets[rootX].rank++;
            }
        }
    };

    const kruskalAlgorithm = (nodes: Node[], connections: Connection[]): Connection[] => {
        connections.sort((a, b) => a.weight - b.weight);
        const selectedEdges: Connection[] = [];
        const disjointSets = makeSet(nodes.length);

        for (const connection of connections) {
            const fromNodeIndex = nodes.findIndex((node) => node.name === connection.from);
            const toNodeIndex = nodes.findIndex((node) => node.name === connection.to);

            const rootA = find(disjointSets, fromNodeIndex);
            const rootB = find(disjointSets, toNodeIndex);

            if (rootA !== rootB) {
                selectedEdges.push(connection);
                union(disjointSets, rootA, rootB);
            }
        }

        return selectedEdges;
    };

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

    const primAlgorithm = (adjacencyMatrix: number[][]) => {
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

    const dijkstraAlgorithm = (adjacencyMatrix: number[][], startNode: Node) => {
        const numNodes = adjacencyMatrix.length;
        const distances: number[] = new Array(numNodes).fill(Infinity);
        const previousNodes: number[] = new Array(numNodes).fill(-1);

        const startNodeIndex = nodes.findIndex((node) => node.name === startNode.name);
        distances[startNodeIndex] = 0;

        const unvisitedNodes: number[] = Array.from({ length: numNodes }, (_, i) => i);

        while (unvisitedNodes.length > 0) {
            const currentNodeIndex = getClosestNode(unvisitedNodes, distances);
            unvisitedNodes.splice(unvisitedNodes.indexOf(currentNodeIndex), 1);

            for (let neighborIndex = 0; neighborIndex < numNodes; neighborIndex++) {
                if (adjacencyMatrix[currentNodeIndex][neighborIndex] !== Infinity) {
                    const tentativeDistance = distances[currentNodeIndex] + adjacencyMatrix[currentNodeIndex][neighborIndex];

                    if (tentativeDistance < distances[neighborIndex]) {
                        distances[neighborIndex] = tentativeDistance;
                        previousNodes[neighborIndex] = currentNodeIndex;
                    }
                }
            }
        }

        const dijkstraEdges: Connection[] = [];
        for (let i = 0; i < numNodes; i++) {
            if (i !== startNodeIndex) {
                const targetNode = nodes[i];
                const path = reconstructPath(previousNodes, i, startNodeIndex);
                dijkstraEdges.push({
                    from: startNode.name,
                    to: targetNode.name,
                    weight: distances[i],
                    path,
                });
            }
        }

        return dijkstraEdges;
    };

    const getClosestNode = (nodes: number[], distances: number[]) => {
        return nodes.reduce((closest, node) => (distances[node] < distances[closest] ? node : closest), nodes[0]);
    };

    const reconstructPath = (previousNodes: number[], targetNode: number, startNode: number) => {
        const path = [targetNode];
        let currentNode = targetNode;
        while (currentNode !== startNode) {
            currentNode = previousNodes[currentNode];
            path.unshift(currentNode);
        }
        return path;
    };

    return {
        buildAdjacencyMatrix,
        primAlgorithm,
        kruskalAlgorithm,
        dijkstraAlgorithm
    }
}