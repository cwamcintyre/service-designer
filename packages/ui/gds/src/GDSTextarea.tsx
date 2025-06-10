export default function GDSTextarea({ name, label, hint, labelIsPageTitle, answer, errors }: 
    { name: string | undefined; label: string | undefined; hint: string | undefined; labelIsPageTitle: boolean; answer?: string, errors?: string[] }) {
    const hasError = errors && errors.length > 0;
    const errorId = `${name}-error`;

    const ariaDescribedBy = [hint ? `${name}-hint` : null, hasError ? errorId : null]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={`govuk-form-group${hasError ? ' govuk-form-group--error' : ''}`} >
            {labelIsPageTitle ? (
                <h1 className="govuk-label-wrapper">
                    <label className="govuk-label govuk-label--l" htmlFor={name}>
                        {label}
                    </label>
                </h1>
            ) : (
                <label className="govuk-label govuk-label--m" htmlFor={name}>
                    {label}
                </label>
            )}
            {hint ? (
                <div id={`${name}-hint`} className="govuk-hint">
                    {hint}
                </div>
            ) : null}
            {hasError ? (
                <p id={errorId} className="govuk-error-message">
                    <span className="govuk-visually-hidden">Error:</span> {errors[0]}
                </p>
            ) : null}
            <textarea 
                className={`govuk-textarea${hasError ? ' govuk-textarea--error' : ''}`} 
                data-testid={name} 
                name={name} 
                rows={5} 
                defaultValue={answer} 
                aria-describedby={ariaDescribedBy}
                aria-invalid={hasError ? 'true' : undefined} 
                aria-errormessage={hasError ? errorId : undefined}
            />
        </div>
    );
}