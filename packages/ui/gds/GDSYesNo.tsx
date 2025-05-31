import { type Option } from '@model/formTypes';

export default function GDSYesNo({ key, name, label, hint, labelIsPageTitle, answer }:
    { key: string, name: string | undefined, label: string | undefined, hint: string | undefined, labelIsPageTitle: boolean | undefined, answer?: Option }) {
    return (
        <div className="govuk-form-group">
            <fieldset className="govuk-fieldset" aria-describedby={hint ? `${name}-hint` : undefined}>
                <legend className={`govuk-fieldset__legend ${labelIsPageTitle ? 'govuk-fieldset__legend--l' : 'govuk-fieldset__legend--m'}`}>
                    {labelIsPageTitle ? <h1 className="govuk-fieldset__heading">{label}</h1> : label}
                </legend>
                {hint ? <div id={`${name}-hint`} className="govuk-hint">{hint}</div> : null}
                <div className="govuk-radios govuk-radios--inline" data-module="govuk-radios">
                    <div className="govuk-radios__item">
                        <input className="govuk-radios__input" data-testid={`${name}-yes`} name={name} type="radio" value="yes" defaultChecked={answer?.value === 'yes'} />
                        <label className="govuk-label govuk-radios__label" htmlFor={`${name}-yes`}>
                            Yes
                        </label>
                    </div>
                    <div className="govuk-radios__item">
                        <input className="govuk-radios__input" data-testid={`${name}-no`} name={name} type="radio" value="no" defaultChecked={answer?.value === 'no'} />
                        <label className="govuk-label govuk-radios__label" htmlFor={`${name}-no`}>
                            No
                        </label>
                    </div>
                </div>
            </fieldset>
        </div>
    );
}