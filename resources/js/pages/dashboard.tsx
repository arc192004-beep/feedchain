import { useEffect, useMemo, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import DashboardCards from '@/components/DashboardCards';
import AnalyticsModule from '@/components/AnalyticsModule';
import ProductionModule from '@/components/ProductionModule';
import InventoryModule from '@/components/InventoryModule';
import DistributionModule from '@/components/DistributionModule';
import CustomerSalesModule from '@/components/CustomerSalesModule';
import ForecastModule from '@/components/ForecastModule';
import ReportsModule from '@/components/ReportsModule';
import UserManagement from '@/components/UserManagement';
import { type BreadcrumbItem, type SharedData, type User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/feedchain/dashboard',
    },
];

function getInitialTab(url?: string) {
    if (!url) {
        return 'dashboard';
    }

    const query = url.split('?')[1] || '';
    const params = new URLSearchParams(query);
    return params.get('tab') || 'dashboard';
}

export default function Dashboard() {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const isMonitoringAdmin = auth.user?.role === 'administrator';
    const monitoringTabs = ['dashboard', 'analytics', 'reports'];
    const initialTab = useMemo(() => getInitialTab(page.url as string), [page.url]);
    const [activeTab, setActiveTab] = useState(initialTab);
    const currentTab = isMonitoringAdmin && !monitoringTabs.includes(activeTab) ? 'dashboard' : activeTab;

    const props = page.props as any;
    const users: any[] = props?.users || [];
    const [rawMaterials, setRawMaterials] = useState<any[]>(props?.rawMaterials || []);
    const [feedProducts, setFeedProducts] = useState<any[]>(props?.feedProducts || []);
    const [formulas, setFormulas] = useState<any[]>(props?.formulas || []);
    const [productionBatches, setProductionBatches] = useState<any[]>(props?.productionBatches || []);
    const [distributions, setDistributions] = useState<any[]>(props?.distributions || []);
    const [sales, setSales] = useState<any[]>(props?.sales || []);
    const [buyers, setBuyers] = useState<any[]>(props?.buyers || []);
    const [customers, setCustomers] = useState<any[]>(props?.customers || []);
    const [inventoryMovements, setInventoryMovements] = useState<any[]>(props?.inventoryMovements || []);
    const analytics = props?.analytics;

    useEffect(() => {
        const requestedTab = getInitialTab(page.url as string);
        setActiveTab(isMonitoringAdmin && !monitoringTabs.includes(requestedTab) ? 'dashboard' : requestedTab);
    }, [page.url, isMonitoringAdmin]);

    useEffect(() => {
        if (Array.isArray(props?.rawMaterials)) {
            setRawMaterials(props.rawMaterials);
        }
        if (Array.isArray(props?.feedProducts)) {
            setFeedProducts(props.feedProducts);
        }
        if (Array.isArray(props?.formulas)) {
            setFormulas(props.formulas);
        }
        if (Array.isArray(props?.productionBatches)) {
            setProductionBatches(props.productionBatches);
        }
        if (Array.isArray(props?.distributions)) {
            setDistributions(props.distributions);
        }
        if (Array.isArray(props?.sales)) {
            setSales(props.sales);
        }
        if (Array.isArray(props?.buyers)) {
            setBuyers(props.buyers);
        }
        if (Array.isArray(props?.customers)) {
            setCustomers(props.customers);
        }
        if (Array.isArray(props?.inventoryMovements)) {
            setInventoryMovements(props.inventoryMovements);
        }
    }, [props.rawMaterials, props.feedProducts, props.formulas, props.productionBatches, props.distributions, props.sales, props.buyers, props.customers, props.inventoryMovements]);

    const currentUser: User = {
        ...auth.user,
        firstName: typeof auth.user.name === 'string' ? auth.user.name.split(' ')[0] : auth.user.name,
        lastName:
            typeof auth.user.name === 'string'
                ? auth.user.name.split(' ').slice(1).join(' ') || auth.user.name
                : '',
    } as User;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6 p-4 md:p-6">
                {currentTab === 'dashboard' && (
                    <DashboardCards
                        currentUser={currentUser}
                        users={users}
                        rawMaterials={rawMaterials}
                        feedProducts={feedProducts}
                        productionBatches={productionBatches}
                        distributions={distributions}
                        sales={sales}
                        setActiveTab={setActiveTab}
                    />
                )}

                {currentTab === 'production' && !isMonitoringAdmin && (
                    <ProductionModule
                        currentUser={currentUser}
                        rawMaterials={rawMaterials}
                        feedProducts={feedProducts}
                        formulas={formulas}
                        productionBatches={productionBatches}
                        onUpdateRawMaterials={setRawMaterials}
                        onUpdateFeedProducts={setFeedProducts}
                        onUpdateFormulas={setFormulas}
                        onUpdateBatches={setProductionBatches}
                    />
                )}

                {currentTab === 'inventory' && !isMonitoringAdmin && (
                    <InventoryModule
                        currentUser={currentUser}
                        rawMaterials={rawMaterials}
                        feedProducts={feedProducts}
                        inventoryMovements={inventoryMovements}
                        onUpdateRawMaterials={setRawMaterials}
                        onUpdateFeedProducts={setFeedProducts}
                        onUpdateMovements={setInventoryMovements}
                    />
                )}

                {currentTab === 'distribution' && !isMonitoringAdmin && (
                    <DistributionModule
                        currentUser={currentUser}
                        buyers={buyers}
                        distributions={distributions}
                        feedProducts={feedProducts}
                        onUpdateBuyers={setBuyers}
                        onUpdateDistributions={setDistributions}
                        onUpdateFeedProducts={setFeedProducts}
                    />
                )}

                {currentTab === 'customer_sales' && !isMonitoringAdmin && (
                    <CustomerSalesModule
                        currentUser={currentUser}
                        customers={customers}
                        sales={sales}
                        feedProducts={feedProducts}
                        onUpdateCustomers={setCustomers}
                        onUpdateSales={setSales}
                        onUpdateFeedProducts={setFeedProducts}
                    />
                )}

                {currentTab === 'forecast' && !isMonitoringAdmin && (
                    <ForecastModule
                        rawMaterials={rawMaterials}
                        feedProducts={feedProducts}
                        productionBatches={productionBatches}
                        formulas={formulas}
                    />
                )}

                {currentTab === 'reports' && (
                    <ReportsModule
                        currentUser={currentUser}
                        rawMaterials={rawMaterials}
                        feedProducts={feedProducts}
                        productionBatches={productionBatches}
                        distributions={distributions}
                        sales={sales}
                        inventoryMovements={inventoryMovements}
                    />
                )}

                {currentTab === 'analytics' && (
                    <AnalyticsModule
                        analytics={analytics as any}
                    />
                )}

                {currentTab === 'users' && !isMonitoringAdmin && (
                    <UserManagement
                        currentUser={currentUser}
                        users={users}
                        onAddUser={() => undefined}
                        onUpdateUser={() => undefined}
                        onDeleteUser={() => undefined}
                    />
                )}
            </div>
        </AppLayout>
    );
}
