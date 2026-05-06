import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { formatDateTimeGmt3 } from '../lib/dateTime';
function SellerOrdersPage() {
    const { copy, formatCurrency, language, translateCatalogText, translateOrderStatus } = useLanguage();
    const { advanceOrderStatus, listings, orders, session } = useMarketplace();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const locationState = location.state;
    const [updatingOrderIds, setUpdatingOrderIds] = useState([]);
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [optimisticDeliveredOrderIds, setOptimisticDeliveredOrderIds] = useState([]);
    const [updateError, setUpdateError] = useState(null);
    const managedListingIds = new Set(listings.filter((listing) => listing.seller === session?.name).map((listing) => listing.id));
    const sellerOrders = orders.filter((order) => managedListingIds.has(order.listingId));
    const requestedView = searchParams.get('view');
    const activeView = requestedView && ['all', 'to-ship', 'shipped', 'delivered'].includes(requestedView)
        ? requestedView
        : 'all';
    const viewButtons = [
        { id: 'all', label: copy.sellerOrders.filters.all },
        { id: 'to-ship', label: copy.sellerOrders.filters.toShip },
        { id: 'shipped', label: copy.sellerOrders.filters.shipped },
        { id: 'delivered', label: copy.sellerOrders.filters.delivered },
    ];
    const getOrderStatus = (orderId, currentStatus) => (optimisticDeliveredOrderIds.includes(orderId) ? 'delivered' : currentStatus);
    const visibleOrders = sellerOrders.filter((order) => {
        const status = getOrderStatus(order.id, order.status);
        if (activeView === 'all') {
            return true;
        }
        if (activeView === 'to-ship') {
            return status === 'paid';
        }
        return status === activeView;
    });
    const selectableOrders = visibleOrders;
    const selectedDeliverableOrderIds = selectedOrderIds.filter((id) => selectableOrders.some((order) => order.id === id && getOrderStatus(order.id, order.status) !== 'delivered'));
    const selectedPendingOrderIds = selectedOrderIds.filter((id) => selectableOrders.some((order) => order.id === id && getOrderStatus(order.id, order.status) !== 'pending'));
    const isAllSelectableChecked = selectableOrders.length > 0 && selectableOrders.every((order) => selectedOrderIds.includes(order.id));
    const handleMarkDelivered = async (orderId) => {
        if (updatingOrderIds.length > 0) {
            return;
        }
        setUpdateError(null);
        setOptimisticDeliveredOrderIds((current) => (current.includes(orderId) ? current : [...current, orderId]));
        setUpdatingOrderIds([orderId]);
        try {
            await advanceOrderStatus(orderId, 'delivered');
            setSelectedOrderIds((current) => current.filter((id) => id !== orderId));
        }
        catch (error) {
            setOptimisticDeliveredOrderIds((current) => current.filter((id) => id !== orderId));
            setUpdateError(error instanceof Error ? error.message : 'Could not update order status.');
        }
        finally {
            setUpdatingOrderIds([]);
        }
    };
    const handleMarkPending = async (orderId) => {
        if (updatingOrderIds.length > 0) {
            return;
        }
        setUpdateError(null);
        setUpdatingOrderIds([orderId]);
        try {
            await advanceOrderStatus(orderId, 'pending');
            setOptimisticDeliveredOrderIds((current) => current.filter((id) => id !== orderId));
            setSelectedOrderIds((current) => current.filter((id) => id !== orderId));
        }
        catch (error) {
            setUpdateError(error instanceof Error ? error.message : 'Could not update order status.');
        }
        finally {
            setUpdatingOrderIds([]);
        }
    };
    const handleToggleOrderSelection = (orderId) => {
        setSelectedOrderIds((current) => (current.includes(orderId)
            ? current.filter((id) => id !== orderId)
            : [...current, orderId]));
    };
    const handleToggleSelectAll = () => {
        if (isAllSelectableChecked) {
            setSelectedOrderIds((current) => (current.filter((id) => !selectableOrders.some((order) => order.id === id))));
            return;
        }
        setSelectedOrderIds((current) => {
            const withAll = [...current];
            selectableOrders.forEach((order) => {
                if (!withAll.includes(order.id)) {
                    withAll.push(order.id);
                }
            });
            return withAll;
        });
    };
    const handleBulkMarkDelivered = async () => {
        if (updatingOrderIds.length > 0 || selectedDeliverableOrderIds.length === 0) {
            return;
        }
        const approved = window.confirm(`Approve delivery for ${selectedDeliverableOrderIds.length} selected orders?`);
        if (!approved) {
            return;
        }
        setUpdateError(null);
        setOptimisticDeliveredOrderIds((current) => {
            const next = [...current];
            selectedDeliverableOrderIds.forEach((id) => {
                if (!next.includes(id)) {
                    next.push(id);
                }
            });
            return next;
        });
        setUpdatingOrderIds(selectedDeliverableOrderIds);
        try {
            await Promise.all(selectedDeliverableOrderIds.map((orderId) => advanceOrderStatus(orderId, 'delivered')));
            setSelectedOrderIds((current) => current.filter((id) => !selectedDeliverableOrderIds.includes(id)));
        }
        catch (error) {
            setOptimisticDeliveredOrderIds((current) => (current.filter((id) => !selectedDeliverableOrderIds.includes(id))));
            setUpdateError(error instanceof Error ? error.message : 'Could not update selected orders.');
        }
        finally {
            setUpdatingOrderIds([]);
        }
    };
    const handleBulkMarkPending = async () => {
        if (updatingOrderIds.length > 0 || selectedPendingOrderIds.length === 0) {
            return;
        }
        const approved = window.confirm(`Set ${selectedPendingOrderIds.length} selected orders to pending?`);
        if (!approved) {
            return;
        }
        setUpdateError(null);
        setUpdatingOrderIds(selectedPendingOrderIds);
        try {
            await Promise.all(selectedPendingOrderIds.map((orderId) => advanceOrderStatus(orderId, 'pending')));
            setOptimisticDeliveredOrderIds((current) => (current.filter((id) => !selectedPendingOrderIds.includes(id))));
            setSelectedOrderIds((current) => current.filter((id) => !selectedPendingOrderIds.includes(id)));
        }
        catch (error) {
            setUpdateError(error instanceof Error ? error.message : 'Could not update selected orders.');
        }
        finally {
            setUpdatingOrderIds([]);
        }
    };
    return (_jsxs("section", { className: "market-grid", children: [_jsxs("div", { className: "section-heading compact", children: [_jsx("p", { className: "section-kicker", children: copy.sellerOrders.kicker }), _jsx("h2", { children: copy.sellerOrders.title })] }), locationState?.notice ? _jsx("p", { className: "form-notice form-notice-success", children: locationState.notice }) : null, updateError ? _jsx("p", { className: "form-notice form-notice-error", children: updateError }) : null, _jsx("section", { className: "filter-strip", children: viewButtons.map((button) => (_jsx("button", { type: "button", className: button.id === activeView ? 'filter-chip filter-chip-active' : 'filter-chip', onClick: () => setSearchParams(button.id === 'all' ? {} : { view: button.id }, { replace: true }), children: button.label }, button.id))) }), _jsxs("div", { className: "table-toolbar", children: [_jsxs("p", { className: "table-count-text", children: ["Rows: ", visibleOrders.length, " | Selected: ", selectedDeliverableOrderIds.length] }), _jsxs("div", { className: "table-toolbar-actions", children: [_jsx("button", { type: "button", className: "button button-secondary", onClick: () => void handleBulkMarkPending(), disabled: selectedPendingOrderIds.length === 0 || updatingOrderIds.length > 0, children: "Set Pending For Checked" }), _jsx("button", { type: "button", className: "button button-primary", onClick: () => void handleBulkMarkDelivered(), disabled: selectedDeliverableOrderIds.length === 0 || updatingOrderIds.length > 0, children: "Approve Delivered For Checked" })] })] }), _jsx("div", { className: "table-shell", children: visibleOrders.length === 0 ? (_jsx("article", { className: "queue-card", children: _jsx("p", { children: copy.sellerOrders.noOrders }) })) : (_jsxs("table", { className: "orders-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { className: "orders-table-selection-cell", children: _jsx("label", { className: "orders-table-selection-control", children: _jsx("input", { className: "orders-table-checkbox", type: "checkbox", checked: isAllSelectableChecked, onChange: handleToggleSelectAll, disabled: selectableOrders.length === 0 || updatingOrderIds.length > 0, "aria-label": "Select all orders" }) }) }), _jsx("th", { children: copy.common.orderId }), _jsx("th", { children: copy.common.product }), _jsx("th", { children: copy.common.buyer }), _jsx("th", { children: copy.common.totalLabel }), _jsx("th", { children: copy.common.status }), _jsx("th", { children: "Ordered At (GMT+3)" }), _jsx("th", { children: "Actions" })] }) }), _jsx("tbody", { children: visibleOrders.map((order) => {
                                const status = getOrderStatus(order.id, order.status);
                                const listing = listings.find((item) => item.id === order.listingId);
                                const isDelivered = status === 'delivered';
                                const isUpdating = updatingOrderIds.includes(order.id);
                                return (_jsxs("tr", { children: [_jsx("td", { className: "orders-table-selection-cell", children: _jsx("label", { className: "orders-table-selection-control", children: _jsx("input", { className: "orders-table-checkbox", type: "checkbox", checked: selectedOrderIds.includes(order.id), onChange: () => handleToggleOrderSelection(order.id), disabled: updatingOrderIds.length > 0, "aria-label": `Select order ${order.id}` }) }) }), _jsx("td", { children: order.id }), _jsx("td", { children: listing ? translateCatalogText(listing.title) : order.listingId }), _jsx("td", { children: order.buyer }), _jsx("td", { children: formatCurrency(order.total) }), _jsx("td", { children: _jsx("span", { className: isDelivered ? 'order-status order-status-complete' : 'order-status', children: translateOrderStatus(status) }) }), _jsx("td", { children: formatDateTimeGmt3(order.createdAt, language) }), _jsx("td", { children: _jsxs("div", { className: "table-row-actions", children: [_jsx("button", { type: "button", className: "button button-secondary", onClick: () => void handleMarkPending(order.id), disabled: isUpdating || status === 'pending' || updatingOrderIds.length > 0, children: status === 'pending' ? 'Pending' : 'Set Pending' }), _jsx("button", { type: "button", className: "button button-primary", onClick: () => void handleMarkDelivered(order.id), disabled: isUpdating || isDelivered || updatingOrderIds.length > 0, children: isDelivered ? copy.sellerOrderDetail.delivered : copy.sellerOrders.deliverAction }), _jsx(Link, { className: "inline-link", to: `/seller/orders/${order.id}`, children: copy.sellerOrders.detailLink })] }) })] }, order.id));
                            }) })] })) })] }));
}
export default SellerOrdersPage;
