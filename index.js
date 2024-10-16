document.addEventListener('DOMContentLoaded', function() {
    const lockState = JSON.parse(localStorage.getItem('isLocked'));
    const createBtn = document.getElementById('createBtn');
    const certSearchInput = document.getElementById('certSearch');
    const certTableBody = document.getElementById('certTableBody');
    const selectBoxHeader = document.querySelector('[data-sort="selectBox"]');
    const lockInterface = document.getElementById('lockInterface');
    const passwordModalTitle = document.getElementById('passwordModalTitle');
    const passwordModal = new bootstrap.Modal(document.getElementById('passwordModal'));
    const passwordInput = document.getElementById('password');
    const texts = {
        en: {
            actions: {
                renew: "Renew",
                revoke: "Revoke",
                disable: "Disable",
                cancel: "Cancel",
                confirm: "Confirm",
            },
            status: {
                valid: "Valid",
                expired: "Expired",
                revoked: "Revoked",
                disabled: "Disabled",
                unknown: "Unknown"
            },
            headers: {
                status: "Status",
                commonName: "Common Name (CN)",
                serial: "Serial",
                signature: "Signature",
                startDate: "Start Date",
                endDate: "End Date",
                downloads: "Downloads",
            },
            titles: {
                searchBar: "Search for a certificate",
                selectProfile: "Select a profile",
                definePass: "Define a Passphrase",
                enterPass: "Enter your Passphrase",
                createMultiSan: "Create Multi SAN Certificate",
                viewCert: "Certificate details",
                renewCert: "Renew Certificate",
                revokeCert: "Revoke Certificate",
                disableCert: "Disable Certificate",
            },
            modals: {
                CA: "Certificate Authority",
                CN: "Common Name",
                SUBJ: "Subject (O / OU / CN)",
                subject: "SAN (Subject Alternative Name)",
                type: "Certificate Type",
                selector: {
                    select1: "Server",
                    select2: "User",
                },
                enterPass: "Enter your passphrase (can be empty)",
                confirmPass: "Confirm your passphrase",
                missing: {
                    IP: "No IP defined",
                    DNS: "No DNS defined",
                    type: "No type defined",
                },
            },
            confirmations: {
                confirmRevoke: "Are you sure you want to revoke this certificate?",
                confirmDisable: "Are you sure you want to disable this certificate?",
            },
            lang: {
                english: "English",
                french: "French",
                spanish: "Spanish",
                german: "German"
            },
            undefined: "Undefined",
        },
        fr: {
            actions: {
                renew: "Renouveler",
                revoke: "Révoquer",
                disable: "Désactiver",
                cancel: "Annuler",
                confirm: "Confirmer",
            },
            status: {
                valid: "Valide",
                expired: "Expiré",
                revoked: "Révoqué",
                disabled: "Désactivé",
                unknown: "Inconnu"
            },
            headers: {
                status: "Statut",
                commonName: "Nom Commun (CN)",
                serial: "Numéro de série",
                signature: "Signature",
                startDate: "Date de début",
                endDate: "Date de fin",
                downloads: "Téléchargements",
            },
            titles: {
                searchBar: "Rechercher un certificat",
                selectProfile: "Sélectionner",
                definePass: "Définir une Passphrase",
                enterPass: "Entrer votre Passphrase",
                createMultiSan: "Créer un certificat Multi SAN",
                viewCert: "Informations du certificat",
                renewCert: "Renouveler le certificat",
                revokeCert: "Révoquer le certificat",
                disableCert: "Désactiver le certificat",
            },
            modals: {
                CA: "Autorité de certification",
                CN: "Nom Commun",
                SUBJ: "Sujet (O / OU / CN)",
                subject: "SAN (Nom Alternatif du Sujet)",
                type: "Type de certificat",
                selector: {
                    select1: "Serveur",
                    select2: "Utilisateur",
                },
                enterPass: "Entrez votre passphrase (peut être vide)",
                confirmPass: "Confirmez votre passphrase",
                missing: {
                    IP: "Pas d'IP définie",
                    DNS: "Pas de DNS défini",
                    type: "Pas de type défini",
                },
            },
            confirmations: {
                confirmRevoke: "Êtes-vous sûr de vouloir révoquer ce certificat ?",
                confirmDisable: "Êtes-vous sûr de vouloir désactiver ce certificat ?",
            },
            lang: {
                english: "Anglais",
                french: "Français",
                spanish: "Espagnol",
                german: "Allemand"
            },
            undefined: "Indéfini",
        },
        es: {
            actions: {
                renew: "Renovar",
                revoke: "Revocar",
                disable: "Deshabilitar",
                cancel: "Cancelar",
                confirm: "Confirmar",
            },
            status: {
                valid: "Válido",
                expired: "Expirado",
                revoked: "Revocado",
                disabled: "Deshabilitado",
                unknown: "Desconocido"
            },
            headers: {
                status: "Estado",
                commonName: "Nombre Común (CN)",
                serial: "Número de serie",
                signature: "Firma",
                startDate: "Fecha de inicio",
                endDate: "Fecha de finalización",
                downloads: "Descargas",
            },
            titles: {
                searchBar: "Buscar un certificado",
                selectProfile: "Seleccionar",
                definePass: "Definir una frase de paso",
                enterPass: "Ingresar tu frase de paso",
                createMultiSan: "Crear Certificado Multi SAN",
                viewCert: "Información del certificado",
                renewCert: "Renovar Certificado",
                revokeCert: "Revocar Certificado",
                disableCert: "Deshabilitar Certificado",
            },
            modals: {
                CA: "Autoridad de Certificación",
                CN: "Nombre Común",
                SUBJ: "Sujeto (O / OU / CN)",
                subject: "SAN (Nombre Alternativo del Sujeto)",
                type: "Tipo de certificado",
                selector: {
                    select1: "Servidor",
                    select2: "Usuario",
                },
                enterPass: "Ingrese su frase de paso (puede estar vacía)",
                confirmPass: "Confirme su frase de paso",
                missing: {
                    IP: "No se ha definido IP",
                    DNS: "No se ha definido DNS",
                    type: "No se ha definido tipo",
                },
            },
            confirmations: {
                confirmRevoke: "¿Estás seguro de que quieres revocar este certificado?",
                confirmDisable: "¿Estás seguro de que quieres deshabilitar este certificado?",
            },
            lang: {
                english: "Inglés",
                french: "Francés",
                spanish: "Español",
                german: "Alemán"
            },
            undefined: "Indefinido",
        },
        de: {
            actions: {
                renew: "Erneuern",
                revoke: "Widerrufen",
                disable: "Deaktivieren",
                cancel: "Abbrechen",
                confirm: "Bestätigen",
            },
            status: {
                valid: "Gültig",
                expired: "Abgelaufen",
                revoked: "Widerrufen",
                disabled: "Deaktiviert",
                unknown: "Unbekannt"
            },
            headers: {
                status: "Status",
                commonName: "Allgemeiner Name (CN)",
                serial: "Seriennummer",
                signature: "Signatur",
                startDate: "Anfangsdatum",
                endDate: "Enddatum",
                downloads: "Downloads",
            },
            titles: {
                searchBar: "Suche nach einem Zertifikat",
                selectProfile: "Profil auswählen",
                definePass: "Passwortphrase festlegen",
                enterPass: "Geben Sie Ihre Passwortphrase ein",
                createMultiSan: "Multi-SAN-Zertifikat erstellen",
                viewCert: "Informationen zum Zertifikat",
                renewCert: "Zertifikat erneuern",
                revokeCert: "Zertifikat widerrufen",
                disableCert: "Zertifikat deaktivieren",
            },
            modals: {
                CA: "Zertifizierungsstelle",
                CN: "Allgemeiner Name",
                SUBJ: "Betreff (O / OU / CN)",
                subject: "SAN (Alternative Name des Betreffs)",
                type: "Zertifikatstyp",
                selector: {
                    select1: "Server",
                    select2: "Benutzer",
                },
                enterPass: "Geben Sie Ihre Passwortphrase ein (kann leer sein)",
                confirmPass: "Bestätigen Sie Ihre Passwortphrase",
                missing: {
                    IP: "Keine IP definiert",
                    DNS: "Kein DNS definiert",
                    type: "Kein Typ definiert",
                },
            },
            confirmations: {
                confirmRevoke: "Sind Sie sicher, dass Sie dieses Zertifikat widerrufen möchten?",
                confirmDisable: "Sind Sie sicher, dass Sie dieses Zertifikat deaktivieren möchten?",
            },
            lang: {
                english: "Englisch",
                french: "Französisch",
                spanish: "Spanisch",
                german: "Deutsch"
            },
            undefined: "Unbekannt",
        },
    };    
    isLocked = lockState !== null ? lockState : true;

    // Set default language from localStorage or use English as default
    let lang = localStorage.getItem('language') || 'en';
    updateLanguage(lang);

    // Set the active class on the corresponding language menu item
    $('#languageMenu .dropdown-item').removeClass('active');
    $(`#languageMenu .dropdown-item[data-lang="${lang}"]`).addClass('active').find('.checkmark').show();

    // Hide checkmarks for other languages
    $('#languageMenu .dropdown-item').not(`[data-lang="${lang}"]`).find('.checkmark').hide(); 

    // Language switcher
    $('#languageMenu .dropdown-item').click(function () {
        $('#languageMenu .dropdown-item').removeClass('active');
        $('#languageMenu .dropdown-item').find('.checkmark').hide();
        $(this).addClass('active');
        $(this).find('.checkmark').show();
        lang = $(this).data('lang');
        localStorage.setItem('language', lang);
        updateLanguage(lang);
        updateInterface()
        loadCertData();
    });

    // Update the language
    function updateLanguage(lang) {
        // Update top page content
        const currentText = $('#switchCurrentCA').html();
        if ([texts['en'].titles.selectProfile, texts['fr'].titles.selectProfile, texts['es'].titles.selectProfile, texts['de'].titles.selectProfile].includes(currentText)) {
            $('#switchCurrentCA').html(texts[lang].titles.selectProfile);
        }
        $('#certSearch').attr('placeholder', texts[lang].titles.searchBar);    
        $('#passwordSubmit').html(`${texts[lang].actions.confirm}`);
        $('#english').html(`${texts[lang].lang.english} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#french').html(`${texts[lang].lang.french} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#spanish').html(`${texts[lang].lang.spanish} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        $('#german').html(`${texts[lang].lang.german} <span class="checkmark"><img src="images/check-solid.svg" class="icon ms-3"/></span>`);
        
        // Update table headers
        $('th[data-sort="status"]').html(`<img src="images/chart-simple-solid.svg" class="icon me-1"/> ${texts[lang].headers.status}`);
        $('th[data-sort="commonName"]').html(`<img src="images/file-lines-solid.svg" class="icon me-1"/> ${texts[lang].headers.commonName}`);
        $('th[data-sort="serial"]').html(`<img src="images/hashtag-solid.svg" class="icon me-1"/> ${texts[lang].headers.serial}`);
        $('th[data-sort="startDate"]').html(`<img src="images/calendar-day-solid.svg" class="icon me-1"/> ${texts[lang].headers.startDate}`);
        $('th[data-sort="endDate"]').html(`<img src="images/calendar-days-solid.svg" class="icon me-1"/> ${texts[lang].headers.endDate}`);
    }

    // Update lock / unlock buttons
    function updateInterface() {
        const checkboxes = document.querySelectorAll('.cert-checkbox');
        if (!isLocked) {
            checkboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
            createBtn.classList.remove('disabled');
            createBtn.classList.remove('btn-secondary');
            createBtn.classList.add('btn-primary');
            lockInterface.classList.remove('btn-danger');
            lockInterface.classList.add('btn-success');
            lockInterface.innerHTML = `<img src="images/unlock-solid.svg" class="icon"/>`;
        } else {
            checkboxes.forEach(checkbox => {
                checkbox.disabled = true;
            });
            createBtn.classList.add('disabled');
            createBtn.classList.remove('btn-primary');
            createBtn.classList.add('btn-secondary');
            lockInterface.classList.remove('btn-success');
            lockInterface.classList.add('btn-danger');
            lockInterface.innerHTML = `<img src="images/lock-white-solid.svg" class="icon"/>`;
        }
    }

    // Update confirmation input visibility and validation
    function updateConfirm() {
        const passPhrase = document.getElementById('passphrase');
        const confirmPassphrase = document.getElementById('confirmPassphrase');
        const confirmAction = document.getElementById('confirmAction');

        if(passPhrase && confirmPassphrase) {
            passPhrase.oninput = function() {
                confirmPassphrase.hidden = !this.value;
                validatePassphrase(confirmAction);
            };

            confirmPassphrase.oninput = () => validatePassphrase(confirmAction);
        }
    }

    // Validate passphrases
    function validatePassphrase(confirmAction) {
        const passPhrase = document.getElementById('passphrase');
        const confirmPassphrase = document.getElementById('confirmPassphrase');

        // Reset validation classes
        [passPhrase, confirmPassphrase].forEach(input => input.classList.remove('is-invalid', 'is-valid'));
        confirmAction.classList.remove('btn-success', 'btn-danger');
        confirmPassphrase.classList.add('is-invalid');
        confirmAction.disabled = true;

        // Check passphrase validity
        if (passPhrase.value && confirmPassphrase.value) {
            if (passPhrase.value === confirmPassphrase.value) {
                confirmPassphrase.classList.add('is-valid');
                confirmAction.classList.remove('btn-primary');
                confirmAction.classList.add('btn-success');
                confirmAction.disabled = false;
            } else {
                confirmPassphrase.classList.add('is-invalid');
                confirmAction.classList.add('btn-danger');
                confirmAction.disabled = true;
            }
        } else {
            confirmAction.classList.add('btn-primary');
        }
    }

    // Initialize tool tips
    function initializeTooltips() {
        $('[data-bs-toggle="tooltip"]').tooltip({
            html: true
        });
    }

    // Adapt name, normalize
    function encodeName(name) {
        return name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9-_ ]/g, '');
    }

    // Replace space with underscore
    function replaceSpaces(str) {
        return str.replace(/\s+/g, '_');
    }

    // Format date to YYYY/MM/DD from ISO format
    function formatDate(isoDateString) {
        const date = new Date(isoDateString);
        return date.toLocaleDateString('fr-FR');
    }

    // Sorting columns
    function sortTable(sortKey, order) {
        const rows = Array.from(certTableBody.querySelectorAll('tr'));

        if (!sortKey || sortKey === 'selectBox' || sortKey === 'downloads') {
            return;
        }

        rows.sort((a, b) => {
            const cellA = a.querySelector(`td[data-sort="${sortKey}"]`);
            const cellB = b.querySelector(`td[data-sort="${sortKey}"]`);

            if (!cellA || !cellB) return 0;

            // Sorting by status
            if (sortKey === 'status') {
                const buttonClassA = cellA.querySelector('button')?.classList;
                const buttonClassB = cellB.querySelector('button')?.classList;

                const statusOrder = {
                    'btn-success': 1,
                    'btn-warning': 2,
                    'btn-danger': 3,
                    'btn-dark': 4,
                    'btn-secondary': 5
                };

                const orderA = Array.from(buttonClassA || []).find(cls => statusOrder[cls]);
                const orderB = Array.from(buttonClassB || []).find(cls => statusOrder[cls]);
                return order === 'asc'
                    ? (statusOrder[orderA] || 0) - (statusOrder[orderB] || 0)
                    : (statusOrder[orderB] || 0) - (statusOrder[orderA] || 0);
            }

            // Sorting by date (startDate, endDate)
            if (sortKey === 'startDate' || sortKey === 'endDate') {
                const parseDate = (dateStr) => {
                    const [day, month, year] = dateStr.split('/').map(Number);
                    return new Date(year, month - 1, day);
                };

                const dateA = parseDate(cellA.textContent.trim());
                const dateB = parseDate(cellB.textContent.trim());

                return order === 'asc' ? dateA - dateB : dateB - dateA;
            }

            if (sortKey === 'id') {
                const nameA = cellA.textContent.trim();
                const nameB = cellB.textContent.trim();

                const numericA = parseInt(nameA.replace(/\D/g, ''), 10);
                const numericB = parseInt(nameB.replace(/\D/g, ''), 10);

                if (numericA !== numericB) {
                    return order === 'asc' ? numericA - numericB : numericB - numericA;
                }
                return order === 'asc'
                    ? nameA.localeCompare(nameB)
                    : nameB.localeCompare(nameA);
            }

            // Default sorting for other text fields
            const valueA = cellA.textContent.trim();
            const valueB = cellB.textContent.trim();

            return order === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
        });

        rows.forEach(row => certTableBody.appendChild(row));
    }

    function loadCertData() {
        let profile;
        fetch('/current-profile')
            .then(response => response.json())
            .then(profileData => {
                profile = profileData.currentProfile;
                return fetch('/list');
            })
            .then(response => response.json())
            .then(data => {
                certTableBody.innerHTML = '';
                data.forEach(cert => {
                    const status = cert.status;
                    let statusColor, statusBtn, statusText;

                    if (status === 'V') {
                        statusColor = 'success';
                        statusText = texts[lang].status.valid;
                        statusBtn = `<img src="images/circle-check-solid.svg" class="icon me-1"/> ${statusText}`;
                    } else if (status === 'E') {
                        statusColor = 'warning';
                        statusText = texts[lang].status.expired;
                        statusBtn = `<img src="images/triangle-exclamation-solid.svg" class="icon me-1"/> ${statusText}`;
                    } else if (status === 'R') {
                        statusColor = 'danger';
                        statusText = texts[lang].status.revoked;
                        statusBtn = `<img src="images/circle-xmark-solid.svg" class="icon me-1"/> ${statusText}`;
                    } else if (status === 'D') {
                        statusColor = 'dark';
                        statusText = texts[lang].status.disabled;
                        statusBtn = `<img src="images/circle-minus-solid.svg" class="icon me-1"/> ${statusText}`;
                    } else {
                        statusColor = 'secondary';
                        statusText = texts[lang].status.unknown;
                        statusBtn = `<img src="images/question-solid.svg" class="icon me-1"/> ${statusText}`;
                    }

                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="text-center check-container"><input type="checkbox" class="cert-checkbox" data-id="${cert.id}" ${status === 'D' ? 'disabled' : ''}></td>                        
                        <td class="status-container" data-sort="status">
                            <div class="button-container">
                                <button class="btn btn-ssm btn-status btn-${statusColor} rounded-pill" data-id="${cert.id}">${statusBtn}</button>
                                <div class="action-buttons" style="display: none;">
                                    <button class="btn btn-action renew">
                                        <img src="images/rotate-right-solid.svg" class="icon rotate-icon" data-id="${cert.id}"/>
                                    </button>
                                    <button class="btn btn-action revoke" ${status === 'R' ? 'disabled' : ''}>
                                        <img src="images/ban-solid.svg" class="icon cross-icon" data-id="${cert.id}"/>
                                    </button>
                                    <button class="btn btn-action disable" disabled>
                                        <img src="images/circle-minus-regular.svg" class="icon wobble-icon" data-id="${cert.id}"/>
                                    </button>
                                </div>
                            </div>
                        </td>
                        <td data-sort="commonName">${cert.id}</td>
                        <td data-sort="serial"><span class="tooltip-container" data-bs-toggle="tooltip" data-bs-html="true" data-bs-placement="bottom" title="<div>${texts[lang].headers.signature}: ${cert.hash}</div>">${cert.serial}</span></td>
                        <td data-sort="startDate"><span class="tooltip-container" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${cert.startDate}">${formatDate(cert.startDate)}</span></td>
                        <td data-sort="endDate"><span class="tooltip-container" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${cert.endDate}">${formatDate(cert.endDate)}</span></td>
                        <td class="download-container">
                            <button type="button" class="btn btn-light btn-sm" data-bs-toggle="popover" data-bs-html="true" data-bs-content="
                                <a class='btn btn-light btn-sm d-block text-start mb-1' href='${profile}/certs/${replaceSpaces(cert.id)}.crt' download><img src='images/certificate-solid.svg' class='icon me-1'/>.crt</a>
                                <a class='btn btn-light btn-sm d-block text-start mb-1' href='${profile}/certs/${replaceSpaces(cert.id)}.csr' download><img src='images/lock-solid.svg' class='icon me-1'/>.csr</a>
                                <a class='btn btn-light btn-sm d-block text-start mb-1' href='${profile}/private/${replaceSpaces(cert.id)}.key' download><img src='images/key-solid.svg' class='icon me-1'/>.key</a>
                                <a class='btn btn-light btn-sm d-block text-start disabled'><img src='images/file-export-solid.svg' class='icon me-1'/>.pkcs12</a>
                            ">
                                <img src="images/file-arrow-down-solid.svg" class="icon"/>
                            </button>
                        </td>
                    `;
                    certTableBody.appendChild(row);

                    // On action buttons click, show modal
                    row.querySelector('.renew').addEventListener('click', () => showModal('renew', cert));
                    row.querySelector('.revoke').addEventListener('click', () => showModal('revoke', cert));
                    row.querySelector('.disable').addEventListener('click', () => showModal('disable', cert));

                    row.addEventListener('click', function(event) {
                        if (!event.target.closest('.check-container') && !event.target.closest('.status-container') && !event.target.closest('.download-container')) {
                            showModal('view', cert);
                        }
                    });

                    // On line hover, show / hide action buttons
                    row.addEventListener('mouseover', function() {
                        if (!isLocked) {
                            const btn = row.querySelector('.btn-status');
                            const actionButtons = row.querySelector('.action-buttons');
                            const checkboxes = document.querySelectorAll('.cert-checkbox');
                            const isAnyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);

                            if (status === 'D' || isAnyChecked) {
                                return;
                            }

                            btn.style.display = 'none';
                            actionButtons.style.display = 'flex';
                        }
                    });
                    row.addEventListener('mouseout', function() {
                        if (!isLocked) {
                            const btn = row.querySelector('.btn-status');
                            const actionButtons = row.querySelector('.action-buttons');

                            btn.style.display = '';
                            actionButtons.style.display = 'none';
                        }
                    });
                });

                // Shift + click checkboxes
                let lastChecked = null;
                const checkboxes = document.querySelectorAll('.cert-checkbox');

                checkboxes.forEach(checkbox => {
                    checkbox.addEventListener('click', function(e) {
                        e.stopPropagation();
                        if (!lastChecked) {
                            lastChecked = this;
                            return;
                        }

                        if (e.shiftKey) {
                            let inBetween = false;
                            checkboxes.forEach(cb => {
                                if (cb === this || cb === lastChecked) {
                                    inBetween = !inBetween;
                                }

                                if (inBetween && !cb.disabled) {
                                    cb.checked = this.checked;
                                }
                            });
                        }
                        lastChecked = this;
                    });
                });

                // Select all checkboxes on header click
                selectBoxHeader.addEventListener('click', function() {
                    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked || checkbox.disabled);
                    
                    checkboxes.forEach(checkbox => {
                        if (!checkbox.disabled) {
                            checkbox.checked = !allChecked;
                        }
                    });
                });

                // Popovers
                var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
                var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
                    return new bootstrap.Popover(popoverTriggerEl);
                });

                // Set popovers for downloads
                popoverTriggerList.forEach((triggerEl) => {
                    triggerEl.addEventListener('click', function(event) {
                        popoverList.forEach(popover => {
                            if (popover._element !== this) {
                                popover.hide();
                            }
                        });
                        const popoverInstance = bootstrap.Popover.getInstance(this);
                        if (popoverInstance) {
                            popoverInstance.hide();
                        } else {
                            new bootstrap.Popover(this).show();
                        }
                        event.stopPropagation();
                    });
                });

                // Hide popovers on outside click
                document.addEventListener('click', function() {
                    popoverList.forEach(popover => {
                        popover.hide();
                    });
                });

                initializeTooltips();
                updateInterface();
                loadPassword();
            })
            .catch(error => console.error('Certificate loading error:', error));
    }

    // Function to manage all modals
    function showModal(action, certData) {
        const modalTitle = document.getElementById('dynamicModalLabel');
        const formContent = document.getElementById('formContent');
        const footerContent = document.getElementById('footerContent');
        const caPassphraseContainer = document.getElementById('caPassphraseContainer');

        formContent.innerHTML = '';

        switch (action) {
            case 'create':
                modalTitle.textContent = texts[lang].titles.createMultiSan;
                formContent.innerHTML = `
                    <div class="mb-3">
                        <input type="text" class="form-control" id="commonName" placeholder="${texts[lang].modals.CN}" required>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="subject" placeholder="${texts[lang].modals.SUBJ}" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">${texts[lang].modals.subject}</label>
                        <div id="sanContainer">
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" placeholder="IP" id="sanIp">
                                <button class="btn btn border" type="button" id="addIpButton">+</button>
                            </div>
                            <div id="addedSanIP" class="mt-2"></div>
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" placeholder="DNS" id="sanDns">
                                <button class="btn btn border" type="button" id="addDnsButton">+</button>
                            </div>
                            <div id="addedDnsNames" class="mt-2"></div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="type" class="form-label">${texts[lang].modals.type}</label>
                        <select class="form-select" id="type" name="type">
                            <option value="server">${texts[lang].modals.selector.select1}</option>
                            <option value="user">${texts[lang].modals.selector.select2}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="startDate" class="form-label">${texts[lang].headers.startDate}</label>
                        <input type="datetime-local" class="form-control" id="startDate" value="">
                    </div>
                    <div class="mb-3">
                        <label for="endDate" class="form-label">${texts[lang].headers.endDate}</label>
                        <input type="datetime-local" class="form-control" id="endDate" value="">
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="passphrase" placeholder="${texts[lang].modals.enterPass}">
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="confirmPassphrase" placeholder="${texts[lang].modals.confirmPass}" hidden>
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].actions.cancel}</button>
                    <button type="button" class="btn btn-primary" id="confirmAction">${texts[lang].actions.confirm}</button>
                `;

                // Confirm certificate creation
                document.getElementById('confirmAction').onclick = async function() {
                    const commonName = document.getElementById('commonName').value;
                    const subject = document.getElementById('subject').value;
                    const sanIP = Array.from(document.getElementById('addedSanIP').children).map(el => el.innerText);
                    const sanDns = Array.from(document.getElementById('addedDnsNames').children).map(el => el.innerText);
                    const type = document.getElementById('type').value;
                    const startDate = document.getElementById('startDate').value;
                    const endDate = document.getElementById('endDate').value;
                    const passphrase = document.getElementById('passphrase').value;

                    const data = {
                        id: commonName,
                        subject: subject,
                        sanIP: sanIP,
                        sanDns: sanDns,
                        type: type,
                        startDate: startDate,
                        endDate: endDate,
                        passphrase: passphrase
                    };

                    try {
                        const response = await fetch('/create', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });
    
                        if (response.ok) {
                            loadCertData();
                            modal.hide();
                        } else {
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                };
                break;
            case 'view':
                fetch('/current-profile')
                    .then(response => response.json())
                    .then(data => {
                        const profile = data.currentProfile;

                        let subjectArray = (certData.subject || '')
                            .replace(/^Subject\s*\(.*?\):\s*/, '')
                            .split(/(?:\/|\n)/)
                            .filter(Boolean);

                        let splitSubject = subjectArray.length > 0
                            ? subjectArray.map(el => `<span>${el}</span>`).join('<br>')
                            : `${texts[lang].undefined}`;

                        if (subjectArray.length === 1) {
                            splitSubject = `<span>${subjectArray[0]}</span>`;
                        } else {
                            splitSubject = `<br>${splitSubject}`;
                        }

                        modalTitle.textContent = `${texts[lang].titles.viewCert}`;
                        caPassphraseContainer.style.display = 'none';
                        formContent.innerHTML = `
                            <div id="certDetails">
                                <p><strong>${texts[lang].modals.CA}:</strong> ${certData.issuer ? certData.issuer : `${texts[lang].undefined}`}</p>
                                <p><strong>${texts[lang].modals.CN}:</strong> ${certData.id ? certData.id : `${texts[lang].undefined}`}</p>
                                <p><strong>${texts[lang].modals.SUBJ}:</strong> ${splitSubject}</p>
                    
                                <p><strong>${texts[lang].headers.serial}:</strong> ${certData.serial ? certData.serial : `${texts[lang].undefined}`}</p>
                                <p><strong>${texts[lang].headers.signature}:</strong> ${certData.hash ? certData.hash : `${texts[lang].undefined}`}</p>

                                <p><strong>IP:</strong> ${certData.ip && certData.ip.length > 0 
                                    ? certData.ip.map(ip => `<span>${ip}</span>`).join(', ') 
                                    : `${texts[lang].modals.missing.IP}`}
                                </p>

                                <p><strong>DNS:</strong> ${certData.dns && certData.dns.length > 0 
                                    ? certData.dns.map(dns => `<span>${dns}</span>`).join(', ') 
                                    : `${texts[lang].modals.missing.DNS}`}
                                </p>

                                <p><strong>${texts[lang].modals.type}:</strong> ${certData.type ? certData.type : `${texts[lang].modals.missing.type}`}</p>
                                <p><strong>${texts[lang].headers.startDate}:</strong> ${certData.startDate ? certData.startDate : `${texts[lang].undefined}`}</p>
                                <p><strong>${texts[lang].headers.endDate}:</strong> ${certData.endDate ? certData.endDate : `${texts[lang].undefined}`}</p>

                                <p class="text-wrap">
                                    <strong class="me-2">${texts[lang].headers.downloads}:</strong>
                                    <span class="d-inline-block mt-1">
                                        <a class="btn btn-light btn-sm mb-1 me-1" href="${profile}/certs/${replaceSpaces(certData.id)}.crt" download>
                                            <img src="images/certificate-solid.svg" class="icon me-1"/>.crt
                                        </a>
                                        <a class="btn btn-light btn-sm mb-1 me-1" href="${profile}/certs/${replaceSpaces(certData.id)}.csr" download>
                                            <img src="images/lock-solid.svg" class="icon me-1"/>.csr
                                        </a>
                                        <a class="btn btn-light btn-sm mb-1 me-1" href="${profile}/private/${replaceSpaces(certData.id)}.key" download>
                                            <img src="images/key-solid.svg" class="icon me-1"/>.key
                                        </a>
                                        <a class="btn btn-light btn-sm mb-1 disabled">
                                            <img src="images/file-export-solid.svg" class="icon me-1"/>.pkcs12
                                        </a>
                                    </span>
                                </p>
                            </div>
                        `;
                        footerContent.style.display = 'none';
                    })
                    .catch(error => console.error('Profile loading error:', error));
                break;
            case 'renew':
                modalTitle.textContent = `${texts[lang].titles.renewCert}`;
                formContent.innerHTML = `
                    <div class="mb-3">
                        <input type="text" class="form-control" id="certificateAuthority" value="${certData.issuer}" placeholder="${texts[lang].modals.CA}" readonly>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="commonName" value="${certData.id}" placeholder="${texts[lang].modals.CN}" readonly>
                    </div>
                    <div class="mb-3">
                        <input type="text" class="form-control" id="subject" value="${certData.subject}" placeholder="${texts[lang].modals.SUBJ}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">SAN (Subject Alternative Name)</label>
                        <div id="sanContainer">
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" placeholder="IP" id="sanIp" value="${certData.ip && certData.ip.length > 0 
                                    ? certData.ip.map(ip => `<span>${ip}</span>`).join(', ') 
                                    : `${texts[lang].modals.missing.IP}`}">
                                <button class="btn btn border" type="button" id="addIpButton">+</button>
                            </div>
                            <div id="addedSanIP" class="mt-2"></div>
                            <div class="input-group mb-2">
                                <input type="text" class="form-control" placeholder="DNS" id="sanDns" value="${certData.dns && certData.dns.length > 0 
                                    ? certData.dns.map(dns => `<span>${dns}</span>`).join(', ') 
                                    : `${texts[lang].modals.missing.DNS}`}">
                                <button class="btn btn border" type="button" id="addDnsButton">+</button>
                            </div>
                            <div id="addedDnsNames" class="mt-2"></div>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="type" class="form-label">${texts[lang].modals.type}</label>
                        <select class="form-select" id="type" name="type">
                            <option value="server">${texts[lang].modals.selector.select1}</option>
                            <option value="user">${texts[lang].modals.selector.select2}</option>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="startDate" class="form-label">${texts[lang].headers.startDate}</label>
                        <input type="datetime-local" class="form-control" id="startDate" value="">
                    </div>
                    <div class="mb-3">
                        <label for="endDate" class="form-label">${texts[lang].headers.endDate}</label>
                        <input type="datetime-local" class="form-control" id="endDate" value="">
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="passphrase" placeholder="${texts[lang].modals.enterPass}">
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="confirmPassphrase" placeholder="${texts[lang].modals.confirmPass}" hidden>
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].actions.cancel}</button>
                    <button type="button" class="btn btn-primary" id="confirmAction" data-bs-dismiss="modal">${texts[lang].actions.renew}</button>
                `;
                
                // Confirm certificate renewal
                document.getElementById('confirmAction').onclick = async function() {
                    const commonName = document.getElementById('commonName').value;
                    const subject = document.getElementById('subject').value;
                    const sanIP = Array.from(document.getElementById('addedSanIP').children).map(el => el.innerText);
                    const sanDns = Array.from(document.getElementById('addedDnsNames').children).map(el => el.innerText);
                    const type = document.getElementById('type').value;
                    const startDate = document.getElementById('startDate').value;
                    const endDate = document.getElementById('endDate').value;
                    const passphrase = document.getElementById('passphrase').value;

                    const data = {
                        id: commonName,
                        subject: subject,
                        sanIP: sanIP,
                        sanDns: sanDns,
                        type: type,
                        startDate: startDate,
                        endDate: endDate,
                        passphrase: passphrase
                    };
    
                    try {
                        const response = await fetch('/renew', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        });
    
                        if (response.ok) {
                            loadCertData();
                            modal.hide();
                        } else {
                            console.error('Renewal failed:', await response.text());
                        }
                    } catch (error) {
                        console.error('Renewal error:', error);
                    }
                };
                break;
            case 'revoke':
                modalTitle.textContent = `${texts[lang].titles.revokeCert}`;
                formContent.innerHTML = `
                    <p>${texts[lang].confirmations.confirmRevoke}</p>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="passphrase" placeholder="${texts[lang].modals.enterPass}">
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="confirmPassphrase" placeholder="${texts[lang].modals.confirmPass}" hidden>
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].actions.cancel}</button>
                    <button type="button" class="btn btn-primary" id="confirmAction" data-bs-dismiss="modal">${texts[lang].actions.revoke}</button>
                `;

                // Confirm certificate revocation
                document.getElementById('confirmAction').onclick = async function() {
                    try {
                        const response = await fetch('/revoke', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ id: certData.id })
                        });
                
                        if (response.ok) {
                            loadCertData();
                            modal.hide();
                        } else {
                            console.error('Revocation failed:', await response.text());
                        }
                    } catch (error) {
                        console.error('Revocation error:', error);
                    }
                };
                break;
            case 'disable':
                modalTitle.textContent = `${texts[lang].titles.disableCert}`;
                formContent.innerHTML = `
                    <p>${texts[lang].confirmations.confirmDisable}</p>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="passphrase" placeholder="${texts[lang].modals.enterPass}">
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="confirmPassphrase" placeholder="${texts[lang].modals.confirmPass}" hidden>
                    </div>
                `;
                footerContent.innerHTML = `
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">${texts[lang].actions.cancel}</button>
                    <button type="button" class="btn btn-primary" id="confirmAction" data-bs-dismiss="modal">${texts[lang].actions.disable}</button>
                `;
                
                // Confirm certificate deactivation
                document.getElementById('confirmAction').onclick = async function() {
                    try {
                        const response = await fetch('/disable', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ id: certData.id })
                        });
                
                        if (response.ok) {
                            loadCertData();
                            modal.hide();
                        } else {
                            console.error('Deactivation failed:', await response.text());
                        }
                    } catch (error) {
                        console.error('Deactivation error:', error);
                    }
                };
                break;
        }
        updateConfirm();

        // Show modal & conditions for interactions
        const now = new Date();
        const startDate = document.getElementById("startDate");
        const endDate = document.getElementById("endDate");
        const addIpButton = document.getElementById('addIpButton');
        const addDnsButton = document.getElementById('addDnsButton');
        const offset = now.getTimezoneOffset() * 60000;
        const modal = new bootstrap.Modal(document.getElementById('dynamicModal'));
        modal.show();

        if (startDate && endDate && addIpButton && addDnsButton) {
            startDate.value = new Date(now.getTime() - offset).toISOString().slice(0, 16);
            endDate.value = new Date(now.setFullYear(now.getFullYear() + 1, now.getMonth(), now.getDate() + 1) - offset).toISOString().slice(0, 16);

            addIpButton.onclick = function() {
                const ipValue = document.getElementById('sanIp').value;
                if (ipValue) {
                    const ipList = document.getElementById('addedSanIP');
                    ipList.innerHTML += `<div class="alert alert-secondary p-2 d-flex justify-content-between align-items-center">
                        ${ipValue}
                        <button class="btn btn-sm btn-close" onclick="this.parentElement.remove();"></button>
                    </div>`;
                    document.getElementById('sanIp').value = '';
                }
            };

            addDnsButton.onclick = function() {
                const dnsValue = document.getElementById('sanDns').value;
                if (dnsValue) {
                    const dnsList = document.getElementById('addedDnsNames');
                    dnsList.innerHTML += `<div class="alert alert-secondary p-2 d-flex justify-content-between align-items-center">
                        ${dnsValue}
                        <button class="btn btn-sm btn-close" onclick="this.parentElement.remove();"></button>
                    </div>`;
                    document.getElementById('sanDns').value = '';
                }
            };
        }
    }

    // Utility function to fetch password from the server
    async function fetchPassword() {
        const response = await fetch('/get-password');
        if (!response.ok) throw new Error('Request failed');
        return (await response.json()).pkiaccess || '';
    }

    // Load password and update interface
    async function loadPassword() {
        const fetchedPassword = await fetchPassword();
        passwordInput.value = fetchedPassword;
        passwordModalTitle.textContent = fetchedPassword ? `${texts[lang].titles.enterPass}` : `${texts[lang].titles.definePass}`;

        if (!fetchedPassword) {
            isLocked = true;
            localStorage.setItem('isLocked', JSON.stringify(isLocked));
            updateInterface();
        }
    }

    // Check if the input password is valid
    async function checkPassword() {
        const tmpPassword = await fetchPassword();
        const passwordSubmit = document.getElementById('passwordSubmit');
        passwordInput.classList.remove('is-invalid', 'is-valid');

        if (!tmpPassword) {
            passwordSubmit.disabled = false;
            passwordSubmit.classList.add('btn-primary');
            passwordSubmit.classList.remove('btn-danger');
            passwordSubmit.classList.remove('btn-success');
            return;
        }

        const isValid = passwordInput.value === tmpPassword;
        passwordInput.classList.toggle('is-valid', isValid);
        passwordInput.classList.toggle('is-invalid', !isValid);
        passwordSubmit.disabled = !isValid;
        passwordSubmit.classList.remove('btn-primary');
        passwordSubmit.classList.toggle('btn-danger', !isValid);
        passwordSubmit.classList.toggle('btn-success', isValid);
    }

    // Handle button clicks and input events
    createBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('create');
    });

    // Filter certificates by name
    certSearchInput.addEventListener('input', function() {
        const searchText = encodeName(this.value).toLowerCase();
        const rows = certTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const match = Array.from(row.querySelectorAll('td')).some(cell => 
                encodeName(cell.textContent).toLowerCase().includes(searchText)
            );
            row.style.display = match ? '' : 'none';
        });
    });

    // Open modal & load password
    lockInterface.addEventListener('click', (e) => {
        e.preventDefault();
        passwordModal.show();
        loadPassword();
        checkPassword();
    });

    // Reload interface on profile switch
    document.getElementById('switchMenu').onclick = loadCertData;

    // Check password while input
    document.getElementById('passwordForm').oninput = checkPassword;

    // Handle password form submission
    document.getElementById('passwordForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = passwordInput.value;

        const tmpPassword = await fetchPassword();
        if (!tmpPassword) {
            // Set new password
            const response = await fetch('/set-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                isLocked = false;
                localStorage.setItem('isLocked', JSON.stringify(isLocked));
                updateInterface();
                passwordModal.hide();
                passwordInput.classList.add('is-valid');
            } else {
                console.error('Error saving password:', response.statusText);
            }
        } else if (password === tmpPassword) {
            isLocked = !isLocked;
            localStorage.setItem('isLocked', JSON.stringify(isLocked));
            updateInterface();
            passwordModal.hide();
            passwordInput.classList.add('is-valid');
        } else {
            passwordInput.classList.add('is-invalid');
            console.error('Password is incorrect');
        }
    });

    // Toggle eye on password modal
    document.getElementById('togglePassword').addEventListener('click', function (event) {
        event.preventDefault();
        const toggleIcon = document.getElementById('togglePasswordIcon');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggleIcon.src = toggleIcon.src.includes('images/eye-solid.svg') ? 'images/eye-slash-solid.svg' : 'images/eye-solid.svg';
    });

    // Sorting columns
    document.querySelectorAll('thead th').forEach(header => {
        header.addEventListener('dblclick', function() {
            const sortKey = this.getAttribute('data-sort');
            const currentOrder = this.classList.contains('asc') ? 'desc' : 'asc';
            this.classList.remove('asc', 'desc');
            this.classList.add(currentOrder);
            sortTable(sortKey, currentOrder);
        });
    });

    updateInterface();
    loadCertData();
    loadPassword();
});
