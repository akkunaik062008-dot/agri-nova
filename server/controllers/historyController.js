import { supabaseAdmin, isSupabaseConfigured, devStorage } from '../config/supabaseAdmin.js';

export const getAllHistory = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-farmer-id';
    const { type = 'all', search = '' } = req.query;

    let advisories = [];
    let diagnostics = [];

    if (isSupabaseConfigured()) {
      if (type === 'all' || type === 'advisory') {
        const { data: advData } = await supabaseAdmin
          .from('crop_advisories')
          .select('*, farm_plots(name, area_acres, soil_type)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        advisories = advData || [];
      }

      if (type === 'all' || type === 'diagnostic') {
        const { data: diagData } = await supabaseAdmin
          .from('diagnostic_scans')
          .select('*, farm_plots(name, area_acres, soil_type)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        diagnostics = diagData || [];
      }
    } else {
      if (type === 'all' || type === 'advisory') {
        advisories = devStorage.advisories
          .filter(a => a.user_id === userId)
          .map(a => {
            const plot = devStorage.plots.find(p => p.id === a.plot_id);
            return { ...a, farm_plots: plot ? { name: plot.name, area_acres: plot.area_acres } : null };
          });
      }

      if (type === 'all' || type === 'diagnostic') {
        diagnostics = devStorage.diagnostics
          .filter(d => d.user_id === userId)
          .map(d => {
            const plot = devStorage.plots.find(p => p.id === d.plot_id);
            return { ...d, farm_plots: plot ? { name: plot.name, area_acres: plot.area_acres } : null };
          });
      }
    }

    // Format into unified list
    const combined = [
      ...advisories.map(item => ({
        id: item.id,
        record_type: 'advisory',
        title: `Crop Advisory: ${item.recommended_crop}`,
        summary: item.ai_response?.crop_suitability_reasoning || 'Automated N-P-K & climate recommendation',
        badge: item.recommended_crop,
        score: item.confidence_score,
        plot_name: item.farm_plots?.name || 'Unassigned Plot',
        season: item.season,
        created_at: item.created_at,
        payload: item
      })),
      ...diagnostics.map(item => ({
        id: item.id,
        record_type: 'diagnostic',
        title: `Leaf Diagnostic: ${item.detected_disease}`,
        summary: `Pathology scan - Severity: ${item.severity_level}`,
        badge: item.severity_level,
        score: item.confidence_score,
        plot_name: item.farm_plots?.name || 'Field Leaf Sample',
        season: 'Field Scan',
        created_at: item.created_at,
        payload: item
      }))
    ];

    // Sort descending
    combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Search filter if supplied
    let result = combined;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = combined.filter(
        item => item.title.toLowerCase().includes(q) ||
                item.summary.toLowerCase().includes(q) ||
                item.plot_name.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      total: result.length,
      data: result
    });
  } catch (err) {
    console.error('[History Controller Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
