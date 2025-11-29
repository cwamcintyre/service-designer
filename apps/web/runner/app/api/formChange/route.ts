'use server';

import applicationService from '@/app/services/applicationService';
import { LogHandler } from '@/app/utils/logging/logHandler';
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

    let processResult = null;
    
    console.log(formData);

    const requestData = Object.fromEntries(formData.entries());

    if (formData.has('mojRemove')) {
        const mojRemoveValue = formData.get('mojRemove');
        if (typeof mojRemoveValue !== 'string') {
            LogHandler.error("Invalid mojRemove value", new Error("mojRemove value must be a string"));
            return new Response("Invalid mojRemove value", { status: 400 });
        }
        
        const separatorIndex = mojRemoveValue.lastIndexOf('-');
        const pageIdToRemove = mojRemoveValue.substring(0, separatorIndex);
        const itemIndex = mojRemoveValue.substring(separatorIndex + 1);
        if (!pageIdToRemove || !itemIndex) {
            LogHandler.error("Invalid mojRemove format", new Error("mojRemove value must be in the format 'pageId-itemIndex'"));
            return new Response("Invalid mojRemove format", { status: 400 });
        }

        processResult = await applicationService.mojRemoveFromAddAnother(
            applicationId,
            pageIdToRemove,
            parseInt(itemIndex, 10),
            requestData
        );
    }
    else if (formData.has('mojAdd')) {
        const mojAddValue = formData.get('mojAdd');
        if (typeof mojAddValue !== 'string') {
            LogHandler.error("Invalid mojAdd value", new Error("mojAdd value must be a string"));
            return new Response("Invalid mojAdd value", { status: 400 });
        }

        const separatorIndex = mojAddValue.lastIndexOf('-');
        const pageIdToAdd = mojAddValue.substring(0, separatorIndex);
        const numberOfItems = mojAddValue.substring(separatorIndex + 1);
        if (!pageIdToAdd || !numberOfItems) {
            LogHandler.error("Invalid mojAdd format", new Error("mojAdd value must be in the format 'pageId-numberOfItems'"));
            return new Response("Invalid mojAdd format", { status: 400 });
        }

        processResult = await applicationService.moJAddAnother(
            applicationId,
            pageIdToAdd,
            parseInt(numberOfItems, 10),
            requestData
        );
    }
    else {
        processResult = await applicationService.processApplicationChange(
            applicationId,
            pageId,
            Object.fromEntries(formData.entries())
        );
    }
    
    const baseUrl = process.env.BASE_URL || '';

    // the redirect will either go to the next invalid or empty page, or straight back to the summary, or possibly to a stop page
    let redirectUrl = processResult.extraData
        ? `${baseUrl}/form/${formId}/change/${processResult.nextPageId}/${processResult.extraData}`
        : `${baseUrl}/form/${formId}/change/${processResult.nextPageId}`;

    if (processResult.nextPageType) {
        if (processResult.nextPageType === "stop") {
            redirectUrl = `${baseUrl}/form/${formId}/stop/${processResult.nextPageId}`;
        }
        else if (processResult.nextPageType === "summary") {
            redirectUrl = `${baseUrl}/form/${formId}/finish/${processResult.nextPageId}`;
        }
    }

    return NextResponse.redirect(redirectUrl, {
        status: 302,
    });
}