import type { LayoutServerLoad } from './$types';
import { fetchCustomers, getHiddenCustomers } from '$lib/server/customers';

export const load: LayoutServerLoad = async () => {
    const customers = await fetchCustomers();
    const hiddenCustomers = getHiddenCustomers();
    return { customers, hiddenCustomers };
};
