export const graphModels = {
    ej_1_c_and_2_b: {
        nodes: [{ name: 'A' }, { name: 'B' }, { name: 'C' }, { name: 'D' }, { name: 'E' }, { name: 'F' }, { name: 'G' }, { name: 'H' }, { name: 'I' }, { name: 'J' }],
        connections: [
            { from: 'A', to: 'B', weight: 2 },
            { from: 'B', to: 'A', weight: 2 },
            { from: 'A', to: 'D', weight: 5 },
            { from: 'D', to: 'A', weight: 5 },
            { from: 'B', to: 'C', weight: 7 },
            { from: 'C', to: 'B', weight: 7 },
            { from: 'C', to: 'D', weight: 5 },
            { from: 'D', to: 'C', weight: 5 },
            { from: 'B', to: 'E', weight: 4 },
            { from: 'E', to: 'B', weight: 4 },
            { from: 'C', to: 'F', weight: 3 },
            { from: 'F', to: 'C', weight: 3 },
            { from: 'E', to: 'G', weight: 4 },
            { from: 'G', to: 'E', weight: 4 },
            { from: 'E', to: 'H', weight: 6 },
            { from: 'H', to: 'E', weight: 6 },
            { from: 'G', to: 'H', weight: 5 },
            { from: 'H', to: 'G', weight: 5 },
            { from: 'H', to: 'I', weight: 7 },
            { from: 'I', to: 'H', weight: 7 },
            { from: 'G', to: 'J', weight: 4 },
            { from: 'J', to: 'G', weight: 4 },
            { from: 'I', to: 'J', weight: 2 },
            { from: 'J', to: 'I', weight: 2 },
        ],
    },
    ej_9: {
        nodes: [{ name: 'M' }, { name: '1' }, { name: '2' }, { name: '3' }, { name: '4' }, { name: '5' }, { name: '6' }, { name: '7' }],
        connections: [
            { from: 'M', to: '1', weight: 5 },
            { from: '1', to: 'M', weight: 5 },
            { from: 'M', to: '6', weight: 4 },
            { from: '6', to: 'M', weight: 4 },
            { from: '1', to: '2', weight: 8 },
            { from: '2', to: '1', weight: 8 },
            { from: '2', to: '4', weight: 7 },
            { from: '4', to: '2', weight: 7 },
            { from: '4', to: '7', weight: 7 },
            { from: '7', to: '4', weight: 7 },
            { from: '5', to: '7', weight: 5 },
            { from: '7', to: '5', weight: 5 },
            { from: '5', to: '6', weight: 9 },
            { from: '6', to: '5', weight: 9 },
            { from: 'M', to: '2', weight: 16 },
            { from: '2', to: 'M', weight: 16 },
            { from: '4', to: '5', weight: 7 },
            { from: '5', to: '4', weight: 7 },
            { from: '1', to: '3', weight: 6 },
            { from: '3', to: '1', weight: 6 },
            { from: '2', to: '3', weight: 7 },
            { from: '3', to: '2', weight: 7 },
            { from: '3', to: '4', weight: 7 },
            { from: '4', to: '3', weight: 7 },
            { from: '3', to: '7', weight: 8 },
            { from: '7', to: '3', weight: 8 },
            { from: '3', to: '5', weight: 6 },
            { from: '5', to: '3', weight: 6 },
            { from: '6', to: '3', weight: 5 },
            { from: '3', to: '6', weight: 5 },
            { from: 'M', to: '3', weight: 10 },
            { from: '3', to: 'M', weight: 10 },
        ],
    },
};