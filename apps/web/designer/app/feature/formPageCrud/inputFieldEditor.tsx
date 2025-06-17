// TODO: this control is getting a bit messy with having to consider options and date parts as conditionals. 
// refactor this into separate components for each type of input field.

import { type Component, type Option, type DateValidationRule, type DateComponent } from '@model/formTypes';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDown } from "lucide-react"
import DateValidationPicker from '@/components/ui/dateValidationPicker';

const selector = (state: FormState) => ({
    updatePageComponent: state.updatePageComponent
});

export default forwardRef(function InputFieldEditor({ component }: { component: Component; }, ref: any) {

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
        dateValidationRules: z
            .array(
                z.object({
                    id: z.string(),
                    errorMessage: z.string().min(1, { message: "Error message cannot be empty" }),
                    comparisonType: z.string().optional(),
                    fixedDate: z.date({ coerce: true }).optional().nullable(),
                    fixedDateId: z.string().optional(),
                    startDate: z.date({ coerce: true }).optional().nullable(),
                    endDate: z.date({ coerce: true }).optional().nullable(),
                    startDateId: z.string().optional(),
                    endDateId: z.string().optional(),
                })
            )
            .optional(),
        dateName: z.string().min(1, { message: "Date name cannot be empty" })
    });

    const getDefaultValues = () => {
        const baseValues = {
            label: component?.label || "Enter label...",
            name: component?.name || "Enter data name...",
            hint: component?.hint || "",
            labelIsPageTitle: component?.labelIsPageTitle || false,
            options: component?.options || []            
        }

        if (component.type === "dateParts") {
            return {
                ...baseValues,
                dateValidationRules: (component as DateComponent)?.dateValidationRules || [],
                dateName: (component as DateComponent)?.dateName || ""
            };
        }

        return baseValues;
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: getDefaultValues(),
    });

    const { fields: optionFields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    });

    const { 
        fields: dateValidationFields, 
        append: appendDateValidation, 
        remove: removeDateValidation 
    } = useFieldArray({
        control: form.control,
        name: "dateValidationRules",
    });    
    
    useEffect(() => {
        if (component) {
            form.reset({
                label: component.label ? component.label : "",
                name: component.name ? component.name : "",
                hint: component.hint || "",
                labelIsPageTitle: component?.labelIsPageTitle || false,
                options: component.options?.map((opt) => ({ id: opt.id, label: opt.label, value: opt.value })) || [],
                dateValidationRules: (component as DateComponent)?.dateValidationRules || [],
                dateName: (component as DateComponent)?.dateName || ""
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
                    JSON.stringify(component.options) !== JSON.stringify(values.options) ||
                    JSON.stringify((component as DateComponent)?.dateValidationRules) !== JSON.stringify(values.dateValidationRules) ||
                    (component.type === "dateParts" && (component as DateComponent)?.dateName !== values.dateName);

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
                            ...(component.type === "dateParts" && {
                                dateValidationRules: values.dateValidationRules,
                                dateName: values.dateName
                            }),
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
        <div>
            <Form {...form}>
                <form className="space-y-4">
                <Collapsible defaultOpen={true}>
                    <div className="flex items-center gap-4">
                        <h4 className="text-sm font-semibold">
                            General
                        </h4>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                                <ChevronsUpDown />
                                <span className="sr-only">Toggle</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                        <FormField
                            control={form.control}
                            name="labelIsPageTitle"
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 py-4">
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
                                <FormItem className="py-4">
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
                                <FormItem className="py-4">
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
                                <FormItem className="py-4">
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
                        { component.type === "dateParts" && (
                            <FormField
                                control={form.control}
                                name="dateName"
                                render={({ field }) => (
                                    <FormItem className="py-4">
                                        <FormLabel>Date Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Date Name" 
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e); // Ensure input can still be typed in
                                                    form.trigger("dateName");
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        </CollapsibleContent>
                    </Collapsible>
                    {(component.type === "radio" || component.type === "select" || component.type === "checkbox") && (
                        <Collapsible>
                            <div className="flex items-center gap-4">
                                <h4 className="text-sm font-semibold">
                                    Options
                                </h4>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="icon" className="size-8">
                                        <ChevronsUpDown />
                                        <span className="sr-only">Toggle</span>
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
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
                            </CollapsibleContent>
                        </Collapsible>
                    )}        
                    {component.type === "dateParts" && (
                        <Collapsible>
                            <div className="flex items-center gap-4">
                                <h4 className="text-sm font-semibold">
                                    Date Specific Validation Rules
                                </h4>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="icon" className="size-8">
                                        <ChevronsUpDown />
                                        <span className="sr-only">Toggle</span>
                                    </Button>
                                </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                                <div key={`date-validation-content-${component.questionId}`}>                                  
                                    {dateValidationFields.map((field, index) => (
                                        <div key={`dateValidation-${index}`} className="mb-6 border border-gray-200 p-4 rounded-md">
                                            <DateValidationPicker
                                                id={`dateValidation-${index}`}
                                                form={form}
                                                index={index}
                                            />
                                            <div className="flex justify-between items-center mb-4">
                                                <Button 
                                                    className="cursor-pointer bg-red-500 text-white" 
                                                    type="button" 
                                                    onClick={() => removeDateValidation(index)}
                                                >
                                                    Remove
                                                </Button>
                                            </div>                                        
                                        </div>
                                    ))}                                
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            // Create a new validation rule with a stable ID
                                            const newRuleId = nanoid();
                                            appendDateValidation({ 
                                                id: newRuleId, 
                                                errorMessage: "Please enter a valid date",
                                                comparisonType: undefined,
                                                fixedDate: undefined,
                                                fixedDateId: undefined,
                                                startDate: undefined,
                                                endDate: undefined,
                                                startDateId: undefined,
                                                endDateId: undefined
                                            });
                                        }}
                                        className="mt-4 cursor-pointer"
                                    >
                                        Add Date Validation Rule
                                    </Button>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    )}
                </form>
            </Form>
        </div>
    );
});