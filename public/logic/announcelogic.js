fetch('/data/announcements.json')
        .then(response => response.json())
        .then(data => {
            const announcementsContainer = document.getElementById('announcements');
            for (const [id, announcement] of Object.entries(data)) {
                const details = document.createElement('details');
                const summary = document.createElement('summary');
                summary.textContent = announcement.ann_title;
                details.appendChild(summary);
                const body = document.createElement('div');
                const date = document.createElement('p');
                date.textContent = `Date: ${announcement.date}`;
                body.appendChild(date);
                const annType = document.createElement('p');
                annType.textContent = `Category: ${announcement.ann_type}`;
                body.appendChild(annType);
                const description = document.createElement('p');
                description.textContent = `Announcement: ${announcement.ann_content}`;
                body.appendChild(description);
                const brk = document.createElement('br');
                body.appendChild(brk);
                const aname = document.createElement('p');
                aname.textContent = `Announcement made by: ${announcement.name}`;
                body.appendChild(aname);
                details.appendChild(body);
                announcementsContainer.appendChild(details);
            }
        })
        .catch(error => console.error(error));