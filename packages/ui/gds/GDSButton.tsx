export default function GDSButton({ text, type = "button" }: { text: string, type?: "button" | "submit" }) {
    return (
        <button className="govuk-button" type={type}>
            {text}
        </button>
    );
}