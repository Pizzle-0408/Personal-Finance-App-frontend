const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://127.0.0.1:5000';

const buildUrl = (path: string) => {
  const normalizedBase = API_BASE_URL.replace(/\/$/, '');
  return `${normalizedBase}${path.startsWith('/') ? path : `/${path}`}`;
};

const parseErrorMessage = async (response: Response) => {
  try {
    const data = await response.json();
    if (data && typeof data === 'object' && 'message' in data) {
      return String(data.message);
    }
  } catch (_) {
    // Ignore JSON parsing errors for error messages
  }
  return response.statusText || 'Unable to complete request';
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(buildUrl(path), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json() as Promise<T>;
}

export interface Transaction {
  id: string | number;
  name?: string;
  description?: string;
  merchant?: string;
  category?: string;
  amount: number;
  date: string;
  type?: 'income' | 'expense' | 'debit' | 'credit';
}

export interface DailyAnalyticsEntry {
  date: string;
  total: number;
  transactions?: number;
  category?: string;
}

export interface MonthlySummary {
  totalSpending: number;
  lastMonthTotal: number;
  differenceAmount: number;
  differencePercent: number;
  dailyAverage: number;
  dailyAverageChange: number;
  topCategory: {
    name: string;
    amount: number;
    percent: number;
  };
}

export interface MonthlyTrendPoint {
  month: string;
  total: number;
  housing?: number;
  food?: number;
  transportation?: number;
  utilities?: number;
  insurance?: number;
  medical?: number;
  personal?: number;
  recreation?: number;
  miscellaneous?: number;
  income?: number;
  expenses?: number;
  [key: string]: string | number | undefined;
}

export interface IncomeVsExpensesPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface CategoryBreakdownEntry {
  category: string;
  amount: number;
  percent: number;
  recommended?: number;
  recommendedAmount?: number;
  color?: string;
  accentClass?: string;
}

export interface MonthlyAnalyticsResponse {
  summary?: MonthlySummary;
  trend?: MonthlyTrendPoint[];
  incomeVsExpenses?: IncomeVsExpensesPoint[];
  categoryBreakdown?: CategoryBreakdownEntry[];
}

export interface UploadResponse {
  success: boolean;
  message: string;
}

export const getTransactions = () => request<Transaction[]>('/transactions');
export const getDailyAnalytics = () => request<DailyAnalyticsEntry[]>('/analytics/daily');
export const getMonthlyAnalytics = () => request<MonthlyAnalyticsResponse>('/analytics/monthly');

export const uploadTransactions = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(buildUrl('/upload'), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return response.json() as Promise<UploadResponse>;
};
