/**
 * API client for BTZ Rate Bot backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface RateRequestData {
    client: string;
    side: 'buy' | 'sell' | 'both';
    user_id: number;
}

export interface ComsRequestData {
    client: string;
    side: 'buy' | 'sell';
    currency?: string;
    amount: number;
    rate: number;
    coms?: number;
    user_id: number;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data?: any;
}

/**
 * Send rate request to backend API
 */
export async function sendRateRequest(data: RateRequestData): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/rate-request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(error.detail || `API error: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Send COMS request to backend API
 */
export async function sendComsRequest(data: ComsRequestData): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/api/v1/coms-request`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(error.detail || `API error: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Health check
 */
export async function healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
}
