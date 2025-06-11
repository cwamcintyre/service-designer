import { type Option } from '@model/formTypes';

export default function GDSSelect({ name, label, hint, labelIsPageTitle, options, answer, errors }: 
    { name: string | undefined, label: string | undefined, hint: string | undefined, labelIsPageTitle: boolean | undefined, options: Option[] | undefined, answer?: Option, errors?: string[] }) {
    
    const hasError = errors && errors.length > 0;
    const errorId = `${name}-error`;    

    const ariaDescribedBy = [hint ? `${name}-hint` : null, hasError ? errorId : null]
        .filter(Boolean)
        .join(' ');
    
    return (
        <div className={`govuk-form-group${hasError ? ' govuk-form-group--error' : ''}`}>
            {labelIsPageTitle ?
                <h1 className="govuk-label-wrapper">
                    <label className="govuk-label govuk-label--l" htmlFor={name}>
                        {label || 'Select an option'}
                    </label>
                </h1>
            : <label className="govuk-label govuk-label--m" htmlFor={name}>
                {label || 'Select an option'}
            </label>}
            {hint && <div id={`${name}-hint`} className="govuk-hint">{hint}</div>}
            {hasError ? (
                    <p id={errorId} className="govuk-error-message">
                        <span className="govuk-visually-hidden">Error:</span> {errors[0]}
                    </p>
                ) : null}
            <select 
                className="govuk-select" 
                data-testid={name}
                id={name} 
                name={name} 
                aria-describedby={ariaDescribedBy}
                aria-invalid={hasError ? 'true' : undefined}
                aria-errormessage={hasError ? errorId : undefined}
                defaultValue={answer?.value}
            >
                {options && options.map((option) => (
                    <option key={option.value} data-testid={`${name}-${option.value}`} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}