'use server';

import { LogHandler } from '@/app/utils/logging/logHandler';
import { setSharedState } from '@/app/utils/sharedState';
import formService from '@/services/formServices';
import applicationService from '@/services/applicationService';
import GDSSummaryComponent from '@/components/GDSSummaryComponent';
import GDSButtonLink from '@gds/GDSButtonLink';
import { addDataToForm } from '@/app/utils/formHandler';

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

    const backLink = "";

    setSharedState({ serviceTitle: form.title });
    LogHandler.debug("Form Title: ", form.title);

    const summaryPage = form.pages.find((page) => page.pageId === pageId);

    if (!summaryPage) {
        console.error("Summary page not found");
        return new Response("Summary page not found", { status: 404 });
    }

    const data = await formService.getFormData(applicationId.value);

    if (!data) {
        console.error("Form data not found");
        return new Response("Form data not found", { status: 404 });
    }

    addDataToForm(form, data);
    LogHandler.debug("Form Data: ", data);

    return (
        <>
            { backLink ? <a href={backLink} className="govuk-back-link">Back</a> : null }
            
            <h1 className="govuk-heading-l">{summaryPage?.title}</h1>
            
            {summaryPage?.components && summaryPage?.components.map((component) => {
                switch (component.type) {
                    case 'summary':
                        return (
                            <GDSSummaryComponent formId={form.formId} pages={form.pages} />
                        );
                    case 'html':
                        return (
                            <div key={component.questionId} dangerouslySetInnerHTML={{ __html: component.content ? component.content : "" }} />
                        );
                    default:
                        return null;
                }
            })}

            <GDSButtonLink href={`/api/form/submit/${form.formId}/${applicationId}`} className="govuk-button" text={"Accept and send"} />
        </>
    );
}