

function create_bus(busId,busData){
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = busId;
    details.appendChild(summary);
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tr = document.createElement("tr");
    const th1 = document.createElement("th");
    const th2 = document.createElement("th");
    th1.textContent = "Time";
    th2.textContent = "Bus Stop";
    tr.appendChild(th1);
    tr.appendChild(th2);
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    for (const routeData of busData.route) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        td1.textContent = routeData.time;
        td2.textContent = routeData.busstop;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.setAttribute('data-id',routeData.busstop);
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    details.appendChild(table);
    details.classList.add("bus");

    return details;
}




function loadData() {
    fetch("/data/buses.json")
    .then(response => response.json())
    .then(data => {
        const detailsContainer = document.getElementById("bus-list");
        for (const [busId, busData] of Object.entries(data)) {
            const details=create_bus(busId,busData)
            detailsContainer.appendChild(details);
        }
    })
    .catch(error => console.error(error));
}



function searchRoutes() {
    const source = document.getElementById("source").value.trim().toLowerCase();
    const destination = document.getElementById("destination").value.trim().toLowerCase();
    const detailsContainer = document.getElementById("bus-list");
    const details = detailsContainer.querySelectorAll(".bus");
    console.log(details)

    for( var i=0;i<details.length;i++)
    {
        const table = details[i].querySelector("table");
        const tbody = table.querySelector("tbody");
        const rows = tbody.querySelectorAll("tr");

        let passThroughSource = false;
        let passThroughDestination = false;
        let passThroughBoth=false;

        for(var j=0;j<rows.length;j++)
        {
            if(rows[j].getAttribute('data-id').trim().toLowerCase()==source) passThroughSource=true;
            if(rows[j].getAttribute('data-id').trim().toLowerCase()==destination && passThroughSource) {passThroughDestination=true; passThroughBoth=true;}
            else if(rows[j].getAttribute('data-id').trim().toLowerCase()==destination && !passThroughSource) {passThroughDestination=true;}

        }

        if(!source && !destination)
        {
            details[i].hidden=false
        }

        else if(source && destination)
        {
            if(!passThroughBoth){
                details[i].hidden=true
            }
            else{
                details[i].hidden=false
            }
        }
        else if(!source && destination)
        {
            if(!passThroughDestination){
                details[i].hidden=true
            }
            else{
                details[i].hidden=false
            }
            
        }
        else if(source && !destination)
        {
            if(!passThroughSource){
                details[i].hidden=true
            }
            else{
                details[i].hidden=false
            }
            
        }
    }
}

loadData();