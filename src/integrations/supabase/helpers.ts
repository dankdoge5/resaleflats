import { supabase } from './client';

/**
 * Helper to bypass strict typing when the generated types.ts
 * doesn't yet reflect the actual database schema.
 */
export const db = supabase as any;
