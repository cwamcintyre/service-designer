export default function GDSButton({ text }: { text: string }) {
    return (
        <button className="govuk-button" type="button">
            {text}
        </button>
    );
}