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

    const processResult = await applicationService.processApplication(
        applicationId,
        pageId,
        Object.fromEntries(formData.entries())
    );

    const baseUrl = process.env.BASE_URL || '';

    // normally the redirect will simply be the next page..
    let redirectUrl = processResult.extraData
        ? `${baseUrl}/form/${formId}/${processResult.nextPageId}/${processResult.extraData}`
        : `${baseUrl}/form/${formId}/${processResult.nextPageId}`;

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