import { ApolloServer } from "apollo-server";
import { gql } from "apollo-server";
import { UserInputError } from "apollo-server";
import pg from "pg";

const pool = new pg.Pool({
    user: "postgres",
    password: "mpmpiv100",
    host: "localhost",
    port: 5432,
    database: "shift_manager"
});

var demand: number[];
var supply: number[];
var costs: number[][];
var shipment_matrix: Shipment[][];

class Shipment {
    costPerUnit: number;
    row: number;
    column: number;
    quantity: number;

    constructor(quantity: number, costPerUnit: number, row: number, column: number){
        this.quantity = quantity;
        this.costPerUnit = costPerUnit;
        this.row = row;
        this.column = column;
    }
}

const northWestCornerRule = (): void => {
    for(let i = 0, northwest = 0; i < supply.length; i++)
        for(let j = northwest; j < demand.length; j++)
        {
            var quantity = Math.min(supply[i], demand[j]);
            if (quantity > 0) {
                shipment_matrix[i][j] = new Shipment(quantity, costs[i][j], i, j);

                supply[i] -= quantity;
                demand[j] -= quantity;

                if (supply[i] == 0) {
                    northwest = j;
                    break;
                }
            }
        }
}

const getNeighbors = (s: Shipment, elements: Shipment[]) => {
    var neighbors: Shipment[] = new Array(2);

    for(let i = 0; i< elements.length; i++) {
        if (elements[i] != s) {
            if (elements[i].row == s.row && neighbors[0] == null)
                neighbors[0] = elements[i];
            else if (elements[i].column == s.column && neighbors[1] == null)
                neighbors[1] = elements[i];
            if (neighbors[0] != null && neighbors[1] != null)
                break;
        }
    }
    return neighbors;
}

const getClosedPath = (s: Shipment): Shipment[] => {
    var path = shipment_matrix.flat().filter(item => item != null);
    path.unshift(s);

    // remove elements that do not have a
    // vertical AND horizontal neighbor
    path = path.filter(item => {
        let neighbors: Shipment[] = getNeighbors(item, path);
        return (neighbors[0] != null && neighbors[1] != null);
    });

    var stones: Shipment[] = path;
    var prev: Shipment = s;
    for(let i = 0; i < stones.length; i++)
    {
        stones[i] = prev;
        prev = getNeighbors(prev, path)[i % 2];
    }

    return stones;
}

const fixDegenerateCase = () => {
    
}

const typeDefs = gql`

    type Query {
        getMinimumCost(all_supply: [Int!]!,
                       all_demand: [Int!]!,
                       costs_mat: [[Float!]]!): Int
    }
`;

const resolvers = {
    Query: {
        getMinimumCost: (_: any, args: any) => {
            const {all_supply, all_demand, costs_mat} = args;

            //assigning the values
            supply = all_supply;
            demand = all_demand;
            costs = costs_mat;

            //allocating the array
            shipment_matrix = Array.from(Array(supply.length), () => new Array(demand.length));
        

        }
    }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({ url }) => {
    console.log(`API is running at: ${url}`);
})

//to run the server: ts-node-esm server.ts