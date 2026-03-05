import { httpClient } from '../../../../shared/infra/httpClient';

export interface DashboardStats {
    stats: Array<{
        label: string;
        value: string;
        icon: string;
        type: string;
        change: string;
        trend: 'up' | 'down';
    }>;
    activities: Array<{
        type: string;
        text: string;
        time: string;
    }>;
    overdueItems: Array<{
        title: string;
        user: string;
        days: string;
    }>;
    summary: {
        available: number;
        borrowed: number;
    };
}

export const DashboardService = {
    async getStats(): Promise<DashboardStats> {
        const response = await httpClient.get<DashboardStats>('/dashboard/stats');
        return response.data;
    },
};
