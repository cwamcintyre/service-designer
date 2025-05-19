export default function GDSInput({key, name, label, hint, labelIsPageTitle, errors, value, autocomplete = "off", inputmode = "text" }: 
    {key: string, name: string | undefined, label: string | undefined, hint: string | undefined, labelIsPageTitle: boolean, errors: string[], value: string | undefined, autocomplete?: string , 
        inputmode?: "text" | "search" | "email" | "tel" | "url" | "none" | "numeric" | "decimal" | undefined }) {

    let ariaDescribedBy = "";
    if (hint) {
        ariaDescribedBy = `${name}-hint`;
    }
    if (errors.length > 0) {
        ariaDescribedBy += ` ${name}-error`;
    }

    let containerClassName = "govuk-form-group";
    if (errors.length > 0) {
        containerClassName += " govuk-form-group--error";
    }
    
    let inputClassName = "govuk-input";
    if (errors.length > 0) {
        inputClassName += " govuk-input--error";
    }

    return (
        <div className={containerClassName} key={key}>

            {labelIsPageTitle ? 
            <h1 className="govuk-label-wrapper">
                <label className="govuk-label govuk-label--l" htmlFor={name}>
                    {label}
                </label>
            </h1> 
            : 
            <label className="govuk-label govuk-label--m" htmlFor={name}>
                {label}
            </label>}
            
            {hint ? 
            <div id={`${name}-hint`} className="govuk-hint">
                {hint}
            </div> : null}
            
            {errors.length > 0 ?
            <p id={`${name}-error`} className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span>
                {errors.map((error, index) => (
                    <span key={index}>{error}</span>
                ))}
            </p>
            : null}
            
            { ariaDescribedBy ? 
                <input className={inputClassName} id={name} name={name} type="text" autoComplete={autocomplete} inputMode={inputmode} aria-describedby={ariaDescribedBy} defaultValue={value} />
            : <input className={inputClassName} id={name} name={name} type="text" autoComplete={autocomplete} inputMode={inputmode} defaultValue={value} />}
        </div>
    );
}