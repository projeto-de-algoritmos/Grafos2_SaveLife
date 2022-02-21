class QElement {
    constructor(element, priority)
    {
        this.element = element;
        this.priority = priority;
    }
}
 
export default class PriorityQueue {
     constructor()
    {
        this.items = [];
    }

    PEnqueue(element, priority){
        var qElement = new QElement(element, priority);
        var contain = false;
        
        // iterating até achar a posição correta na fila
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                //enfileira
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
    
        //maior prioridade ->fim da fila
        if (!contain) {
            this.items.push(qElement);
        }

    }

    PDequeue(){
	    if (this.PQisEmpty())
	    	return "underflow";
	    return this.items.shift();
    }

    front()
    {
        // retorna elemento de maior prioridade sem removê-lo
        if (this.PQisEmpty())
            return "Sem elementos";
        return this.items[0];
    }

    back(){
        // retorna elemento de menor prioridade
        if (this.PQisEmpty())
            return "Sem elementos";
        return this.items[this.items.length - 1];
    }

    PQisEmpty(){
        return this.items.length == 0;
    }

}