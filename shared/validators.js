import { z } from 'zod';

export const AdvisoryInputSchema = z.object({
  plot_id: z.string().optional().nullable().or(z.literal("")),
  plot_name: z.string().optional().nullable(),
  region: z.string().optional(),
  season: z.enum(['Kharif', 'Rabi', 'Zaid', 'Spring', 'Summer', 'Autumn', 'Winter'], {
    errorMap: () => ({ message: "Please select a valid farming season" })
  }),
  soil_type: z.string().min(2, "Soil type required").optional(),
  nitrogen_ppm: z.coerce.number().min(0, "Nitrogen must be >= 0").max(500, "Nitrogen max is 500 ppm"),
  phosphorus_ppm: z.coerce.number().min(0, "Phosphorus must be >= 0").max(500, "Phosphorus max is 500 ppm"),
  potassium_ppm: z.coerce.number().min(0, "Potassium must be >= 0").max(500, "Potassium max is 500 ppm"),
  ph_level: z.coerce.number().min(0, "pH must be >= 0").max(14, "pH must be <= 14"),
  irrigation_type: z.enum(['Drip', 'Sprinkler', 'Flood', 'Rainfed', 'Sub-irrigation'], {
    errorMap: () => ({ message: "Please select a valid irrigation method" })
  }),
  budget_per_acre: z.coerce.number().positive("Budget per acre must be greater than 0"),
  target_market: z.string().min(2, "Target market must be specified")
});

export const PlotSchema = z.object({
  name: z.string().min(2, "Plot name must be at least 2 characters"),
  area_acres: z.coerce.number().positive("Area must be greater than 0"),
  soil_type: z.string().min(2, "Soil type is required"),
  default_irrigation: z.string().min(2, "Irrigation type is required"),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable()
});

export const DiagnosticInputSchema = z.object({
  image: z.string().min(20, "Valid image payload (base64 or URL) is required"),
  plot_id: z.string().optional().nullable(),
  crop_type: z.string().optional().nullable()
});

export const MarketQuerySchema = z.object({
  region: z.string().optional(),
  category: z.string().optional()
});
