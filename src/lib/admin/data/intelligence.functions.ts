import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { tinyfishService } from "../../../server/services/tinyfish/client.server";

export const runResearchJob = createServerFn({ method: "POST" })
  .inputValidator(z.object({ 
    type: z.string(),
    category: z.string().optional(),
    market: z.string().optional()
  }).parse)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    
    // Create Job record
    const { data: job, error: jobError } = await (supabaseAdmin.from('research_jobs') as any)
      .insert([{
        type: data.type,
        status: 'running',
        started_at: new Date().toISOString(),
        queries: [data.category || 'all']
      }], {}, {})
      .select()
      .single();

    if (jobError) throw new Error(jobError.message);

    try {
      // Execute actual research
      const searchResult = await tinyfishService.search(`bestseller trending ${data.category || ''} ${data.market || ''}`);
      
      // Store results as intelligence signals
      if (searchResult.results && searchResult.results.length > 0) {
        const signals = searchResult.results.map((res: any) => ({
          type: res.signal || 'trend',
          entity_name: res.name,
          category_slug: res.category || data.category || 'misc',
          score: res.score || 50,
          evidence: { source: 'tinyfish', query: searchResult.query },
          metadata: { ...res }
        }));

        await (supabaseAdmin.from('intelligence_signals') as any).insert(signals, {}, {});
      }

      // Update Job status
      await (supabaseAdmin.from('research_jobs') as any)
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          results_count: searchResult.results.length,
          sources_count: 5 
        }, {}, {})
        .eq('id', job.id);

      return { job_id: job.id, success: true, count: searchResult.results.length };
    } catch (e: any) {
      await (supabaseAdmin.from('research_jobs') as any)
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          errors: [e.message]
        }, {}, {})
        .eq('id', job.id);
      
      throw new Error(e.message);
    }
  });

export const getRecentJobs = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    
    const { data, error } = await supabaseAdmin
      .from('research_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw new Error(error.message);
    return data;
  });

export const getIntelligenceSignals = createServerFn({ method: "GET" })
  .inputValidator(z.object({ type: z.string().optional() }).parse)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    
    let query = supabaseAdmin
      .from('intelligence_signals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data.type) {
      query = query.eq('type', data.type);
    }

    const { data: signals, error } = await query;
    if (error) throw new Error(error.message);
    return signals;
  });

export const getPriceObservations = createServerFn({ method: "GET" })
  .handler(async () => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    
    const { data, error } = await supabaseAdmin
      .from('price_observations')
      .select('*, products(name)')
      .order('observed_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  });