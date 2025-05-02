using System;
using System.Text;

namespace Component.Search.Infrastructure.Fake.Helpers;

public static class RandomUKPostCodeGenerator
{
    private static Random random = new Random(1337);
    
    public static string GenerateRandomPostcode()
    {
        string[] outwardFormats = { "A9", "A9A", "A99", "AA9", "AA9A", "AA99" }; 
        string outward = GenerateOutwardCode(outwardFormats[random.Next(outwardFormats.Length)]);
        string inward = GenerateInwardCode();

        return $"{outward} {inward}";
    }

    static string GenerateOutwardCode(string format)
    {
        StringBuilder postcode = new StringBuilder();

        foreach (char c in format)
        {
            if (c == 'A')
                postcode.Append(RandomLetter());
            else if (c == '9')
                postcode.Append(RandomDigit());
        }

        return postcode.ToString();
    }

    static string GenerateInwardCode()
    {
        return $"{RandomDigit()}{RandomLetter()}{RandomLetter()}";
    }

    static char RandomLetter()
    {
        string letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        return letters[random.Next(letters.Length)];
    }

    static char RandomDigit()
    {
        return (char)('0' + random.Next(10));
    }
}
