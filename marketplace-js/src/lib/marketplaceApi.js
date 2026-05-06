import axios from 'axios';
import demoMarketplaceApi from './demoMarketplaceApi';
const TOKEN_KEY = 'signal-market-token';
const API_BASE = import.meta.env.VITE_API_URL || (window.location.hostname === 'ahmed-abulfateh.github.io' ? 'https://marketplace-api.onrender.com' : '');
let runtimeMode = API_BASE ? 'remote' : 'demo';
const isJwtToken = (token) => typeof token === 'string' && token.split('.').length === 3;
const readToken = () => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (API_BASE && token && !isJwtToken(token)) {
        window.localStorage.removeItem(TOKEN_KEY);
        return null;
    }
    return token;
};
const writeToken = (token) => {
    if (token) {
        window.localStorage.setItem(TOKEN_KEY, token);
        return;
    }
    window.localStorage.removeItem(TOKEN_KEY);
};
const shouldUseDemoFallback = (error) => {
    if (!API_BASE) {
        return true;
    }
    const message = error instanceof Error ? error.message : String(error ?? '');
    return /Could not reach|Request failed: 404|Request failed: 5\d\d|Failed to fetch|Load failed|Network Error|timeout/i.test(message);
};
const runWithFallback = async (remoteOperation, demoOperation) => {
    if (!API_BASE || runtimeMode === 'demo') {
        runtimeMode = 'demo';
        return demoOperation();
    }
    try {
        const result = await remoteOperation();
        runtimeMode = 'remote';
        return result;
    }
    catch (error) {
        if (shouldUseDemoFallback(error)) {
            runtimeMode = 'demo';
            return demoOperation();
        }
        throw error;
    }
};
const getMarketplaceRuntimeInfo = () => ({ mode: runtimeMode, apiBase: API_BASE });
const apiClient = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});
apiClient.interceptors.request.use((config) => {
    const token = readToken();
    const headers = config.headers ?? {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    else {
        delete headers.Authorization;
    }
    config.headers = headers;
    return config;
});
const request = async (path, init) => {
    try {
        const response = await apiClient({
            url: path,
            method: init?.method,
            data: init?.body,
            headers: init?.headers,
        });
        return response.data;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const errorBody = error.response.data;
                if (typeof errorBody?.message === 'string') {
                    throw new Error(errorBody.message);
                }
                throw new Error(`Request failed: ${error.response.status}`);
            }
            throw new Error('Could not reach the marketplace server. Check that the backend is running and try again.');
        }
        throw error;
    }
};
const marketplaceApi = {
    getStore: async () => runWithFallback(async () => {
        const response = await request('/api/bootstrap');
        return response.store;
    }, () => demoMarketplaceApi.getStore()),
    signIn: async (payload) => runWithFallback(async () => {
        const response = await request('/api/auth/sign-in', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        writeToken(response.token);
        return response.store;
    }, async () => {
        const response = await demoMarketplaceApi.signIn(payload);
        return response.store;
    }),
    signUp: async (payload) => runWithFallback(async () => {
        const response = await request('/api/auth/sign-up', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        writeToken(response.token);
        return response.store;
    }, async () => {
        const response = await demoMarketplaceApi.signUp(payload);
        return response.store;
    }),
    signOut: async () => runWithFallback(async () => {
        writeToken(null);
        const response = await request('/api/bootstrap');
        return response.store;
    }, () => demoMarketplaceApi.signOut()),
    updateProfile: async (payload) => runWithFallback(async () => {
        const response = await request('/api/profile', {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
        return response.store;
    }, () => demoMarketplaceApi.updateProfile(payload)),
    toggleFavorite: async (listingId) => runWithFallback(async () => {
        const response = await request(`/api/favorites/${listingId}/toggle`, {
            method: 'POST',
        });
        return response.store;
    }, () => demoMarketplaceApi.toggleFavorite(listingId)),
    toggleCart: async (listingId) => runWithFallback(async () => {
        const response = await request(`/api/cart/${listingId}/toggle`, {
            method: 'POST',
        });
        return response.store;
    }, () => demoMarketplaceApi.toggleCart(listingId)),
    createListing: async (payload) => runWithFallback(async () => {
        const response = await request('/api/listings', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return response.store;
    }, () => demoMarketplaceApi.createListing(payload)),
    updateListing: async (listingId, payload) => runWithFallback(async () => {
        const response = await request(`/api/listings/${listingId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
        return response.store;
    }, () => demoMarketplaceApi.updateListing(listingId, payload)),
    deleteListing: async (listingId) => runWithFallback(async () => {
        const response = await request(`/api/listings/${listingId}`, {
            method: 'DELETE',
        });
        return response.store;
    }, () => demoMarketplaceApi.deleteListing(listingId)),
    updateListingStatus: async (listingId, status) => runWithFallback(async () => {
        const response = await request(`/api/listings/${listingId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        return response.store;
    }, () => demoMarketplaceApi.updateListingStatus(listingId, status)),
    addModerationNote: async (listingId, note) => runWithFallback(async () => {
        const response = await request(`/api/listings/${listingId}/notes`, {
            method: 'POST',
            body: JSON.stringify({ note }),
        });
        return response.store;
    }, () => demoMarketplaceApi.addModerationNote(listingId, note)),
    advanceOrderStatus: async (orderId, status) => runWithFallback(async () => {
        const response = await request(`/api/orders/${orderId}/advance`, {
            method: 'PATCH',
            body: JSON.stringify(status ? { status } : {}),
        });
        return response.store;
    }, () => demoMarketplaceApi.advanceOrderStatus(orderId, status)),
    sendOrderMessage: async (orderId, text) => runWithFallback(async () => {
        const response = await request(`/api/orders/${orderId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ text }),
        });
        return response.store;
    }, () => demoMarketplaceApi.sendOrderMessage(orderId, text)),
    addListingReview: async (listingId, payload) => runWithFallback(async () => {
        const response = await request(`/api/listings/${listingId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return response.store;
    }, () => demoMarketplaceApi.addListingReview(listingId, payload)),
    updateSellerStatus: async (userId, status) => runWithFallback(async () => {
        const response = await request(`/api/admin/sellers/${userId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        return response.store;
    }, () => demoMarketplaceApi.updateSellerStatus(userId, status)),
    checkout: async (payload) => runWithFallback(() => request('/api/checkout', { method: 'POST', body: JSON.stringify(payload) }), () => demoMarketplaceApi.checkout(payload)),
    requestPasswordReset: async () => runWithFallback(() => request('/api/auth/request-password-reset', { method: 'POST' }), () => demoMarketplaceApi.requestPasswordReset()),
    resetPassword: async (token, newPassword) => runWithFallback(() => request('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
    }), () => demoMarketplaceApi.resetPassword(token, newPassword)),
};
export { getMarketplaceRuntimeInfo };
export default marketplaceApi;
