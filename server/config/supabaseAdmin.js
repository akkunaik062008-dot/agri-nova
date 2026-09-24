import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== 'https://your-supabase-project.supabase.co' &&
    supabaseKey !== 'your-supabase-service-role-key'
  );
};

export const supabaseAdmin = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Local in-memory repository for development / demo mode when Supabase is not connected
export const devStorage = {
  plots: [
    {
      id: '00000000-0000-0000-0000-000000000001',
      user_id: 'demo-farmer-id',
      name: 'North Valley Field',
      area_acres: 24.5,
      soil_type: 'Loam',
      default_irrigation: 'Drip',
      latitude: 36.7783,
      longitude: -119.4179,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: '00000000-0000-0000-0000-000000000002',
      user_id: 'demo-farmer-id',
      name: 'East Ridge Orchard',
      area_acres: 12.0,
      soil_type: 'Sandy Loam',
      default_irrigation: 'Sprinkler',
      latitude: 36.7820,
      longitude: -119.4120,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ],
  advisories: [
    {
      id: '00000000-0000-0000-0000-000000000101',
      user_id: 'demo-farmer-id',
      plot_id: '00000000-0000-0000-0000-000000000001',
      season: 'Rabi',
      soil_inputs: {
        nitrogen_ppm: 140,
        phosphorus_ppm: 45,
        potassium_ppm: 210,
        ph_level: 6.8,
        irrigation_type: 'Drip',
        budget_per_acre: 1200,
        target_market: 'Commercial Processing'
      },
      recommended_crop: 'Wheat (Durum)',
      confidence_score: 94.5,
      ai_response: {
        recommended_crop: 'Wheat (Durum)',
        confidence_score: 94.5,
        crop_suitability_reasoning: 'Optimal N-P-K ratio (140:45:210) combined with near-neutral pH (6.8) and low water requirement during grain filling perfectly aligns with winter/Rabi climate conditions in loamy soils.',
        alternative_crops: ['Barley', 'Chickpea'],
        fertilizer_schedule: [
          { stage: 'Basal / Sowing', fertilizer_name: 'DAP (Diammonium Phosphate)', dosage_kg_per_acre: 50, application_method: 'Soil Broadcast & Incorporation' },
          { stage: 'Crown Root Initiation (Day 21)', fertilizer_name: 'Urea (46% N)', dosage_kg_per_acre: 45, application_method: 'Top dressing with light irrigation' },
          { stage: 'Booting Stage (Day 60)', fertilizer_name: 'MOP (Muriate of Potash) + Zinc Sulfate', dosage_kg_per_acre: 20, application_method: 'Foliar spray with spreader' }
        ],
        irrigation_plan: {
          frequency_days: 12,
          water_volume_liters_per_acre: 18000,
          critical_stages: ['Crown Root Initiation', 'Tillering', 'Flowering', 'Milk/Dough Stage']
        },
        estimated_yield_tons_per_acre: 3.2,
        estimated_net_profit_per_acre: 820
      },
      created_at: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ],
  diagnostics: [
    {
      id: '00000000-0000-0000-0000-000000000201',
      user_id: 'demo-farmer-id',
      plot_id: '00000000-0000-0000-0000-000000000001',
      image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=600&q=80',
      detected_disease: 'Tomato Early Blight (Alternaria solani)',
      severity_level: 'Moderate',
      confidence_score: 92.0,
      treatment_plan: {
        detected_disease: 'Tomato Early Blight (Alternaria solani)',
        is_healthy: false,
        severity_level: 'Moderate',
        confidence_score: 92.0,
        symptoms_identified: [
          'Concentric dark rings (target-like spots) on lower mature leaves',
          'Yellow chlorotic halos surrounding necrotic lesions',
          'Premature leaf senescence starting from bottom canopy'
        ],
        organic_controls: [
          'Apply copper octanoate (copper soap) spray every 7-10 days',
          'Prune all foliage within 12 inches of soil surface to minimize splash transmission',
          'Spread thick organic straw mulch around plant base to isolate fungal spores'
        ],
        chemical_controls: [
          {
            active_ingredient: 'Azoxystrobin 23% SC',
            trade_product_example: 'Amistar / Quadris',
            dosage: '1.0 mL per Liter of water (200 mL per acre in 200L water)',
            safety_instructions: 'Wear nitrile gloves, eye goggles, and N95 vapor mask. 7-day pre-harvest interval.'
          },
          {
            active_ingredient: 'Chlorothalonil 75% WP',
            trade_product_example: 'Bravo Weather Stik',
            dosage: '2.5 g per Liter of water',
            safety_instructions: 'Protective chemical apron and respirator required. Do not spray within 48 hours of heavy rain.'
          }
        ],
        prevention_tips: [
          'Implement a strict 3-year crop rotation with non-solanaceous crops',
          'Switch overhead sprinklers to drip irrigation to keep leaf canopy dry',
          'Disinfect pruning shears with 70% isopropyl alcohol between rows'
        ]
      },
      created_at: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ]
};
