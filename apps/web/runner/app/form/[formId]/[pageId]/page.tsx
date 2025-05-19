'use server';

import { LogHandler } from '@/app/utils/logging/logHandler';
import { setSharedState } from '@/app/utils/sharedState';
import GDSFormPage from '@/components/GDSFormPage';
import formService from '@/services/formServices';
import applicationService from '@/services/applicationService';
import GDSButton from '@gds/GDSButton';
import { PageHandlerFactory } from '@/app/utils/pageHandler/pageHandlerFactory';

export default async function FormPage({ params, searchParams }: { params: { formId: string, pageId: string }; searchParams: any }) {
        
    // Access the dynamic route parameter
    const { formId, pageId } = params;

    // Access query parameters
    const step = searchParams.step;

    const form = await formService.getForm(formId);        
    const page = form.pages.find((page: any) => page.pageId === pageId);

    const applicationId = await applicationService.getApplicationId();
    if (!applicationId) {
        console.error("Application ID not found");
        return new Response("Application ID not found", { status: 400 });
    }

    if (!page || typeof page.pageType !== 'string') {
        console.error("Page or page type is invalid");
        return new Response("Page or page type is invalid", { status: 400 });
    }

    const pageHandler = PageHandlerFactory.For(page.pageType);
    if (!pageHandler) {
        console.error("Page handler not found");
        return new Response("Page handler not found", { status: 400 });
    }

    const pageDataResponse = await formService.getDataForPage(formId, pageId, applicationId.value, step || "");
    if (!pageDataResponse) {
        console.error("Page data not found");
        return new Response("Page data not found", { status: 400 });
    }

    pageHandler.HandlePage(page, pageDataResponse);    

    const backLink = pageDataResponse.previousExtraData ? `/form/${formId}/${pageDataResponse.previousPage}/${pageDataResponse.previousExtraData}` : 
                                                          pageDataResponse.previousPage ? `/form/${formId}/${pageDataResponse.previousPage}` : "";

    setSharedState({ serviceTitle: form.title });
    LogHandler.debug("Form Title: ", form.title);
    return (
        <>
            <form action={`/api/form`} method="POST" className="govuk-form-group">
                
                <input type="hidden" name="formId" value={formId} />
                <input type="hidden" name="pageId" value={pageId} />
                <input type="hidden" name="extraData" value={JSON.stringify({ step })} />

                <GDSFormPage page={page} backLink={backLink} />

                <div className="govuk-button-group">
                    <GDSButton type="submit" text="Continue" />
                </div>
            </form>
        </>
    );
}