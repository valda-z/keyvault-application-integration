/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for
 * license information.
 */
'use strict';

const KeyVault = require('azure-keyvault');
const AuthenticationContext = require('adal-node').AuthenticationContext;

const clientId = process.env['AZURE_CLIENT_ID'];
const secret = process.env['AZURE_CLIENT_SECRET'];
const keyvaultUri = process.env['AZURE_KEYVAULT_URI'];
const secretName = process.env['AZURE_KEYVAULT_SECRET_NAME'];
const secretVersion = process.env['AZURE_KEYVAULT_SECRET_VERSION'];

// Authenticates to the Azure Key Vault by providing a callback to authenticate using ADAL.
function authUsingAdalCallback() {
    console.log("Using ADAL to authenticate to '" + keyvaultUri + "'");

    // Callback for ADAL authentication.
    const adalCallback = (challenge, callback) => {
        const context = new AuthenticationContext(challenge.authorization);
        return context.acquireTokenWithClientCredentials(challenge.resource, clientId, secret, (err, tokenResponse) => {
            if (err) {
                throw err;
            }

            // The KeyVaultCredentials callback expects an error, if any, as the first parameter. 
            // It then expects a value for the HTTP 'Authorization' header, which we compute based upon the access token obtained with the SP client credentials. 
            // The token type will generally equal 'Bearer' - in some user-specific situations, a different type of token may be issued. 
            return callback(null, tokenResponse.tokenType + ' ' + tokenResponse.accessToken);
        });
    };

    const keyVaultClient = new KeyVault.KeyVaultClient(new KeyVault.KeyVaultCredentials(adalCallback));

    keyVaultClient.getSecret(keyvaultUri, secretName, secretVersion)
        .then((bundle) => {
            console.log("Successfully retrieved 'my-secret'");
            console.log(bundle);
        })
        .catch((err) => {
            console.log(err);
        });
}

function runSample(demoCallback) {
    console.log("  .. starting ...");
    demoCallback();
}

// Main entry point.
console.log('Running KeyVault sample.');
runSample(authUsingAdalCallback);