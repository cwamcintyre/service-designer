export default function GDSButton({ text, type = "button", preventDoubleClick = false }: { text: string, type?: "button" | "submit", preventDoubleClick?: boolean }) {
    return (
        <button className="govuk-button" type={type} data-module="govuk-button" data-prevent-double-click={preventDoubleClick}>
            {text}
        </button>
    );
}