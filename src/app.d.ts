// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}
        // interface PageState {}
        // interface Platform {}
    }

    interface Window {
        Telegram: {
            WebApp: TelegramWebApp;
        };
    }

    interface TelegramWebApp {
        initData: string;
        initDataUnsafe: {
            query_id?: string;
            user?: {
                id: number;
                first_name: string;
                last_name?: string;
                username?: string;
                language_code?: string;
            };
            auth_date: number;
            hash: string;
        };
        colorScheme: 'light' | 'dark';
        themeParams: {
            bg_color?: string;
            text_color?: string;
            hint_color?: string;
            link_color?: string;
            button_color?: string;
            button_text_color?: string;
            secondary_bg_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        MainButton: {
            text: string;
            color: string;
            textColor: string;
            isVisible: boolean;
            isActive: boolean;
            isProgressVisible: boolean;
            setText(text: string): void;
            onClick(callback: () => void): void;
            offClick(callback: () => void): void;
            show(): void;
            hide(): void;
            enable(): void;
            disable(): void;
            showProgress(leaveActive?: boolean): void;
            hideProgress(): void;
        };
        BackButton: {
            isVisible: boolean;
            onClick(callback: () => void): void;
            offClick(callback: () => void): void;
            show(): void;
            hide(): void;
        };
        HapticFeedback: {
            impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
            notificationOccurred(type: 'error' | 'success' | 'warning'): void;
            selectionChanged(): void;
        };
        close(): void;
        expand(): void;
        sendData(data: string): void;
        ready(): void;
        setHeaderColor(color: string): void;
        setBackgroundColor(color: string): void;
    }
}

export { };
