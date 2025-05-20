import { UKAddress } from '@model/formTypes';

export default function GDSUKAddress({ name, label, hint, labelIsPageTitle, answer }:
    { name: string | undefined; label: string | undefined; hint: string | undefined; labelIsPageTitle: boolean, answer?: UKAddress }) {

    return (
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
            <div className="govuk-form-group">
                <label className="govuk-label" htmlFor={`${name}-address-line-1`}>
                Address line 1
                </label>
                <input className="govuk-input" id={`${name}-address-line-1`} name={`${name}-addressLine1`} type="text" autoComplete="address-line1" defaultValue={answer?.addressLine1} />
            </div>
            <div className="govuk-form-group">
                <label className="govuk-label" htmlFor={`${name}-address-line-2`}>
                Address line 2 (optional)
                </label>
                <input className="govuk-input" id={`${name}-address-line-2`} name={`${name}-addressLine2`} type="text" autoComplete="address-line2" defaultValue={answer?.addressLine2} />
            </div>
            <div className="govuk-form-group">
                <label className="govuk-label" htmlFor={`${name}-address-town`}>
                Town or city
                </label>
                <input className="govuk-input govuk-!-width-two-thirds" id={`${name}-address-town`} name={`${name}-addressTown`} type="text" autoComplete="address-level2" defaultValue={answer?.town} />
            </div>
            <div className="govuk-form-group">
                <label className="govuk-label" htmlFor={`${name}-address-county`}>
                County (optional)
                </label>
                <input className="govuk-input govuk-!-width-two-thirds" id={`${name}-address-county`} name={`${name}-addressCounty`} type="text" defaultValue={answer?.county} />
            </div>
            <div className="govuk-form-group">
                <label className="govuk-label" htmlFor={`${name}-address-postcode`}>
                Postcode
                </label>
                <input className="govuk-input govuk-input--width-10" id={`${name}-address-postcode`} name={`${name}-addressPostcode`} type="text" autoComplete="postal-code" defaultValue={answer?.postcode} />
            </div>
        </fieldset>
    );
}   