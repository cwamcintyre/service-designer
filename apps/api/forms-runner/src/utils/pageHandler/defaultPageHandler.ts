import { PageHandler } from '@/utils/pageHandler/interfaces';
import { ComponentHandlerFactory } from '@/utils/componentHandler/componentHandlerFactory';
import { meetsCondition } from '@/utils/expressionUtils';
import { getAllDataFromApplication } from '@/utils/applicationUtils';
import { Application } from '@model/formTypes';

export class DefaultPageHandler implements PageHandler {

    async Process(application: Application, pageId: string, data: { [key: string]: any; }): Promise<boolean> {
        const page = application.pages.find(p => p.pageId === pageId);
        if (!page) {
            throw new Error(`Page with ID ${pageId} not found.`);
        }

        let hasErrors = false;

        for (const component of page.components) {
        
            if (!component.type) {
                throw new Error(`Component type is undefined for component ID ${component.questionId}.`);
            }
        
            if (component.type === 'html') {
                // Skip HTML components
                continue;
            }

            const componentHandler = ComponentHandlerFactory.For(component.type);
            if (!componentHandler) {
                throw new Error(`No handler found for component type ${component.type}.`);
            }

            // update the component answer..
            if (component.name) {
                const convertedAnswer = componentHandler.Convert(component, data);
                console.log(`Converted answer for component ${component.name}:`, convertedAnswer);
                component.answer = convertedAnswer;
            } else {
                throw new Error(`Component name is undefined for component ID ${component.questionId}.`);
            }

            const validationResult = await componentHandler.Validate(component, getAllDataFromApplication(application));
            if (validationResult.length > 0) {
                hasErrors = true;
                component.errors = validationResult;
            }
            else {
                // ensure that errors are cleared if there are no validation errors
                component.errors = [];
            }
        }

        return hasErrors;
    }

    async GetNextPageId(application: Application, pageId: string): Promise<{ nextPageId: string | undefined, nextPageType: string | undefined, extraData: string | undefined }> {
        const page = application.pages.find(p => p.pageId === pageId);
        if (!page) {
            throw new Error(`Page with ID ${pageId} not found.`);
        }

        const { metCondition, nextPageId } = await meetsCondition(page, getAllDataFromApplication(application));
        if (metCondition) {
            const nextPage = application.pages.find(p => p.pageId === nextPageId);
            return { nextPageId, nextPageType: nextPage?.pageType, extraData: undefined };
        }

        const nextPage = application.pages.find(p => p.pageId === page.nextPageId);
        return { nextPageId: page.nextPageId, nextPageType: nextPage?.pageType, extraData: undefined };
    }

    async WalkToNextInvalidOrUnfilledPage(application: Application, currentPageId: string, extraData: string,): Promise<{ pageId: string, pageType: string, stop: boolean }> {

        const page = application.pages.find(p => p.pageId === currentPageId);
        if (!page) {
            throw new Error(`Page with ID ${currentPageId} not found.`);
        }

        for (const component of page.components) {
        
            if (!component.type) {
                throw new Error(`Component type is undefined for component ID ${component.questionId}.`);
            }
        
            if (component.type === 'html') {
                // Skip HTML components
                continue;
            }

            // check whether the answer is empty. If so, we need to stop here.
            if (component.answer === undefined || component.answer === null || component.answer === "") {
                return { pageId: currentPageId, pageType: page.pageType || "", stop: true };
            }
            
            const componentHandler = ComponentHandlerFactory.For(component.type);
            if (!componentHandler) {
                throw new Error(`No handler found for component type ${component.type}.`);
            }

            const validationResult = await componentHandler.Validate(component, getAllDataFromApplication(application));
            if (validationResult.length > 0) {
                return { pageId: currentPageId, pageType: page.pageType || "", stop: true };
            }
        }

        const nextPageResult = await this.GetNextPageId(application, currentPageId);
        return { pageId: nextPageResult.nextPageId || "", pageType: nextPageResult.nextPageType || "", stop: false };
    }
}