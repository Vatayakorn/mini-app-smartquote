import crypto from 'crypto';
import { BOT_TOKEN } from '$env/static/private';

/**
 * Verify Telegram WebApp initData using HMAC-SHA256
 */
export function verifyTelegramInitData(initData: string): { valid: boolean; userId?: number } {
    if (!initData) {
        return { valid: false };
    }

    try {
        const params = new URLSearchParams(initData);
        const hash = params.get('hash');

        if (!hash) {
            return { valid: false };
        }

        params.delete('hash');

        // Sort parameters alphabetically
        const dataCheckString = [...params.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}=${v}`)
            .join('\n');

        // Create secret key: HMAC-SHA256 of bot token with "WebAppData"
        const secretKey = crypto
            .createHmac('sha256', 'WebAppData')
            .update(BOT_TOKEN)
            .digest();

        // Calculate hash of data check string
        const calculatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        if (calculatedHash !== hash) {
            return { valid: false };
        }

        // Extract user ID from user parameter
        const userParam = params.get('user');
        if (userParam) {
            try {
                const user = JSON.parse(userParam);
                return { valid: true, userId: user.id };
            } catch {
                return { valid: true };
            }
        }

        return { valid: true };
    } catch (error) {
        console.error('Failed to verify initData:', error);
        return { valid: false };
    }
}

/**
 * Check if user ID is in allowed operators list
 */
export function isAllowedOperator(userId: number, allowedIds: string): boolean {
    if (!allowedIds) return true; // No restriction if not configured

    const ids = allowedIds.split(',').map(id => parseInt(id.trim(), 10));
    return ids.includes(userId);
}
