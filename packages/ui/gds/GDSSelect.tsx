import { type Option } from '@model/formTypes';

export default function GDSSelect({ name, label, hint, labelIsPageTitle, options, answer, errors }: 
    { name: string | undefined, label: string | undefined, hint: string | undefined, labelIsPageTitle: boolean | undefined, options: Option[] | undefined, answer?: Option, errors?: string[] }) {
    
    const hasError = errors && errors.length > 0;
    const errorId = `${name}-error`;    
    
    return (
        <div className={`govuk-form-group${hasError ? ' govuk-form-group--error' : ''}`}>
            {labelIsPageTitle ?
                <h1 className="govuk-label-wrapper">
                    <label className="govuk-label govuk-label--l" htmlFor="select-example">
                        {label || 'Select an option'}
                    </label>
                </h1>
            : <label className="govuk-label govuk-label--m" htmlFor="select-example">
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
                name={name} 
                aria-describedby={`${name}-hint`}
                aria-invalid={hasError ? 'true' : undefined}
                aria-errormessage={hasError ? errorId : undefined}>
                {options && options.map((option) => (
                    <option key={option.value} data-testid={`${name}-${option.value}`} value={option.value} selected={option.value === answer?.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}