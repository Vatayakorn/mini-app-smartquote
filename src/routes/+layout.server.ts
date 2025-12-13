import type { LayoutServerLoad } from './$types';
import { fetchCustomers } from '$lib/server/customers';

export const load: LayoutServerLoad = async () => {
    const customers = await fetchCustomers();
    return { customers };
};
