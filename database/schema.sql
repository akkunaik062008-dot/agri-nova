-- ==============================================================================
-- AgriVision AI: Crop Advisory & Smart Farming Assistant
-- Database Schema & Row-Level Security (RLS) Policies for Supabase / PostgreSQL
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- Extends Supabase auth.users with agricultural organization details
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    organization_name TEXT,
    region TEXT NOT NULL DEFAULT 'North America',
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. FARM PLOTS TABLE
-- Manages physical plots of farmland with specific soil, area, and irrigation info
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.farm_plots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    area_acres NUMERIC(8,2) NOT NULL,
    soil_type TEXT NOT NULL,
    default_irrigation TEXT NOT NULL,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 3. CROP ADVISORIES TABLE
-- Stores AI-generated multi-variable crop recommendations and schedules
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crop_advisories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plot_id UUID REFERENCES public.farm_plots(id) ON DELETE SET NULL,
    season TEXT NOT NULL,
    soil_inputs JSONB NOT NULL,
    ai_response JSONB NOT NULL,
    recommended_crop TEXT NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. DIAGNOSTIC SCANS TABLE
-- Stores plant leaf pathology scans, visual findings, and treatment protocols
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.diagnostic_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plot_id UUID REFERENCES public.farm_plots(id) ON DELETE SET NULL,
    image_url TEXT NOT NULL,
    detected_disease TEXT NOT NULL,
    severity_level TEXT NOT NULL,
    confidence_score NUMERIC(5,2) NOT NULL,
    treatment_plan JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_farm_plots_user ON public.farm_plots(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_user ON public.crop_advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_user ON public.diagnostic_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_advisories_plot ON public.crop_advisories(plot_id);
CREATE INDEX IF NOT EXISTS idx_diagnostics_plot ON public.diagnostic_scans(plot_id);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Ensures complete multi-tenant tenant isolation per authenticated user
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_scans ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Farm Plots Policies
DROP POLICY IF EXISTS "Users can view own plots" ON public.farm_plots;
CREATE POLICY "Users can view own plots" ON public.farm_plots
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own plots" ON public.farm_plots;
CREATE POLICY "Users can insert own plots" ON public.farm_plots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own plots" ON public.farm_plots;
CREATE POLICY "Users can update own plots" ON public.farm_plots
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own plots" ON public.farm_plots;
CREATE POLICY "Users can delete own plots" ON public.farm_plots
    FOR DELETE USING (auth.uid() = user_id);

-- Crop Advisories Policies
DROP POLICY IF EXISTS "Users can view own advisories" ON public.crop_advisories;
CREATE POLICY "Users can view own advisories" ON public.crop_advisories
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own advisories" ON public.crop_advisories;
CREATE POLICY "Users can insert own advisories" ON public.crop_advisories
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own advisories" ON public.crop_advisories;
CREATE POLICY "Users can delete own advisories" ON public.crop_advisories
    FOR DELETE USING (auth.uid() = user_id);

-- Diagnostic Scans Policies
DROP POLICY IF EXISTS "Users can view own diagnostics" ON public.diagnostic_scans;
CREATE POLICY "Users can view own diagnostics" ON public.diagnostic_scans
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own diagnostics" ON public.diagnostic_scans;
CREATE POLICY "Users can insert own diagnostics" ON public.diagnostic_scans
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own diagnostics" ON public.diagnostic_scans;
CREATE POLICY "Users can delete own diagnostics" ON public.diagnostic_scans
    FOR DELETE USING (auth.uid() = user_id);
