import { toNextJsHandler } from 'better-auth/next-js';
import { auth } from '@/lib/auth';

const handlers = toNextJsHandler(auth);

export const { GET, POST } = handlers;
