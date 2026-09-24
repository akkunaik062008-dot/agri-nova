import { supabaseAdmin, isSupabaseConfigured, devStorage } from '../config/supabaseAdmin.js';
import { PlotSchema } from '../../shared/validators.js';

export const getPlots = async (req, res) => {
  try {
    const userId = req.user?.id || 'demo-farmer-id';

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('farm_plots')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ success: true, data });
    }

    const userPlots = devStorage.plots.filter(p => p.user_id === userId);
    return res.status(200).json({ success: true, data: userPlots });
  } catch (err) {
    console.error('[Get Plots Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const createPlot = async (req, res) => {
  try {
    const parseResult = PlotSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed on plot details',
        issues: parseResult.error.flatten().fieldErrors
      });
    }

    const userId = req.user?.id || 'demo-farmer-id';
    const newPlot = {
      id: crypto.randomUUID(),
      user_id: userId,
      ...parseResult.data,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabaseAdmin
        .from('farm_plots')
        .insert([newPlot])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ success: true, data });
    }

    devStorage.plots.unshift(newPlot);
    return res.status(201).json({ success: true, data: newPlot });
  } catch (err) {
    console.error('[Create Plot Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deletePlot = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || 'demo-farmer-id';

    if (isSupabaseConfigured()) {
      const { error } = await supabaseAdmin
        .from('farm_plots')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return res.status(200).json({ success: true, message: 'Plot removed successfully' });
    }

    const index = devStorage.plots.findIndex(p => p.id === id && p.user_id === userId);
    if (index !== -1) {
      devStorage.plots.splice(index, 1);
    }
    return res.status(200).json({ success: true, message: 'Plot removed successfully' });
  } catch (err) {
    console.error('[Delete Plot Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
