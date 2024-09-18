# ZPKI

### Overview
ZPKI is a command-line utility for managing a Public Key Infrastructure (PKI). It provides commands for creating and managing certificates, keys, and Certificate Authorities (CAs) using OpenSSL.

### Usage
```
zpki 1.0 - Benoit DOLEZ <bdolez@zenetys.com> - MIT License
Usage: zpki [options] ACTION [ACTION-PARAMETERS]

Options:
 -h, --help           Show this help message
 -V, --version        Display the version information
 --x-debug            Enable bash debug mode
 -v, --verbose        Set verbose level (can be repeated for higher verbosity)
 -q, --quiet          Set verbose level to 0 (minimal output)
 -C, --ca             Specify the CA base directory
 -y, --yes            Automatically accept all prompts
 -c, --cipher         Define the cipher (use 'none' for no encryption)

Actions:
 create-cnf
     Generate a default OpenSSL configuration file
 create-key [CN|SUBJ]
     Create a key file
 create-csr CN|SUBJ [ALTNAMES...]
     Generate a certificate signing request (CSR)
 create-self CN|SUBJ [ALTNAMES...]
     Create a self-signed certificate
 create-ca CN|SUBJ
     Create a Certificate Authority (CA) and its storage
 create-crt {CN|SUBJ} [ALTNAMES...]
     Create a certificate
 ca-list
     List certificates stored in the CA
 ca-sign-csr CN|SUBJ|CSRFILE
     Sign a CSR file using the CA
 ca-update-crt CN|SUBJ|CRTFILE
     Update a certificate
 ca-revoke-crt CN|SUBJ|CRTFILE
     Revoke a certificate

For Subject Alternative Names (SANs), use the format: DNS:<FQDN>, IP:ADDR
```


### Example

#### Setting Up a CA
```
$ mkdir /tmp/test-pki
$ cd /tmp/test-pki
$ zpki -y -c none create-ca "TEST CA"
: openssl genrsa -out ca.key 4096
: openssl req -batch -new -x509 -days 366 -out ca.crt -key ca.key -subj '/CN=TEST CA' -config ca.cnf -extensions ca_ext
```

#### Creating Certificates
```
$ zpki -y -c none create-crt "Server1"
: openssl genrsa -out private/Server1.key 4096
: openssl req -batch -new -out certs/Server1.csr -key private/Server1.key -subj /CN=Server1
: openssl ca -config ca.cnf -batch -in certs/Server1.csr -out certs/Server1.crt -days 366 -extensions x509v3_ext

$ zpki -y -c none create-crt "Server2"
: openssl genrsa -out private/Server2.key 4096
: openssl req -batch -new -out certs/Server2.csr -key private/Server2.key -subj /CN=Server2
: openssl ca -config ca.cnf -batch -in certs/Server2.csr -out certs/Server2.crt -days 366 -extensions x509v3_ext
```

#### Revoking a Certificate
```
$ zpki -y -c none ca-revoke-crt "Server1" certs/Server1.crt
: openssl ca -config ca.cnf -batch -revoke certs/Server1.crt
```

#### Renewing a Certificate

1. Create a new CSR for the certificate:
```
$ zpki -y -c none create-csr "Server1"
: openssl req -batch -new -key private/Server1.key -out certs/Server1.csr -subj /CN=Server1
```

2. Sign the new CSR using the CA:
```
$ zpki -y -c none ca-sign-csr "Server1" certs/Server1.csr
: openssl ca -config ca.cnf -batch -in certs/Server1.csr -out certs/Server1_new.crt -days 366 -extensions x509v3_ext
```

3. Update the certificate:
```
$ zpki -y -c none ca-update-crt "Server1" certs/Server1_new.crt
: openssl ca -config ca.cnf -batch -in certs/Server1_new.crt -out certs/Server1.crt
```

#### Listing Certificates
```
$ zpki ca-list
[
  {"status":"V","expiration":"2022-02-06T21:06:56+0200","serial":"A638E2BB7E8C","subject":"/CN=Server1"},
  {"status":"V","expiration":"2022-02-06T21:20:08+0200","serial":"A638E2BB7E8E","subject":"/CN=Server2"}
]
```

