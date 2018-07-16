package com.microsoft.azure.valda;

import com.microsoft.azure.keyvault.KeyVaultClient;
import com.microsoft.azure.keyvault.models.SecretBundle;;

public class Main{
    public static void main(String [] args){
        System.out.println("Start KeyVault TEST...");

        String SP_ClientID="####################################";
        String SP_Password="####################################";
        String MyKeyVault="https://<your keyvault name>.vault.azure.net";

        // ClientSecretKeyVaultCredential is the implementation of KeyVaultCredentials
        KeyVaultClient client = new KeyVaultClient(
                new ClientSecretKeyVaultCredential(SP_ClientID, SP_Password));

        SecretBundle secret = client.getSecret( MyKeyVault, "my-secret" );
        System.out.println("MySecret: " + secret.value() );
    }
}
