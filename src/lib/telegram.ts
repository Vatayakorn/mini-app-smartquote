/**
 * Telegram WebApp SDK wrapper
 */

export function getTelegramWebApp(): TelegramWebApp | null {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        return window.Telegram.WebApp;
    }
    return null;
}

export function initTelegramApp(): TelegramWebApp | null {
    const webApp = getTelegramWebApp();
    if (webApp) {
        webApp.ready();
        webApp.expand();

        // Apply theme colors
        if (webApp.themeParams.bg_color) {
            document.documentElement.style.setProperty('--tg-theme-bg-color', webApp.themeParams.bg_color);
        }
        if (webApp.themeParams.text_color) {
            document.documentElement.style.setProperty('--tg-theme-text-color', webApp.themeParams.text_color);
        }
        if (webApp.themeParams.hint_color) {
            document.documentElement.style.setProperty('--tg-theme-hint-color', webApp.themeParams.hint_color);
        }
        if (webApp.themeParams.button_color) {
            document.documentElement.style.setProperty('--tg-theme-button-color', webApp.themeParams.button_color);
        }
        if (webApp.themeParams.secondary_bg_color) {
            document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', webApp.themeParams.secondary_bg_color);
        }
    }
    return webApp;
}

export function getInitData(): string {
    const webApp = getTelegramWebApp();
    return webApp?.initData || '';
}

export function getUserId(): number | null {
    const webApp = getTelegramWebApp();
    return webApp?.initDataUnsafe?.user?.id || null;
}

export function getUserName(): string {
    const webApp = getTelegramWebApp();
    const user = webApp?.initDataUnsafe?.user;
    if (!user) return 'Guest';
    return user.first_name + (user.last_name ? ` ${user.last_name}` : '');
}

export function sendDataToBot(data: object): void {
    const webApp = getTelegramWebApp();
    if (webApp) {
        webApp.sendData(JSON.stringify(data));
    } else {
        console.log('[Dev Mode] Would send to bot:', data);
    }
}

export function closeApp(): void {
    const webApp = getTelegramWebApp();
    if (webApp) {
        webApp.close();
    }
}

export function hapticFeedback(type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' | 'selection'): void {
    const webApp = getTelegramWebApp();
    if (!webApp?.HapticFeedback) return;

    if (type === 'selection') {
        webApp.HapticFeedback.selectionChanged();
    } else if (['success', 'error', 'warning'].includes(type)) {
        webApp.HapticFeedback.notificationOccurred(type as 'success' | 'error' | 'warning');
    } else {
        webApp.HapticFeedback.impactOccurred(type as 'light' | 'medium' | 'heavy');
    }
}

export function isInTelegram(): boolean {
    return getTelegramWebApp() !== null;
}
