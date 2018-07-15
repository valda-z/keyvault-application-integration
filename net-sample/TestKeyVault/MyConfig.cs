using Microsoft.Azure.KeyVault;
using Microsoft.Azure.KeyVault.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Clients.ActiveDirectory;

namespace TestKeyVault
{
    public static class MyConfig
    {
        public static string My_secret { get; set; }

        public static void ReadSecrets()
        {
            KeyVaultClient kv = new KeyVaultClient(new KeyVaultClient.AuthenticationCallback(securityToken));
            SecretBundle sec = kv.GetSecretAsync(Properties.Settings.Default.MySecretUri).Result;
            My_secret = sec.Value;
        }

        private static async Task<string> securityToken(string authority, string resource, string scope)
        {
            var authContext = new AuthenticationContext(authority);
            ClientCredential clientCred = new ClientCredential(Properties.Settings.Default.ClientID,
                        Properties.Settings.Default.ClientSecret);
            AuthenticationResult result = await authContext.AcquireTokenAsync(resource, clientCred);

            if (result == null)
                throw new InvalidOperationException("Failed to obtain the JWT token");

            return result.AccessToken;
        }
    }
}
