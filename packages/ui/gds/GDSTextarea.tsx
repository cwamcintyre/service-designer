export default function GDSTextarea({ key, name, label, hint, labelIsPageTitle }: 
    { key: string; name: string | undefined; label: string | undefined; hint: string | undefined; labelIsPageTitle: boolean }) {
    return (
        <div className="govuk-form-group" key={key}>
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
            <textarea className="govuk-textarea" id={name} name={name} rows={5} />
        </div>
    );
}   