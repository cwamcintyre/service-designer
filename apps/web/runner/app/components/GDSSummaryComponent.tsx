import { type Page } from '@model/formTypes'
import { GDSSummaryList, GDSSummaryRow, GDSSummaryQuestion, GDSSummaryAnswer, GDSSummaryActions, } from '@gds/GDSSummary'
import GDSLink from '@gds/GDSLink'

export default function GDSSummaryComponent({ formId, pages }: { formId: string, pages: Page[] }) {
    return (
        <GDSSummaryList>            
            {pages.map((page) => {
                return (
                    <GDSSummaryRow key={page.pageId}>
                        {page.components && page.components.map((component) => {
                            switch (component.type) {
                                case 'text':
                                case 'email':
                                case 'number':
                                case 'phonenumber':
                                case 'multilineText':
                                case 'radio':
                                case 'checkbox':
                                case 'select':
                                case 'yesno':                                
                                    return (
                                        <>
                                            <GDSSummaryQuestion text={component.label || 'Untitled'} />
                                            <GDSSummaryAnswer>{component.answer || 'Not provided'}</GDSSummaryAnswer>
                                            <GDSSummaryActions>
                                                <GDSLink href={`/form/${formId}/change/${page.pageId}`}>Change<span className="govuk-visually-hidden">{component.label}</span></GDSLink>
                                            </GDSSummaryActions>
                                        </>
                                    );
                                case 'ukaddress':
                                    return (
                                        <>
                                            <GDSSummaryQuestion text={component.label || 'Untitled'} />
                                            <GDSSummaryAnswer>
                                                {component.answer?.addressLine1 ? <p>{component.answer?.addressLine1}</p> : null}
                                                {component.answer?.addressLine2 ? <p>{component.answer?.addressLine2}</p> : null}
                                                {component.answer?.town ? <p>{component.answer?.town}</p> : null}
                                                {component.answer?.county ? <p>{component.answer?.county}</p> : null}
                                                {component.answer?.postcode ? <p>{component.answer?.postcode}</p> : null}
                                            </GDSSummaryAnswer>
                                            <GDSSummaryActions>
                                                <GDSLink href={`/form/${formId}/change/${page.pageId}`}>Change<span className="govuk-visually-hidden">{component.label}</span></GDSLink>
                                            </GDSSummaryActions>
                                        </>
                                    );
                            }
                        })}
                    </GDSSummaryRow>
                )
            })}
        </GDSSummaryList>
    )
}