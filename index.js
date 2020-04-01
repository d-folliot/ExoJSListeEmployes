const datalink = 'http://dummy.restapiexample.com/api/v1/employees';

const listOfColumns = {
    'EID': (item => item.id), 
    'Full Name': (item =>item.employee_name), 
    'Email': item => {
        let arraysplit = item.employee_name.toLowerCase().split(" ");
        return final =arraysplit[0][0]+ "." + arraysplit[arraysplit.length-1] + '@email.com';
    }, 
    'Monthly salary': function(item){return (item.employee_salary/12).toFixed(2) + " €";}, 
    'Year of birth': function(item){return (new Date().getFullYear() - item.employee_age);}, 
    'actions': (item,tdRow) => { return "" ;}
};

let dataxhr= [];
let dataaxios=[];
let datafetch=[];

// methodes de tri 
let sortbysalary = function(emp1, emp2){
    
    if ( parseInt(emp1.salary) > parseInt(emp2.salary)) return -1;
    else return 1;
};
let sortbyid = function(emp1, emp2){
    
    if ( parseInt(emp1.EID) > parseInt(emp2.EID)) return -1;
    else return 1;
};
let sortbyname = function(emp1, emp2){
    
    if ( emp1['Full Name'] > emp2['Full Name']) return -1;
    else return 1;
};
let sortbyemail = function(emp1, emp2){
    
    if ( emp1['Email'] > emp2['Email']) return -1;
    else return 1;
};
let sortbybirth = function(emp1, emp2){
    
    if ( parseInt(emp1['Year of birth']) > parseInt(emp2['Year of birth'])) return -1;
    else return 1;
};



const buttonxhr = document.querySelector('#xhr');
const buttonfetch = document.querySelector('#fetch');
const buttonaxios = document.querySelector('#axios');
const buttonclear = document.querySelector('#clear');
const table = document.querySelector('#table');

buttonxhr.addEventListener("click", function(){fillthetable(dataxhr, 'xhr')} );
buttonfetch.addEventListener("click", function(){fillthetable(datafetch, 'fetch')} );
buttonaxios.addEventListener("click", function(){fillthetable(dataaxios, 'axios')} );
buttonclear.addEventListener("click", function(){table.innerHTML ="";} );

// bouttons HTML create  & delete
function createButtons(i, td, method){
   const buttonduplicate = document.createElement('button');
   const buttondelete = document.createElement('button');

   buttonduplicate.className = "mybuttondupl mybuttontab";
   buttonduplicate.id = "butdupl"+i;
   buttonduplicate.dataset.method = method;
   buttonduplicate.dataset.rowid = i;
   buttonduplicate.textContent="Duplicate";
   buttonduplicate.addEventListener('click', duplicateEmployee);

   buttondelete.className = "mybuttondel mybuttontab";
   buttondelete.id = "butdel"+i;
   buttondelete.dataset.rowid = i;
   buttondelete.dataset.method = method;
   buttondelete.textContent="Delete";   
   buttondelete.addEventListener('click', deleteEmployee);

   td.append(buttonduplicate);
   td.append(buttondelete);   
}
// bouttons HTML pour up et down
function createArrows(th, method, key){
    const buttonarrup = document.createElement('button');
    const buttonarrdown = document.createElement('button');

    buttonarrup.className = "mybuttonup mybuttonhead";
    buttonarrup.dataset.method = method;
    buttonarrup.dataset.dir = 1;
    buttonarrup.dataset.key =key;
    buttonarrup.textContent="Up";
    buttonarrup.addEventListener('click', orderEmployee);
 
    buttonarrdown.className = "mybuttondown mybuttonhead";
    buttonarrdown.dataset.method = method;
    buttonarrdown.dataset.dir = -1;
    buttonarrdown.dataset.key =key;
    buttonarrdown.textContent="Down";   
    buttonarrdown.addEventListener('click', orderEmployee);
 
    th.append(buttonarrup);
    th.append(buttonarrdown);  
}

function orderEmployee(_event){
    console.log(_event);
    let method =_event.target.dataset.method;
    let dir =parseInt(_event.target.dataset.dir);
    let key = _event.target.dataset.key;
    switch(key){
        case 'Monthly salary' : 
            findTheArray(method).sort(function(emp1, emp2){return dir*sortbysalary(emp1, emp2);} );
            break;
        case 'EID' : 
            findTheArray(method).sort(function(emp1, emp2){return dir*sortbyid(emp1, emp2);} ); 
            break;
        case 'Full Name' :
            findTheArray(method).sort(function(emp1, emp2){return dir*sortbyname(emp1, emp2);} );
            break;
        case 'Year of birth':  
            findTheArray(method).sort(function(emp1, emp2){return dir*sortbybirth(emp1, emp2);} );
            break;
        case 'Email' : 
            findTheArray(method).sort(function(emp1, emp2){return dir*sortbyemail(emp1, emp2);} );
            break;
        default:
            return false;
            break;
    }  
    fillthetable(findTheArray(method), method);
}

function deleteEmployee(_event){
    let rowId = _event.target.dataset.rowid;
    let method =_event.target.dataset.method;
    findTheArray(method).splice(rowId, 1);
    fillthetable(findTheArray(method), method);
}

function duplicateEmployee(_event){
    let rowId = parseInt(_event.target.dataset.rowid);
    let method = _event.target.dataset.method;
    let employee = findTheArray(method)[rowId];
    let obj = Object.create(Object.getPrototypeOf(employee));
    let newEmployee = Object.assign( obj, employee); 
    let newId = 0;
    findTheArray(method).forEach(emp => {
        let empId = parseInt(emp.EID);
        if(empId > newId) {
          newId = empId;        
      }
    });
    newEmployee.EID = ++newId;
    findTheArray(method).push(newEmployee);
    fillthetable(findTheArray(method), method);
}



// CREATION TABLE HTML
function fillthetable(dataArray, method ){    
    table.innerHTML=""; 

    const listOfKeys = Object.keys(listOfColumns); 

    table.append(createTableHead(listOfKeys, method));

    let sumofsalary =0;
       
    for (let i = 0; i < dataArray.length ; i++){
        const tdRow = document.createElement('tr'); 
        listOfKeys.forEach( key => { 
            const td = document.createElement('td');            
            td.textContent = dataArray[i][key];
            if (key=='actions'){
                createButtons(i, td, method);
            } 
            tdRow.append(td);           
        });
        sumofsalary += parseInt(dataArray[i].salary);
        table.append(tdRow);
    } 
    // Message si table vide
    if (dataArray.length==0 ){
        const tdRow = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = "Pas d'employés à afficher";
        tdRow.append(td); 
        table.append(tdRow);
    }
    else{ // sinon ligne de somme
        table.append(createFinalRow(dataArray, sumofsalary));
    }
}

//CREATION TABLE HEAD HTML
function createTableHead(listOfKeys, method){       
    const thRow=document.createElement('tr');
    
    listOfKeys.forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        if (key !='actions')
             createArrows(th, method, key);
        thRow.append(th);   
    });
    return thRow;
}
// CREATION LIGNE DE SOMME HTML 
function createFinalRow(dataArray, sumofsalary){
    const finaltdRow = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.textContent = dataArray.length;
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
    return finaltdRow;
}

// FILLING TABLE AND ROWS
function onLoadJson(array, method){
    let dataArray = findTheArray(method);
    for (let i = 0; i < array.length ; i++){
        dataArray[i] = new Object();
        Object.keys(listOfColumns).forEach( key => {             
            dataArray[i][key] = listOfColumns[key](array[i]);
        });
        dataArray[i]['salary']=array[i].employee_salary;    
    }
    fillthetable(dataArray, method);
}

// return en reference le tableau de données concerné
function findTheArray(method){
    switch(method){
        case 'xhr':
            return dataxhr;
            break;
        case 'fetch':
            return datafetch;
            break;
        case 'axios':
            return dataaxios;
            break;
        default:
            return false;
            break;  
    }
}


// XHR PART
let req = new XMLHttpRequest();
req.onload =function (){
    array = JSON.parse(this.responseText);
    onLoadJson(array.data, 'xhr');

};
req.open("GET", datalink,true);
req.send();

// API FETCH PART 
fetch(datalink)
.then(response => response.json())
.then(function(json) {
    onLoadJson(json.data, 'fetch');
});


// API AXIOS PART
axios({
    method: 'get',
    url: datalink,
    responseType: 'json'
  })
.then(response => onLoadJson(response.data.data, 'axios'));
    
