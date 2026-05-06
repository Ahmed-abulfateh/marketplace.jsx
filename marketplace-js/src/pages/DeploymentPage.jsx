import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
function DeploymentPage() {
    const [deploymentStatus, setDeploymentStatus] = useState({
        status: 'connecting',
        message: 'Checking deployment status...',
        mongoDBStatus: 'Checking...',
        apiHealth: 'Checking...',
        timestamp: new Date().toLocaleString(),
    });
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        const checkDeploymentStatus = async () => {
            const API_BASE = import.meta.env.VITE_API_URL ?? '';
            if (!API_BASE) {
                if (isMounted) {
                    setDeploymentStatus({
                        status: 'error',
                        message: 'No backend URL configured (VITE_API_URL is not set)',
                        mongoDBStatus: 'Unknown',
                        apiHealth: 'Not configured',
                        timestamp: new Date().toLocaleString(),
                    });
                }
                return;
            }
            try {
                const healthResponse = await fetch(`${API_BASE}/api/health`, {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!isMounted)
                    return;
                if (healthResponse.ok) {
                    setDeploymentStatus({
                        status: 'connected',
                        message: 'Deployment is operational',
                        mongoDBStatus: 'Connected',
                        apiHealth: 'Healthy',
                        timestamp: new Date().toLocaleString(),
                    });
                }
                else {
                    setDeploymentStatus({
                        status: 'error',
                        message: `API responded with status ${healthResponse.status}`,
                        mongoDBStatus: 'Unknown',
                        apiHealth: 'Unhealthy',
                        timestamp: new Date().toLocaleString(),
                    });
                }
            }
            catch (error) {
                if (!isMounted)
                    return;
                const errorMsg = error instanceof Error
                    ? error.name === 'AbortError'
                        ? 'Request timed out'
                        : error.message
                    : 'Unknown error';
                setDeploymentStatus({
                    status: 'error',
                    message: `Failed to connect to API: ${errorMsg}`,
                    mongoDBStatus: 'Unknown',
                    apiHealth: 'Unreachable',
                    timestamp: new Date().toLocaleString(),
                });
            }
            clearTimeout(timeoutId);
        };
        checkDeploymentStatus();
        const interval = setInterval(checkDeploymentStatus, 10000); // Check every 10 seconds
        return () => {
            isMounted = false;
            clearInterval(interval);
            clearTimeout(timeoutId);
            controller.abort();
        };
    }, []);
    return (_jsxs("main", { style: { padding: '2rem', maxWidth: '800px', margin: '0 auto' }, children: [_jsx("h1", { children: "Deployment Status" }), _jsxs("section", { style: {
                    marginTop: '2rem',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    backgroundColor: deploymentStatus.status === 'connected'
                        ? '#d4edda'
                        : deploymentStatus.status === 'error'
                            ? '#f8d7da'
                            : '#e2e3e5',
                    borderLeft: `4px solid ${deploymentStatus.status === 'connected'
                        ? '#28a745'
                        : deploymentStatus.status === 'error'
                            ? '#dc3545'
                            : '#6c757d'}`,
                }, children: [_jsxs("h2", { style: { margin: '0 0 1rem 0', fontSize: '1.5rem' }, children: [deploymentStatus.status === 'connected' ? '✓' : deploymentStatus.status === 'error' ? '✕' : '⟳', " Overall Status"] }), _jsx("p", { style: { fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: '500' }, children: deploymentStatus.message }), _jsxs("p", { style: { fontSize: '0.9rem', color: '#666' }, children: ["Last checked: ", deploymentStatus.timestamp] })] }), _jsxs("section", { style: { marginTop: '2rem' }, children: [_jsx("h2", { style: { fontSize: '1.3rem', marginBottom: '1rem' }, children: "Service Details" }), _jsxs("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '1rem',
                        }, children: [_jsxs("div", { style: { padding: '1rem', border: '1px solid #ddd', borderRadius: '6px' }, children: [_jsx("h3", { style: { margin: '0 0 0.5rem 0', fontSize: '1rem' }, children: "MongoDB" }), _jsx("p", { style: {
                                            margin: 0,
                                            padding: '0.5rem 0',
                                            color: deploymentStatus.mongoDBStatus === 'Connected' ? '#28a745' : '#dc3545',
                                            fontWeight: '500',
                                        }, children: deploymentStatus.mongoDBStatus })] }), _jsxs("div", { style: { padding: '1rem', border: '1px solid #ddd', borderRadius: '6px' }, children: [_jsx("h3", { style: { margin: '0 0 0.5rem 0', fontSize: '1rem' }, children: "API Server" }), _jsx("p", { style: {
                                            margin: 0,
                                            padding: '0.5rem 0',
                                            color: deploymentStatus.apiHealth === 'Healthy' ? '#28a745' : '#dc3545',
                                            fontWeight: '500',
                                        }, children: deploymentStatus.apiHealth })] })] })] }), _jsxs("section", { style: { marginTop: '2rem' }, children: [_jsx("h2", { style: { fontSize: '1.3rem', marginBottom: '1rem' }, children: "Configuration" }), _jsxs("div", { style: { padding: '1rem', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: '#f9f9f9' }, children: [_jsxs("p", { style: { margin: '0.5rem 0', fontSize: '0.95rem' }, children: [_jsx("strong", { children: "API Endpoint:" }), " ", _jsx("code", { children: "/api" })] }), _jsxs("p", { style: { margin: '0.5rem 0', fontSize: '0.95rem' }, children: [_jsx("strong", { children: "Database:" }), " MongoDB Atlas (MarketPlace)"] }), _jsxs("p", { style: { margin: '0.5rem 0', fontSize: '0.95rem' }, children: [_jsx("strong", { children: "Status Page URL:" }), " ", _jsx("code", { children: "/deployment" })] })] })] })] }));
}
export default DeploymentPage;
