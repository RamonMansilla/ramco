# RAMNCO - Guarda el token de Vercel (una sola vez por PC)
# Uso: doble clic en setup-vercel.bat
#
# Crea el token en: https://vercel.com/account/tokens
#   Name:  dsh-ramnco
#   Scope: Full Account
#   Expiration: la que prefieras (maximo 1 ano)

param([string]$Token)

$ErrorActionPreference = 'Stop'

if (-not $Token) {
    Write-Host ''
    Write-Host '=== RAMNCO - publicar en Vercel ===' -ForegroundColor Cyan
    Write-Host 'Crea un token en: https://vercel.com/account/tokens' -ForegroundColor Yellow
    Write-Host ''
    $secure = Read-Host -Prompt 'Pega el token de Vercel (no se vera en pantalla)' -AsSecureString
    $ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try { $Token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) }
    finally { [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}

$Token = $Token.Trim()
if ([string]::IsNullOrWhiteSpace($Token)) {
    Write-Host 'No escribiste ningun token.' -ForegroundColor Red
    exit 1
}

try {
    $vercel = Invoke-RestMethod -Uri 'https://api.vercel.com/v2/user' -Headers @{ Authorization = "Bearer $Token" }
    Write-Host ("Token valido para la cuenta: " + $vercel.user.username) -ForegroundColor Green
}
catch {
    Write-Host 'El token de Vercel no es valido.' -ForegroundColor Red
    exit 1
}

$file = Join-Path $env:USERPROFILE '.ramnco-vercel-token'
Set-Content -LiteralPath $file -Value $Token -NoNewline -Encoding ascii
Write-Host ''
Write-Host "Token guardado en $file (fuera del repositorio)." -ForegroundColor Green
Write-Host 'Ahora puedes usar publicar.bat o el atajo "Publicar RAMNCO".' -ForegroundColor DarkGray
