const { spawn } = require('child_process');

const fs = require('fs');
const path = require('path');

// Need installation via npm
const express = require('express');
const cors = require('cors');
const moment = require('moment');

// Set basic variables
const app = express();
const port = 3000;
const srcDir = path.join(__dirname, 'src');

// Setup express & cors
app.use(express.static(__dirname));
app.use('/src', express.static(srcDir));
app.use(express.json());
app.use(cors());

// Function to find a unique certificate name
const findUniqueCertName = (baseName) => {
    let uniqueName = baseName;
    let index = 1;
    while (fs.existsSync(path.join(__dirname, 'src', 'certs', `${uniqueName}.crt`))) {
        uniqueName = `${baseName}${index}`;
        index++;
    }
    return uniqueName;
};

// Function to validate certificate name
const validateCertName = (name) => {
    const regex = /^[a-zA-Z0-9-_]+$/;
    return regex.test(name);
};

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to get the list of certificates
app.get('/list', (req, res) => {
    try {
        const certData = readCertData();
        res.json(certData);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route to create certificates
app.get('/create', async (req, res) => {
    const certName = req.query.name;
    const count = parseInt(req.query.count) || 1;
    let generatedCount = 0;

    // Validate certificate name
    if (!validateCertName(certName)) {
        return res.status(400).json({ error: 'Invalid certificate name. Only alphanumeric characters, hyphens, and underscores are allowed.' }, null, 2);
    }

    const createCert = (uniqueCertName) => {
        return new Promise((resolve, reject) => {
            const process = spawn('./zpki', ['-y', '-c', 'none', 'create-crt', uniqueCertName], { cwd: srcDir });

            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    return reject(`Creation error: ${stderr}`);
                }
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
            res.json({ response: `${generatedCount}/${count} certificates generated.` }, null, 2); // Pretty print here
        } catch (error) {
            res.status(500).json({ error: error.message }, null, 2);
        }
    };
    processCerts();
});

// Route to revoke certificates
app.post('/revoke', (req, res) => {
    const { id } = req.body;
    if (!Array.isArray(id)) {
        return res.status(400).json({ error: 'Invalid list of certificates.' }, null, 2);
    }

    for (const name of id) {
        if (!validateCertName(name)) {
            return res.status(400).json({ error: `Invalid certificate name: ${name}. Only alphanumeric characters, hyphens, and underscores are allowed.` }, null, 2);
        }
    }

    const revokeCert = (name) => {
        return new Promise((resolve, reject) => {
            const process = spawn('./zpki', ['-y', '-c', 'none', 'ca-revoke-crt', name], { cwd: srcDir });

            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    return reject(`Revocation error: ${stderr}`);
                }
                resolve(stdout);
            });
        });
    };

    const processRevocations = async () => {
        const certData = readCertData();
        const certMap = new Map(certData.map(cert => [cert.id, cert]));

        try {
            for (const name of id) {
                if (!certMap.has(name)) {
                    return res.status(404).json({ error: `Certificate with ID ${name} not found.` }, null, 2);
                }
                await revokeCert(name);
            }
            res.json({ response: 'Certificates revoked.' }, null, 2);
        } catch (error) {
            res.status(500).json({ error: error.message }, null, 2);
        }
    };
    processRevocations();
});

// Route to renew certificates
app.post('/renew', (req, res) => {
    const { id } = req.body;
    if (!Array.isArray(id)) {
        return res.status(400).json({ error: 'Invalid list of certificates.' }, null, 2);
    }

    for (const name of id) {
        if (!validateCertName(name)) {
            return res.status(400).json({ error: `Invalid certificate name: ${name}. Only alphanumeric characters, hyphens, and underscores are allowed.` }, null, 2);
        }
    }

    const renewCert = (name) => {
        return new Promise((resolve, reject) => {
            const process = spawn('./zpki', ['-y', '-c', 'none', 'ca-update-crt', name], { cwd: srcDir });

            let stdout = '';
            let stderr = '';

            process.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            process.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    return reject(`Renewal error: ${stderr}`);
                }
                resolve(stdout);
            });
        });
    };

    const processRenewals = async () => {
        const certData = readCertData();
        const certMap = new Map(certData.map(cert => [cert.id, cert]));

        try {
            for (const name of id) {
                if (!certMap.has(name)) {
                    return res.status(404).json({ error: `Certificate with ID ${name} not found.` }, null, 2);
                }
                await renewCert(name);
            }
            res.json({ response: 'Certificates renewed.' }, null, 2);
        } catch (error) {
            res.status(500).json({ error: error.message }, null, 2);
        }
    };
    processRenewals();
});

// Function to read and filter certificate data
const readCertData = () => {
    const idxPath = path.join(__dirname, 'src', 'ca.idx');
    const idzPath = path.join(__dirname, 'src', 'ca.idz');

    if (!fs.existsSync(idxPath) || !fs.existsSync(idzPath)) {
        throw new Error('Missing ca.idx or ca.idz files.');
    }

    const idxData = fs.readFileSync(idxPath, 'utf8');
    const idzData = fs.readFileSync(idzPath, 'utf8');

    const idxLines = idxData.split('\n').filter(line => line.trim() !== '');
    const idzLines = idzData.split('\n').filter(line => line.trim() !== '');

    const certMap = new Map();

    const parseCN = (str) => {
        const match = str.match(/\/CN=([\s\S]*?)(?:\/|$)/);
        return match ? match[1].trim() : '';
    };

    idxLines.forEach(line => {
        const parts = line.trim().split('\t');
        if (parts.length >= 5) {
            const status = parts[0];
            const expiration = parts[1];
            const serial = parts[3];
            const subject = parts[4] !== 'unknown' ? parseCN(parts[4]) : '';
            certMap.set(serial, { 
                status,
                expiration,
                id: subject
            });
        }
    });

    idzLines.forEach(line => {
        const parts = line.trim().split('\t');
        if (parts.length >= 6) {
            const serial = parts[0];
            if (certMap.has(serial)) {
                const cert = certMap.get(serial);
                cert.serial = serial;
                cert.signature = parts[1];
                cert.startDate = parts[2];
                cert.endDate = parts[3];
                cert.id = parts[4] !== 'unknown' ? parseCN(parts[4]) : cert.id;
                certMap.set(serial, cert);
            }
        }
    });

    // Update status if expiration date is in the past
    const now = moment();
    const certificateData = Array.from(certMap.values()).map(cert => {
        if (moment(cert.endDate).isBefore(now)) {
            cert.status = cert.status === 'R' ? 'R' : 'I';
        }
        return cert;
    }).filter(cert => 
        cert.id && cert.id !== 'undefined' &&
        cert.status && cert.expiration && cert.serial &&
        cert.startDate && cert.endDate
    );

    return certificateData;
};

// Localhost
app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});
