import { type Form } from '@model/formTypes';
import { PageHandlerFactory } from '@/app/utils/pageHandler/pageHandlerFactory';
import { GetDataForPageResponse } from '@/services/formServices';

export function addDataToForm(form: Form, data: { [key: string]: any }) {
    // Loop through each page in the form
    for (const page of form.pages) {
        
        if (!page.pageType) {
            throw new Error('Page type is undefined');
        }
        
        if (page.pageType !== 'summary' && page.pageType !== 'stop') {
            const pageHandler = PageHandlerFactory.For(page.pageType);
            if (!pageHandler) {
                throw new Error('Page handler not found');
            }

            const dataForPageResponse: GetDataForPageResponse = {
                formData: data,
                errors: {},
                previousPage: "",
                previousExtraData: "",
                forceRedirect: false
            };

            pageHandler.HandlePage(page, dataForPageResponse);
        }
    }
}