const TOKEN_KEY = 'signal-market-token';
const API_BASE = import.meta.env.VITE_API_URL || (window.location.hostname === 'ahmed-abulfateh.github.io' ? 'https://marketplace-api.onrender.com' : '');
const readToken = () => window.localStorage.getItem(TOKEN_KEY);
const writeToken = (token) => {
    if (token) {
        window.localStorage.setItem(TOKEN_KEY, token);
        return;
    }
    window.localStorage.removeItem(TOKEN_KEY);
};
const request = async (path, init) => {
    const token = readToken();
    let response;
    try {
        response = await fetch(`${API_BASE}${path}`, {
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(init?.headers ?? {}),
            },
        });
    }
    catch {
        throw new Error('Could not reach the marketplace server. Check that the backend is running and try again.');
    }
    if (!response.ok) {
        let message = `Request failed: ${response.status}`;
        try {
            const errorBody = await response.json();
            if (typeof errorBody?.message === 'string') {
                message = errorBody.message;
            }
        }
        catch {
            // Keep the fallback message when the response has no JSON body.
        }
        throw new Error(message);
    }
    return response.json();
};
const marketplaceApi = {
    getStore: async () => {
        const response = await request('/api/bootstrap');
        return response.store;
    },
    signIn: async (payload) => {
        const response = await request('/api/auth/sign-in', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        writeToken(response.token);
        return response.store;
    },
    signUp: async (payload) => {
        const response = await request('/api/auth/sign-up', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        writeToken(response.token);
        return response.store;
    },
    signOut: async () => {
        writeToken(null);
        const response = await request('/api/bootstrap');
        return response.store;
    },
    updateProfile: async (payload) => {
        const response = await request('/api/profile', {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
        return response.store;
    },
    toggleFavorite: async (listingId) => {
        const response = await request(`/api/favorites/${listingId}/toggle`, {
            method: 'POST',
        });
        return response.store;
    },
    toggleCart: async (listingId) => {
        const response = await request(`/api/cart/${listingId}/toggle`, {
            method: 'POST',
        });
        return response.store;
    },
    createListing: async (payload) => {
        const response = await request('/api/listings', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return response.store;
    },
    updateListing: async (listingId, payload) => {
        const response = await request(`/api/listings/${listingId}`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
        });
        return response.store;
    },
    deleteListing: async (listingId) => {
        const response = await request(`/api/listings/${listingId}`, {
            method: 'DELETE',
        });
        return response.store;
    },
    updateListingStatus: async (listingId, status) => {
        const response = await request(`/api/listings/${listingId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        return response.store;
    },
    addModerationNote: async (listingId, note) => {
        const response = await request(`/api/listings/${listingId}/notes`, {
            method: 'POST',
            body: JSON.stringify({ note }),
        });
        return response.store;
    },
    advanceOrderStatus: async (orderId, status) => {
        const response = await request(`/api/orders/${orderId}/advance`, {
            method: 'PATCH',
            body: JSON.stringify(status ? { status } : {}),
        });
        return response.store;
    },
    sendOrderMessage: async (orderId, text) => {
        const response = await request(`/api/orders/${orderId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ text }),
        });
        return response.store;
    },
    addListingReview: async (listingId, payload) => {
        const response = await request(`/api/listings/${listingId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
        return response.store;
    },
    updateSellerStatus: async (userId, status) => {
        const response = await request(`/api/admin/sellers/${userId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        return response.store;
    },
    checkout: async (payload) => request('/api/checkout', { method: 'POST', body: JSON.stringify(payload) }),
    requestPasswordReset: async () => request('/api/auth/request-password-reset', { method: 'POST' }),
    resetPassword: async (token, newPassword) => request('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
    }),
};
export default marketplaceApi;
