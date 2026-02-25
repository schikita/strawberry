# Скрипт копирования видео перед загрузкой на сервер
# Запустите перед деплоем, чтобы видео попали в strawberry/videos/

$source = Join-Path $PSScriptRoot "..\videos"
$dest = Join-Path $PSScriptRoot "videos"

if (-not (Test-Path $source)) {
    Write-Host "Папка $source не найдена." -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $dest)) {
    New-Item -ItemType Directory -Path $dest -Force | Out-Null
}

$files = @("hero.mp4", "bg_cycle.mp4", "full-video.mp4", "2.mp4")
$copied = 0

foreach ($f in $files) {
    $srcPath = Join-Path $source $f
    if (Test-Path $srcPath) {
        Copy-Item $srcPath -Destination $dest -Force
        Write-Host "Скопировано: $f"
        $copied++
    } else {
        Write-Host "Не найден: $f (пропущен)" -ForegroundColor Yellow
    }
}

Write-Host "`nГотово. Скопировано файлов: $copied"
Write-Host "Теперь загрузите папку strawberry на сервер (включая videos/)."
