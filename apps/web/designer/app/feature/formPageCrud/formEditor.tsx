import { type Page, type Form as FormData, PageTypes, type AddAnotherPage } from '@model/formTypes';
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
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import React from 'react';

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    height: isDragging ? undefined : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="border border-gray-300 relative mb-4">
      <div {...listeners} className="absolute top-5 right-5 cursor-grab pr-2" tabIndex={0} title="Drag to reorder">☰</div>
      {children}
    </div>
  );
}

export default forwardRef(function FormEditor({ page }: { page: Page }, ref: any) {
  
  const selector = (state: FormState) => ({
    addPageComponent: state.addPageComponent,
    removePageComponent: state.removePageComponent,
    swapComponents: state.swapComponents,
    updatePage: state.updatePage,
  });

  // Define a single schema that includes all possible fields
  // but make the Add Another fields optional
  const pageFormSchema = z.object({
    pageId: z.string().min(1, { message: "Page ID is required" }),
    pageType: z.string().min(1, { message: "Page Type is required" }),
    title: z.string().optional(),
    // Add Another specific fields - optional by default
    sectionTitle: z.string().min(1, { message: "Section title is required" }).optional(),
    numberOfItemsToStartWith: z.coerce.number().min(1, { message: "At least one item is required" }).optional(),
    addAnotherButtonLabel: z.string().min(1, { message: "Button label is required" }).optional(),
    answerKey: z.string().min(1, { message: "Answer key is required" }).optional(),
    answerLabel: z.string().min(1, { message: "Answer label is required" }).optional()
  })
  // Add refinement to enforce required fields when page type is MoJAddAnother
  .refine((data) => {
    if (data.pageType === PageTypes.MoJAddAnother) {
      return !!data.sectionTitle && 
             data.numberOfItemsToStartWith !== undefined && 
             !!data.addAnotherButtonLabel && 
             !!data.answerKey && 
             !!data.answerLabel;
    }
    return true;
  }, {});

  const { addPageComponent, removePageComponent, swapComponents, updatePage } = useFormStore(
    useShallow(selector)
  );

  const componentEditorRefs = useRef<(any | null)[]>([]);

  const form = useForm<z.infer<typeof pageFormSchema>>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: {
      pageId: page?.pageId || "",
      pageType: page?.pageType || "default",
      title: page?.title || "",
      ...(page.pageType === PageTypes.MoJAddAnother && (page as AddAnotherPage) && {
        sectionTitle: (page as AddAnotherPage).sectionTitle  || "",
        numberOfItemsToStartWith: (page as AddAnotherPage).numberOfItemsToStartWith || 1,
        numberOfItems: (page as AddAnotherPage).numberOfItemsToStartWith || 1,
        addAnotherButtonLabel: (page as AddAnotherPage).addAnotherButtonLabel || "",
        answerKey: (page as AddAnotherPage).answerKey || "",
        answerLabel: (page as AddAnotherPage).answerLabel || ""
      })
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      swapComponents(active.id, over.id);
    }
  };

  useEffect(() => {
      if (page) {
          form.reset({
              pageId: page?.pageId,
              pageType: page?.pageType,
              title: page?.title || "",
              ...(page.pageType === PageTypes.MoJAddAnother && (page as AddAnotherPage) && {
                sectionTitle: (page as AddAnotherPage).sectionTitle  || "",
                numberOfItemsToStartWith: (page as AddAnotherPage).numberOfItemsToStartWith || 1,
                numberOfItems: (page as AddAnotherPage).numberOfItemsToStartWith || 1,
                addAnotherButtonLabel: (page as AddAnotherPage).addAnotherButtonLabel || "",
                answerKey: (page as AddAnotherPage).answerKey || "",
                answerLabel: (page as AddAnotherPage).answerLabel || ""
              })             
          });
      }
  }, [page]);
  
  useEffect(() => {
        const subscription = form.watch((values) => {
            if (form) {
                const isDifferent =
                    page.pageId !== values.pageId ||
                    page.pageType !== values.pageType ||
                    page.title !== values.title ||
                    (page.pageType === PageTypes.MoJAddAnother && (page as AddAnotherPage) && (
                      (page as AddAnotherPage).sectionTitle !== values.sectionTitle ||
                      (page as AddAnotherPage).numberOfItemsToStartWith !== values.numberOfItemsToStartWith ||
                      (page as AddAnotherPage).addAnotherButtonLabel !== values.addAnotherButtonLabel ||
                      (page as AddAnotherPage).answerKey !== values.answerKey ||
                      (page as AddAnotherPage).answerLabel !== values.answerLabel
                    ));
                if (isDifferent) {
                    updatePage(
                        {
                            ...page,
                            pageId: values.pageId || "",
                            pageType: values.pageType || "default",
                            title: values.title || "",
                            ...(page.pageType === PageTypes.MoJAddAnother && (page as AddAnotherPage) && {
                              sectionTitle: values.sectionTitle  || "",
                              numberOfItemsToStartWith: values.numberOfItemsToStartWith || 1,
                              numberOfItems: values.numberOfItemsToStartWith || 1,
                              addAnotherButtonLabel: values.addAnotherButtonLabel || "",
                              answerKey: values.answerKey || "",
                              answerLabel: values.answerLabel || ""
                            })
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
          console.log(componentEditorRefs.current);
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
                    <SelectItem value={PageTypes.Default}>Default</SelectItem>
                    <SelectItem value={PageTypes.Summary}>Summary</SelectItem>
                    <SelectItem value={PageTypes.Stop}>Stop</SelectItem>
                    <SelectItem value={PageTypes.MoJAddAnother}>
                      MoJ Add Another
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

           {page.pageType === PageTypes.MoJAddAnother && (
            <>
              <FormField
                control={form.control}
                name="sectionTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section Title</FormLabel>
                    <FormControl>
                      <Input id={"input-section-title"} placeholder="Section Title" {...field} onChange={(e) => {
                        field.onChange(e);
                        form.trigger("sectionTitle");
                      }}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numberOfItemsToStartWith"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Items to Start With</FormLabel>
                    <FormControl>
                      <Input 
                        id={"input-items-to-start"} 
                        type="number" 
                        placeholder="Number of Items" 
                        {...field} 
                        onChange={(e) => {
                          // Convert string to number
                          field.onChange(parseInt(e.target.value) || 1);
                          form.trigger("numberOfItemsToStartWith");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="addAnotherButtonLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Add Another Button Label</FormLabel>
                    <FormControl>
                      <Input id={"input-button-label"} placeholder="Button Label" {...field} onChange={(e) => {
                        field.onChange(e);
                        form.trigger("addAnotherButtonLabel");
                      }}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answerKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer Key</FormLabel>
                    <FormControl>
                      <Input id={"input-answer-key"} placeholder="Answer Key" {...field} onChange={(e) => {
                        field.onChange(e);
                        form.trigger("answerKey");
                      }}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answerLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer Label</FormLabel>
                    <FormControl>
                      <Input id={"input-answer-label"} placeholder="Answer Label" {...field} onChange={(e) => {
                        field.onChange(e);
                        form.trigger("answerLabel");
                      }}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </>
          )}          
        </form>
      </Form>

      <div className="pt-4">
        <h2 className="text-lg font-medium pb-4">Content</h2>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <SortableContext items={page.components.map((c) => c.questionId)}>
            {page.components.map((component, index) => (
              <SortableItem key={component.questionId} id={component.questionId}>
                <div className="p-4 mb-4">
                  <ComponentEditor
                    ref={(el: HTMLElement) => {
                      componentEditorRefs.current[index] = el;
                    }}
                    controlIndex={index}
                    component={component}
                    pageId={page.pageId}
                  />
                  <Separator className="my-4" />
                  <Button
                    id={`remove-component-${index}`}
                    className="cursor-pointer bg-red-500 text-white"
                    type="button"
                    onClick={() => {
                      removePageComponent(component.questionId);
                    }}
                  >
                    Remove Component
                  </Button>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
        <Button
          id={"add-component"}
          className="cursor-pointer"
          type="button"
          onClick={() => addPageComponent()}
        >
          Add Component
        </Button>
      </div>
    </div>
  );
});