/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for
 * license information.
 */
'use strict';
var request = require('request');

function callKeyVault(keyVaultName, app) {
    // lets acquire bearer token from VM
    request.get({
        url: 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net',
        json: true,
        headers: { 'Metadata': 'true' }
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Error - Status:', res.statusCode);
        } else {
            // lets acquire secret from KeyVault
            request.get({
                url: 'https://' + keyvault + '.vault.azure.net/secrets/my-secret?api-version=2016-10-01',
                json: true,
                headers: { 'Authorization': 'Bearer ' + data.access_token }
            }, (err, res, data) => {
                if (err) {
                    console.log('Error:', err);
                } else if (res.statusCode !== 200) {
                    console.log('Error - Status:', res.statusCode);
                } else {
                    secret = data.value;
                    // call application
                    app();
                }
            });
        }
    });
}

function callMyApp() {
    console.log('Value of secret: ' + secret);
}

var keyvault = '<your keyvault name>';
var secret = '';

// Main entry point.
console.log('Running KeyVault sample.');
callKeyVault(keyvault, callMyApp);