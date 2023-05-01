fetch('/data/complaints.json')
        .then(response => response.json())
        .then(data => {
            const complaintsContainer = document.getElementById('complaints');
            for (const [id, complaint] of Object.entries(data)) {
                const details = document.createElement('details');
                const summary = document.createElement('summary');
                summary.textContent = complaint.title;
                details.appendChild(summary);
                const body = document.createElement('div');
                const date = document.createElement('p');
                date.textContent = `Date: ${complaint.date}`;
                body.appendChild(date);
                const busId = document.createElement('p');
                busId.textContent = `Bus ID: ${complaint.BusId}`;
                body.appendChild(busId);
                const description = document.createElement('p');
                description.textContent = `Description: ${complaint.description}`;
                body.appendChild(description);
                const resolution = document.createElement('p');
                resolution.textContent = `Resolved: ${complaint.resolved}`;
                body.appendChild(resolution);
                details.appendChild(body);
                complaintsContainer.appendChild(details);
            }
        })
        .catch(error => console.error(error));