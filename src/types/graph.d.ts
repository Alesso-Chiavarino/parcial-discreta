export type Node = {
    name: string;
};

export type Connection = {
    from: string;
    to: string;
    weight: number;
};

export interface DisjointSet {
    parent: number;
    rank: number;
}