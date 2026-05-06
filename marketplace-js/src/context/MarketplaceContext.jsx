import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, } from 'react';
import { formatCurrency } from '../data';
import marketplaceApi from '../lib/marketplaceApi';
const MarketplaceContext = createContext(undefined);
function MarketplaceProvider({ children }) {
    const [store, setStore] = useState(null);
    const [lastCheckout, setLastCheckout] = useState(null);
    useEffect(() => {
        void marketplaceApi.getStore().then(setStore);
    }, []);
    const listings = store?.listings ?? [];
    const favoriteIds = store?.favoriteIds ?? [];
    const cartIds = store?.cartIds ?? [];
    const orders = store?.orders ?? [];
    const pendingSellers = store?.pendingSellers ?? [];
    const listingStatuses = Object.fromEntries(listings.map((listing) => [listing.id, listing.status]));
    const cartTotal = cartIds.reduce((total, listingId) => {
        const listing = listings.find((item) => item.id === listingId);
        return total + (listing?.price ?? 0);
    }, 0);
    const updateFromApi = async (operation) => {
        const nextStore = await operation;
        setStore(nextStore);
    };
    const value = {
        isReady: store !== null,
        session: store?.session ?? null,
        listings,
        favoriteIds,
        cartIds,
        cartTotal,
        listingStatuses,
        orders,
        pendingSellers,
        cartTotalLabel: formatCurrency(cartTotal),
        lastCheckout,
        signIn: async (payload) => updateFromApi(marketplaceApi.signIn(payload)),
        signUp: async (payload) => updateFromApi(marketplaceApi.signUp(payload)),
        signOut: async () => updateFromApi(marketplaceApi.signOut()),
        updateProfile: async (payload) => updateFromApi(marketplaceApi.updateProfile(payload)),
        toggleFavorite: async (listingId) => updateFromApi(marketplaceApi.toggleFavorite(listingId)),
        toggleCart: async (listingId) => updateFromApi(marketplaceApi.toggleCart(listingId)),
        checkout: async (payload) => {
            const response = await marketplaceApi.checkout(payload);
            setStore(response.store);
            setLastCheckout(response.confirmation);
            return response.confirmation;
        },
        createListing: async (payload) => updateFromApi(marketplaceApi.createListing(payload)),
        updateListing: async (listingId, payload) => updateFromApi(marketplaceApi.updateListing(listingId, payload)),
        deleteListing: async (listingId) => updateFromApi(marketplaceApi.deleteListing(listingId)),
        updateListingStatus: async (listingId, status) => updateFromApi(marketplaceApi.updateListingStatus(listingId, status)),
        addModerationNote: async (listingId, note) => updateFromApi(marketplaceApi.addModerationNote(listingId, note)),
        advanceOrderStatus: async (orderId, status) => updateFromApi(marketplaceApi.advanceOrderStatus(orderId, status)),
        sendOrderMessage: async (orderId, text) => updateFromApi(marketplaceApi.sendOrderMessage(orderId, text)),
        addListingReview: async (listingId, payload) => updateFromApi(marketplaceApi.addListingReview(listingId, payload)),
        updateSellerStatus: async (userId, status) => updateFromApi(marketplaceApi.updateSellerStatus(userId, status)),
        clearLastCheckout: () => setLastCheckout(null),
        getOrderStatusLabel: (status) => status.replace(/^./, (char) => char.toUpperCase()),
    };
    return _jsx(MarketplaceContext.Provider, { value: value, children: children });
}
const useMarketplace = () => {
    const value = useContext(MarketplaceContext);
    if (!value) {
        throw new Error('useMarketplace must be used within MarketplaceProvider');
    }
    return value;
};
export { MarketplaceProvider, useMarketplace };
