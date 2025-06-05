import { lazy } from "react";
import type { Component } from "@model/formTypes";
import useFormStore, { type FormState } from '@/store/formStore';
import { useShallow } from 'zustand/react/shallow';

const GDSHtmlEditor = lazy(() => import("@/components/quill/GDSHtmlEditor"));

const selector = (state: FormState) => ({
    updatePageComponent: state.updatePageComponent
});

export default function HtmlContentEditor({ controlIndex, component }: { controlIndex: number, component: Component }) {
    
    const { updatePageComponent } = useFormStore(useShallow(selector));

    function handleChange(html: string) {
        updatePageComponent(component.questionId, { ...component, content: html });
    };

    return (
        <div id={`html-editor-${component.questionId}-${controlIndex}`} className="flex flex-col gap-4">
            <GDSHtmlEditor  html={component.content} onChange={handleChange} />
        </div>
    );
}