param(
    [string]$CommitMsg = "auto update",
    [string]$RepoUrl = "https://github.com/Lavr0v0/Lavr0v0.github.io.git",
    [string]$Branch = "main"
)

$CurrentDir = Get-Location
$GitDir = Join-Path $CurrentDir ".git"

function Fail($msg) {
    Write-Host $msg
    exit 1
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Fail "Git is not installed or not in PATH."
}

if (-not (Test-Path $GitDir)) {
    Write-Host "No git repo found. Initializing current folder..."

    git init
    if ($LASTEXITCODE -ne 0) {
        Fail "git init failed."
    }

    git branch -M $Branch

    $remoteNames = git remote
    if ($remoteNames -match "^origin$") {
        git remote set-url origin $RepoUrl
    }
    else {
        git remote add origin $RepoUrl
    }

    git fetch origin
    if ($LASTEXITCODE -ne 0) {
        Fail "git fetch failed."
    }

    $remoteBranchInfo = git ls-remote --heads origin $Branch

    if ($remoteBranchInfo) {
        Write-Host "Remote branch exists. Pulling remote history into current folder..."
        git pull origin $Branch --allow-unrelated-histories --no-rebase

        if ($LASTEXITCODE -ne 0) {
            Write-Host "Normal pull failed. Trying local-first setup..."
        }
    }
    else {
        Write-Host "Remote branch does not exist yet."
    }
}

Set-Location $CurrentDir

Write-Host "Current directory: $CurrentDir"

$changes = git status --porcelain

if ($changes) {
    Write-Host "Local changes detected, committing first"
    git add .
    git commit -m $CommitMsg

    if ($LASTEXITCODE -ne 0) {
        Fail "Commit failed."
    }
}
else {
    Write-Host "No local changes"
}

Write-Host "Pulling latest changes from remote"
git pull --rebase origin $Branch

if ($LASTEXITCODE -ne 0) {
    Write-Host "Rebase pull failed. Trying normal pull..."
    git pull origin $Branch --allow-unrelated-histories --no-rebase

    if ($LASTEXITCODE -ne 0) {
        Fail "Pull failed. You likely have merge conflicts that need manual resolution."
    }
}

Write-Host "Pushing to remote"
git push -u origin $Branch

if ($LASTEXITCODE -ne 0) {
    Fail "Push failed."
}

Write-Host "Done"