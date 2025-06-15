import { DefaultPageHandler } from '@/utils/pageHandler/defaultPageHandler';
import { ComponentHandlerFactory } from '@/utils/componentHandler/componentHandlerFactory';
import { getAllDataFromApplication } from '@/utils/applicationUtils';
import { AddAnotherPage, Application } from '@model/formTypes';

export class MoJAddAnotherHandler extends DefaultPageHandler {

    async Process(application: Application, pageId: string, data: { [key: string]: any }, skipValidation?: boolean ): Promise<boolean> {
        const page: AddAnotherPage | undefined = application.pages.find((p): p is AddAnotherPage => p.pageId === pageId && 'numberOfItems' in p);
        if (!page) {
            throw new Error(`Page with ID ${pageId} not found.`);
        }

        const baseNames = new Set<string>();
        Object.keys(data).forEach(key => {
            const firstDashIndex = key.indexOf('-');
            if (firstDashIndex > 0) {
                const baseName = key.substring(firstDashIndex + 1, key.length);
                baseNames.add(baseName);
            }
        });

        let hasErrors = false;
        const dataItems: { [key: string]: any; }[] = [];
        for (let i = 1; i <= page.numberOfItems; i++) {
            const individualData: { [key: string]: any; } = {};
            for (const component of page.components) {
                if (!component.name) {
                    throw new Error(`Component name is undefined for component ID ${component.questionId}.`);
                }

                for (const baseName of baseNames) {
                    if (baseName.includes(component.name)) {
                        const dataKey = `${i}-${baseName}`;
                        if (data[dataKey] !== undefined) {
                            individualData[baseName] = data[dataKey];
                        } 
                    }
                }
            }

            dataItems.push(individualData);
        }

        console.log(dataItems);

        const pageErrors: { [key: string]: string[] } = {};
        const pageData: { [key: string]: any; }[] = [];
        // set them now, we will be mutating them in the loop below (so that getAllDataFromApplication can use them for validation)
        page.pageErrors = pageErrors;
        page.pageAnswer = pageData;
        for (let i = 0; i < dataItems.length; i++) {
            const dataItem = dataItems[i];
            const pageItemAnswer: { [key: string]: any; } = {};
            pageData.push(pageItemAnswer);
            const normalisedIteration = i + 1; // normalise the iteration to start from 1

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

                // store the answer in the component for validation purposes, and also in the pageItemAnswer object so that
                // it can be included in the page answer, which can also be used for validation purposes, as well as display.
                // no need to throw an error here because that has already been checked above.
                if (component.name) {
                    const convertedAnswer = componentHandler.Convert(component, dataItem);
                    component.answer = convertedAnswer;    
                    pageItemAnswer[component.name] = convertedAnswer;            
                } 

                if (!skipValidation) {
                    const validationResult = await componentHandler.Validate(component, getAllDataFromApplication(application));
                    if (validationResult.length > 0) {
                        hasErrors = true;
                        if (!pageErrors[`${normalisedIteration}-${component.name}`]) {
                            pageErrors[`${normalisedIteration}-${component.name}`] = [];
                        }
                        pageErrors[`${normalisedIteration}-${component.name}`] = validationResult;
                    }
                }
            }
        }

        // clear out the component answers because we don't want them to end up in the application output later down the line..
        for (const component of page.components) {
            delete component.answer;
            delete component.errors;
        }

        return hasErrors;
    }

    async WalkToNextInvalidOrUnfilledPage(application: Application, currentPageId: string, extraData: string,): Promise<{ pageId: string, pageType: string, stop: boolean }> {

        const page: AddAnotherPage | undefined = application.pages.find((p): p is AddAnotherPage => p.pageId === currentPageId && 'numberOfItems' in p);
        if (!page) {
            throw new Error(`Page with ID ${currentPageId} not found.`);
        }

        const pageErrors: { [key: string]: string[] } = {};
        page.pageErrors = pageErrors;
        let hasErrors = false;

        for (let i = 0; i <= page.numberOfItems; i++) {

            const normalisedIteration = i + 1; // normalise the iteration to start from 1

            for (const component of page.components) {
            
                if (!component.type) {
                    throw new Error(`Component type is undefined for component ID ${component.questionId}.`);
                }
            
                if (component.type === 'html') {
                    // Skip HTML components
                    continue;
                }

                if (page.pageAnswer && page.pageAnswer[i] && component.name) {
                    component.answer = page.pageAnswer[i][component.name] || null;
                }

                // check whether the answer is empty. If so, we need to stop here.
                // note we're not checking for whether the component is optional - that should be handled by the user, and this is possibly
                // the first time they have seen this page.
                if (component.answer === undefined || component.answer === null || component.answer === "") {
                    return { pageId: currentPageId, pageType: page.pageType || "", stop: true };
                }
                
                const componentHandler = ComponentHandlerFactory.For(component.type);
                if (!componentHandler) {
                    throw new Error(`No handler found for component type ${component.type}.`);
                }

                const validationResult = await componentHandler.Validate(component, getAllDataFromApplication(application));
                if (validationResult.length > 0) {
                    hasErrors = true;
                    if (!pageErrors[`${normalisedIteration}-${component.name}`]) {
                        pageErrors[`${normalisedIteration}-${component.name}`] = [];
                    }
                    pageErrors[`${normalisedIteration}-${component.name}`] = validationResult;
                }
            }
        }
        
        // clear out the component answers because we don't want them to end up in the application output later down the line..
        for (const component of page.components) {
            delete component.answer;
            delete component.errors;
        }

        page.pageErrors = pageErrors;

        if (hasErrors) {
            return { pageId: currentPageId, pageType: page.pageType || "", stop: true };
        }

        const nextPageResult = await this.GetNextPageId(application, currentPageId);
        return { pageId: nextPageResult.nextPageId || "", pageType: nextPageResult.nextPageType || "", stop: false };
    }
}