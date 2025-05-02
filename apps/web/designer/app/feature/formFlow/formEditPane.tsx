import type { Form as FormData } from "@/store/formTypes";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, forwardRef, useImperativeHandle } from "react";

const formSchema = z.object({
    formId: z.string().min(1, { message: "Form ID is required" }),
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().optional(),
    startPage: z.string().min(1, { message: "Start Page is required" }),
    submission: z.object({
        method: z.string().min(1, { message: "Method is required" }),
        endpoint: z.string().min(1, { message: "Endpoint is required" })
    })
});

export default forwardRef(function FormEditPane({ form, isLoaded, onUpdate }: { form: FormData; isLoaded: boolean; onUpdate: (formId: string, updatedForm: FormData) => void }, ref: any) {
    
    const handleChange = (formId: string, updatedForm: FormData) => {
        onUpdate(formId, updatedForm);
    };

    const formInstance = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            formId: form.formId || "",
            title: form.title || "",
            description: form.description || "",
            startPage: form.startPage || "",
            submission: {
                method: form.submission?.method || "",
                endpoint: form.submission?.endpoint || ""
            }
        },
    });

    const { control } = formInstance;

    useEffect(() => {        
        if (form) {
            formInstance.reset({
                formId: form.formId || "",
                title: form.title || "",
                description: form.description || "",
                startPage: form.startPage || "",
                submission: {
                    method: form.submission?.method || "",
                    endpoint: form.submission?.endpoint || ""
                }
            });
            if (form.formId !== "new") {
                formInstance.trigger();
            }
        }
    }, [isLoaded]);

    useEffect(() => {
        const subscription = formInstance.watch((values) => {
            if (form) {
                const isDifferent =
                    form.formId !== values.formId ||
                    form.title !== values.title ||
                    form.description !== values.description ||
                    form.startPage !== values.startPage ||
                    form.submission?.method !== values.submission?.method ||
                    form.submission?.endpoint !== values.submission?.endpoint;
                
                if (isDifferent) {
                    handleChange(
                        form.formId,
                        {
                            ...form,
                            formId: values.formId || "",
                            title: values.title || "",
                            description: values.description || "",
                            startPage: values.startPage || "",
                            submission: {
                                method: values.submission?.method || "",
                                endpoint: values.submission?.endpoint || ""
                            }
                        }
                    );
                }                
            }
        });
        return () => subscription.unsubscribe();
    }, [form]);

    const onError = (errors: any) => {
        //console.log("FormEditPane onError", errors);
    }

    const onNoop = (data: any) => {
        //console.log("FormEditPane onNoop");
    }

    useImperativeHandle(ref, () => ({
        async submit() {
            await formInstance.trigger();            
            await formInstance.handleSubmit(onNoop, onError)();
            return formInstance;
        },
        getFormInstance() {
            return formInstance;
        }
    }));

    return (
        <div className="p-4">
            <Form {...formInstance}>
                <form className="space-y-4">
                    <FormField
                        control={control}
                        name="formId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Form ID</FormLabel>
                                <FormControl>
                                    <Input id={"form-id"} placeholder="Form ID" {...field} onChange={(e) => {
                                        field.onChange(e); // Ensure input can still be typed in
                                        formInstance.trigger("formId");
                                    }}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input id={"form-title"} placeholder="Title" {...field} {...field} onChange={(e) => {
                                        field.onChange(e); // Ensure input can still be typed in
                                        formInstance.trigger("title");
                                    }}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea id={"form-description"} placeholder="Description" {...field} onChange={(e) => {
                                        field.onChange(e); // Ensure input can still be typed in
                                        formInstance.trigger("description");
                                    }}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="startPage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Page</FormLabel>
                                <FormControl>
                                    <Input id={"form-start-page"} placeholder="Start Page" {...field} onChange={(e) => {
                                        field.onChange(e); // Ensure input can still be typed in
                                        formInstance.trigger("startPage");
                                    }}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="submission.method"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Submission Method</FormLabel>
                                <FormControl>
                                    <Input id={"form-submission-method"} placeholder="Method" {...field} onChange={(e) => {
                                        field.onChange(e); // Ensure input can still be typed in
                                        formInstance.trigger("submission.method");
                                    }}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="submission.endpoint"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Submission Endpoint</FormLabel>
                                <FormControl>
                                    <Input id={"form-submission-endpoint"} placeholder="Endpoint" {...field} onChange={(e) => {
                                        field.onChange(e); // Ensure input can still be typed in
                                        formInstance.trigger("submission.endpoint");
                                    }}/>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </div>
    );
});