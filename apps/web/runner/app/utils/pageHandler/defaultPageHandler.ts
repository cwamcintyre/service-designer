import { LogHandler } from '@/app/utils/logging/logHandler';
import { PageHandler } from '@/app/utils/pageHandler/interfaces';
import { ComponentHandlerFactory } from '@/app/utils/componentHandler/componentHandlerFactory';
import { Page } from '@model/formTypes';
import { type GetDataForPageResponse } from '@/services/formServices';

export class DefaultPageHandler implements PageHandler {
    HandlePage(page: Page, pageResponseData: GetDataForPageResponse): void {
        const pageData = pageResponseData.formData;
        const pageErrors = pageResponseData.errors;

        LogHandler.debug("Page Data: ", pageData);
        LogHandler.debug("Page Errors: ", pageErrors);

        for (const component of page.components) {
            if (component.name) {
                const handler = component.type ? ComponentHandlerFactory.For(component.type) : undefined;
                LogHandler.debug("Component Type: ", component.type);
                if (handler) {
                    component.answer = handler.GetFromSavedData(component.name, pageData);
                    component.errors = pageErrors[component.name] ? pageErrors[component.name] : [];
                    LogHandler.debug("Component Handler Data: ", component.answer);
                    LogHandler.debug("Component Handler Errors: ", component.errors);
                }
            }
        }
    }

    GetSubmittedData(page: Page, data: FormData): any {
        const pageData: { [key: string]: any } = {};

        for (const component of page.components) {
            
            if (component.name) {
                const handler = component.type ? ComponentHandlerFactory.For(component.type) : undefined;
                LogHandler.debug("Component Type: ", component.type);
                if (handler) {
                    const componentData = handler.GetFromFormData(component.name, data);
                    LogHandler.debug("Component Handler Data: ", componentData);
                    pageData[component.name] = componentData;
                }
            }
        }

        return pageData;
    }
}