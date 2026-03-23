Set-Location (Split-Path -Parent $PSScriptRoot)
docker compose up --build -d
Write-Host "Prelegal running at http://localhost:8000"
