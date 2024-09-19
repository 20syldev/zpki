const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Path to the source directory
const srcDir = path.join(__dirname, 'src');

app.use(express.static(__dirname));
app.use('/src', express.static(srcDir));
app.use(express.json());
app.use(cors());

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Function to find a unique certificate name
const findUniqueCertName = (baseName) => {
    let uniqueName = baseName;
    let index = 1;
    while (fs.existsSync(path.join(srcDir, 'certs', `${uniqueName}.crt`))) {
        uniqueName = `${baseName}${index}`;
        index++;
    }
    return uniqueName;
};

// Route to get the list of certificates
app.get('/list', (req, res) => {
    try {
        res.json(readCertData());
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route to create certificates
app.get('/create', async (req, res) => {
    const certName = req.query.name || 'Dolez Benoît';
    const count = parseInt(req.query.count) || 1;
    let generatedCount = 0;

    const createCert = (uniqueCertName) => {
        return new Promise((resolve, reject) => {
            exec(`cd ${path.join(srcDir)} && ./zpki -y -c none create-crt "${uniqueCertName}"`, (error, stdout, stderr) => {
                resolve(stdout);
            });
        });
    };

    const processCerts = async () => {
        try {
            for (let i = 1; i <= count; i++) {
                const uniqueCertName = findUniqueCertName(certName);
                await createCert(uniqueCertName);
                generatedCount++;
            }
            res.send(`${generatedCount}/${count} certificates generated.`);
        } catch (error) {
            res.status(500).send(error);
        }
    };
    processCerts();
});

// Route to revoke certificates
app.post('/revoke', (req, res) => {
    const { id } = req.body;
    if (!Array.isArray(id)) {
        return res.status(400).send('List of invalid certificates.');
    }

    const revokeCert = (name) => {
        return new Promise((resolve, reject) => {
            exec(`cd ${path.join(srcDir)} && ./zpki -y -c none ca-revoke-crt "${name}"`, (error, stdout, stderr) => {
                if (error) {
                    return reject(`Revocation error: ${stderr}`);
                }
                resolve(stdout);
            });
        });
    };

    const processRevocations = async () => {
        try {
            for (const name of id) {
                await revokeCert(name);
            }
            res.send('Revoked certificates.');
        } catch (error) {
            res.status(500).send(error);
        }
    };

    processRevocations();
});

// Route to renew certificates
app.post('/renew', (req, res) => {
    const { id } = req.body;
    if (!Array.isArray(id)) {
        return res.status(400).send('List of invalid certificates.');
    }

    const renewCert = (name) => {
        return new Promise((resolve, reject) => {
            exec(`cd ${path.join(srcDir)} && ./zpki -y -c none ca-update-crt "${name}"`, (error, stdout, stderr) => {
                if (error) {
                    return reject(`Renewal error: ${stderr}`);
                }
                resolve(stdout);
            });
        });
    };

    const processRenewals = async () => {
        try {
            for (const name of id) {
                await renewCert(name);
            }
            res.send('Renewed certificates.');
        } catch (error) {
            res.status(500).send(error);
        }
    };

    processRenewals();
});

// Function to read and filter certificate data
const readCertData = () => {
    const idxPath = path.join(srcDir, 'ca.idx');
    const idzPath = path.join(srcDir, 'ca.idz');

    if (!fs.existsSync(idxPath) || !fs.existsSync(idzPath)) {
        throw new Error('Missing ca.idx or ca.idz files.');
    }

    const idxData = fs.readFileSync(idxPath, 'utf8');
    const idzData = fs.readFileSync(idzPath, 'utf8');

    const idxLines = idxData.split('\n').filter(line => line.trim() !== '');
    const idzLines = idzData.split('\n').filter(line => line.trim() !== '');

    const certMap = new Map();

    idxLines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
            const status = parts[0];
            if (status == 'R') {
                const expiration = parts[1];
                // const startDate = parts[2];
                const serial = parts[3];
                const subject = parts[5] !== 'unknown' ? parts[5].replace('/CN=', '') : ''; 
                certMap.set(serial, { 
                    status,
                    expiration,
                    id: subject
                });
            } else {
                const expiration = parts[1];
                const serial = parts[2];
                const subject = parts[4] !== 'unknown' ? parts[4].replace('/CN=', '') : ''; 
                certMap.set(serial, { 
                    status,
                    expiration,
                    id: subject
                });
            }
        }
    });

    idzLines.forEach(line => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 6) {
            const serial = parts[0];
            if (certMap.has(serial)) {
                const cert = certMap.get(serial);
                cert.serial = serial;
                cert.signature = parts[1];
                cert.startDate = parts[2];
                cert.endDate = parts[3];
                cert.id = parts[4] !== 'unknown' ? parts[4].replace('/CN=', '') : cert.id;
                certMap.set(serial, cert);
            }
        }
    });

    // Filter certificates with undefined or empty fields
    return Array.from(certMap.values()).filter(cert => 
        cert.id && cert.id !== 'undefined' &&
        cert.status && cert.expiration && cert.serial &&
        cert.startDate && cert.endDate
    );
};

app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});
