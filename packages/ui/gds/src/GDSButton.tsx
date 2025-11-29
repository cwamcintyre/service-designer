export default function GDSButton({ text, type = "button", preventDoubleClick = false, name, value, additionalClassNames }: { text: string, type?: "button" | "submit", preventDoubleClick?: boolean, name?: string, value?: string, additionalClassNames?: string }) {
    return (
        <button className={`govuk-button ${additionalClassNames}`} type={type} data-module="govuk-button" data-prevent-double-click={preventDoubleClick} name={name} value={value}>
            {text}
        </button>
    );
}