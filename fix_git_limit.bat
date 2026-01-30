@echo off
echo ==========================================
echo       MEMPERBAIKI ERROR GIT (FILE TERLALU BESAR)
echo ==========================================

echo 1. Membatalkan commit terakhir (tapi kode aman)...
git reset --soft HEAD~1

echo 2. Mengeluarkan file video besar dari antrian upload...
git restore --staged "public/projects/Kurihing Cine.mov"

echo 3. Mengupload kode lannya tanpa video besar...
git commit -m "Update code (skip large video)"
git push

echo ==========================================
echo SELESAI! Kode aman terupload. Video harus dikompres dulu.
echo ==========================================
pause
