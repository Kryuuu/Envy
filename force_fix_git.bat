@echo off
echo ==========================================
echo    MEMPERBAIKI ERROR GIT (FORCE FIX)
echo ==========================================

echo 1. Membatalkan 3 commit terakhir (menjaga kodingan aman)...
git reset --soft HEAD~3

echo 2. Menghapus file video besar dari antrian git...
git rm --cached "public/projects/Kurihing Cine.mov"
git restore --staged "public/projects/Kurihing Cine.mov"

echo 3. Menghapus file video besar dari komputer (jika masih ada)...
del "public\projects\Kurihing Cine.mov"

echo 4. Membuat commit baru yang bersih...
git add .
git commit -m "Fix: Remove large video and use YouTube"

echo 5. Mencoba push ulang...
git push

echo ==========================================
echo SELESAI! Coba cek apakah ada error di atas.
echo ==========================================
pause
