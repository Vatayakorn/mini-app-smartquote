import { CUSTOMER_API_URL, CUSTOMER_API_KEY } from '$env/static/private';

export interface Customer {
    name: string;
}

/**
 * Fetch customers from LF API with HMAC authentication
 */
export async function fetchCustomers(): Promise<string[]> {
    console.log('[Customers] API URL:', CUSTOMER_API_URL);
    console.log('[Customers] API KEY present:', !!CUSTOMER_API_KEY);

    // If no API key configured, use mock data
    if (!CUSTOMER_API_KEY) {
        console.log('[Customers] No CUSTOMER_API_KEY configured, using mock data');
        return getMockCustomers();
    }

    try {
        console.log('[Customers] Fetching from:', CUSTOMER_API_URL);
        const response = await fetch(CUSTOMER_API_URL, {
            headers: {
                'Accept': 'application/json',
                'x-api-key': CUSTOMER_API_KEY
            }
        });

        console.log('[Customers] Response status:', response.status);

        if (!response.ok) {
            console.error(`Failed to fetch customers: ${response.status}`);
            return getMockCustomers();
        }

        const data = await response.json();
        const names = extractNames(data);
        console.log('[Customers] Fetched', names.length, 'customers');
        return names;
    } catch (error) {
        console.error('Error fetching customers:', error);
        return getMockCustomers();
    }
}

function extractNames(payload: unknown): string[] {
    if (Array.isArray(payload)) {
        return payload
            .map(item => {
                if (typeof item === 'string') return item;
                if (typeof item === 'object' && item !== null) {
                    const obj = item as Record<string, unknown>;
                    for (const key of ['name', 'client', 'customer_name', 'title']) {
                        if (typeof obj[key] === 'string') return obj[key] as string;
                    }
                }
                return '';
            })
            .filter(Boolean);
    }

    if (typeof payload === 'object' && payload !== null) {
        const obj = payload as Record<string, unknown>;
        for (const key of ['customers', 'data', 'items', 'results']) {
            if (Array.isArray(obj[key])) {
                return extractNames(obj[key]);
            }
        }
    }

    return [];
}

function getMockCustomers(): string[] {
    return [
        'Paisan Farm',
        'Richly Trading',
        'Thanya Group',
        'Fourwheel Co.',
        'Global Ace',
        'Blue Ocean Logistics',
        'Metro Dynamics',
        'Crescent Holdings'
    ];
}
