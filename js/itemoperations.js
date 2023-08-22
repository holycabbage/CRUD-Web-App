const itemOperations = {
    items:[],
    add(itemObject){
        /* adds an item into the array items*/
        this.items.push(itemObject);
    },
    remove(){
         /* removes the item which has the "isMarked" field set to true*/
         this.items = this.items.filter(itemObject=>!itemObject.isMarked);
   },
    search(id){
        /* searches the item with a given argument id */
        return this.items.find(itemObject=>itemObject.id==id);
    },
    markUnMark(id){
        /* toggle the isMarked field of the item with the given argument id*/
        const itemObject = this.search(id);
        if (itemObject instanceof Item){
            itemObject.toggle();
        }

},
   countTotalMarked(){
        /* counts the total number of marked items */
        return this.items.filter(itemObject=>itemObject.isMarked).length;
},
   
}