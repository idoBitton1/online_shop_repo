import { ApolloServer } from "apollo-server";
import { gql } from "apollo-server";
import { UserInputError } from "apollo-server";

//variables decleration
let demand: number[];
let supply: number[];
let costs: number[][];
let shipment_matrix: Shipment[][];

let totalCosts: number = 0; //will hold the final total cost
let resultMat: number[][]; //will hold the final result matrix

//object that holds the data of each shipment
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

//the first algorithm
const northWestCornerRule = (): void => {
    
    for(let i = 0, northwest = 0; i < supply.length; i++)
        for(let j = northwest; j < demand.length; j++)
        {
            //takes the smaller value between the supply and demand
            let quantity = Math.min(supply[i], demand[j]);
            //if quantity is 0, the row or the column is canceled
            if (quantity > 0) {
                //sets the smaller value as the quantity of the current cell
                shipment_matrix[i][j] = new Shipment(quantity, costs[i][j], i, j);

                supply[i] -= quantity;
                demand[j] -= quantity;

                //we need to check the north west corner cell in every
                //iteration, so if we "cancel" a row, we need to move to
                //the next
                if (supply[i] == 0) {
                    northwest = j;
                    break;
                }
            }
        }
}

//checks for neighbors from the same row and column,
//takes only the first one
const getNeighbors = (s: Shipment, elements: Shipment[]) => {
    //same row neighbors in index 0 
    //same column neighbors in index 1 
    var neighbors: Shipment[] = new Array(2);

    if(s != undefined){
        elements.forEach(element => {
            if (element != s) {// dont check the same item with itself
                if (element.row == s.row && neighbors[0] == null)
                    neighbors[0] = element; //same row, if not taken already
                else if (element.column == s.column && neighbors[1] == null)
                    neighbors[1] = element; //same column, if not taken already
    
                //if both neighbors found, quit
                if (neighbors[0] != null && neighbors[1] != null)
                    return;
            }
        })
    }

    return neighbors;
}

//flat the matrix to one dimention array, and filter the undefined values
const getShipmentMatrixFlat = (): Shipment[] => {

    return shipment_matrix.flat().filter(item => item.quantity != undefined);
}

//get closed path from the current cell
//closed path - a "circle" from the current cell
const getClosedPath = (s: Shipment): Shipment[] => {
    let path = getShipmentMatrixFlat();
    path.unshift(s);

    let prev_path_length;
    //remove elements that do not have a
    //vertical and horizontal neighbor
    do
    {
        prev_path_length = path.length;
        path = path.filter(item => {
            let neighbors: Shipment[] = getNeighbors(item, path);
            return (neighbors[0] != null && neighbors[1] != null);
        });
        path = path.filter(item => item.quantity != undefined);
    }while(prev_path_length != path.length)

    //finds the closed path
    let stones: Shipment[] = new Array(path.length);
    let prev: Shipment = s;
    for(let i = 0; i < stones.length; i++){
        stones[i] = prev;
        prev = getNeighbors(prev, path)[i % 2];
    }

    return stones;
}

const fixDegenerateCase = () => {
    const eps = Number.MIN_VALUE;

        if(supply.length + demand.length - 1 != getShipmentMatrixFlat().length) {

            for(let r = 0; r < supply.length; r++)
                for(let c = 0; c < demand.length; c++) {
                    if(shipment_matrix[r][c] == null) {
                        var dummy: Shipment = new Shipment(eps, costs[r][c], r, c);
                        //if there is no closed path for the dummy
                        if(getClosedPath(dummy)[0] == undefined) {
                            shipment_matrix[r][c] = dummy;
                            return;
                        }
                    }
                }
        }
}

const steppingStone = (): void => {
    let maxReduction: number = 0;
    let move: Shipment[] = [];
    let leaving: Shipment = {} as Shipment;

    fixDegenerateCase();

    for (let r = 0; r < supply.length; r++) {
        for (let c = 0; c < demand.length; c++) {
        
            if (shipment_matrix[r][c] != null)
                continue;

            let trial: Shipment = new Shipment(0, costs[r][c], r, c);
            let path: Shipment[] = getClosedPath(trial);

            let reduction: number = 0;
            let lowestQuantity: number = Number.MAX_VALUE;
            let leavingCandidate: Shipment = {} as Shipment;

            let plus: boolean = true;
            path.forEach(item => {
                if(plus){
                    reduction += item.costPerUnit;
                }
                else{
                    reduction -= item.costPerUnit;
                    if (item.quantity < lowestQuantity) {
                        leavingCandidate = item;
                        lowestQuantity = item.quantity;
                    }
                }
                plus = !plus;
            })

            if (reduction < maxReduction) {
                move = path;
                leaving = leavingCandidate;
                maxReduction = reduction;
            }
        }
    }

    if (move.length != 0) {
        let q: number = leaving.quantity;
        let plus: boolean = true;
        move.forEach(item => {
            item.quantity += plus ? q : -q;
            shipment_matrix[item.row][item.column] = item.quantity == 0 ? {} as Shipment : item;
            plus = !plus;
        })
        steppingStone();
    }
}

//forming the results for the client
const formReply = (): number[][] => {

    let resMat: number[][] = Array.from(Array(supply.length), () => new Array(demand.length));

    for (let r = 0; r < supply.length; r++) {
        for (let c = 0; c < demand.length; c++) {

            let s: Shipment = shipment_matrix[r][c];
            if(s != undefined && s.quantity === Number.MIN_VALUE){
                resMat[r][c] = 0;
            }
            else if (s != undefined && s.row == r && s.column == c) {
                resMat[r][c] = s.quantity;
                totalCosts += (s.quantity * s.costPerUnit);
            } else
                resMat[r][c] = 0;
        }
    }

    return resMat;
}

const typeDefs = gql`

    type Result{
        resMat: [[Int!]]!,
        totalCost: Float!
    }

    type Query {
        getMinimumCost(all_supply: [Int!]!,
                       all_demand: [Int!]!,
                       costs_mat: [[Float!]]!): Result
    }
`;

const resolvers = {
    Query: {
        getMinimumCost: (_: any, args: any) => {
            const {all_supply, all_demand, costs_mat} = args;

            //reset
            totalCosts = 0;

            //fix imbalance
            let total_src = 0;
            all_supply.forEach((item: number) => {
                total_src += item;
            });

            let total_dst = 0;
            all_demand.forEach((item: number) => {
                total_dst += item;
            });

            //check if there is an imbalance, and if there is one, fix it
            if (total_src > total_dst){
                demand = [...all_demand, (total_src - total_dst)];

                supply = all_supply;
            }
            else if (total_dst > total_src){
                supply = [...all_supply, (total_dst - total_src)];

                demand = all_demand;
            }
            else{
                supply = all_supply;
                demand = all_demand;
            }
            
            //allocating the arrays
            costs = Array.from(Array(supply.length), () => new Array(demand.length));
            shipment_matrix = Array.from(Array(supply.length), () => new Array(demand.length));

            //fill the costs mat
            for (let i = 0; i < all_supply.length; i++)
                for (let j = 0; j < all_demand.length; j++)
                    costs[i][j] = costs_mat[i][j];
            //fill  empty cells
            for (let i = 0; i < supply.length; i++)
                for (let j = 0; j < demand.length; j++)
                    costs[i][j] = costs[i][j] == undefined ? 0 : costs[i][j];

            northWestCornerRule();
            steppingStone();

            resultMat =  formReply();

            console.log(resultMat)
            console.log(totalCosts)

            const result = {
                resMat: resultMat,
                totalCost: totalCosts
            } 

            console.log(result)

            return result;
        }
    }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen({port: 8080}).then(({ url }) => {
    console.log(`API is running at: ${url}`);
})
//to run the server: ts-node-esm server.ts
//if comment not found, run: npm i -g ts-node