import axios from 'axios';
import type { Form } from '@/store/formTypes';

class FormService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getAllForms(): Promise<Form[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/getAllForms`);
            return response.data.forms;
        } catch (error) {
            console.error('Error fetching all forms:', error);
            throw error;
        }
    }

    async getForm(id: string): Promise<Form> {
        try {
            const response = await axios.get(`${this.baseUrl}/getForm/${id}`);
            return response.data.form;
        } catch (error) {
            console.error(`Error fetching form with id ${id}:`, error);
            throw error;
        }
    }

    async updateForm(id: string, formData: Form) {
        try {
            const request = { form: formData };
            const response = await axios.post(`${this.baseUrl}/updateForm`, request);
            return response.data;
        } catch (error) {
            console.error(`Error updating form with id ${id}:`, error);
            throw error;
        }
    }

    async createForm(formData: Form) {
        try {
            const request = { form: formData };
            const response = await axios.put(`${this.baseUrl}/createForm`, request);
            return response.data;
        } catch (error) {
            console.error('Error creating form:', error);
            throw error;
        }
    }

    async deleteForm(id: string) {
        try {
            const response = await axios.delete(`${this.baseUrl}/deleteForm/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting form with id ${id}:`, error);
            throw error;
        }
    }
}

export default FormService;