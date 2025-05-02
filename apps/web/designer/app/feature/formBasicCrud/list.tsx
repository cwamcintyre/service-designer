import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useFormStore from "@/store/formStore";
import { useNavigate, Link } from "react-router";
import ActionOverlay from '@/feature/common/actionOverlay';

export default function List() {
  const { isLoading, forms, getAllForms, deleteForm, createForm } = useFormStore((state) => ({
    isLoading: state.isLoading,
    forms: state.forms,
    getAllForms: state.getAllForms,
    deleteForm: state.deleteForm,
    createForm: state.createForm
  }));

  const navigate = useNavigate();

  useEffect(() => {
    getAllForms();
  }, []);

  const [{show, actionName}, setAction] = useState<{ show: boolean; actionName: string }>({ show: false, actionName: "" });

  useEffect(() => {
    if (isLoading) {
      setAction({ show: true, actionName: "Loading" });
    } else {
      setAction({ show: false, actionName: "" });
    }
  }, [isLoading]);

  const handleEdit = (formId: string) => {
    navigate(`/form/edit/${formId}`);
  };

  const handleDelete = async (formId: string) => {
    deleteForm(formId);    
  };

  const handleCreateForm = async () => {
    navigate(`/form/edit/new`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Forms</h1>
        <Button variant="default" className={"cursor-pointer"} onClick={handleCreateForm}>
          Create Form
        </Button>
      </div>
      {forms.length === 0 && (
        <div className="text-center text-gray-500">
          No forms available. Click "Create Form" to add a new form.
        </div>
      )}
      {forms.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (            
              <TableRow key={form.formId}>
                <TableCell>{form.formId}</TableCell>
                <TableCell>{form.title}</TableCell>
                <TableCell>{form.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link to={`${import.meta.env.VITE_APP_RUNNER_URL}/form/${form.formId}/start`} target="_blank">
                      <Button variant="outline" className="cursor-pointer">
                        Go
                      </Button>
                    </Link>
                    <Button variant="outline" className={"cursor-pointer"} onClick={() => handleEdit(form.formId)}>
                      Edit
                    </Button>
                    <Button variant="destructive" className={"cursor-pointer"} onClick={() => handleDelete(form.formId)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <ActionOverlay show={show} action={actionName} />
    </div>
  );
}