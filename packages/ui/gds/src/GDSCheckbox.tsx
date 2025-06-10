import { type Option } from '@model/formTypes';

export default function GDSCheckbox({ name, label, hint, labelIsPageTitle, options, answer, errors }: {
    name: string | undefined, label: string | undefined, hint: string | undefined, labelIsPageTitle: boolean | undefined, options: Option[] | undefined, answer?: Option, errors?: string[]
}) {

    const hasError = errors && errors.length > 0;
    const errorId = `${name}-error`;
    const ariaDescribedBy = [hint ? `${name}-hint` : null, hasError ? errorId : null]
        .filter(Boolean)
        .join(' ');
        
    return (
        <div className={`govuk-form-group${hasError ? ' govuk-form-group--error' : ''}`}>
        <fieldset 
            className="govuk-fieldset" 
            aria-describedby={ariaDescribedBy}
            aria-invalid={hasError ? 'true' : undefined} 
            aria-errormessage={hasError ? errorId : undefined}>
            <legend className={`govuk-fieldset__legend ${labelIsPageTitle ? 'govuk-fieldset__legend--l' : 'govuk-fieldset__legend--m'}`}>
                {labelIsPageTitle ? <h1 className="govuk-fieldset__heading">{label}</h1> : label}
            </legend>
            {hint ? <div id={`${name}-hint`} className="govuk-hint">{hint}</div> : null}
            {hasError ? (
                <p id={errorId} className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span> {errors[0]}
                </p>
            ) : null}
            <div className="govuk-checkboxes" data-module="govuk-checkboxes">
                {options && options.map((option) => (
                    <div className="govuk-checkboxes__item" key={option.value}>
                        <input 
                            className="govuk-checkboxes__input" 
                            id={`${name}-${option.value}`}
                            data-testid={`${name}-${option.value}`} 
                            name={name} 
                            type="checkbox" 
                            value={option.value} 
                            defaultChecked={option.value === answer?.value} 
                        />
                        <label className="govuk-label govuk-checkboxes__label" htmlFor={`${name}-${option.value}`}>
                        {option.label}
                        </label>
                    </div>
                ))}
            </div>
        </fieldset>
        </div>
    );
}