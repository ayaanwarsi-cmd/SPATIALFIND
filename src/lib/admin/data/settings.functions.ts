import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

// This file must remain a thin wrapper for createServerFn
// Real logic should be in *.server.ts files.

export const saveTinyFishKey = createServerFn({ method: "POST" })
  .inputValidator(z.object({ key: z.string() }).parse)
  .handler(async ({ data }) => {
    // In a real project, we'd use supabaseAdmin to write to public.settings
    // Since we're in a TanStack Start handler, we can import the server client
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    
    const { error } = await supabaseAdmin
      .from('settings')
      .upsert({ 
        key: 'tinyfish_api_key', 
        value: { key: data.key },
        updated_at: new Date().toISOString()
      });

    if (error) throw new Error(error.message);
    return { success: true };
  });

export const getTinyFishStatus = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    
    const { data, error } = await supabaseAdmin
      .from('settings')
      .select('value, updated_at')
      .eq('key', 'tinyfish_api_key')
      .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    
    return { 
      connected: !!data?.value,
      lastUpdated: data?.updated_at || null
    };
  });

export const testTinyFishConnection = createServerFn({ method: "POST" })
  .handler(async () => {
    const { tinyfishService } = await import('../../../server/services/tinyfish/client.server');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

    const { data } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'tinyfish_api_key')
      .single();

    const value = data?.value as { key?: string } | null;
    if (!value?.key) throw new Error("No API key configured");

    try {
      // Real test call would go here
      const result = await tinyfishService.search('test connection');
      return { success: true, timestamp: new Date().toISOString() };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });
