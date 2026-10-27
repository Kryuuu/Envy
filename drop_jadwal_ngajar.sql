-- ==============================================================================
-- Script SQL untuk Menghapus Tabel & Policy Jadwal Ngajar di Supabase
-- ==============================================================================
-- Jalankan query berikut di Supabase SQL Editor (Dashboard > SQL Editor)

-- 1. Hapus Policy Row Level Security jika ada
DROP POLICY IF EXISTS "Enable all operations for anon users" ON public.jadwal_ngajar;

-- 2. Hapus Tabel jadwal_ngajar beserta constraint terkait jika ada
DROP TABLE IF EXISTS public.jadwal_ngajar CASCADE;
