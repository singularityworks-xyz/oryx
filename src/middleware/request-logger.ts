import type { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

const HTTP_STATUS_BAD_REQUEST = 400;
const RANDOM_STRING_BASE = 36;
const RANDOM_STRING_SUBSTR_START = 2;
const RANDOM_STRING_LENGTH = 9;

export type RequestContext = {
  requestId: string;
  method: string;
  url: string;
  userAgent?: string;
  ip?: string;
  startTime: number;
};

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(RANDOM_STRING_BASE).substr(RANDOM_STRING_SUBSTR_START, RANDOM_STRING_LENGTH)}`;
}

export function extractRequestInfo(request: NextRequest): RequestContext {
  const requestId = generateRequestId();
  const _url = new URL(request.url);

  return {
    requestId,
    method: request.method,
    url: request.url,
    userAgent: request.headers.get('user-agent') || undefined,
    ip:
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown',
    startTime: Date.now(),
  };
}

export function logRequestStart(context: RequestContext): void {
  logger
    .setRequestId(context.requestId)
    .setContext('Request')
    .info('Request started', {
      method: context.method,
      url: context.url,
      userAgent: context.userAgent,
      ip: context.ip,
    });
}

export function logRequestComplete(
  context: RequestContext,
  statusCode: number,
  responseSize?: number
): void {
  const duration = Date.now() - context.startTime;

  const logData = {
    method: context.method,
    url: context.url,
    statusCode,
    duration,
    responseSize,
    userAgent: context.userAgent,
    ip: context.ip,
  };

  if (statusCode >= HTTP_STATUS_BAD_REQUEST) {
    logger
      .setRequestId(context.requestId)
      .setContext('Request')
      .warn('Request completed with error', logData);
  } else {
    logger
      .setRequestId(context.requestId)
      .setContext('Request')
      .info('Request completed', logData);
  }
}

export function logAuthEvent(
  requestId: string,
  event: string,
  userId?: string,
  metadata?: Record<string, unknown>
): void {
  logger
    .setRequestId(requestId)
    .setUserId(userId || 'anonymous')
    .setContext('Auth')
    .info(event, metadata);
}

export function logDatabaseOperation(
  requestId: string,
  options: {
    operation: string;
    table: string;
    duration: number;
    metadata?: Record<string, unknown>;
  }
): void {
  logger
    .setRequestId(requestId)
    .setContext('Database')
    .debug(`DB ${options.operation}`, {
      table: options.table,
      duration: options.duration,
      ...(options.metadata && options.metadata),
    });
}

export function logError(
  requestId: string,
  error: Error,
  context: string,
  metadata?: Record<string, unknown>
): void {
  logger
    .setRequestId(requestId)
    .setContext(context)
    .error(error.message, metadata, error);
}
