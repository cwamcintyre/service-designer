import { type Option } from '@model/formTypes';

export default function GDSYesNo({ name, label, hint, labelIsPageTitle, answer, errors }:
    { name: string | undefined, label: string | undefined, hint: string | undefined, labelIsPageTitle: boolean | undefined, answer?: Option, errors?: string[] }) {

    const hasError = errors && errors.length > 0;
    const errorId = `${name}-error`;
    const ariaDescribedBy = [hint ? `${name}-hint` : null, hasError ? errorId : null]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={`govuk-form-group${hasError ? ' govuk-form-group--error' : ''}`}>
            <fieldset className="govuk-fieldset" 
                aria-describedby={ariaDescribedBy} 
                aria-invalid={hasError ? 'true' : undefined} 
                aria-errormessage={hasError ? errorId : undefined}
            >
                <legend className={`govuk-fieldset__legend ${labelIsPageTitle ? 'govuk-fieldset__legend--l' : 'govuk-fieldset__legend--m'}`}>
                    {labelIsPageTitle ? <h1 className="govuk-fieldset__heading">{label}</h1> : label}
                </legend>
                {hint ? <div id={`${name}-hint`} className="govuk-hint">{hint}</div> : null}
                {hasError ? (
                    <p id={errorId} className="govuk-error-message">
                        <span className="govuk-visually-hidden">Error:</span>
                        {errors.map((error, index) => (
                            <span key={index}>{error}<br /></span>
                        ))}
                    </p>
                ) : null}
                <div className="govuk-radios govuk-radios--inline" data-module="govuk-radios">
                    <div className="govuk-radios__item">
                        <input className="govuk-radios__input" data-testid={`${name}-yes`} id={`${name}-yes`} name={name} type="radio" value="yes" defaultChecked={answer?.value === 'yes'} />
                        <label className="govuk-label govuk-radios__label" htmlFor={`${name}-yes`}>
                            Yes
                        </label>
                    </div>
                    <div className="govuk-radios__item">
                        <input className="govuk-radios__input" data-testid={`${name}-no`} id={`${name}-no`} name={name} type="radio" value="no" defaultChecked={answer?.value === 'no'} />
                        <label className="govuk-label govuk-radios__label" htmlFor={`${name}-no`}>
                            No
                        </label>
                    </div>
                </div>
            </fieldset>
        </div>
    );
}