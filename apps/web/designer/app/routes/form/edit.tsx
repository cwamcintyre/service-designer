import FormFlowPane from '@/feature/formFlow/formFlowPane';
import FormEditPane from '@/feature/formFlow/formEditPane';
import FormEditConditionsPane from '@/feature/formFlow/formEditConditionsPane';
import AskHumphrey from '@/feature/formFlow/askHumphrey';

import { SplitPane } from '@rexxars/react-split-pane';
import { useShallow } from 'zustand/shallow';
import useFormStore, { type FormState } from '@/store/formStore';
import useFormFlowStore, { type FormFlowState } from '@/store/formFlowStore';
import { type Node } from '@xyflow/react';
import { useEffect, useState, useRef } from 'react';
import type { Form } from '@model/formTypes';
import { useNavigate } from "react-router";
import formUtil from '@/util/formUtil';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import ActionOverlay from '@/feature/common/actionOverlay';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const selector = (state: FormState) => ({
    isLoading: state.isLoading,
    form: state.form,
    isFormDirty: state.isFormDirty,
    loadForm: state.loadForm,
    saveForm: state.saveForm,
    updateLocalForm: state.updateLocalForm,
    resetForm: state.resetForm,
    resetSelectedPage: state.resetSelectedPage,
    receiveFormFromChat: state.receiveFormFromChat,
});

const flowSelector = (state: FormFlowState) => ({
    setFlow: state.setFlow,
    updateNode: state.updateNode,
    nodes: state.nodes,
    edges: state.edges,
    isFlowDirty: state.isFlowDirty,
    isLoaded: state.isLoaded,
    selectedNode: state.selectedNode,
});

export default function FormEditPage({params}: { params: { formId: string }}) {
    const { formId } = params;
    
    const [paneSize, setPaneSize] = useState(500);
  
    const [open, setOpen] = useState(false);

    const [{show, actionName}, setAction] = useState<{ show: boolean; actionName: string }>({ show: false, actionName: "" });

    const { isFormDirty, isLoading, loadForm, saveForm, form, updateLocalForm, resetForm, resetSelectedPage, receiveFormFromChat } = useFormStore(
        useShallow(selector)
    );

    const { isFlowDirty, setFlow, updateNode, selectedNode, edges } = useFormFlowStore(
        useShallow(flowSelector)
    );

    const navigate = useNavigate();

    useEffect(() => {
        loadForm(formId);
    }, []);

    useEffect(() => {
        setAction({ show: isLoading, actionName: "Loading" });
    }, [isLoading]);

    const handleUpdateForm = (formId: string, form: Form) => {
        updateLocalForm(formId, form);
    }

    const handleUpdateCondition = (form: Form, node: Node) => {
        updateLocalForm(formId, form);
        updateNode(node);
    };

    const detailForm = useRef<any>(null);

    const handleSave = async (thenNavigate: boolean) => {
        setAction({ show: true, actionName: "Saving" });
        const formInstance = await detailForm.current?.submit();
        const formState = formInstance.control._formState;
        const data = formInstance.getValues();
        
        if (formState.isValid) {
            const newForm = {
                ...form,
                formId: data.formId,
                title: data.title,
                description: data.description,
                startPage: data.startPage,
                submission: {
                    method: data.submission.method,
                    endpoint: data.submission.endpoint
                }
            };
                        
            setOpen(false);
            
            formUtil.connectPages(edges, newForm);
            updateLocalForm(formId, newForm);
            await saveForm();            

            setAction({ show: false, actionName: "Saving" });

            if (thenNavigate) {
                navigate(`/form/editPage/${newForm.formId}/${selectedNode.data.label }`);
            }
            else if (formId !== newForm.formId) {
                navigate(`/form/edit/${newForm.formId}`);
            }
        }
        else {
            setAction({ show: false, actionName: "" });
        }
    };

    const handleCancel = () => {
        resetForm();
        setFlow([],[]);
        navigate(`/form`);
    }

    const handleEditNode = (nodeId: string) => {
        resetSelectedPage();

        if (isFormDirty || isFlowDirty) {
            setOpen(true);
            return;
        }
        
        navigate(`/form/editPage/${formId}/${selectedNode.data.label}`);
    }

    const handleReceiveForm = (form: Form) => {
        receiveFormFromChat(form);
        resetSelectedPage();
        setFlow([],[]);
        detailForm.current?.trigger();
    }

    if (form.formId) {
        return (    
            <div>
                <div className="flex p-4 bg-gray-200">
                    <h1 className="text-xl font-bold">Edit Form - {form?.title ? form.title : form?.formId }</h1>
                    <div className="flex-grow text-right space-x-4"> 
                        { isFormDirty || isFlowDirty ? 
                        <>
                        <button onClick={() => handleSave(false)} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Save</button>
                        <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">Cancel</button> 
                        </> : 
                        <button onClick={handleCancel} className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">Done</button>}
                    </div>
                </div>
                <SplitPane 
                    split="vertical"
                    minSize={200}
                    defaultSize={paneSize}
                    onChange={(size) => setPaneSize(size)}
                    style={{top: "72px", height: "calc(100vh - 72px)"}}
                >
                    <>
                        <Tabs defaultValue="properties" className="w-full h-full">
                            <TabsList>
                                <TabsTrigger value="properties">Properties</TabsTrigger>
                                <TabsTrigger value="humphrey">Humphrey</TabsTrigger>
                            </TabsList>
                            <TabsContent value="properties">
                                <FormEditPane ref={detailForm} form={form} isLoaded={isLoading} onUpdate={handleUpdateForm} />
                                <FormEditConditionsPane form={form} selectedNode={selectedNode} onUpdate={handleUpdateCondition} />
                            </TabsContent>
                            <TabsContent value="humphrey">
                                <AskHumphrey onReceiveForm={handleReceiveForm} formId={formId} />
                            </TabsContent>
                        </Tabs>
                    </>
                    <FormFlowPane form={form} onEdit={handleEditNode} />
                </SplitPane>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Save form first.</DialogTitle>
                        <DialogDescription>
                            <div>
                                You must save the form first. Do that now?
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button variant="default" onClick={async () => await handleSave(true)}>Save</Button>
                            </div>
                        </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
                <ActionOverlay show={show} action={actionName} />
            </div>
        )
    } else {
        return (
            <ActionOverlay show={show} action={actionName} />
        )
    }
}