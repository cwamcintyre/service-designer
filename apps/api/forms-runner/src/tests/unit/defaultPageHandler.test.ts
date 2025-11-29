// this tests for error handling. functionality is mainly covered by the usecase tests.
import { PageHandlerFactory } from '@/utils/pageHandler/pageHandlerFactory';
import { PageHandler } from '@/utils/pageHandler/interfaces';
import { PageTypes } from '@model/formTypes';

describe('DefaultPageHandler', () => {
    let defaultPageHandler: PageHandler;
    
    beforeEach(() => {
        defaultPageHandler = PageHandlerFactory.For(PageTypes.Default);
    });

    describe('Process', () => {
        it('should throw an error if the page is not found', async () => {
            const application = { pages: [] } as any; // Mock application with no pages
            await expect(defaultPageHandler.Process(application, 'non-existent-page', {})).rejects.toThrow('Page with ID non-existent-page not found.');
        });

        it('should throw an error if the component does not have a type', async () => {
            const application = { pages: [{ pageId: 'page1', components: [{ questionId: 'non-existent-component' }] }] } as any; // Mock application with no components
            await expect(defaultPageHandler.Process(application, 'page1', {})).rejects.toThrow('Component type is undefined for component ID non-existent-component.');
        });

        it('should throw an error if the component type is unknown', async () => {
            const application = { pages: [{ pageId: 'page1', components: [{ questionId: 'unknown-component', type: "unknown" }] }] } as any; // Mock application with no components
            await expect(defaultPageHandler.Process(application, 'page1', {})).rejects.toThrow('No handler found for component type unknown.');
        });

        it('should throw an error if the component does not have a name', async () => {
            const application = { pages: [{ pageId: 'page1', components: [{ questionId: 'unknown-component', type: "text", name: undefined }] }] } as any; // Mock application with no components
            await expect(defaultPageHandler.Process(application, 'page1', {})).rejects.toThrow('Component name is undefined for component ID unknown-component.');
        });    
    });

    describe('GetNextPageId', () => {
        it('should throw an error if the page is not found', async () => {
            const application = { pages: [] } as any; // Mock application with no pages
            await expect(defaultPageHandler.GetNextPageId(application, 'non-existent-page')).rejects.toThrow('Page with ID non-existent-page not found.');
        });
    });

    describe('WalkToNextInvalidOrUnfilledPage', () => {
        it('should throw an error if the page is not found', async () => {
            const application = { pages: [] } as any; // Mock application with no pages
            await expect(defaultPageHandler.WalkToNextInvalidOrUnfilledPage(application, 'non-existent-page', '')).rejects.toThrow('Page with ID non-existent-page not found.');
        });

        it('should throw an error if the component does not have a type', async () => {
            const application = { pages: [{ pageId: 'page1', components: [{ questionId: 'non-existent-component' }] }] } as any; // Mock application with no components
            await expect(defaultPageHandler.WalkToNextInvalidOrUnfilledPage(application, 'page1', '')).rejects.toThrow('Component type is undefined for component ID non-existent-component.');
        });

        it('should throw an error if the component type is unknown', async () => {
            const application = { pages: [{ pageId: 'page1', components: [{ questionId: 'unknown-component', type: "unknown", answer: "blah" }] }] } as any; // Mock application with no components
            await expect(defaultPageHandler.WalkToNextInvalidOrUnfilledPage(application, 'page1', '')).rejects.toThrow('No handler found for component type unknown.');
        });
    });
});
