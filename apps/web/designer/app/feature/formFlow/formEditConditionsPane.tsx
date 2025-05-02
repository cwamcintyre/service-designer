import { forwardRef, useEffect, useState } from 'react';
import { type Node } from '@xyflow/react';
import { type Form as FormData, type Page } from "@/store/formTypes";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from 'nanoid';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

export default forwardRef(function FormEditConditionsPane({ form, selectedNode, onUpdate }: { form: FormData; selectedNode: Node; onUpdate: (updatedForm: FormData, updatedNode: Node) => void }, ref: any) {
    const [selectedPage, setSelectedPage] = useState<Page | null>(null);

    const conditionSchema = z.object({
        id: z.string(),
        label: z.string().min(1, { message: "Label is required" }),
        expression: z.string().min(1, { message: "Expression is required" })
    });

    const formSchema = z.object({
        conditions: z.array(conditionSchema),
    });

    const formMethods = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            conditions: selectedPage?.conditions || [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: formMethods.control,
        name: "conditions",
    });

    useEffect(() => {
        if (selectedNode) {
            const page = form.pages.find((page) => page.id === selectedNode.id) || null;
            setSelectedPage(page);
            formMethods.reset({ conditions: page?.conditions || [] });
        } else {
            setSelectedPage(null);
        }
    }, [selectedNode, form.pages, formMethods]);

    const handleChange = () => {
        if (selectedPage) {
            // for whatever reason, remove does not remove the item, just the values from the item..
            const newConditions = formMethods.getValues("conditions").filter((condition) => condition.id );
            const updatedPage = { ...selectedPage, conditions: newConditions };
            const updatedNode = { ...selectedNode, data: { ...selectedNode.data, conditions: newConditions } };
            onUpdate({ ...form, pages: form.pages.map((page) => (page.id === updatedPage.id ? updatedPage : page)) }, updatedNode);
        }
    };

    const onRemove = (index: number) => {
        remove(index);
        handleChange();
    }

    const onAppend = () => {
        append({ id: nanoid(), label: "", expression: "" });
        handleChange();
    }

    return (
        <div className="flex flex-col p-4">
            {selectedPage && (
                <>
                    <h2>Conditions</h2>
                    <Form {...formMethods}>
                        <form onChange={handleChange} className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={`conditions-${index}`} className="space-y-2 border p-2">
                                    <FormField
                                        control={formMethods.control}
                                        name={`conditions.${index}.label` as const}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Label</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`condition-label-${index}`}
                                                        placeholder="Condition Label"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={formMethods.control}
                                        name={`conditions.${index}.expression` as const}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Expression</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id={`condition-expression-${index}`}
                                                        placeholder="Condition Expression"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />                                    
                                    <Button
                                        type="button"
                                        className="bg-red-500 text-white"
                                        onClick={() => onRemove(index)}
                                    >
                                        Remove Condition
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                className="mt-4"
                                onClick={() => onAppend()}
                            >
                                Add Condition
                            </Button>
                        </form>
                    </Form>
                </>
            )}
        </div>
    );
});