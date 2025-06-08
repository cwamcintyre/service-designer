import { type Page } from '@model/formTypes'
import { GDSSummaryList, GDSSummaryRow, GDSSummaryQuestion, GDSSummaryAnswer, GDSSummaryActions, } from '@gds/GDSSummary'
import GDSLink from '@gds/GDSLink'

export default function GDSSummaryComponent({ formId, pages }: { formId: string, pages: Page[] }) {    
    return (
        <GDSSummaryList>            
            {pages.map((page) => {
                return (
                    <>
                        {page.components && page.components.map((component) => {
                            switch (component.type) {
                                case 'text':
                                case 'email':
                                case 'number':
                                case 'phonenumber':
                                case 'multilineText':
                                    return (
                                        <GDSSummaryRow key={component.questionId} name={component.name}>
                                            <GDSSummaryQuestion text={component.label || 'Untitled'} />
                                            <GDSSummaryAnswer>{component.answer || 'Not provided'}</GDSSummaryAnswer>
                                            <GDSSummaryActions>
                                                <GDSLink href={`/form/${formId}/change/${page.pageId}`}>Change<span className="govuk-visually-hidden">{component.label}</span></GDSLink>
                                            </GDSSummaryActions>
                                        </GDSSummaryRow>
                                    );
                                case 'radio':
                                case 'checkbox':
                                case 'select':
                                case 'yesno':                                
                                    return (
                                        <GDSSummaryRow key={component.questionId} name={component.name}>
                                            <GDSSummaryQuestion text={component.label || 'Untitled'} />
                                            <GDSSummaryAnswer>{component.answer?.label || 'Not provided'}</GDSSummaryAnswer>
                                            <GDSSummaryActions>
                                                <GDSLink href={`/form/${formId}/change/${page.pageId}`}>Change<span className="govuk-visually-hidden">{component.label}</span></GDSLink>
                                            </GDSSummaryActions>
                                        </GDSSummaryRow>
                                    );
                                case 'ukaddress':
                                    return (
                                        <GDSSummaryRow key={component.questionId} name={component.name}>
                                            <GDSSummaryQuestion text={component.label || 'Untitled'} />
                                            <GDSSummaryAnswer>
                                                {!component.answer?.addressLine1 && !component.answer?.addressLine2 && !component.answer?.town && !component.answer?.county && !component.answer?.postcode ?
                                                    "Not provided"
                                                : null}
                                                {component.answer?.addressLine1 ? <p>{component.answer?.addressLine1}</p> : null}
                                                {component.answer?.addressLine2 ? <p>{component.answer?.addressLine2}</p> : null}
                                                {component.answer?.town ? <p>{component.answer?.town}</p> : null}
                                                {component.answer?.county ? <p>{component.answer?.county}</p> : null}
                                                {component.answer?.postcode ? <p>{component.answer?.postcode}</p> : null}
                                            </GDSSummaryAnswer>
                                            <GDSSummaryActions>
                                                <GDSLink href={`/form/${formId}/change/${page.pageId}`}>Change<span className="govuk-visually-hidden">{component.label}</span></GDSLink>
                                            </GDSSummaryActions>
                                        </GDSSummaryRow>
                                    );
                                case 'dateParts':
                                    return (
                                        <GDSSummaryRow key={component.questionId} name={component.name}>
                                            <GDSSummaryQuestion text={component.label || 'Untitled'} />
                                            <GDSSummaryAnswer>
                                                {!component.answer?.day || !component.answer?.month || !component.answer?.year ? 
                                                    "Not provided" : 
                                                    new Date(`${component.answer.year}-${component.answer.month}-${component.answer.day}`).toLocaleDateString()
                                                }
                                            </GDSSummaryAnswer>
                                            <GDSSummaryActions>
                                                <GDSLink href={`/form/${formId}/change/${page.pageId}`}>Change<span className="govuk-visually-hidden">{component.label}</span></GDSLink>
                                            </GDSSummaryActions>
                                        </GDSSummaryRow>
                                    );
                            }
                        })}
                    </>
                )
            })}
        </GDSSummaryList>
    )
}