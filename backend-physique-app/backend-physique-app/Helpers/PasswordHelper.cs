using System.Security.Cryptography;

namespace backend_physique_app.Helpers;

public static class PasswordHelper
{
    private const string Upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private const string Lower = "abcdefghijklmnopqrstuvwxyz";
    private const string Digits = "0123456789";
    private const string Special = "!@#$%^&*()-_=+";

    public static string GenerateSecurePassword(int length = 12)
    {
        var allChars = Upper + Lower + Digits + Special;
        var passwordChars = new List<char>();
        var rng = RandomNumberGenerator.Create();

        // Assurer présence minimale
        passwordChars.Add(GetRandomChar(Upper, rng));
        passwordChars.Add(GetRandomChar(Lower, rng));
        passwordChars.Add(GetRandomChar(Digits, rng));
        passwordChars.Add(GetRandomChar(Special, rng));

        // Remplir le reste
        for (int i = passwordChars.Count; i < length; i++)
        {
            passwordChars.Add(GetRandomChar(allChars, rng));
        }

        // Mélanger
        return Shuffle(passwordChars, rng);
    }

    private static char GetRandomChar(string source, RandomNumberGenerator rng)
    {
        var bytes = new byte[4];
        rng.GetBytes(bytes);
        var idx = BitConverter.ToInt32(bytes, 0) % source.Length;
        return source[Math.Abs(idx)];
    }

    private static string Shuffle(List<char> list, RandomNumberGenerator rng)
    {
        var result = list.ToArray();
        for (int i = result.Length - 1; i > 0; i--)
        {
            var bytes = new byte[4];
            rng.GetBytes(bytes);
            var j = Math.Abs(BitConverter.ToInt32(bytes, 0)) % (i + 1);
            (result[i], result[j]) = (result[j], result[i]);
        }
        return new string(result);
    }
}
