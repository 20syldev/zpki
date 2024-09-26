const { spawn } = require('child_process');

const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const express = require('express');
const moment = require('moment');
const cors = require('cors');

// Set basic variables
const app = express();
const port = 3000;
const srcDir = path.join(__dirname, 'src');

// Centralized error handling middleware
const handleError = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: err.message });
};

// Setup
app.use(rateLimit({ windowMs: 1 * 60 * 1000, max: 1000, message: { error: 'API Rate Limit Exceeded.' }}));
app.use(cors({ methods: ['GET', 'POST'] }));
app.use('/src', express.static(srcDir));
app.use(express.static(__dirname));
app.use(express.json());
app.use(helmet());

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
const validateName = (name) => {
    const regex = /^[a-zA-Z0-9-_ ]+$/;

    for (const command of ['sudo', 'bash', 'sh', 'exec', 'system', 'kill', 'rm', 'mv', 'cp', 'dd', 'curl', 'wget', 'chmod', 'chown', 'ln']) {
        if (name.toLowerCase().includes(command)) {
            return false;
        }
    }
    return regex.test(name) && name.length > 0 && name.length < 64;
};

// Function to validate count parameter
const validateCount = (count) => {
    return Number.isInteger(count) && count > 0;
};

// Route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to get the list of certificates
app.get('/list', (req, res, next) => {
    try {
        const certData = readCertData();
        res.json(certData);
    } catch (error) {
        next(error);
    }
});

// Route to create certificates
app.get('/create', async (req, res, next) => {
    const certName = req.query.name;
    const count = parseInt(req.query.count);

    // Validate certificate name
    if (!validateName(certName)) {
        return res.status(400).json({ error: `Invalid certificate name (${certName}). Only alphanumeric characters, spaces, hyphens, and underscores are allowed, and the length must be between 1 and 64 characters.` });
    }

    // Validate count
    if (!validateCount(count)) {
        return res.status(400).json({ error: `Invalid count value. It must be a positive integer.` });
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
                    return reject(new Error(`Creation error: ${stderr}`));
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
            }
            res.json({ response: `${count} certificates generated.` });
        } catch (error) {
            next(error);
        }
    };
    processCerts();
});

// Route to revoke certificates
app.post('/revoke', (req, res, next) => {
    const { id } = req.body;
    if (!Array.isArray(id)) {
        return res.status(400).json({ error: 'Invalid list of certificates.' });
    }

    for (const name of id) {
        if (!validateName(name)) {
            return res.status(400).json({ error: `Invalid certificate name (${name}). Only alphanumeric characters, spaces, hyphens, and underscores are allowed, and the length must be between 1 and 64 characters.` });
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
                    return reject(new Error(`Revocation error: ${stderr}`));
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
                    return res.status(404).json({ error: `Certificate with ID ${name} not found.` });
                }
                await revokeCert(name);
            }
            res.json({ response: 'Certificates revoked.' });
        } catch (error) {
            next(error);
        }
    };
    processRevocations();
});

// Route to renew certificates
app.post('/renew', (req, res, next) => {
    const { id } = req.body;
    if (!Array.isArray(id)) {
        return res.status(400).json({ error: 'Invalid list of certificates.' });
    }

    for (const name of id) {
        if (!validateName(name)) {
            return res.status(400).json({ error: `Invalid certificate name (${name}). Only alphanumeric characters, spaces, hyphens, and underscores are allowed, and the length must be between 1 and 64 characters.` });
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
                    return reject(new Error(`Renewal error: ${stderr}`));
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
                    return res.status(404).json({ error: `Certificate with ID ${name} not found.` });
                }
                await renewCert(name);
            }
            res.json({ response: 'Certificates renewed.' });
        } catch (error) {
            next(error);
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

app.use(handleError);
app.listen(port, () => {
    console.log(`Server started: http://localhost:${port}`);
});