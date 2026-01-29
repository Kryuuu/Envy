@echo off
echo ==========================================
echo       FIXING VERCEL DEPLOYMENT
echo ==========================================

echo 1. Menghapus pnpm-lock.yaml secara paksa...
del /f /q pnpm-lock.yaml
git rm -f pnpm-lock.yaml --ignore-unmatch

echo 2. Menyimpan perubahan ke Git...
git add .
git commit -m "Force remove pnpm-lock.yaml for Vercel"

echo 3. Mengirim ke GitHub...
git push

echo ==========================================
echo SELESAI! Cek Vercel sekarang.
echo ==========================================
pause
