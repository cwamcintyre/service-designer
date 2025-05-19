import { Form } from '@model/formTypes';

const service = {
   getForm: async (formId: string): Promise<Form> => {
       const response = await fetch(`${process.env.FORM_API}/getForm/${formId}`);
       const json = await response.json();
       return json.form;
   },
   getFormData: async (applicationId: string): Promise<{ [key: string]: any }> => {
       const response = await fetch(`${process.env.FORM_API}/getData/${applicationId}`);
       const json = await response.json();
       return json.formData;
   },
   getDataForPage: async (formId: string, pageId: string, applicationId: string, extraData: string): Promise<GetDataForPageResponse> => {
       const response = await fetch(`${process.env.FORM_API}/getDataForPage/${formId}/${pageId}/${applicationId}/${extraData}`);
       const json = await response.json();
       return json;
   },
   processPage: async (formId: string, pageId: string, applicationId: string, formData: { [key: string]: any }) => {
       const postData = {
           "formId": formId,
           "pageId": pageId,
           "applicantId": applicationId,
           "form": formData
       };

       const response = await fetch(`${process.env.FORM_API}/processForm`, {
           method: 'POST',
           body: JSON.stringify(postData),
           headers: {
               'Content-Type': 'application/json',
           }
       });
       const json = await response.json();
       return json;
   }
};

export type GetDataForPageResponse = {
    formData: Record<string, any>;
    errors: Record<string, string[]>;
    previousPage: string;
    previousExtraData: string;
    forceRedirect: boolean;
}

export default service;