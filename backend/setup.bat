@echo off
echo ========================================
echo Setting up IRA Django Backend
echo ========================================

echo.
echo [1/4] Creating virtual environment...
python -m venv venv

echo.
echo [2/4] Activating virtual environment and installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt

echo.
echo [3/4] Running migrations...
python manage.py makemigrations users
python manage.py makemigrations papers
python manage.py makemigrations reviews
python manage.py makemigrations journal
python manage.py migrate

echo.
echo [4/4] Creating media directory...
if not exist "media\papers\pdfs" mkdir media\papers\pdfs

echo.
echo ========================================
echo Setup complete!
echo.
echo To start the development server:
echo   call venv\Scripts\activate.bat
echo   python manage.py runserver
echo.
echo To create a superuser:
echo   python manage.py createsuperuser
echo ========================================
