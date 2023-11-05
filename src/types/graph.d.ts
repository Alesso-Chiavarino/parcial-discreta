export type Node = {
    name: string;
};

export type Connection = {
    from: string;
    to: string;
    weight: number;
    path?: number[];
};

export interface DisjointSet {
    parent: number;
    rank: number;
}