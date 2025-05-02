using Component.Form.Application.Helpers;
using Component.Form.Application.Shared.Infrastructure;
using Component.Form.Model;
using Microsoft.Extensions.Configuration;
using System.Diagnostics.CodeAnalysis;

namespace Component.Form.Infrastructure.Fake
{
    [ExcludeFromCodeCoverage]
    public class FakeFormStore : IFormStore
    {
        private readonly Dictionary<string, FormModel> _formStore;
        private readonly SafeJsonHelper _safeJsonHelper;
        private readonly string _formStorePath;

        public FakeFormStore(SafeJsonHelper safeJsonHelper, IConfiguration configuration)
        {
            _safeJsonHelper = safeJsonHelper;
            _formStorePath = configuration["FakeFormDirectory"];
            
            if (_formStore == null) 
            {
                _formStore = new Dictionary<string, FormModel>();
                LoadForms();               
            }
        }

        private void LoadForms()
        {        
            var formFiles = Directory.GetFiles(_formStorePath, "*.json");
            foreach (var file in formFiles)
            {
                var json = File.ReadAllText(file);
                var formModel = _safeJsonHelper.SafeDeserializeObject<FormModel>(json);
                if (formModel != null && formModel.FormId != null)
                {
                    var formId = Path.GetFileNameWithoutExtension(file);
                    _formStore[formId] = formModel;
                }
            }
        }

        public async Task<FormModel> GetFormAsync(string formId)
        {
            if (_formStore.TryGetValue(formId, out var formModel))
            {
                return formModel;
            }
            return null;
        }

        public async Task<IEnumerable<FormModel>> GetAllFormsAsync()
        {
            return _formStore.Values;
        }

        public async Task UpdateFormAsync(string formId, FormModel formModel)
        {
            _formStore[formId] = formModel;
        }

         public async Task CreateFormAsync(string formId, FormModel formModel)
        {
            if (!_formStore.ContainsKey(formId))
            {
                _formStore[formId] = formModel;
            }
        }

        public async Task DeleteFormAsync(string formId)
        {
            if (_formStore.ContainsKey(formId))
            {
                _formStore.Remove(formId);
            }
        }
    }
}
