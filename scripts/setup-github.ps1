# RAMCO - Guarda las credenciales de GitHub para poder hacer push
# Uso: doble clic en setup-github.bat
# Tambien sirve para renovar el token cuando expire.

param([string]$Token)

$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent

if (-not $Token) {
    Write-Host ''
    Write-Host '=== RAMCO - credenciales de GitHub ===' -ForegroundColor Cyan
    Write-Host 'Crea un token en: https://github.com/settings/tokens/new' -ForegroundColor Yellow
    Write-Host 'Scopes: repo + read:org' -ForegroundColor Yellow
    Write-Host ''
    $secure = Read-Host -Prompt 'Pega el token (no se vera en pantalla)' -AsSecureString
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { $Token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}

$Token = $Token.Trim()
if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Host 'No escribiste ningun token.' -ForegroundColor Red
    exit 1
}

# 1. Validar contra la API de GitHub
try {
    $me = Invoke-RestMethod -Uri 'https://api.github.com/user' -Headers @{
        Authorization  = "Bearer $Token"
        'User-Agent'   = 'ramco-setup'
        Accept         = 'application/vnd.github+json'
    }
    Write-Host ("Token valido para la cuenta: " + $me.login) -ForegroundColor Green
}
catch {
    Write-Host 'El token no es valido o no puede leer la cuenta.' -ForegroundColor Red
    exit 1
}

# 2. Guardar credenciales para git (administrador de credenciales de Windows)
git -C $Root config --unset-all credential.helper 2>$null | Out-Null
git -C $Root config --unset-all 'credential.https://github.com.helper' 2>$null | Out-Null
git -C $Root config credential.helper manager

$payload = "protocol=https`nhost=github.com`nusername=$($me.login)`npassword=$Token`n`n"
$payload | git credential approve
if ($LASTEXITCODE -ne 0) {
    Write-Host 'No se pudieron guardar las credenciales.' -ForegroundColor Red
    exit 1
}

Write-Host ''
Write-Host 'Credenciales guardadas. Ya puedes ejecutar sync.bat.' -ForegroundColor Green
Write-Host 'Recuerda revocar el token viejo si generaste uno nuevo.' -ForegroundColor DarkGray
