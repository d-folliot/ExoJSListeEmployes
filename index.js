const datalink = 'http://dummy.restapiexample.com/api/v1/employees';

const listOfColumns = {'EID': (item => item.id), 'Full Name': (item =>item.employee_name), 
'Email': item => {
    let arraysplit = item.employee_name.toLowerCase().split(" ");
    return final =arraysplit[0][0]+ "." + arraysplit[arraysplit.length-1] + '@email.com';
}, 
'Monthly salary': function(item){return (item.employee_salary/12).toFixed(2) + " €";}, 
'Year of birth': function(item){return (new Date().getFullYear() - item.employee_age);}, 
'actions': (item,tdRow) => {
    return "" ;
}};

let modifiedArray = [];

let sortbysalary = function(emp1, emp2){
    if (emp1.salary > emp2.salary) return -1;
    else return 1;
};


let displaytable = function (tableok,  ...tableko){
    if (tableok != null) {tableok.style.display="block";}
    tableko.forEach(table => table.style.display ="none" );
};
const buttonxhr = document.querySelector('#xhr');
const buttonfetch = document.querySelector('#fetch');
const buttonaxios = document.querySelector('#axios');
const buttonclear = document.querySelector('#clear');
const tablexhr = document.querySelector('#tablexhr');
const tablefetch = document.querySelector('#tablefetch');
const tableaxios = document.querySelector('#tableaxios');

buttonxhr.addEventListener("click", function(){displaytable(tablexhr,tablefetch,tableaxios)} );
buttonfetch.addEventListener("click", function(){displaytable(tablefetch,tablexhr,tableaxios)} );
buttonaxios.addEventListener("click", function(){displaytable(tableaxios,tablefetch,tablexhr)} );
buttonclear.addEventListener("click", function(){displaytable(null, tableaxios,tablefetch,tablexhr)} );

function createButtons(i, td){
   const buttonduplicate = document.createElement('button');
   const buttondelete = document.createElement('button');
   buttonduplicate.className = "mybuttondupl mybuttontab";
   buttonduplicate.id = "butdupl"+i;
   buttonduplicate.dataset.rowid = i;
   buttonduplicate.textContent="Duplicate";
   buttonduplicate.addEventListener('click', duplicateEmployee);

   buttondelete.className = "mybuttondel mybuttontab";
   buttondelete.id = "butdel"+i;
   buttondelete.dataset.rowid = i;
   buttondelete.textContent="Delete";   
   buttondelete.addEventListener('click', deleteEmployee);
   td.append(buttonduplicate);
   td.append(buttondelete);   
}

function deleteEmployee(_event){

}
function duplicateEmployee(_event){

}

function fillthetable( table){
    const thRow=document.createElement('tr');
    const listOfKeys = Object.keys(listOfColumns);
    let sumofsalary =0;
    listOfKeys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        thRow.append(th);   
    });
    table.append(thRow);
    for (let i = 0; i < modifiedArray.length ; i++){
        const tdRow = document.createElement('tr'); 
        listOfKeys.forEach( key => { 
            const td = document.createElement('td');            
            td.textContent = modifiedArray[i][key];
            if (key=='actions'){
                createButtons(i, td);
            } 
            tdRow.append(td);           
        });
        sumofsalary += parseInt(modifiedArray[i].salary);
        table.append(tdRow);
    }
    const finaltdRow = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.textContent = modifiedArray.length;
    finaltdRow.style.fontWeight = "bold";
    finaltdRow.append(td1);
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');
    td4.textContent = (sumofsalary/12).toFixed(2) + " €";
    const td5 = document.createElement('td');
    const td6 = document.createElement('td');
    finaltdRow.append(td2);
    finaltdRow.append(td3);
    finaltdRow.append(td4);    
    finaltdRow.append(td5);
    finaltdRow.append(td6);
    table.append(finaltdRow);
}

// FILLING TABLE AND ROWS
function onLoadJson(array, table){

    for (let i = 0; i < array.length ; i++){
        modifiedArray[i] = new Object();
        Object.keys(listOfColumns).forEach( key => {             
            modifiedArray[i][key] = listOfColumns[key](array[i]);
        });
        modifiedArray[i]['salary']=array[i].employee_salary;    
    }
    fillthetable(table);

}


// XHR PART
let req = new XMLHttpRequest();
req.onload =function (){
    array = JSON.parse(this.responseText);
    onLoadJson(array.data, tablexhr);

};
req.open("GET", datalink,true);
req.send();

// API FETCH PART 
fetch(datalink)
.then(response => response.json())
.then(function(json) {
    onLoadJson(json.data, tablefetch);
});


// API AXIOS PART
axios({
    method: 'get',
    url: datalink,
    responseType: 'json'
  })
.then(response => onLoadJson(response.data.data, tableaxios));
    
// init
displaytable(null, tableaxios,tablefetch,tablexhr);