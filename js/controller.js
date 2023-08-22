window.addEventListener("load",init);
function init(){
    
    clearAll();
    loadId();
    showTotal();
    bindEvents();  
}

function clearAll(){

    /* this function clears the contents of the form except the ID (since ID is auto generated)*/
    document.querySelectorAll('.form-control').forEach(input=>input.value = '');
    
}

let auto = autoGen();

function loadId(){
    /* this function automatically sets the value of ID */
    document.querySelector('#id').innerText = auto.next().value;
    
}

function showTotal(){
    /* this function populates the values of #total, #mark and #unmark ids of the form */
    const total = itemOperations.items.length;
    const marked = itemOperations.countTotalMarked();
    document.querySelector('#total').innerText = total;
    document.querySelector('#mark').innerText = marked;
    document.querySelector('#unmark').innerText = total - marked;
}

function bindEvents(){
    
    document.querySelector('#remove').addEventListener('click',deleteRecords);
    document.querySelector('#add').addEventListener('click',addRecord);
    document.querySelector('#update').addEventListener('click',updateRecord)
    document.querySelector('#exchange').addEventListener('change',getExchangerate)

    document.querySelector('#saveToLocal').addEventListener('click',saveToLocal);
    document.querySelector('#loadFromLocal').addEventListener('click',loadFromLocal);

    document.querySelector('#saveToServer').addEventListener('click',saveToServer);
    document.querySelector('#loadFromServer').addEventListener('click',loadFromServer);
}

function deleteRecords(){
    /* this function deletes the selected record from itemOperations and prints the table using the function printTable*/
    itemOperations.remove();
    printTable(itemOperations.items);
}


function addRecord(){
    /* this function adds a new record in itemOperations and then calls printRecord(). showTotal(), loadId() and clearAll()*/
    const id = parseInt(document.querySelector('#id').innerText);
    const name = document.querySelector('#name').value;
    const price = parseFloat(document.querySelector('#price').value);
    const desc = document.querySelector('#desc').value;
    const color = document.querySelector('#color').value;
    const url = document.querySelector('#url').value;
    const itemObject = new Item(id, name, price, desc, color, url);
    itemOperations.add(itemObject);

    printRecord(itemObject);
    showTotal();
    loadId();
    clearAll();
}
function edit(){
    /*this function fills (calls fillFields()) the form with the values of the item to edit after searching it in items */ 
    const id = parseInt(this.getAttribute('data-itemid'));
    const itemObject = itemOperations.search(id);
    if(itemObject){
        fillFields(itemObject);
    }
}
function fillFields(itemObject){
    /*this function fills the form with the details of itemObject*/
    document.querySelector('#id').innerText = itemObject.id;
    document.querySelector('#name').value = itemObject.name;
    document.querySelector('#price').value = itemObject.price;
    document.querySelector('#desc').value = itemObject.desc;
    document.querySelector('#color').value = itemObject.color;
    document.querySelector('#url').value = itemObject.url;
}
function createIcon(className,fn, id){
 /* this function creates icons for edit and trash for each record in the table*/
    // <i class="fas fa-trash"></i>
    // <i class="fas fa-edit"></i>
    var iTag = document.createElement("i");
    iTag.className = className;
    iTag.addEventListener('click',fn);
    iTag.setAttribute("data-itemid", id) ;

    return iTag;
}


function updateRecord(){
    /*this function updates the record that is edited and then prints the table using printTable()*/
    const id = parseInt(document.querySelector('#id').innerText);
    const itemObject = itemOperations.search(id);
    if(itemObject){
        itemObject.name = document.querySelector('#name').value;
        itemObject.price = parseFloat(document.querySelector('#price').value);
        itemObject.desc = document.querySelector('#desc').value;
        itemObject.color = document.querySelector('#color').value;
        itemObject.url = document.querySelector('#url').value;

        printTable(itemOperations.items);
        clearAll();
    }
}

function trash(){
    /*this function toggles the color of the row when its trash button is selected and updates the marked and unmarked fields */
    let id = this.getAttribute('data-itemid');
    itemOperations.markUnMark(id);
    showTotal();
    let tr = this.parentNode.parentNode;
    tr.classList.toggle('alert-danger');
    console.log("I am Trash ",this.getAttribute('data-itemid'))
}

function printTable(items){
    /* this function calls printRecord for each item of items and then calls the showTotal function*/
    document.querySelector('#items').innerHTML = '';
    items.forEach(printRecord);
    showTotal();
}
function printRecord(item){
    var tbody = document.querySelector('#items');
    var tr = tbody.insertRow();
    var index = 0;
    for(let key in item){
        if(key=='isMarked'){
            continue;
        }
        let cell = tr.insertCell(index);
        cell.innerText = item[key] ;
        index++;
    }
    var lastTD = tr.insertCell(index);
    lastTD.appendChild(createIcon('fas fa-trash mr-2',trash,item.id));
    lastTD.appendChild(createIcon('fas fa-edit',edit,item.id));
}

function getExchangerate(){
    /* this function makes an AJAX call to http://apilayer.net/api/live to fetch and display the exchange rate for the currency selected*/
    const API_KEY = '4d0e8cc73f527785021d84fc7b44b95b';
    const currency = document.getElementById('exchange');
    const currencyValue = currency.options[currency.selectedIndex].value;

    const prise = parseFloat(document.querySelector('#price').value);

    console.log(currencyValue);

    fetch(`http://apilayer.net/api/live?access_key=${API_KEY}`)
    .then(response=>response.json())
    .then(data=>{
        const rate = data.quotes['USD'+currencyValue];
        if(rate){
            if (isNaN(prise)) {
                document.querySelector('#exrate').innerText = '$1.00 USD = $' + (rate).toFixed(2) + ' ' + currencyValue;
                return;
            }else {
                document.querySelector('#exrate').innerText = '$' + prise.toFixed(2) + ' USD = $' + (prise*rate).toFixed(2) + ' ' + currencyValue;
            }//'Exchange Rate: ' + rate;
        } else {
            document.querySelector('#exrate').innerText = 'Exchange Rate: Not Available';
        }
    })
    .catch(err=>{
        console.log('Error is ',err);
        document.querySelector('#exrate').innerText = 'Exchange Rate: Not Available';
    });
}

function saveToLocal(){
    localStorage.setItem('items',JSON.stringify(itemOperations.items));
}

function loadFromLocal(){

    const storedItems = JSON.parse(localStorage.getItem('items'));
    if(storedItems){
        //Convert plain objects to Item instances
        itemOperations.items = storedItems.map(itemObject=> Object.assign(new Item(),itemObject));
        printTable(itemOperations.items);
    }
}

function saveToServer(){
    fetch('http://localhost:3000/save',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(itemOperations.items)
    })
    .then(response=>response.json())
    .then(data=>{
        console.log('Data saved: ',data);
    })
    .catch(err=>{
        console.log('Error is ',err);
    });
}

function loadFromServer(){
    fetch('http://localhost:3000/load')
    .then(response=>response.json())
    .then(data=>{
        //Convert plain objects to Item instances
        itemOperations.items = data.map(itemObject=> Object.assign(new Item(),itemObject));
        printTable(itemOperations.items);
        showTotal();
    })
    .catch(err=>{
        console.log('Error is ',err);
    });
}