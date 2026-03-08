#!/bin/bash
echo "========================================"
echo "Setting up IRA Django Backend"
echo "========================================"

echo ""
echo "[1/4] Creating virtual environment..."
python -m venv venv

echo ""
echo "[2/4] Activating virtual environment and installing dependencies..."
source venv/Scripts/activate
pip install -r requirements.txt

echo ""
echo "[3/4] Running migrations..."
python manage.py makemigrations users
python manage.py makemigrations papers
python manage.py makemigrations reviews
python manage.py makemigrations journal
python manage.py migrate

echo ""
echo "[4/4] Creating media directory..."
mkdir -p media/papers/pdfs

echo ""
echo "========================================"
echo "Setup complete!"
echo ""
echo "To start the development server:"
echo "  source venv/Scripts/activate"
echo "  python manage.py runserver"
echo ""
echo "To create a superuser:"
echo "  python manage.py createsuperuser"
echo "========================================"
