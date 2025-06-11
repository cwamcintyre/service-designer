export default function GDSLink({ children, href, className = "", target = "_self" }: { children: React.ReactNode, href: string, className?: string, target?: string }) {
    return (
        <a href={href} className={`govuk-link ${className}`} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}>
            {children}
        </a>
    )
}