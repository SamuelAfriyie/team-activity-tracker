// resources/js/lib/route.ts
import { route as routeFn, Config } from 'ziggy-js';
import { Ziggy } from '@/ziggy';

export const route = (name: string, params?: any, absolute?: boolean) =>
  routeFn(name, params, absolute ?? true, Ziggy as unknown as Config);
