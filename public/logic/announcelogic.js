fetch('/data/announcements.json')
        .then(response => response.json())
        .then(data => {
            const announcementsContainer = document.getElementById('announcements');
            for (const [id, announcement] of Object.entries(data)) {
                const details = document.createElement('details');
                const summary = document.createElement('summary');
                summary.textContent = announcement.title;
                details.appendChild(summary);
                const body = document.createElement('div');
                const date = document.createElement('p');
                date.textContent = `Date: ${announcement.date}`;
                body.appendChild(date);
                const busId = document.createElement('p');
                busId.textContent = `Bus ID: ${announcement.BusId}`;
                body.appendChild(busId);
                const description = document.createElement('p');
                description.textContent = `Description: ${announcement.description}`;
                body.appendChild(description);
                details.appendChild(body);
                announcementsContainer.appendChild(details);
            }
        })
        .catch(error => console.error(error));