export default function GDSLink({ children, href, className = "" }: { children: React.ReactNode, href: string, className?: string }) {
    return (
        <a href={href} className={`govuk-link ${className}`}>
            {children}
        </a>
    )
}