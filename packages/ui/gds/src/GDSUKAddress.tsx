import { type UKAddress } from '@model/formTypes';

export default function GDSUKAddress({ name, label, hint, labelIsPageTitle, answer, errors }:
    { name: string | undefined; label: string | undefined; hint: string | undefined; labelIsPageTitle: boolean, answer?: UKAddress, errors?: string[] }) {

    const fieldErrors = {
        addressLine1: errors?.filter(error => error.startsWith('[addressLine1]')),
        addressTown: errors?.filter(error => error.startsWith('[addressTown]')),
        addressPostcode: errors?.filter(error => error.startsWith('[addressPostcode]')),
    };

    const generalErrors = errors?.filter(error => 
        !error.startsWith('[addressLine1]') && 
        !error.startsWith('[addressTown]') && 
        !error.startsWith('[addressPostcode]')
    );

    return (
        <div className="govuk-form-group">
            <fieldset className="govuk-fieldset">
                {labelIsPageTitle ?
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--l">
                        <h1 className="govuk-fieldset__heading">
                            {label}
                        </h1>
                    </legend>
                : 
                    <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
                        {label}
                    </legend>
                }
                {hint && <div id={`${name}-hint`} className="govuk-hint">{hint}</div>}

                {generalErrors && generalErrors.length > 0 && (
                    <div className="govuk-error-summary">
                        {generalErrors.map((error, index) => (
                            <p key={index} className="govuk-error-message">
                                <span className="govuk-visually-hidden">Error:</span> {error}
                            </p>
                        ))}
                    </div>
                )}

                <div className={`govuk-form-group${fieldErrors.addressLine1?.length ? ' govuk-form-group--error' : ''}`}>
                    <label className="govuk-label" htmlFor={`${name}-address-line-1`}>
                        Address line 1
                    </label>
                    {fieldErrors.addressLine1?.map((error, index) => (
                        <p key={index} id={`${name}-address-line-1-error-${index}`} className="govuk-error-message">
                            <span className="govuk-visually-hidden">Error:</span> {error.replace('[addressLine1]-', '').trim()}
                        </p>
                    ))}
                    <input className={`govuk-input${fieldErrors.addressLine1?.length ? ' govuk-input--error' : ''}`} id={`${name}-address-line-1`} data-testid={`${name}-addressLine1`} name={`${name}-addressLine1`} type="text" autoComplete="address-line1" aria-describedby={fieldErrors.addressLine1?.map((_, index) => `${name}-address-line-1-error-${index}`).join(' ')} defaultValue={answer?.addressLine1} />
                </div>

                <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor={`${name}-address-line-2`}>
                        Address line 2 (optional)
                    </label>
                    <input className="govuk-input" id={`${name}-address-line-2`} data-testid={`${name}-addressLine2`} name={`${name}-addressLine2`} type="text" autoComplete="address-line2" defaultValue={answer?.addressLine2} />
                </div>

                <div className={`govuk-form-group${fieldErrors.addressTown?.length ? ' govuk-form-group--error' : ''}`}>
                    <label className="govuk-label" htmlFor={`${name}-address-town`}>
                        Town or city
                    </label>
                    {fieldErrors.addressTown?.map((error, index) => (
                        <p key={index} id={`${name}-address-town-error-${index}`} className="govuk-error-message">
                            <span className="govuk-visually-hidden">Error:</span> {error.replace('[addressTown]-', '').trim()}
                        </p>
                    ))}
                    <input className={`govuk-input govuk-!-width-two-thirds${fieldErrors.addressTown?.length ? ' govuk-input--error' : ''}`} id={`${name}-address-town`} data-testid={`${name}-addressTown`} name={`${name}-addressTown`} type="text" autoComplete="address-level2" aria-describedby={fieldErrors.addressTown?.map((_, index) => `${name}-address-town-error-${index}`).join(' ')} defaultValue={answer?.town} />
                </div>

                <div className="govuk-form-group">
                    <label className="govuk-label" htmlFor={`${name}-address-county`}>
                        County (optional)
                    </label>
                    <input className="govuk-input govuk-!-width-two-thirds" id={`${name}-address-county`} data-testid={`${name}-addressCounty`} name={`${name}-addressCounty`} type="text" defaultValue={answer?.county} />
                </div>

                <div className={`govuk-form-group${fieldErrors.addressPostcode?.length ? ' govuk-form-group--error' : ''}`}>
                    <label className="govuk-label" htmlFor={`${name}-address-postcode`}>
                        Postcode
                    </label>
                    {fieldErrors.addressPostcode?.map((error, index) => (
                        <p key={index} id={`${name}-address-postcode-error-${index}`} className="govuk-error-message">
                            <span className="govuk-visually-hidden">Error:</span> {error.replace('[addressPostcode]-', '').trim()}
                        </p>
                    ))}
                    <input className={`govuk-input govuk-input--width-10${fieldErrors.addressPostcode?.length ? ' govuk-input--error' : ''}`} id={`${name}-address-postcode`} data-testid={`${name}-addressPostcode`} name={`${name}-addressPostcode`} type="text" autoComplete="postal-code" aria-describedby={fieldErrors.addressPostcode?.map((_, index) => `${name}-address-postcode-error-${index}`).join(' ')} defaultValue={answer?.postcode} />
                </div>
            </fieldset>
        </div>
    );
}