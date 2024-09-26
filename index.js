document.addEventListener('DOMContentLoaded', function() {
    const createItems = document.querySelectorAll('.create');
    const createDropdown = document.getElementById('createDropdown');
    const certCountInput = document.getElementById('certCount');
    const certNameInput = document.getElementById('certName');
    const certSearchInput = document.getElementById('certSearch');
    const certTableBody = document.getElementById('certTableBody');
    const refreshButton = document.getElementById('refresh');
    const revokeSelectedButton = document.getElementById('revokeSelected');
    const renewSelectedButton = document.getElementById('renewSelected');
    const texts = {
        en: {
            certificateNamePlaceholder: "Certificate name (ex: John Doe)",
            searchPlaceholder: "Search for a certificate",
            revoke: "Revoke",
            renew: "Renew",
            oneCertificate: "1 Certificate",
            tenCertificates: "10 Certificates",
            hundredCertificates: "100 Certificates",
            thousandCertificates: "1000 Certificates",
            refresh: "Refresh",
            done: "Done!",
            validityBtn: {
                valid: "Valid",
                expired: "Expired",
                revoked: "Revoked",
                unknown: "Unknown"
            },
            serial: "Serial",
            startDate: "Start Date",
            endDate: "End Date",            
            actions: "Actions",
            downloads: "Downloads"
        },
        fr: {
            certificateNamePlaceholder: "Nom du certificat (ex: John Doe)",
            searchPlaceholder: "Rechercher un certificat",
            revoke: "Révoquer",
            renew: "Renouveler",
            oneCertificate: "1 Certificat",
            tenCertificates: "10 Certificats",
            hundredCertificates: "100 Certificats",
            thousandCertificates: "1000 Certificats",
            refresh: "Rafraîchir",
            done: "Terminé !",
            validityBtn: {
                valid: "Valide",
                expired: "Expiré",
                revoked: "Révoqué",
                unknown: "Inconnu"
            },
            serial: "Numéro de série",
            startDate: "Date de début",
            endDate: "Date de fin",            
            actions: "Actions",
            downloads: "Téléchargements"
        }
    };

    // Set default language from localStorage or use English as default
    let lang = localStorage.getItem('language') || 'en';
    updateLanguage(lang);

    // Language switcher
    $('#languageMenu .dropdown-item').click(function () {
        lang = $(this).data('lang');
        localStorage.setItem('language', lang);
        updateLanguage(lang);
        loadCertData();
    });

    // Update the language
    function updateLanguage(lang) {
        setTimeout(() => {
            // Update top page content
            $('#certName').attr('placeholder', texts[lang].certificateNamePlaceholder);
            $('#certSearch').attr('placeholder', texts[lang].searchPlaceholder);
            $('#revokeSelected').html(`<img src="src/images/ban-solid.svg" class="icon mr-1"/> ${texts[lang].revoke}`);
            $('#renewSelected').html(`<img src="src/images/rotate-right-solid.svg" class="icon mr-1"/> ${texts[lang].renew}`);
            $('#refresh').html(`<img src="src/images/rotate-solid.svg" class="icon mr-1"/> ${texts[lang].refresh}`);

            // Update dropdown items
            $('.create[data-count="1"]').text(texts[lang].oneCertificate);
            $('.create[data-count="10"]').text(texts[lang].tenCertificates);
            $('.create[data-count="100"]').text(texts[lang].hundredCertificates);
            $('.create[data-count="1000"]').text(texts[lang].thousandCertificates);
            
            // Update table headers
            $('th[data-sort="serial"]').html(`<img src="src/images/hashtag-solid.svg" class="icon mr-1"/> ${texts[lang].serial}`);
            $('th[data-sort="startDate"]').html(`<img src="src/images/calendar-day-solid.svg" class="icon mr-1"/> ${texts[lang].startDate}`);
            $('th[data-sort="endDate"]').html(`<img src="src/images/calendar-days-solid.svg" class="icon mr-1"/> ${texts[lang].endDate}`);
            $('th[data-sort="actions"]').html(`<img src="src/images/gear-solid.svg" class="icon mr-1"/> ${texts[lang].actions}`);
            $('th[data-sort="downloads"]').html(`<img src="src/images/download-solid.svg" class="icon mr-1"/> ${texts[lang].downloads}`);
        }, 50);
    }

    // Adapt name, normalize
    function encodeName(name) {
        return name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-_]/g, '');
    }

    // Format date to YYYY/MM/DD from ISO format
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('fr-CA');
    }
    
    // Update actions buttons
    function updateActionButtons() {
        const selectedCerts = document.querySelectorAll('.cert-checkbox.active');
        if (selectedCerts.length > 0) {
            revokeSelectedButton.hidden = false;
            renewSelectedButton.hidden = false;
        } else {
            revokeSelectedButton.hidden = true;
            renewSelectedButton.hidden = true;
        }
    }

    // Sort columns
    function sortTable(columnIndex, order) {
        const rows = Array.from(certTableBody.querySelectorAll('tr'));                
        rows.sort((a, b) => {
            const cellA = a.querySelector(`td:nth-child(${columnIndex})`);
            const cellB = b.querySelector(`td:nth-child(${columnIndex})`);

            const textA = cellA.textContent.trim();
            const textB = cellB.textContent.trim();
            if (order === 'asc') {
                return textA.localeCompare(textB, undefined, { numeric: true });
            } else {
                return textB.localeCompare(textA, undefined, { numeric: true });
            }
        });
        rows.forEach(row => certTableBody.appendChild(row));
    }

    // Load data from files, create and update table & check checkboxes
    function loadCertData() {
        fetch('/list')
            .then(response => response.json())
            .then(data => {
                certTableBody.innerHTML = '';
                data.forEach(cert => {
                    const status = cert.status;
                    let validityColor, validityBtn, validityText;

                    // Determine validity color and button text based on the status
                    if (status === 'V') {
                        validityColor = 'success';
                        validityText = texts[lang].validityBtn.valid;
                        validityBtn = `<img src="src/images/circle-check-solid.svg" class="icon mr-1"/> ${validityText}`;
                    } else if (status === 'I') {
                        validityColor = 'warning';
                        validityText = texts[lang].validityBtn.expired;
                        validityBtn = `<img src="src/images/triangle-exclamation-solid.svg" class="icon mr-1"/> ${validityText}`;
                    } else if (status === 'R') {
                        validityColor = 'danger';
                        validityText = texts[lang].validityBtn.revoked;
                        validityBtn = `<img src="src/images/circle-xmark-solid.svg" class="icon mr-1"/> ${validityText}`;
                    } else {
                        validityColor = 'secondary';
                        validityText = texts[lang].validityBtn.unknown;
                        validityBtn = `<img src="src/images/question-solid.svg" class="icon mr-1"/> ${validityText}`;
                    }

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><button class="btn btn-dark btn-sm cert-checkbox" data-id="${cert.id}" ${status === 'R' ? 'disabled' : ''}><img src="src/images/${status === 'R' ? 'ban' : 'minus'}-solid.svg" class="icon"/></button></td>
                        <td><button class="btn btn-${validityColor} btn-sm w-100" data-id="${cert.id}">${validityBtn}</button></td>
                        <td><span class="tooltip-container" data-toggle="tooltip" data-html="true" data-placement="bottom" title="<div>Signature: ${cert.signature}</div>">${cert.serial}</span></td>
                        <td><span class="tooltip-container" data-toggle="tooltip" data-placement="bottom" title="${cert.startDate}">${formatDate(cert.startDate)}</span></td>
                        <td><span class="tooltip-container" data-toggle="tooltip" data-placement="bottom" title="${cert.endDate}">${formatDate(cert.endDate)}</span></td>
                        <td>${cert.id}</td>
                        <td>
                            <button class="btn btn-dark btn-sm revoke" onclick="revokeCert('${cert.id}')" ${status === 'R' ? 'disabled' : ''}><img src="src/images/ban-solid.svg" class="icon mr-1"/> ${texts[lang].revoke}</button>
                            <button class="btn btn-dark btn-sm renew" onclick="renewCert('${cert.id}')" ${status === 'R' ? 'disabled' : ''}><img src="src/images/rotate-right-solid.svg" class="icon mr-1"/> ${texts[lang].renew}</button>
                        </td>
                        <td>
                            <a class="btn btn-info btn-sm" href="/src/certs/${cert.id}.crt" download><img src="src/images/file-arrow-down-solid.svg" class="icon mr-1"/>.crt</a>
                            <a class="btn btn-info btn-sm" href="/src/certs/${cert.id}.csr" download><img src="src/images/file-arrow-down-solid.svg" class="icon mr-1"/>.csr</a>
                            <a class="btn btn-info btn-sm" href="/src/private/${cert.id}.key" download><img src="src/images/file-arrow-down-solid.svg" class="icon mr-1"/>.key</a>
                        </td>
                    `;
                    certTableBody.appendChild(row);
                });

                // Add event listeners for cert checkboxes
                const certButtons = document.querySelectorAll('.cert-checkbox');
                certButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        this.classList.toggle('active');
                        updateActionButtons();

                        if (this.classList.contains('active')) {
                            this.innerHTML = '<img src="src/images/check-solid.svg" class="icon"/>';
                        } else {
                            this.innerHTML = '<img src="src/images/minus-solid.svg" class="icon"/>';
                        }
                    });
                });
                updateActionButtons();
                initializeTooltips();
            })
            .catch(error => console.error('Certificate loading error:', error));
    }

    // Check if input is empty or not
    function toggleCreateButton() {
        if (certNameInput.value.trim() === "") {
            createDropdown.disabled = true;
        } else {
            createDropdown.disabled = false;
        }
    }

    // Initialize tool tips
    function initializeTooltips() {
        $('[data-toggle="tooltip"]').tooltip({
            html: true
        });
    }

    // Update create button based on input
    certNameInput.addEventListener('input', toggleCreateButton);

    // Dropdown menu to generate a specific number of certificates
    createItems.forEach(item => {
        item.addEventListener('click', function() {
            const certCount = this.getAttribute('data-count');
            const certName = encodeName(certNameInput.value);
            certCountInput.value = certCount;

            createDropdown.setAttribute('disabled', 'true');

            // Request create a certificate
            fetch(`/create?name=${encodeURIComponent(certName)}&count=${certCount}`)
                .then(response => response.text())
                .catch(error => {
                    console.error('Error:', error);
                })
                .finally(() => {
                    setTimeout(() => {
                        createDropdown.removeAttribute('disabled');
                    }, 3000);
                });
        });
    });

    // Filter certificates by name
    certSearchInput.addEventListener('input', function() {
        const searchText = encodeName(this.value).toLowerCase();
        const rows = certTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let match = false;
            cells.forEach(cell => {
                if (encodeName(cell.textContent).toLowerCase().includes(searchText)) {
                    match = true;
                }
            });
            row.style.display = match ? '' : 'none';
        });
    });
    
    // Refreshing the table
    refreshButton.addEventListener('click', function(event) {
        event.preventDefault();
        loadCertData();
        refreshButton.disabled = true;
        refreshButton.querySelector('img').style.transition = '1s ease-in-out';
        refreshButton.querySelector('img').style.transform = 'rotate(720deg)';

        setTimeout(() => {
            refreshButton.classList.add('btn-success');
            refreshButton.innerHTML = `<img src="src/images/square-check-white-solid.svg" class="icon mr-1"/> ${texts[lang].done}`;
        }, 1000);
        
        setTimeout(() => {
            refreshButton.classList.remove('btn-success');
            refreshButton.innerHTML = `<img src="src/images/rotate-solid.svg" class="icon mr-1"/> ${texts[lang].refresh}`;
            refreshButton.disabled = false;
        }, 2500);
    });

    // Renew multiple certificates
    renewSelectedButton.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedCerts = Array.from(document.querySelectorAll('.cert-checkbox.active')).map(button => button.getAttribute('data-id'));
        if (selectedCerts.length > 0) {
            fetch('/renew', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: selectedCerts })
            })
            .then(response => response.text())
            .then(() => loadCertData())
            .catch(error => console.error('Renewal error:', error));
        }
    });

    // Revoke multiple certificates
    revokeSelectedButton.addEventListener('click', function(event) {
        event.preventDefault();
        const selectedCerts = Array.from(document.querySelectorAll('.cert-checkbox.active')).map(button => button.getAttribute('data-id'));
        if (selectedCerts.length > 0) {
            fetch('/revoke', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: selectedCerts })
            })
            .then(response => response.text())
            .then(() => loadCertData())
            .catch(error => console.error('Revocation error:', error));
        }
    });

    // JQuery
    $(document).ready(function() {
        $("table thead").sortable({
            items: 'th',
            handle: '.sortable-handle',
            cursor: 'move',
            
            start: function(event, ui) {
                ui.placeholder.height(ui.helper.outerHeight());
            },
            stop: function(event, ui) {
                const newOrder = $("table thead th").map(function() {
                    return $(this).index();
                }).get();

                $("table thead").html(
                    $("table thead th").sort(function(a, b) {
                        return newOrder[$(a).index()] - newOrder[$(b).index()];
                    }).toArray()
                );

                $("table tbody").each(function() {
                    $(this).children("tr").each(function() {
                        const cells = $(this).children("td").toArray();
                        const reorderedCells = newOrder.map(index => cells[index]);
                        $(this).empty().append(reorderedCells);
                    });
                });
            }
        }).disableSelection();
    });

    // Sorting columns
    document.querySelectorAll('thead th').forEach((header, index) => {
        header.addEventListener('click', function() {
            const currentOrder = this.classList.contains('asc') ? 'desc' : 'asc';
            sortTable(index + 1, currentOrder);
            document.querySelectorAll('thead th').forEach(th => th.classList.remove('asc', 'desc'));
            this.classList.add(currentOrder);
        });
    });

    // Renew one certificate
    window.renewCert = function(id) {
        fetch('/renew', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: [id] })
        })
        .then(response => response.text())
        .then(() => loadCertData())
        .catch(error => console.error('Renewal error:', error));
    };

    // Revoke one certificate
    window.revokeCert = function(id) {
        fetch('/revoke', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: [id] })
        })
        .then(response => response.text())
        .then(() => loadCertData())
        .catch(error => console.error('Revocation error:', error));
    };

    loadCertData();
    toggleCreateButton();
});
