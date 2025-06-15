import { type AddAnotherPage } from '@model/formTypes'
import { GDSSummaryRow, GDSSummaryQuestion, GDSSummaryAnswer, GDSSummaryActions, } from '@gds/GDSSummary'
import GDSLink from '@gds/GDSLink'
import { get } from 'http';

function getAnswer(index: number, componentName?: string, pageAnswers?: Record<string, any>[]) {
    if (!pageAnswers || !pageAnswers[index]) return "Not provided";
    if (!componentName) return "Not provided";
    return pageAnswers[index][componentName];
}

function getOptionLabel(index: number, componentName?: string, pageAnswers?: Record<string, any>[]) {
    if (!pageAnswers || !pageAnswers[index]) return "Not provided";
    if (!componentName || !pageAnswers[index][componentName]) return "Not provided";
    return pageAnswers[index][componentName].label || "Not provided";
}

function getAddress(index: number, componentName?: string, pageAnswers?: Record<string, any>[]) {
    if (!pageAnswers || !pageAnswers[index]) return "Not provided";
    if (!componentName || !pageAnswers[index][componentName]) return "Not provided";
    const address = pageAnswers[index][componentName];
    if (!address?.addressLine1 && !address?.addressLine2 && !address?.town && !address?.county && !address?.postcode) return "Not provided";
    return (
        <>
            {address?.addressLine1 && <p>{address.addressLine1}</p>}
            {address?.addressLine2 && <p>{address.addressLine2}</p>}
            {address?.town && <p>{address.town}</p>}
            {address?.county && <p>{address.county}</p>}
            {address?.postcode && <p>{address.postcode}</p>}
        </>
    );
}

function getDatePartsAnswer(index: number, componentName?: string, pageAnswers?: Record<string, any>[]) {
    if (!pageAnswers || !pageAnswers[index]) return "Not provided";
    if (!componentName || !pageAnswers[index][componentName]) return "Not provided";
    const dateParts = pageAnswers[index][componentName];
    if (!dateParts?.day || !dateParts?.month || !dateParts?.year) return "Not provided";
    return new Date(`${dateParts.year}-${dateParts.month}-${dateParts.day}`).toLocaleDateString();
}

export default function GDSMoJAddAnotherSummaryRow({ formId, page }: { formId: string, page: AddAnotherPage }) {
    return (
        <GDSSummaryRow key={page.pageId} name={page.pageId}>
            <GDSSummaryQuestion text={page.answerLabel || "Untitled"} />
            <GDSSummaryAnswer>
                {Array.from({ length: page.pageAnswer ? page.pageAnswer.length : 0 }).map((_, i) => (
                    <div className="moj-repeat-summary-section__item" key={`${page.pageId}-${i}`}>
                        {page.components && page.components.map((component) => {
                            switch (component.type) {
                                case 'text':
                                case 'email':
                                case 'number':
                                case 'phonenumber':
                                case 'multilineText':
                                    return (
                                        <div>{getAnswer(i, component.name, page.pageAnswer)}</div>
                                    );
                                case 'radio':
                                case 'checkbox':
                                case 'select':
                                case 'yesno':                                
                                    return (
                                        <div>{getOptionLabel(i, component.name, page.pageAnswer)}</div>
                                    );
                                case 'ukaddress':
                                    return (
                                        <div>
                                            {getAddress(i, component.name, page.pageAnswer)}
                                        </div>
                                    );
                                case 'dateParts':
                                    return (
                                        <div>
                                            {getDatePartsAnswer(i, component.name, page.pageAnswer)}
                                        </div>
                                    );
                            }
                        })}
                    </div>
                ))}
            </GDSSummaryAnswer>
            <GDSSummaryActions>
                <GDSLink href={`/form/${formId}/change/${page.pageId}`}>Change<span className="govuk-visually-hidden">{page.answerKey}</span></GDSLink>
            </GDSSummaryActions>
        </GDSSummaryRow>
    )
}