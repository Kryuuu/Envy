@echo off
echo ==========================================
echo    FINAL FIX: GIT RESET & CLEANUP
echo ==========================================

echo 1. Resetting history to safe point (b6a0f93)...
git reset --soft b6a0f93

echo 2. Unstaging large video file...
git reset HEAD "public/projects/Kurihing Cine.mov"

echo 3. Deleting large video file...
del "public\projects\Kurihing Cine.mov"

echo 4. Adding safe files...
git add .

echo 5. Committing...
git commit -m "Update: YouTube integration and Chatbot features"

echo 6. Pushing to Envy remote...
git push Envy main

echo ==========================================
echo DONE!
echo ==========================================
pause
