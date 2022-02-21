import Queue from "./queue.js";
import PriorityQueue from "./priorityQueue.js";

export default class Graph {
    constructor(numNodes){
        this.numNodes = numNodes;
        this.adjacencyList = {}
    }

    addNode(v){
        if(!this.adjacencyList[v]) this.adjacencyList[v] = [];
    }


    addEdge(v, u, weight){ 
        this.adjacencyList[v].push({node: u, weight:weight});
        this.adjacencyList[u].push({node: v, weight:weight});
      
    }

    printGraph() {
        var get_keys = Object.keys(this.adjacencyList)

        for (var i of get_keys){
            var get_values = Object.values(this.adjacencyList[i]);
            var conc = "";

            for (var j of get_values){
                conc += JSON.stringify(j) + " ";
            }
            console.log(i + " -> " + conc);
        }

    }

    
}

 

