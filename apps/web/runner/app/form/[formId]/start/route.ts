'use server'

import { nanoid } from 'nanoid';
import applicationService from '@/services/applicationService';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { formId: string } }) {
    const { formId } = params;

    // Set up the form session
    const applicationId = nanoid();

    // Fetch the form details
    const startPageId = await applicationService.startApplication(applicationId, formId);

    // Create a response with a cookie and redirect
    const response = NextResponse.redirect(`${process.env.BASE_URL}/form/${formId}/${startPageId}`, 302);

    response.cookies.set('applicationId', applicationId, {
        httpOnly: true, // Prevent client-side access
        secure: true,   // Ensure the cookie is sent over HTTPS
        sameSite: 'strict', // Prevent cross-site request forgery
        path: '/',      // Make the cookie available across the entire site
    });

    console.log('Application ID: ', applicationId);

    return response;
}