using Bogus;
using Newtonsoft.Json;
using Component.Search.Model;
using Component.Search.Infrastructure.Fake.Helpers;

namespace Component.Search.Infrastructure.Fake;

public class FakeData
{
    private static readonly Lazy<FakeData> instance = new Lazy<FakeData>(() => new FakeData());

    public static FakeData Instance => instance.Value;

    private static Dictionary<string, Dictionary<string, Dictionary<string, string>>> Details = new Dictionary<string, Dictionary<string, Dictionary<string, string>>>();    

    private FakeData()
    {
        // Private constructor to prevent instantiation
    }

    public Dictionary<string, string> GetDetail(string searchType, string id)
    {
        return Details[searchType].ContainsKey(id) ?Details[searchType][id] : null;
    }

    public List<Dictionary<string, string>> GetDetails(string searchType)
    {
        if (!Details.ContainsKey(searchType))
        {
            Details[searchType] = GenerateFakeData(searchType);
        }

        return Details[searchType].Values.ToList();
    }

    private static Dictionary<string, Dictionary<string, string>> GenerateFakeData(string searchType) 
    {
        var json = File.ReadAllText($"{searchType}DetailType.json");
        var detailTest = JsonConvert.DeserializeObject<DetailTypeModel>(json);

        var faker = new Faker();
        faker.Random = new Randomizer(1337);

        var newDetails = new Dictionary<string, Dictionary<string, string>>();

        for (int i = 0; i < 100; i++)
        {
            var innerDetails = new Dictionary<string, string>();
            var id = faker.Random.Guid();
            innerDetails["id"] = id.ToString();

            foreach (var section in detailTest.DetailsPage.Sections)
            {
                foreach (var component in section.Components)
                {
                    if (component.Fields == null)
                    {
                        continue;
                    }
                    
                    foreach (var field in component.Fields)
                    {
                        innerDetails[field.Name] = GenerateFieldValue(field.Name, field.Type, field.Label, faker);
                    }
                }
            }

            newDetails.Add(id.ToString(), innerDetails);
        }

        return newDetails;
    }

    private static string GenerateFieldValue(string fieldName, string fieldType, string fieldLabel, Faker faker)
    {
        return fieldType switch
        {
            "text" => GenerateTextFieldValue(fieldName, fieldLabel, faker),
            "email" => faker.Internet.Email(),
            "date" => faker.Date.Past(30, DateTime.Now.AddYears(-18)).ToString("yyyy-MM-dd"),
            _ => faker.Lorem.Word()
        };
    }

    private static string GenerateTextFieldValue(string fieldName, string fieldLabel, Faker faker)
    {
        var surnames = new string[] { "Smith", "Jones", "Taylor", "Brown", "Williams" };
        if (fieldName.Equals("name", StringComparison.OrdinalIgnoreCase))
        {
            return $"{faker.Name.FirstName()} {faker.PickRandom(surnames)}";
        }
        if (fieldName.Equals("firstName", StringComparison.OrdinalIgnoreCase))
        {
            return faker.Name.FirstName();
        }
        if (fieldName.Equals("lastName", StringComparison.OrdinalIgnoreCase))
        {
            return faker.PickRandom(surnames);
        }
        if (fieldLabel.Equals("City", StringComparison.OrdinalIgnoreCase))
        {
            var cities = new[] { "London", "Edinburgh", "Paris", "Milan", "Novi Sad" };
            return faker.PickRandom(cities);
        }
        if (fieldLabel.Equals("Postcode", StringComparison.OrdinalIgnoreCase))
        {
            return RandomUKPostCodeGenerator.GenerateRandomPostcode();
        }
        return faker.Lorem.Word();
    }   
}