using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Model;

namespace Component.Form.Infrastructure.Fake
{
    [ExcludeFromCodeCoverage]
    public class FakeFormDataStore : IFormDataStore
    {
        private static Dictionary<string, string> _formData = new Dictionary<string, string>();
        
        public async Task<FormData> GetFormDataAsync(string applicantId)
        {
            if (!_formData.ContainsKey(applicantId))
            {
                return new FormData()
                {
                    Data = ""
                };
            }

            return new FormData() 
            {
                Data = _formData[applicantId]
            };
        }

        public async Task SaveFormDataAsync(string formId, string applicantId, string formData)
        {
            _formData[applicantId] = formData;
        }
    }
}
