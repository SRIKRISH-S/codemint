// ============================================================
// CodeMint AI — Local Storage Store
// Replaces a database for local-first / offline demo usage.
// ============================================================
import { Order, WebhookLog, AnalysisResult, CheckoutSession, AnalysisRequest, SessionStatus } from './types';
import { v4 as uuidv4 } from 'uuid';

const KEYS = {
  ORDERS: 'codemint_orders',
  WEBHOOK_LOGS: 'codemint_webhook_logs',
};

// ---- Utility -----------------------------------------------

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ---- Orders ------------------------------------------------

export function getAllOrders(): Order[] {
  return readJSON<Order[]>(KEYS.ORDERS, []);
}

export function getOrderById(id: string): Order | undefined {
  return getAllOrders().find((o) => o.id === id);
}

export function getOrderBySessionId(sessionId: string): Order | undefined {
  return getAllOrders().find((o) => o.session.id === sessionId);
}

export function createOrder(
  request: AnalysisRequest,
  session: CheckoutSession
): Order {
  const order: Order = {
    id: uuidv4(),
    request,
    session,
    status: 'awaiting-payment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const orders = getAllOrders();
  orders.unshift(order);
  writeJSON(KEYS.ORDERS, orders);
  return order;
}

export function updateOrder(id: string, updates: Partial<Order>): Order | undefined {
  const orders = getAllOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx === -1) return undefined;
  orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() };
  writeJSON(KEYS.ORDERS, orders);
  return orders[idx];
}

export function updateOrderBySessionId(
  sessionId: string,
  updates: Partial<Order>
): Order | undefined {
  const orders = getAllOrders();
  const idx = orders.findIndex((o) => o.session.id === sessionId);
  if (idx === -1) return undefined;
  orders[idx] = { ...orders[idx], ...updates, updatedAt: new Date().toISOString() };
  writeJSON(KEYS.ORDERS, orders);
  return orders[idx];
}

export function setOrderStatus(id: string, status: SessionStatus): void {
  updateOrder(id, { status });
}

export function attachResult(orderId: string, result: AnalysisResult): void {
  updateOrder(orderId, { result, status: 'complete' });
}

export function clearAllOrders(): void {
  writeJSON(KEYS.ORDERS, []);
}

// ---- Webhook Logs ------------------------------------------

export function getAllWebhookLogs(): WebhookLog[] {
  return readJSON<WebhookLog[]>(KEYS.WEBHOOK_LOGS, []);
}

export function appendWebhookLog(log: Omit<WebhookLog, 'id' | 'timestamp'>): WebhookLog {
  const entry: WebhookLog = {
    ...log,
    id: uuidv4(),
    timestamp: new Date().toISOString(),
  };
  const logs = getAllWebhookLogs();
  logs.unshift(entry);
  if (logs.length > 200) logs.length = 200; // cap at 200
  writeJSON(KEYS.WEBHOOK_LOGS, logs);
  return entry;
}

export function clearAllWebhookLogs(): void {
  writeJSON(KEYS.WEBHOOK_LOGS, []);
}

// ---- Analytics ---------------------------------------------

export function getAnalytics() {
  const orders = getAllOrders();
  const completed = orders.filter((o) => o.status === 'complete');
  const totalRevenue = completed.reduce((sum, o) => sum + o.session.amount, 0);

  const revenueByType: Record<string, number> = {};
  completed.forEach((o) => {
    const t = o.request.analysisType;
    revenueByType[t] = (revenueByType[t] ?? 0) + o.session.amount;
  });

  return {
    totalRevenue,
    totalOrders: orders.length,
    completedOrders: completed.length,
    pendingOrders: orders.filter((o) => o.status !== 'complete' && o.status !== 'failed').length,
    conversionRate: orders.length > 0 ? Math.round((completed.length / orders.length) * 100) : 0,
    avgOrderValue: completed.length > 0 ? Math.round(totalRevenue / completed.length) : 0,
    revenueByType,
  };
}
