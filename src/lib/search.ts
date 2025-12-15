/**
 * Fuzzy search utility using Fuse.js
 */
import Fuse from 'fuse.js';

export interface SearchResult {
    item: string;
    score: number;
}

let fuse: Fuse<string> | null = null;

export function initSearch(customers: string[]): void {
    fuse = new Fuse(customers, {
        threshold: 0.4,
        distance: 100,
        minMatchCharLength: 1,
        includeScore: true
    });
}

export function searchCustomers(query: string, customers: string[], limit: number = 10): string[] {
    if (!query.trim()) {
        return customers.slice(0, limit);
    }

    if (!fuse) {
        initSearch(customers);
    }

    const results = fuse!.search(query, { limit });
    return results.map(r => r.item);
}

// Local storage keys
const RECENT_KEY = 'btz_recent_customers';
const MAX_RECENT = 5;

export function getRecentCustomers(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(RECENT_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function addRecentCustomer(name: string): void {
    if (typeof window === 'undefined') return;
    try {
        let recent = getRecentCustomers();
        recent = recent.filter(n => n.toLowerCase() !== name.toLowerCase());
        recent.unshift(name);
        recent = recent.slice(0, MAX_RECENT);
        localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    } catch {
        // ignore storage errors
    }
}

export function clearRecentCustomers(): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(RECENT_KEY);
    } catch {
        // ignore
    }
}

// Favorite customers storage
const FAVORITES_KEY = 'btz_favorite_customers';

export function getFavoriteCustomers(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

export function addFavoriteCustomer(name: string): void {
    if (typeof window === 'undefined') return;
    try {
        let favorites = getFavoriteCustomers();
        if (!favorites.some(n => n.toLowerCase() === name.toLowerCase())) {
            favorites.push(name);
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        }
    } catch {
        // ignore storage errors
    }
}

export function removeFavoriteCustomer(name: string): void {
    if (typeof window === 'undefined') return;
    try {
        let favorites = getFavoriteCustomers();
        favorites = favorites.filter(n => n.toLowerCase() !== name.toLowerCase());
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
        // ignore storage errors
    }
}

export function toggleFavoriteCustomer(name: string): boolean {
    if (typeof window === 'undefined') return false;
    const favorites = getFavoriteCustomers();
    const isFavorite = favorites.some(n => n.toLowerCase() === name.toLowerCase());
    if (isFavorite) {
        removeFavoriteCustomer(name);
        return false;
    } else {
        addFavoriteCustomer(name);
        return true;
    }
}

export function isFavoriteCustomer(name: string): boolean {
    const favorites = getFavoriteCustomers();
    return favorites.some(n => n.toLowerCase() === name.toLowerCase());
}
