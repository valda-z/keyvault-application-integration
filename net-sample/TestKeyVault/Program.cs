using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TestKeyVault
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Reading Key Vault...");

            MyConfig.ReadSecrets();

            Console.WriteLine("Secret value is: " + MyConfig.My_secret);

            Console.ReadKey();
        }
    }
}
