export interface ForecastPoint {
    month: string;
    actual: number;
    trend: number;
}

export interface ForecastResult {
    historical: Array<{ month: string; actual: number; trend: number }>;
    forecast: Array<{ month: string; predicted: number }>;
    slope: number;
    intercept: number;
    r2: number;
}

export interface ParetoItem {
    name: string;
    value: number;
    cumulativeValue: number;
    cumulativePercent: number;
}

export interface OLAPRow {
    dimension: string;
    value: string | number;
    total: number;
    count: number;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getMonthLabel(index: number): string {
    const monthIndex = ((index % 12) + 12) % 12;
    return monthNames[monthIndex] ?? `M${monthIndex + 1}`;
}

export function forecastNextPeriods(
    productionBatches: Array<{ productionDate?: string; quantityProducedBags: number; feedProductCode?: string }> = [],
    selectedProductCode: string | 'ALL' = 'ALL',
    periods = 3
): ForecastResult {
    const filtered = productionBatches
        .filter((batch) => batch.quantityProducedBags >= 0)
        .filter((batch) => selectedProductCode === 'ALL' || batch.feedProductCode === selectedProductCode)
        .map((batch) => ({
            productionDate: batch.productionDate || '',
            quantityProducedBags: batch.quantityProducedBags,
        }))
        .sort((a, b) => (a.productionDate || '').localeCompare(b.productionDate || ''));

    const historical = filtered.map((batch, index) => ({
        month: getMonthLabel(index),
        actual: batch.quantityProducedBags,
        trend: batch.quantityProducedBags,
    }));

    let slope = 0;
    let intercept = 0;
    let r2 = 0;

    if (historical.length >= 2) {
        const xMean = historical.reduce((sum, _, i) => sum + i, 0) / historical.length;
        const yMean = historical.reduce((sum, point) => sum + point.actual, 0) / historical.length;
        const numerator = historical.reduce((sum, point, i) => sum + ((i - xMean) * (point.actual - yMean)), 0);
        const denominator = historical.reduce((sum, point, i) => sum + Math.pow(i - xMean, 2), 0) || 1;
        slope = numerator / denominator;
        intercept = yMean - slope * xMean;
        const ssTot = historical.reduce((sum, point) => sum + Math.pow(point.actual - yMean, 2), 0) || 1;
        const ssRes = historical.reduce((sum, point, i) => {
            const predicted = slope * i + intercept;
            return sum + Math.pow(point.actual - predicted, 2);
        }, 0);
        r2 = Math.max(0, 1 - ssRes / ssTot);
    } else {
        slope = historical[0]?.actual ?? 0;
        intercept = 0;
        r2 = 0;
    }

    const forecast = Array.from({ length: periods }, (_, idx) => {
        const x = historical.length + idx;
        return {
            month: getMonthLabel(x),
            predicted: Math.max(0, Math.round(slope * x + intercept)),
        };
    });

    return {
        historical,
        forecast,
        slope: Number(slope.toFixed(2)),
        intercept: Number(intercept.toFixed(2)),
        r2: Number(r2.toFixed(3)),
    };
}

export function calculatePareto(items: Array<{ name: string; value: number }>): ParetoItem[] {
    const sorted = [...items].sort((a, b) => b.value - a.value);
    const total = sorted.reduce((sum, item) => sum + item.value, 0) || 1;
    let cumulative = 0;

    return sorted.map((item) => {
        cumulative += item.value;
        return {
            name: item.name,
            value: item.value,
            cumulativeValue: cumulative,
            cumulativePercent: Number(((cumulative / total) * 100).toFixed(1)),
        };
    });
}

export function performOLAPAnalysis(
    dimension: 'Year' | 'Month' | 'Feed Product' | 'Buyer' | 'Customer',
    productionBatches: Array<{ productionDate?: string; feedProductCode?: string; quantityProducedBags: number }>,
    distributions: Array<{ distributionDate?: string; buyerId?: number; totalQuantity?: number }>,
    sales: Array<{ saleDate?: string; customerId?: number; totalAmount: number }>,
    feedProducts: Array<{ code?: string; name?: string }>,
    buyers: Array<{ id?: number; name?: string }>,
    customers: Array<{ id?: number; name?: string }>
): OLAPRow[] {
    const rows: OLAPRow[] = [];
    const groupBy = new Map<string, { total: number; count: number }>();

    if (dimension === 'Feed Product') {
        productionBatches.forEach((batch) => {
            const key = batch.feedProductCode || 'Unknown';
            const row = groupBy.get(key) || { total: 0, count: 0 };
            row.total += batch.quantityProducedBags;
            row.count += 1;
            groupBy.set(key, row);
        });
    } else if (dimension === 'Buyer') {
        distributions.forEach((dist) => {
            const key = String(dist.buyerId || 'Unknown');
            const row = groupBy.get(key) || { total: 0, count: 0 };
            row.total += dist.totalQuantity ?? 0;
            row.count += 1;
            groupBy.set(key, row);
        });
    } else if (dimension === 'Customer') {
        sales.forEach((sale) => {
            const key = String(sale.customerId || 'Unknown');
            const row = groupBy.get(key) || { total: 0, count: 0 };
            row.total += sale.totalAmount;
            row.count += 1;
            groupBy.set(key, row);
        });
    } else if (dimension === 'Year' || dimension === 'Month') {
        const source = [...productionBatches, ...distributions, ...sales].filter((item) => item.productionDate || item.distributionDate || item.saleDate);
        source.forEach((item: any) => {
            const date = new Date(item.productionDate || item.distributionDate || item.saleDate || '');
            if (Number.isNaN(date.getTime())) return;
            const key = dimension === 'Year' ? String(date.getFullYear()) : `${getMonthLabel(date.getMonth())} ${date.getFullYear()}`;
            const row = groupBy.get(key) || { total: 0, count: 0 };
            row.total += Number(item.quantityProducedBags ?? item.totalQuantity ?? item.totalAmount ?? 0);
            row.count += 1;
            groupBy.set(key, row);
        });
    }

    for (const [key, value] of groupBy.entries()) {
        rows.push({
            dimension,
            value: key,
            total: Number(value.total.toFixed ? value.total.toFixed(2) : value.total),
            count: value.count,
        });
    }

    return rows.sort((a, b) => (b.total || 0) - (a.total || 0));
}
