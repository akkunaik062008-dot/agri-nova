export const getMarketPrices = async (req, res) => {
  try {
    const { region = 'Midwest / Global Central', category = 'All' } = req.query;

    const commodities = [
      {
        id: 'c-1',
        name: 'Durum Wheat',
        category: 'Cereals & Grains',
        current_price_per_ton: 315.50,
        change_24h_pct: 2.4,
        demand_rating: 'High',
        price_unit: 'USD / Metric Ton',
        ai_outlook: 'Strong milling demand in domestic processing hubs. Prices projected to firm up over the next 45 days due to winter harvest transition.',
        recommended_action: 'Hold 40% for post-harvest premium; forward-contract remainder.',
        trend: [302, 305, 308, 304, 310, 312, 315.5]
      },
      {
        id: 'c-2',
        name: 'Hybrid Yellow Maize',
        category: 'Cereals & Grains',
        current_price_per_ton: 198.20,
        change_24h_pct: -0.8,
        demand_rating: 'Moderate',
        price_unit: 'USD / Metric Ton',
        ai_outlook: 'Ethanol and poultry feed consumption steady. Ample regional inventories keeping upside bounded within a 3% band.',
        recommended_action: 'Stagger spot deliveries across consecutive weeks.',
        trend: [205, 203, 200, 201, 199, 197, 198.2]
      },
      {
        id: 'c-3',
        name: 'Soybeans (Non-GMO)',
        category: 'Pulses & Legumes',
        current_price_per_ton: 462.00,
        change_24h_pct: 3.1,
        demand_rating: 'Very High',
        price_unit: 'USD / Metric Ton',
        ai_outlook: 'Export demand surges for certified organic/non-GMO shipments. Protein extraction plants paying a 12% premium over basis.',
        recommended_action: 'Prioritize certified cleaning and sorting for export grading.',
        trend: [438, 442, 445, 450, 452, 458, 462.0]
      },
      {
        id: 'c-4',
        name: 'Kabuli Chickpea (Garbanzo)',
        category: 'Pulses & Legumes',
        current_price_per_ton: 780.00,
        change_24h_pct: 1.5,
        demand_rating: 'High',
        price_unit: 'USD / Metric Ton',
        ai_outlook: 'Mediterranean import demand robust. Caliber 9mm+ seeds fetching exceptional margins in retail packaging channels.',
        recommended_action: 'Grade by seed diameter before marketing.',
        trend: [750, 755, 762, 768, 770, 775, 780.0]
      },
      {
        id: 'c-5',
        name: 'Long-Staple Cotton',
        category: 'Cash Crops',
        current_price_per_ton: 1840.00,
        change_24h_pct: -1.2,
        demand_rating: 'Moderate',
        price_unit: 'USD / Metric Ton',
        ai_outlook: 'Textile spinning mills reporting elevated cotton-yarn stock. Fiber strength index >30g/tex retains solid bid.',
        recommended_action: 'Lock in minimum price guarantee options with local ginneries.',
        trend: [1890, 1880, 1865, 1850, 1855, 1845, 1840.0]
      },
      {
        id: 'c-6',
        name: 'Roma Processing Tomatoes',
        category: 'Vegetables & Fruits',
        current_price_per_ton: 165.00,
        change_24h_pct: 4.8,
        demand_rating: 'Very High',
        price_unit: 'USD / Metric Ton',
        ai_outlook: 'Canning and paste facilities ramping up seasonal throughput. High brix content (>5.5) eligible for tier-1 factory bonuses.',
        recommended_action: 'Coordinate harvest delivery windows directly with cannery schedulers.',
        trend: [150, 152, 155, 158, 160, 162, 165.0]
      }
    ];

    const filtered = category === 'All' 
      ? commodities 
      : commodities.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));

    return res.status(200).json({
      success: true,
      region,
      as_of: new Date().toISOString(),
      commodities: filtered,
      market_intelligence_summary: {
        headline: 'Export demand surges for specialty legumes and processing vegetables',
        key_driver: 'Favorable logistics corridors and processing plant procurement incentives create high ROI for farmers with high-grade produce.',
        volatility_index: 'Moderate (14.2%)',
        recommended_focus: 'High-value legumes (Soybean, Chickpea) and Drip-irrigated Roma Tomatoes.'
      }
    });
  } catch (err) {
    console.error('[Market Controller Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
