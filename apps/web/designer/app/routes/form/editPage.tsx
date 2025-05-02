import { type Component, type Condition } from '@/store/formTypes';
import { SplitPane } from '@rexxars/react-split-pane';
import { useState, useEffect, useRef, use } from "react";
import FormEditor from '../../feature/formPageCrud/formEditor';
import FormPreview from '../..//feature/formPageCrud/formPreview';
import useFormStore, { type FormState } from "../../store/formStore";
import { useShallow } from "zustand/react/shallow";
import { useNavigate } from "react-router";
import { type Page } from '../../store/formTypes';
import formUtil from '@/util/formUtil';
import useWindowWidth from '@/util/windowWidth';
import ActionOverlay from '@/feature/common/actionOverlay';

const selector = (state: FormState) => ({
  isLoading: state.isLoading,
  isFormDirty: state.isFormDirty,
  form: state.form,
  edges: state.edges,
  selectedPage: state.selectedPage,
  saveForm: state.saveForm,
  resetForm: state.resetForm,
  loadAndSelectPage: state.loadAndSelectPage,
  updateLocalForm: state.updateLocalForm,
});

export default function EditPage({ params }: { params: { formId: string, pageId: string } }) {
  
  const [paneSize, setPaneSize] = useState(500);
  const [showPreview, setShowPreview] = useState(true);
  const width = useWindowWidth();

  const handleTogglePreview = () => {
    
    if (!showPreview) {
      setPaneSize(500);
    }
    else {  
      setPaneSize(width);
    }

    setShowPreview(prev => !prev);
  };

  const {
    isLoading, 
    isFormDirty,
    form, 
    edges,
    selectedPage,
    saveForm, 
    resetForm, 
    loadAndSelectPage, 
    updateLocalForm } = useFormStore(
                              useShallow(selector)
  );

  const [{show, actionName}, setAction] = useState<{ show: boolean; actionName: string }>({ show: false, actionName: "" });

  const { formId, pageId } = params;

  useEffect(() => {
    loadAndSelectPage(formId, pageId);
  }, [formId, pageId]);

  useEffect(() => {    
    if (isLoading) {
      setAction({ show: true, actionName: "Loading" });
    } else {
      setAction({ show: false, actionName: "" });
    }
  }, [isLoading]);

  const navigate = useNavigate();

  const detailForm = useRef<any>(null);

  const handleSave = async () => {
    const validIndicators = await detailForm.current.submit();
    if (validIndicators && validIndicators.every((v: boolean) => v || v === undefined)) {
        setAction({ show: true, actionName: "Saving" });
        const newForm = {
            ...form,
            pages: form.pages.map(page => page.pageId === pageId ? { ...page, ...selectedPage } : page)
        }
        // need to reconnect in case the pageId has changed...
        formUtil.connectPages(edges, newForm);
        updateLocalForm(formId, newForm);
        await saveForm();
        setAction({ show: false, actionName: "" });
        if (pageId !== selectedPage.pageId) {
          navigate(`/form/editPage/${formId}/${selectedPage.pageId}`);
        }
    }
  };

  const handleCancel = () => {
      resetForm();    
      navigate(`/form/edit/${formId}`);
  }

  if (selectedPage.pageId) {
  return (
    <div>
      <div className="flex p-4 bg-gray-200">
        <h1 className="text-xl font-bold">Edit Page - {selectedPage?.pageId}</h1>
        <div className="flex-grow text-right space-x-4">
          <button onClick={handleTogglePreview} className="bg-black text-white px-4 py-2 rounded cursor-pointer">{showPreview ? "Hide" : "Show"} Preview</button>
          { isFormDirty ?
          <> 
          <button onClick={async (e) => await handleSave()} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">Save</button>
          <button onClick={handleCancel} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">Cancel</button>
          </>
          : 
          <button onClick={handleCancel} className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">Done</button>
          }
        </div>
      </div>
      <SplitPane
          split="vertical"
          minSize={200}
          defaultSize={paneSize}
          onChange={(size) => setPaneSize(size)}
          style={{top: "72px", height: "calc(100vh - 72px)", width: "100vw"}}
      >
          <div className="h-full overflow-y-auto" style={{ width: paneSize }}>
            <FormEditor ref={detailForm} page={selectedPage} />
          </div>
          <div className="properties-pane h-full overflow-y-auto">
            <FormPreview page={selectedPage} />
          </div>
      </SplitPane>
      <ActionOverlay show={show} action={actionName} />
    </div>
  );
  } else {      
    return (
      <ActionOverlay show={show} action={actionName} />
    );
  }
}