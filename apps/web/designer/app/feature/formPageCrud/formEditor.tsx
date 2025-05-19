import { type Page, type Form as FormData } from '@model/formTypes';
import ComponentEditor from './componentEditor';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useFormStore, { type FormState } from "@/store/formStore";
import { useShallow } from "zustand/react/shallow";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const selector = (state: FormState) => ({
  addPageComponent: state.addPageComponent,
  removePageComponent: state.removePageComponent,
  updatePage: state.updatePage,
});

const pageFormSchema = z.object({
  pageId: z.string().min(1, { message: "Page ID is required" }),
  pageType: z.string().min(1, { message: "Page Type is required" }),
  title: z.string().optional()
});

export default forwardRef(function FormEditor({ page }: { page: Page }, ref: any) {
  
  const { addPageComponent, removePageComponent, updatePage } = useFormStore(
    useShallow(selector)
  );

  const componentEditorRefs = useRef<(any | null)[]>([]);

  const form = useForm<z.infer<typeof pageFormSchema>>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      pageId: page?.pageId || "",
      pageType: page?.pageType || "default",
      title: page?.title || ""
    },
  });

  useEffect(() => {
      if (page) {
          form.reset({
              pageId: page?.pageId,
              pageType: page?.pageType,
              title: page?.title || ""             
          });
          form.trigger();
      }
  }, [page]);
  
  useEffect(() => {
        const subscription = form.watch((values) => {
            if (form) {
                const isDifferent =
                    page.pageId !== values.pageId ||
                    page.pageType !== values.pageType ||
                    page.title !== values.title;
                if (isDifferent) {
                    updatePage(
                        {
                            ...page,
                            pageId: values.pageId || "",
                            pageType: values.pageType || "default",
                            title: values.title || ""
                        }
                    );
                }                
            }
        });
        return () => subscription.unsubscribe();
    }, [page]);

  const onNoop = (data: any) => {
      //console.log("FormEditor submit noop");              
  };

  useImperativeHandle(ref, () => ({
      async submit() {
          await form.trigger();
          await form.handleSubmit((data) => onNoop(data))();
          const validIndicators = await Promise.all(componentEditorRefs.current.map(async (ref) => {
              if (ref) {
                 const componentEditorState = await ref.getComponentEditorState();
                 return componentEditorState;
              }
              return null;
          }));
          validIndicators.push(form.control._formState.isValid);
          return validIndicators;
      }
  }));

  if (!page) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">No page selected</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium pb-4">Page details</h2>
      <Form {...form}>
        <form
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="pageId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page ID</FormLabel>
                <FormControl>
                  <Input id={"input-page-id"} placeholder="Page ID" {...field} onChange={(e) => {
                    field.onChange(e); // Ensure input can still be typed in
                    form.trigger("pageId");
                  }}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
              control={form.control}
              name="pageType"
              render={({ field }) => (
                <FormItem>
                <FormLabel>Page Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Page Type" />
                  </SelectTrigger>
                  <SelectContent id={"select-page-type"}>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="stop">Stop</SelectItem>
                    <SelectItem value="inline-repeating-page">
                    Inline Repeating Page
                    </SelectItem>
                  </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
                </FormItem>
              )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input id={"input-title"} placeholder="Title" {...field}  onChange={(e) => {
                      field.onChange(e); // Ensure input can still be typed in
                      form.trigger("title");
                    }}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
            )}
          />          
        </form>
      </Form>

      <div className="pt-4">
        <div>
          <h2 className="text-lg font-medium pb-4">Content</h2>
          {page.components.map((component, index) => (
            <div key={component.questionId} className="border border-gray-500 p-4 mb-4">
              <ComponentEditor ref={(el: HTMLElement) => { componentEditorRefs.current[index] = el; }} controlIndex={index} component={component} pageId={page.pageId} />
              <Separator className="my-4" />
              <Button
                id={`remove-component-${index}`}
                className="cursor-pointer bg-red-500 text-white"
                type="button"
                onClick={() => removePageComponent(component.questionId)}
              >
                Remove Component
              </Button>
            </div>
          ))}
        </div>        
        <Button id={"add-component"} className="cursor-pointer" type="button" onClick={() => addPageComponent()}>
          Add Component
        </Button>
      </div>
    </div>
  );
});