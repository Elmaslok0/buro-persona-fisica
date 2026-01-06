#!/bin/bash

# Script para desplegar en Koyeb
# Este script crea un servicio en Koyeb con todas las configuraciones necesarias

KOYEB_TOKEN="hd5jm703iz15mgmqlmcbtws3iuon5sdrrtgeeq5sy4i7okmgulhpmtmx537deq6w"
APP_NAME="buro-persona-fisica"
SERVICE_NAME="buro-pf-app"
GITHUB_REPO="https://github.com/tu-usuario/buro-persona-fisica.git"  # Cambiar por tu repo

# Variables de entorno
DATABASE_URL="postgres://koyeb-adm:npg_Peb9lw0RKQEX@ep-floral-mouse-agfp728w.c-2.eu-central-1.pg.koyeb.app/koyebdb?sslmode=require"
BURO_API_BASE_URL="https://api.burodecredito.com.mx:4431/devpf"
BURO_API_USERNAME="apif.burodecredito.com.mx:Onsite:Onsite007$$"
BURO_API_CLIENT_ID="l7f4ab9619923343069e3a48c3209b61e4"
BURO_API_CLIENT_SECRET="ee9ba699e9f54cd7bbe7948e0884ccc9"

echo "Desplegando en Koyeb..."
echo "Nombre de la app: $APP_NAME"
echo "Nombre del servicio: $SERVICE_NAME"

# Nota: Este script es una referencia. 
# Para desplegar, sube el código a GitHub y crea el servicio desde la interfaz de Koyeb
# o usa la API de Koyeb directamente.

echo "Variables de entorno configuradas:"
echo "- DATABASE_URL"
echo "- BURO_API_BASE_URL"
echo "- BURO_API_USERNAME"
echo "- BURO_API_CLIENT_ID"
echo "- BURO_API_CLIENT_SECRET"
