@echo off
echo Checking git status...
git status
echo.
echo Adding all changes...
git add .
echo.
set "commit_msg=Update files"
set /p "commit_msg=Enter commit message (default: Update files): "
git commit -m "%commit_msg%"
echo.
echo Pushing to remote repository...
git push origin main
echo.
echo Done!
pause