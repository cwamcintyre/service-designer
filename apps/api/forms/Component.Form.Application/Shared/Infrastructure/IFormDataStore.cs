using System;
using Component.Form.Model;

namespace Component.Form.Application.Shared.Infrastructure;

public interface IFormDataStore
{
    Task<FormData> GetFormDataAsync(string applicantId);
    Task SaveFormDataAsync(
        string formId, 
        string applicantId, 
        string formData);
}
