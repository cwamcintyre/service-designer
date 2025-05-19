'use server';

import applicationService from '@/services/applicationService';
import formService from '@/services/formServices';
import { LogHandler } from '@/app/utils/logging/logHandler';
import { PageHandlerFactory } from '@/app/utils/pageHandler/pageHandlerFactory';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {

    const applicationId = await applicationService.getApplicationId();    

    if (!applicationId) {
        LogHandler.error("Application ID not found", new Error("Application ID is required but was not found"));
        return new Response("Application ID not found", { status: 400 });
    }

    LogHandler.log("Application ID: ", applicationId);

    const formData = await req.formData();
    LogHandler.log("Form Data: ", formData);

    const formId = formData.get("formId");
    const pageId = formData.get("pageId");
    const extraData = formData.get("extraData");

    if (typeof formId !== 'string') {
        LogHandler.error("Invalid formId", new Error("formId must be a string"));
        return new Response("Invalid formId", { status: 400 });
    }

    if (typeof pageId !== 'string') {
        LogHandler.error("Invalid pageId", new Error("pageId must be a string"));
        return new Response("Invalid pageId", { status: 400 });
    }

    if (typeof extraData !== 'string') {
        LogHandler.error("Invalid extraData", new Error("extraData must be a string"));
        return new Response("Invalid extraData", { status: 400 });
    }

    const form = await formService.getForm(formId);
    
    if (!form) {
        LogHandler.error("Form not found", new Error(`Form with ID ${formId} not found`));
        return new Response("Form not found", { status: 400 });
    }
    
    const page = form.pages.find((page: any) => page.pageId === pageId);
    
    if (!page) {
        LogHandler.error("Page not found", new Error(`Page with ID ${pageId} not found`));
        return new Response("Page not found", { status: 400 });
    }

    if (!page.pageType) {
        LogHandler.error("Page type is undefined", new Error("Page type is required but was undefined"));
        return new Response("Page type is undefined", { status: 400 });
    }

    const pageHandler = PageHandlerFactory.For(page.pageType);
    const submittedData = pageHandler.GetSubmittedData(page, formData);
    LogHandler.log("Submitted Data: ", submittedData);
    const processedData = await formService.processPage(formId, pageId, applicationId.value, submittedData);
    LogHandler.log("Processed Data: ", processedData);

    const baseUrl = process.env.BASE_URL || '';

    const nextPage = form.pages.find((page: any) => page.pageId === processedData.nextPageId);

    // normally the redirect will simply be the next page..
    let redirectUrl = processedData.extraData 
        ? `${baseUrl}/form/${formId}/${processedData.nextPageId}/${processedData.extraData}` 
        : `${baseUrl}/form/${formId}/${processedData.nextPageId}`;

    if (nextPage) {
        if (nextPage.pageType === "stop") {
            redirectUrl = `${baseUrl}/form/${formId}/stop/${processedData.nextPageId}`;
        }
        else if (nextPage.pageType === "summary") {  
            redirectUrl = `${baseUrl}/form/${formId}/summary/${processedData.nextPageId}`;
        }
    }

    return NextResponse.redirect(redirectUrl, {
        status: 302,
    });
}