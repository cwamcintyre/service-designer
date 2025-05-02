import { 
    type Form, 
    type Page, 
    type Component, 
    type Condition, 
    type ValidationRule, 
    type Submission 
} from './formTypes';
import { nanoid } from 'nanoid';
import { createWithEqualityFn } from 'zustand/traditional';
import formUtil from '@/util/formUtil';
import FormService from '@/service/formService';
import { type Edge} from '@xyflow/react';

export type FormState = {
    isLoading: boolean;
    isLoaded: boolean;
    forms: Form[];
    form: Form;
    edges: Edge[];
    selectedPage: Page;
    isFormDirty: boolean;
    setIsLoading: (isLoading: boolean) => void;
    setIsLoaded: (isLoaded: boolean) => void;
    getAllForms: () => void;
    loadForm: (formId: string) => void;
    createForm: () => string;
    saveForm: () => Promise<void>;
    deleteForm: (formId: string) => void;
    updateLocalForm: (formId: string, updatedForm: Form) => Promise<void>;
    addPage: (id: string) => void;
    removePage: (pageId: string) => void;
    updatePage: (updatedPage: Page) => void;
    loadAndSelectPage: (formId: string, pageId: string) => void;
    resetSelectedPage: () => void;
    addPageComponent: () => void;
    updatePageComponent: (componentId: string, updatedComponent: Component) => void;
    removePageComponent: (componentId: string) => void;
    resetForm: () => void;
    receiveFormFromChat: (form: Form) => void;
};

const apiUrl = import.meta.env.VITE_APP_API_URL || (() => { throw new Error("VITE_APP_API_URL is not defined"); })();
const formService = new FormService(apiUrl);

const useStore = createWithEqualityFn<FormState>((set, get) => ({
    isLoading: false,
    isLoaded: false,
    forms: [],
    form: {} as Form,
    edges: [],
    selectedPage: { pageId: "", components: [] as Component[], conditions: [] as Condition[] } as Page,
    isFormDirty: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
    setIsLoaded: (isLoaded: boolean) => set({ isLoaded: isLoaded }),
    getAllForms: () => {
        set({ isLoading: true, isLoaded: false });
        // Fetch all forms from API or local storage
        formService.getAllForms().then((forms) => {
            set({ forms: forms, isLoading: false });
        });
    },
    createForm: () => {
        // Create form in API or local storage
        const newForm = {
            formId: 'new',
            pages: [] as Page[],
            submission: { method: '', endpoint: '' },
            isCreated: false
        } as Form;
        set({ form: newForm, isFormDirty: true });
        return newForm.formId;
    },
    deleteForm: (formId: string) => {
        set({ isLoading: true, isLoaded: false });
        formService.deleteForm(formId).then((response) => {
            set((state) => {
                const updatedForms = state.forms.filter(form => form.formId !== formId);
                return { forms: updatedForms, isLoading: false, isLoaded: true };
            });
        });
    },
    loadForm: (formId: string) => {
        
        if (formId === 'new') {
            set({ form: { formId: 'new', pages: [], submission: { method: '', endpoint: '' }, isCreated: false, title: '', description: '', startPage: '' }, isLoaded: true, isLoading: false, isFormDirty: true });
            return;
        }

        try {
            set({ isLoading: true, isLoaded: false });
            formService.getForm(formId).then((form) => {
                // ensure that pages and components all have unique IDs
                for (const page of form.pages) {
                    for (const component of page.components) {
                        if (!component.questionId) {
                            component.questionId = nanoid();
                        }
                    }
                }
                set({ form: { ...form, isCreated: true }, isLoaded: true, isLoading: false, isFormDirty: false });
            });    
        }
        catch (error) {
            console.error(`Error loading form with id ${formId}:`, error);
            set({ isLoaded: true, isLoading: false, isFormDirty: false });
            throw new Error(`Failed to load form with id ${formId}`);
        }
    },
    saveForm: async () => {
        const { form } = get();
        if (form.isCreated) {
            const response = await formService.updateForm(form.formId, form);
            set({ form: { ...form, isCreated: true }, isFormDirty: false, isLoading: false });
        } else {
            const response = await formService.createForm(form);
            set({ form: { ...form, isCreated: true }, isFormDirty: false, isLoading: false });
        }
    },
    updateLocalForm: async (formId: string, updatedForm: Form) => {        
        set((state) => {
            const updatedForms = state.forms.map(form => 
                form.formId === formId ? { ...form, ...updatedForm } : form
            );
            return { forms: updatedForms, form: { ...updatedForm, isCreated: true }, isFormDirty: true };
        });
    },
    addPage: (id: string) => {
        set((state) => {
            const newPage = { id: id, pageId: id, pageType: 'default', components: [] };
            return { form: { ...state.form, pages: [...state.form.pages, newPage] }, isFormDirty: true };
        });
    },
    removePage: (pageId: string) => {
        set((state) => {
            const updatedPages = state.form.pages.filter(page => page.pageId !== pageId);
            return { form: { ...state.form, pages: updatedPages }, isFormDirty: true };
        });
    },
    updatePage: (updatedPage: Page) => {
        if (get().isLoaded) {
            set((state) => {
                const update = { ...state.selectedPage, ...updatedPage };             
                return { selectedPage: update, isFormDirty: true };
            });
        }
    },
    loadAndSelectPage: (formId: string, pageId: string) => {
        set({ isLoading: true, isLoaded: false });
        formService.getForm(formId).then((form) => {
            const selectedPage = form.pages.find(page => page.pageId === pageId) || { id: "", pageId: "", components: [] as Component[], conditions: [] as Condition[] };
            const { edges } = formUtil.getFormGraph(form);        
            set({ form: form, selectedPage: selectedPage, edges: edges, isLoading: false, isLoaded: true, isFormDirty: false });
        });
    },
    resetSelectedPage: () => {
        set({ selectedPage: { id: "", pageId: "", components: [] as Component[], conditions: [] as Condition[] } });
    },
    addPageComponent: () => {
        set((state) => {
            const newComponent = { questionId: nanoid(), type: 'text', labelIsPageTitle: false, name: "Enter data name...", label: "Enter label...", validationRules: [] };
            const updatedPage = { ...state.selectedPage, components: [...state.selectedPage.components, newComponent] }
            return { selectedPage: updatedPage, isFormDirty: true };
        });
    },
    updatePageComponent: (componentId: string, updatedComponent: Component) => {
        set((state) => {
            const updatedPage = { 
                ...state.selectedPage,
                components: state.selectedPage.components.map(component => 
                    component.questionId === componentId ? { ...component, ...updatedComponent } : component
                ) 
            }
            return { selectedPage: updatedPage, isFormDirty: true };
        });
    },
    removePageComponent: (componentId: string) => {
        set((state) => {
            const updatedPage = { 
                ...state.selectedPage,
                components: state.selectedPage.components.filter(component => component.questionId !== componentId)
            }
            return { selectedPage: updatedPage, isFormDirty: true };
        });
    },
    resetForm: () => {
        set({ form: {} as Form });
    },
    receiveFormFromChat: (form: Form) => {
        set({ form: { ...form, isCreated: false }, isFormDirty: true, isLoading: false });
    }
}));

export default useStore;

