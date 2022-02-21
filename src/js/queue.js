export default class Queue{
    constructor(){
        this.items = [];
    }

    enqueue(item){
        this.items.push(item);
    }

    dequeue(){
        if(this.isEmpty())
            return //tratar fila vazia
        return this.items.shift();
    }

    getSize(){
        return this.items.length;
    }

    isEmpty(){
        return this.getSize() === 0;
    }
}