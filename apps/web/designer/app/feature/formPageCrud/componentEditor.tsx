import { type Component, type ValidationRule } from '@model/formTypes';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import useFormStore, { type FormState } from '@/store/formStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, forwardRef, useImperativeHandle, useRef } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import InputFieldEditor from "./inputFieldEditor";
import HtmlContentEditor from './htmlContentEditor';

const selector = (state: FormState) => ({
    updatePageComponent: state.updatePageComponent
});

const componentTypes = [
    { label: "HTML", value: "html"}, { label: "Summary", value: "summary" }, { label: "Text", value: "text" }, { label: "Select", value: "select" }, { label: "Multiline Text", value: "multilineText" }, { label: "Radio", value: "radio" }, { label: "Checkbox", value: "checkbox" },
    { label: "Yes/No", value: "yesno" }, { label: "Email", value: "email" }, { label: "Phone Number", value: "phonenumber" }, { label: "File Upload", value: "fileupload" }, { label: "Date Parts", value: "dateParts" },
    { label: "UK Address", value: "ukaddress" }
];

export default forwardRef(function ComponentEditor({ controlIndex, component, pageId }: { controlIndex: number; component: Component; pageId: string }, ref) {

    const { updatePageComponent } = useFormStore(useShallow(selector));

    const formSchema = z.object({
        type: z.string().refine((val) => componentTypes.map(type => type.value).includes(val as string), {
            message: "Invalid component type"
        }),
        validationRules: z.array(
            z.object({
                id: z.string(),
                expression: z.string().min(1, { message: "Expression is required" }),
                errorMessage: z.string().min(1, { message: "Error message is required" })
            })
        )
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: component?.type || "text",
            validationRules: component?.validationRules || []
        },
    });

    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name: "validationRules"
    });

    const inputComponentRef = useRef<any>(null);

    useEffect(() => {
        if (component) {
            form.reset({
                type: component.type,
                validationRules: component.validationRules || []
            });
        }
    }, [component, form]);

    useEffect(() => {
        const subscription = form.watch((values) => {
            if (form.formState.isValid && component) {
                const isDifferent =
                    component.type !== values.type ||
                    JSON.stringify(component.validationRules) !== JSON.stringify(values.validationRules);

                if (isDifferent) {
                    updatePageComponent(
                        component.questionId,
                        {
                            ...component,
                            type: values.type,
                            validationRules: values.validationRules ? values.validationRules.filter((rule): rule is ValidationRule => !!rule) : []
                        }
                    );
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [form, component]);

    const onNoop = (data: any) => {
      //console.log("componentEditor submit noop");              
    };

    useImperativeHandle(ref, () => ({
        async getComponentEditorState() {
            await form.trigger();
            await form.handleSubmit((data) => onNoop(data))();
            return form.control._formState.isValid && await inputComponentRef.current?.getComponentState();
        }
    }));

    return (
        <div>
            <Form {...form}>
                <form className="space-y-4">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center space-x-4 pb-4">
                                    <FormLabel className="whitespace-nowrap">Content Type</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a question type" />
                                            </SelectTrigger>
                                            <SelectContent id={`select-component-type-${controlIndex}`}>
                                                {componentTypes.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
            
            {(() => {
                switch (form.watch("type")) {
                    case "html":
                        return <HtmlContentEditor controlIndex={controlIndex} component={component} />;
                    case "summary":
                        return <></>;
                    default:
                        return <InputFieldEditor key={`${component.questionId}-${controlIndex}`} ref={inputComponentRef} controlIndex={controlIndex} component={component} />;
                }
            })()}

            {form.watch("type") !== "html" && form.watch("type") !== "summary" && form.watch("type") !== "stop" ? (
            <Form {...form}>
                <form className="space-y-4 pt-4">
                    <div>
                        <h3>Validation Rules</h3>
                        {fields.map((field, index) => (
                            <div key={`validationRules.${index}`} className="space-y-2 border p-2">
                                <FormField
                                    control={form.control}
                                    name={`validationRules.${index}.expression` as const}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Expression</FormLabel>
                                            <FormControl>
                                                <Input id={`validation-rule-expression-${controlIndex}-${index}`} placeholder="Validation Expression" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`validationRules.${index}.errorMessage` as const}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Error Message</FormLabel>
                                            <FormControl>
                                                <Input id={`validation-rule-error-${controlIndex}-${index}`} placeholder="Error Message" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button id={`remove-validation-rule-${controlIndex}-${index}`} className="cursor-pointer bg-red-500 text-white" type="button" onClick={() => remove(index)}>
                                    Remove Rule
                                </Button>
                            </div>
                        ))}
                        <Button id={`add-validation-rule-${controlIndex}`} className="mt-4 cursor-pointer" type="button" onClick={() => append({ id: Date.now().toString(), expression: "", errorMessage: "" })}>
                            Add Validation Rule
                        </Button>
                    </div>
                </form>
            </Form>                    
        ) : null }
        </div>
    );
})
