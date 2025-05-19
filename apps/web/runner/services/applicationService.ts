import { cookies } from 'next/headers';
import { nanoid } from 'nanoid';

const applicationService = {
    getApplicationId: async () => {
        const cookieStore = await cookies();
        return cookieStore.get('applicationId');
    }
}

export default applicationService;