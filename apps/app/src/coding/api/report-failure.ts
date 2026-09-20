/**
 * Fire-and-forget reporter for product API failures.
 * Does not use `apiFetch` so a logging failure cannot recurse.
 */
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api';
const INGEST_PATH = '/telemetry/failures';
const MIN_GAP_MS = 15_000;
const MAX_PER_MINUTE = 20;

const lastByKey = new Map<string, number>();
let minuteWindowStart = 0;
let minuteCount = 0;

export type ApiFailureReport = {
  method: string;
  path: string;
  statusCode: number;
  errorMessage: string;
};

function clientPlatform() {
  if (Platform.OS === 'web') return 'web';
  if (Platform.OS === 'ios') return 'ios';
  if (Platform.OS === 'android') return 'android';
  return Platform.OS;
}

function pagePath() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return null;
  return window.location?.pathname ?? null;
}

function userAgent() {
  if (Platform.OS !== 'web' || typeof navigator === 'undefined') return null;
  return navigator.userAgent ?? null;
}

function allowSend(key: string) {
  const now = Date.now();
  if (now - minuteWindowStart > 60_000) {
    minuteWindowStart = now;
    minuteCount = 0;
  }
  if (minuteCount >= MAX_PER_MINUTE) return false;
  const previous = lastByKey.get(key) ?? 0;
  if (now - previous < MIN_GAP_MS) return false;
  lastByKey.set(key, now);
  minuteCount += 1;
  return true;
}

/** Report a failed product API call. Safe to call without awaiting. */
export function reportApiFailure(report: ApiFailureReport, accessToken: string | null) {
  if (!accessToken || accessToken === 'demo-access-token') return;
  const path = report.path.split('?')[0] ?? report.path;
  if (!path || path === INGEST_PATH || path.startsWith(INGEST_PATH)) return;

  const method = (report.method || 'GET').toUpperCase();
  const key = `${method}:${path}:${report.statusCode}`;
  if (!allowSend(key)) return;

  const payload = {
    method,
    path,
    statusCode: report.statusCode,
    errorMessage: report.errorMessage.slice(0, 2000),
    clientPlatform: clientPlatform(),
    appVersion: Constants.expoConfig?.version ?? null,
    userAgent: userAgent(),
    pagePath: pagePath(),
  };

  void fetch(`${BASE_URL}${INGEST_PATH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
