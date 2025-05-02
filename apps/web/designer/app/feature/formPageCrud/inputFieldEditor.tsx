import { type Component, type Option } from '../../store/formTypes';
import { z } from "zod";
import { nanoid } from 'nanoid';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import useFormStore, { type FormState } from '@/store/formStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, forwardRef, useImperativeHandle } from "react";
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
import { Button } from "@/components/ui/button";

const selector = (state: FormState) => ({
    updatePageComponent: state.updatePageComponent
});

export default forwardRef(function InputFieldEditor({ controlIndex, component }: { controlIndex: number; component: Component; }, ref: any) {

    const { updatePageComponent } = useFormStore(useShallow(selector));

    const formSchema = z.object({
        label: z.string().min(2, { message: "Label must be at least 2 characters long" }).max(100, { message: "Label must be at most 100 characters long" }),
        name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(50, { message: "Name must be at most 50 characters long" }),
        labelIsPageTitle: z.boolean(),
        hint: z.string().optional(),
        options: z
            .array(
                z.object({
                    id: z.string(),
                    label: z.string().min(1, { message: "Option label cannot be empty" }),
                    value: z.string().min(1, { message: "Option value cannot be empty" }),
                })
            )
            .optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            label: component?.label || "Enter label...",
            name: component?.name || "Enter data name...",
            hint: component?.hint || "",
            labelIsPageTitle: component?.labelIsPageTitle || false,
            options: component?.options || [],
        },
    });

    const { fields: optionFields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    });

    useEffect(() => {
        if (component) {
            form.reset({
                label: component.label ? component.label : "",
                name: component.name ? component.name : "",
                hint: component.hint || "",
                labelIsPageTitle: component?.labelIsPageTitle || false,
                options: component.options?.map((opt) => ({ id: opt.id, label: opt.label, value: opt.value })) || [],
            });
        }
        form.trigger();
    }, [component, form]);

    useEffect(() => {
        const subscription = form.watch((values) => {
            if (form.formState.isValid && component) {
                const isDifferent =
                    component.label !== values.label ||
                    component.name !== values.name ||
                    component.hint !== values.hint ||
                    component.labelIsPageTitle !== values.labelIsPageTitle ||
                    JSON.stringify(component.options) !== JSON.stringify(values.options);

                if (isDifferent) {
                    updatePageComponent(
                        component.questionId,
                        {
                            ...component,
                            label: values.label,
                            name: values.name,
                            hint: values.hint,
                            labelIsPageTitle: values.labelIsPageTitle === undefined ? false : values.labelIsPageTitle,
                            options: values.options?.map((opt) => ({
                              id: opt?.id || nanoid(),
                              label: opt?.label || "",
                              value: opt?.value || ""
                            })) || [],
                        }
                    );
                }
            }
        });
        return () => subscription.unsubscribe();
    }, [form, component]);
    
    const onNoop = (data: any) => {
      //console.log("inputFieldEditor submit noop");              
    };

    useImperativeHandle(ref, () => ({
      async getComponentState() {
          await form.trigger();
          await form.handleSubmit((data) => onNoop(data))();
          return form.control._formState.isValid;
      }
    }));

    return (
        <div className="bg-white p-4">
            <Form {...form}>
                <form className="space-y-4">
                    <FormField
                        control={form.control}
                        name="labelIsPageTitle"
                        render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <input type="checkbox" checked={field.value}                                         
                                       onChange={(e) => {
                                            field.onChange(e); // Ensure input can still be typed in
                                            form.trigger("labelIsPageTitle");
                                        }}
                                />
                                <label htmlFor="labelIsPageTitle">Label is Page Title</label>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="label"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Label</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Label" {...field}
                                        onChange={(e) => {
                                            field.onChange(e); // Ensure input can still be typed in
                                            form.trigger("label");
                                        }}
                                     />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Name" {...field}
                                        onChange={(e) => {
                                            field.onChange(e); // Ensure input can still be typed in
                                            form.trigger("name");
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="hint"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hint</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        placeholder="Hint" {...field} 
                                        onChange={(e) => {
                                            field.onChange(e); // Ensure input can still be typed in
                                            form.trigger("hint");
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {(component.type === "radio" || component.type === "select" || component.type === "checkbox") && (
                        <div>
                            <h3>Options</h3>
                            {optionFields.map((field, index) => (
                                <div key={`options.${index}`} className="flex items-center space-x-4 pt-4">
                                    <FormField
                                        control={form.control}
                                        name={`options.${index}.label` as const}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        key={`options.${index}.label`}
                                                        placeholder="Label"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            form.trigger(`options.${index}.label`);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`options.${index}.value` as const}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        key={`options.${index}.value`}
                                                        placeholder="Value"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e);
                                                            form.trigger(`options.${index}.value`);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button className="cursor-pointer bg-red-500 text-white" type="button" onClick={() => remove(index)}>
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={() => append({ id: nanoid(), label: "Enter label..", value: "Enter value.." })}
                                className="mt-4 cursor-pointer"
                            >
                                Add Option
                            </Button>
                        </div>
                    )}
                </form>
            </Form>
        </div>
    );
});