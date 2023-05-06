//identifying various regions on the page
const schList = document.getElementById("admin_sch_list");
const routeList = document.getElementById("admin_route_list");
const newRoute = document.getElementById("new_bus_route");
let numWaypoints = 0;

function addBusRoute() {
    const newBusForm = document.getElementById("new_bus_form");
    if (newBusForm.className == "sch_new_bus_hidden") {
        newBusForm.className = "sch_new_bus";
    }
    //initialising the number of waypoints for a particular bus route
    numWaypoints = 0;
}

async function deleteBus(busId) {
    const response = await fetch(`/admin/deletebus/${busId}`, { method: 'DELETE' });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Failed to delete bus ${busId}: ${errorMessage}`);
      return;
    }
    clearBusList();
    loadData();
}

function submitBusDetails() {
    hideBusForm();
    //clearBusList();
    //loadData();
}

function addWaypoint(currentWaypoint) {
  numWaypoints++;

  const newWaypoint = document.createElement('li');
  newWaypoint.innerHTML = `
    <div class="waypt">
      <label for="time[${numWaypoints}]">Time
        <input type="text" class="time" name="time[${numWaypoints}]" required>
      </label>
      <label for="loc[${numWaypoints}]">Bus Stop
        <input type="text" class="loc" name="loc[${numWaypoints}]" required>
      </label>
      <button type="button" class="rt_btn" value="add_waypt" onclick="addWaypoint(this.parentNode.parentNode)"><img src="pics/add-point1.png" alt="Add Waypoint"></button>
      <button type="button" class="rt_btn" value="del_waypt" onclick="delWaypoint(this.parentNode.parentNode)"><img src="pics/bin.png" alt="Delete Waypoint"></button>
    </div>
  `;

  const currentWaypointIndex = Array.from(currentWaypoint.parentNode.children).indexOf(currentWaypoint);
  currentWaypoint.parentNode.insertBefore(newWaypoint, currentWaypoint.nextSibling);

  // Update the name attributes of subsequent waypoints
  for (let i = currentWaypointIndex + 2; i < numWaypoints + 1; i++) {
    const waypoint = currentWaypoint.parentNode.children[i];
    const timeInput = waypoint.querySelector('.time');
    const locInput = waypoint.querySelector('.loc');
    timeInput.name = `time[${i-1}]`;
    locInput.name = `loc[${i-1}]`;
  }
}

function delWaypoint(currentWaypoint) {
    if (numWaypoints === 1) {
        alert('Cannot delete the only waypoint.');
        return;
      }

    currentWaypoint.parentNode.removeChild(currentWaypoint);

    // Update the name attributes of subsequent waypoints
    for (let i = Array.from(currentWaypoint.parentNode.children).indexOf(currentWaypoint) + 1; i < numWaypoints; i++) {
        const waypoint = currentWaypoint.parentNode.children[i];
        const timeInput = waypoint.querySelector('.time');
        const locInput = waypoint.querySelector('.loc');
        timeInput.name = `time[${i-1}]`;
        locInput.name = `loc[${i-1}]`;
    }

    numWaypoints--;
}

async function insertWaypoint(busId, time, busStop) {
    const response = await fetch(`/admin/insertwaypoint/${busId}/${time}/${busStop}`, { method: 'DELETE' });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Failed to insert waypoint ${time}:${busStop} of ${busId}: ${errorMessage}`);
      return;
    }
    clearBusList();
    loadData();
}

async function deleteWaypoint(busId, busStop) {
    const response = await fetch(`/admin/deletewaypoint/${busId}/${busStop}`, { method: 'DELETE' });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`Failed to delete waypoint ${busStop} of ${busId}: ${errorMessage}`);
      return;
    }
    clearBusList();
    loadData();
}

function getRoute(busId, busData) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    const delBtn = document.createElement("button"); // Create delete button
    const delImg = document.createElement("img");
    delImg.src = "pics/delfromlist.png";
    delImg.alt = "Delete Bus Route";
    delBtn.classList.add("busdel_btn");
    delBtn.appendChild(delImg);
    summary.textContent = busId;
    summary.appendChild(delBtn); // Add delete button to summary tag
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
    const th3 = document.createElement("th");
    th3.textContent = "Actions";
    tr.appendChild(th3);
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement("tbody");
    for (const routeData of busData.route) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = document.createElement("td");
        const td3 = document.createElement("td");
        const addBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");
        const addImg = document.createElement("img");
        const deleteImg = document.createElement("img");
        addImg.src = "pics/add-point1.png";
        addImg.alt = "Add";
        deleteImg.src = "pics/bin.png";
        deleteImg.alt = "Delete";
        addBtn.classList.add("bus_btn");
        deleteBtn.classList.add("bus_btn");
        addBtn.appendChild(addImg);
        deleteBtn.appendChild(deleteImg);
        td1.textContent = routeData.time;
        td2.textContent = routeData.busstop;
        td3.appendChild(addBtn);
        td3.appendChild(deleteBtn);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.setAttribute("data-id", routeData.busstop);
        tbody.appendChild(tr);

        // Add event listener to delete button
        deleteBtn.addEventListener("click", function deleteRow() {
            const busStop = routeData.busstop;
            const confirmation = confirm(`Are you sure you want to delete the bus stop "${busStop}" of bus "${busId}"?`);
            if (confirmation) {
                //document.getElementById("bus-list").innerHTML += "Delete waypoint clicked!";
                deleteWaypoint(busId, busStop);
                tr.remove();
            }
        });

        // Add event listener to add button
        addBtn.addEventListener("click", function insertRow() {
            // Prompt user for time and busstop values
            const time = prompt("Enter time:");
            if (time !== null && time !== "") {
                const busstop = prompt("Enter bus stop:");
                if (busstop !== null && busstop !== "") {
                    // Create new row
                    const newRow = document.createElement("tr");

                    // Create buttons
                    const addBtn = document.createElement("button");
                    const deleteBtn = document.createElement("button");
                    const addImg = document.createElement("img");
                    const deleteImg = document.createElement("img");
                    addImg.src = "pics/add-point1.png";
                    addImg.alt = "Add";
                    deleteImg.src = "pics/bin.png";
                    deleteImg.alt = "Delete";
                    addBtn.classList.add("bus_btn");
                    deleteBtn.classList.add("bus_btn");
                    addBtn.appendChild(addImg);
                    deleteBtn.appendChild(deleteImg);
                
                    // Add new cells to row
                        // time
                    const timeCell = document.createElement("td");
                    timeCell.textContent = time;
                    newRow.appendChild(timeCell);

                        //bus stop
                    const busstopCell = document.createElement("td");
                    busstopCell.textContent = busstop;
                    newRow.appendChild(busstopCell);

                        //buttons
                    const btnsCell = document.createElement("td");
                    btnsCell.appendChild(addBtn);
                    btnsCell.appendChild(deleteBtn);
                    newRow.appendChild(btnsCell);

                    // Add event listeners for the new row buttons
                    addBtn.addEventListener("click", insertRow);
                    //deleteBtn.addEventListener("click", deleteRow);
                
                    // Add new row to table
                    tbody.appendChild(newRow);

                    insertWaypoint(busId, time, busstop);
                }
            }
        });
    }
    table.appendChild(tbody);
    details.appendChild(table);
    details.classList.add("bus");

    // Add event listener to delete button
    delBtn.addEventListener("click", () => {
        //document.getElementById("bus-list").innerHTML += "Delete button clicked!";
        const confirmation = confirm(`Are you sure you want to delete the bus "${busId}"?`);
        if (confirmation) {
            deleteBus(busId);
        }
    });

    return details;
}

function loadData() {
    fetch("/data/buses.json")
    .then(response => response.json())
    .then(data => {
        const detailsContainer = document.getElementById("bus-list");
        for (const [busId, busData] of Object.entries(data)) {
            const details=getRoute(busId,busData)
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

function hideBusForm() {
    const newBusForm = document.getElementById("new_bus_form");
    if (newBusForm.className == "sch_new_bus") {
        newBusForm.className = "sch_new_bus_hidden";
    }
}

function clearBusList() {
    const detailsContainer = document.getElementById("bus-list");
    detailsContainer.innerHTML = "";
}

//calling function to load data onto the page
loadData();
