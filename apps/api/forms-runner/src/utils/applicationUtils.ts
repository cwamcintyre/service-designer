import { Application, Page } from '@model/formTypes'
import { PageHandlerFactory } from './pageHandler/pageHandlerFactory'
import { application } from 'express';

type PreviousPageModel = {
    pageId: string;
    extraData?: string;
    forceRedirect?: boolean;
}

export function getAllDataFromApplication(application: Application): { [key: string]: any } {
    const allData: { [key: string]: any } = {};
    for (const page of application.pages) {
        for (const component of page.components) {
            if (component.name) {
                allData[component.name] = component.answer;
            }
        }
    }
    return allData;
}

export async function calculatePreviousPageId(
    application: Application,
    currentPageId: string,
    extraData: string): Promise<PreviousPageModel> {

    const visitedPages = new Stack();

    if (extraData) {
        currentPageId = `${currentPageId}/${extraData}`;
    }

    console.log(`calculatePreviousPageId: currentPageId: ${currentPageId}`);
    console.log(`calculatePreviousPageId: extraData: ${extraData}`);

    await calculatePreviousPageRecursive(
        application,
        application.pages[0],
        currentPageId,
        extraData,
        "",
        visitedPages
    );

    if (visitedPages.size() === 0) {
        console.log(`calculatePreviousPageId: no previous page found`);
        return {
            pageId: ""
        }
    }    

    return visitedPages.peek();
}

async function calculatePreviousPageRecursive(
    application: Application,
    page: Page,
    currentPageId: string,
    extraData: string,
    nextExtraData: string,
    visitedPages: Stack
): Promise<void> {
    
    let checkPageId = page.pageId;
    if (nextExtraData) {
        checkPageId = `${checkPageId}/${nextExtraData}`;
    }

    if (checkPageId === currentPageId) {
        console.log(`calculatePreviousPageRecursive: found pageId: ${page.pageId}`);
        return;
    }

    visitedPages.push({
        pageId: page.pageId,
        extraData: nextExtraData
    });

    if (!page.pageType) {
        throw new Error("Page type is undefined");
    }
    const pageHandler = PageHandlerFactory.For(page.pageType);
    if (!pageHandler) {
        throw new Error(`No handler found for page type ${page.pageType}`);
    }

    const nextPageResult = await pageHandler.GetNextPageId(application, page.pageId);

    const nextPage = application.pages.find(p => p.pageId === nextPageResult.nextPageId);
    if (!nextPage) {
        throw new Error(`Next page with ID ${nextPageResult.nextPageId} not found.`);
    }

    await calculatePreviousPageRecursive(
        application,
        nextPage,
        currentPageId,
        extraData,
        nextPageResult.extraData || "",
        visitedPages
    );
}

export async function walkToNextInvalidOrUnfilledPage(
    application: Application,
    currentPageId: string,
    extraData: string,
): Promise<{ pageId: string, pageType: string, stop: boolean }> {
    const currentPage = application.pages.find(p => p.pageId === currentPageId);
    if (!currentPage) {
        throw new Error(`Page with ID ${currentPageId} not found.`);
    }

    if (currentPage.pageType === 'summary' || currentPage.pageType === 'stop') {
        return { pageId: currentPageId, pageType: currentPage.pageType, stop: true };
    }

    if (!currentPage.pageType) {
        throw new Error("Page type is undefined");
    }
    const pageHandler = PageHandlerFactory.For(currentPage.pageType);
    if (!pageHandler) {
        throw new Error(`No handler found for page type ${currentPage.pageType}`);
    }

    const walkResult = await pageHandler.WalkToNextInvalidOrUnfilledPage(
        application,
        currentPageId,
        extraData
    );

    if (!walkResult.stop) {
        return walkToNextInvalidOrUnfilledPage(application, walkResult.pageId, extraData);
    }

    return walkResult;
}

class Stack {
    items: any[];
    
    constructor() {
        this.items = [];
    }

    // Add an element to the stack
    push(element: any) {
        this.items.push(element);
    }

    // Remove and return the top element of the stack
    pop() {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        return this.items.pop();
    }

    // Return the top element of the stack without removing it
    peek() {
        if (this.isEmpty()) {
            throw new Error("Stack is empty");
        }
        return this.items[this.items.length - 1];
    }

    // Check if the stack is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Return the size of the stack
    size() {
        return this.items.length;
    }

    // Clear the stack
    clear() {
        this.items = [];
    }
}