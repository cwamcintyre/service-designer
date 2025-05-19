'use client';
import { useEffect } from 'react';

export default function GDSInitialiser() {
    useEffect(() => {
        // Dynamically import the govuk-frontend module and initialize it
        import("@/public/govuk-frontend.min.js").then(({ initAll }) => {
            document.body.classList.add("js-enabled");
            document.body.classList.add("govuk-frontend-supported");
            initAll();
        });
    }, []);
    return (
        <>
        </>
    )
}