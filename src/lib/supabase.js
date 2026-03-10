import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
}

const noop = () => ({
    select: () => ({ data: [], error: null, single: () => ({ data: null, error: null }), then: (cb) => Promise.resolve({ data: [], error: null }).then(cb) }),
    upsert: () => ({ then: (cb) => Promise.resolve({ data: null, error: null }).then(cb) }),
    update: () => ({ eq: () => ({ then: (cb) => Promise.resolve({ data: null, error: null }).then(cb) }) }),
    insert: () => ({ then: (cb) => Promise.resolve({ data: null, error: null }).then(cb) })
});

export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        from: noop,
        channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
        removeChannel: () => { }
    };
