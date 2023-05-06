const detailsContainer = document.getElementById('complaints');

fetch('/data/complaints.json')
  .then(response => response.json())
  .then(complaints => {

    Object.keys(complaints).forEach(id => {
      const complaint = complaints[id];

      const detailsElement = document.createElement('details');
      detailsContainer.appendChild(detailsElement);

      const summaryElement = document.createElement('summary');
      summaryElement.textContent = complaint.subject ;
      detailsElement.appendChild(summaryElement);


      const typeElement = document.createElement('p');
      typeElement.textContent = "Type : " + complaint.type;
      detailsElement.appendChild(typeElement);

      const descriptionElement = document.createElement('p');
      descriptionElement.textContent = "Description : " + complaint.description;
      detailsElement.appendChild(descriptionElement);

      const resolvedElement = document.createElement('p');
      resolvedElement.textContent = "Resolved : " + complaint.resolved;
      detailsElement.appendChild(resolvedElement);

      const resolveButton = document.createElement('button');
      resolveButton.textContent = 'Resolve';
      resolveButton.value = id; 
      resolveButton.classList.add('btn');
      resolveButton.style.float='right'

      detailsElement.appendChild(resolveButton);

      resolveButton.addEventListener('click', (event) => {
        const id = event.target.value; 
        console.log(id);

        fetch('/maintenance/resolution', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: id })
        }).then(response => response.json())
          .then(data => console.log(data))
          .then(()=>{resolvedElement.textContent="Resolved : true";})
          .catch(error => console.error(error));
      });

      
    });
  }).catch(error => {
    console.error(error);
  });