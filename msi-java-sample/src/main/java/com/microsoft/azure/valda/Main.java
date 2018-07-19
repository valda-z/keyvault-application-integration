package com.microsoft.azure.valda;

import com.mashape.unirest.http.HttpResponse;
import com.mashape.unirest.http.JsonNode;
import com.mashape.unirest.http.Unirest;
import org.json.JSONObject;

public class Main{

    private static String getBearerToken(){
        String ret = "";
        try {
            // REST client for GeoIP service
            HttpResponse<JsonNode> jrequest = Unirest.get("http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fvault.azure.net")
                .header("Metadata", "true")
                .asJson();
            // retrieve the parsed JSONObject from the response
            JSONObject myObj = jrequest.getBody().getObject();

            // extract fields from the object
            ret = myObj.getString("access_token");

        } catch (Exception e) {
            e.printStackTrace();
        }
        return ret;
    }

    private static String getSecret(String keyvault, String secret){
        String ret = "";
        try {
            // REST client for GeoIP service
            HttpResponse<JsonNode> jrequest = Unirest.get(
                "https://"+keyvault+".vault.azure.net/secrets/"+secret+"?api-version=2016-10-01")
                .header("Authorization", "Bearer "+getBearerToken())
                .asJson();
            // retrieve the parsed JSONObject from the response
            JSONObject myObj = jrequest.getBody().getObject();

            // extract fields from the object
            ret = myObj.getString("value");
            
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ret;
    }

    public static void main(String [] args){
        System.out.println("Start KeyVault TEST...");

        String MyKeyVault="<your keyvault name>";

        System.out.println("MySecret: " + 
            getSecret(MyKeyVault, "my-secret") );
    }
}
