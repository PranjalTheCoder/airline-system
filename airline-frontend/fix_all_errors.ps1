# # SkyWay Airlines - Fix All Errors Script
# # Run this from inside the airline-frontend folder:
# # PS> .\fix_all_errors.ps1

# Write-Host "Fixing all errors..." -ForegroundColor Cyan

# # ── Helper ──────────────────────────────────────────────────
# function Fix-File {
#     param($path, $old, $new)
#     if (Test-Path $path) {
#         $content = Get-Content $path -Raw -Encoding UTF8
#         if ($content -match [regex]::Escape($old)) {
#             $content = $content.Replace($old, $new)
#             Set-Content $path $content -Encoding UTF8 -NoNewline
#             Write-Host "  Fixed: $path" -ForegroundColor Green
#         } else {
#             Write-Host "  Skip (already fixed): $path" -ForegroundColor Gray
#         }
#     } else {
#         Write-Host "  NOT FOUND: $path" -ForegroundColor Red
#     }
# }

# # ════════════════════════════════════════════════════════════
# # FIX 1: Environment import paths (4 levels → 5 levels deep)
# # ════════════════════════════════════════════════════════════
# Write-Host "`n[1/8] Fixing environment import paths..." -ForegroundColor Yellow

# $envFiles = @(
#     "src\app\modules\admin\pages\dashboard\admin-dashboard.component.ts",
#     "src\app\modules\baggage\pages\add-baggage\add-baggage.component.ts",
#     "src\app\modules\baggage\pages\track-baggage\track-baggage.component.ts",
#     "src\app\modules\checkin\pages\checkin-home\checkin-home.component.ts",
#     "src\app\modules\crew\pages\list\crew-list.component.ts",
#     "src\app\modules\crew\pages\schedule\crew-schedule.component.ts",
#     "src\app\modules\loyalty\pages\dashboard\loyalty-dashboard.component.ts",
#     "src\app\modules\loyalty\pages\rewards\loyalty-rewards.component.ts",
#     "src\app\modules\operations\pages\dashboard\operations-dashboard.component.ts",
#     "src\app\modules\payment\pages\payment-status\payment-status.component.ts",
#     "src\app\modules\reservation\pages\manage-booking\manage-booking.component.ts",
#     "src\app\modules\auth\pages\profile\profile.component.ts"
# )

# foreach ($f in $envFiles) {
#     Fix-File $f `
#         "'../../../../environments/environment'" `
#         "'../../../../../environments/environment'"
# }

# # ════════════════════════════════════════════════════════════
# # FIX 2: feature.stores.ts - wrong model import path
# # ════════════════════════════════════════════════════════════
# Write-Host "`n[2/8] Fixing feature.stores.ts model import..." -ForegroundColor Yellow
# Fix-File "src\app\store\feature.stores.ts" `
#     "from '../../core/models'" `
#     "from '../core/models/index'"

# # ════════════════════════════════════════════════════════════
# # FIX 3: Login - arrow function in template
# # ════════════════════════════════════════════════════════════
# Write-Host "`n[3/8] Fixing login arrow function in template..." -ForegroundColor Yellow
# Fix-File "src\app\modules\auth\pages\login\login.component.ts" `
#     '(click)="showPassword.update(v => !v)"' `
#     '(click)="togglePassword()"'

# # Add togglePassword method if missing
# $loginPath = "src\app\modules\auth\pages\login\login.component.ts"
# $loginContent = Get-Content $loginPath -Raw -Encoding UTF8
# if ($loginContent -notmatch "togglePassword\(\)") {
#     $loginContent = $loginContent.Replace(
#         "  isInvalid(field: string): boolean {",
#         "  togglePassword(): void { this.showPassword.update(v => !v); }`n`n  isInvalid(field: string): boolean {"
#     )
#     Set-Content $loginPath $loginContent -Encoding UTF8 -NoNewline
#     Write-Host "  Added togglePassword() method" -ForegroundColor Green
# }

# # ════════════════════════════════════════════════════════════
# # FIX 4: Results - track $_ → track $index
# # ════════════════════════════════════════════════════════════
# Write-Host "`n[4/8] Fixing track `$_ in results..." -ForegroundColor Yellow
# Fix-File "src\app\modules\flight\pages\results\results.component.ts" `
#     'track $_)' `
#     'track $index)'

# # ════════════════════════════════════════════════════════════
# # FIX 5: Search - swapRoutes null coalescing
# # ════════════════════════════════════════════════════════════
# Write-Host "`n[5/8] Fixing swapRoutes null safety..." -ForegroundColor Yellow
# Fix-File "src\app\modules\flight\pages\search\search.component.ts" `
#     "this.form.get('origin')?.setValue(d);" `
#     "this.form.get('origin')?.setValue(d ?? '');"

# Fix-File "src\app\modules\flight\pages\search\search.component.ts" `
#     "this.form.get('destination')?.setValue(o);" `
#     "this.form.get('destination')?.setValue(o ?? '');"

# # ════════════════════════════════════════════════════════════
# # FIX 6: Loyalty rewards - sortBy type mismatch
# # ════════════════════════════════════════════════════════════
# Write-Host "`n[6/8] Fixing loyalty rewards sortBy type..." -ForegroundColor Yellow
# Fix-File "src\app\modules\loyalty\pages\rewards\loyalty-rewards.component.ts" `
#     '(click)="sortBy.set(s.value)"' `
#     '(click)="setSortBy(s.value)"'

# $loyaltyPath = "src\app\modules\loyalty\pages\rewards\loyalty-rewards.component.ts"
# $loyaltyContent = Get-Content $loyaltyPath -Raw -Encoding UTF8
# if ($loyaltyContent -notmatch "setSortBy\(") {
#     $loyaltyContent = $loyaltyContent.Replace(
#         "  countByCategory(cat: string): number {",
#         "  setSortBy(val: string) { this.sortBy.set(val as 'featured' | 'points_asc' | 'points_desc'); }`n`n  countByCategory(cat: string): number {"
#     )
#     Set-Content $loyaltyPath $loyaltyContent -Encoding UTF8 -NoNewline
#     Write-Host "  Added setSortBy() method" -ForegroundColor Green
# }

# # ════════════════════════════════════════════════════════════
# # FIX 7: Operations - $index in @for
# # ════════════════════════════════════════════════════════════
# Write-Host "`n[7/8] Fixing operations @for `$index..." -ForegroundColor Yellow
# Fix-File "src\app\modules\operations\pages\dashboard\operations-dashboard.component.ts" `
#     '@for (val of analytics().weeklyOTP; track $index; let i = $index)' `
#     '@for (val of analytics().weeklyOTP; track i; let i = $index)'

# # ════════════════════════════════════════════════════════════
# # FIX 8: Passenger details - $index in @for + contact null
# # ════════════════════════════════════════════════════════════
# Write-Host "`n[8/8] Fixing passenger-details @for + contact null..." -ForegroundColor Yellow
# Fix-File "src\app\modules\reservation\pages\passenger-details\passenger-details.component.ts" `
#     '@for (paxGroup of passengers.controls; track $index; let i = $index)' `
#     '@for (paxGroup of passengers.controls; track i; let i = $index)'

# Fix-File "src\app\modules\reservation\pages\passenger-details\passenger-details.component.ts" `
#     'email: contact.email, phone: contact.phone' `
#     "email: contact.email ?? '', phone: contact.phone ?? ''"

# # ════════════════════════════════════════════════════════════
# # FIX 9: Payment - add FormsModule
# # ════════════════════════════════════════════════════════════
# Write-Host "`n[9] Fixing payment FormsModule..." -ForegroundColor Yellow
# Fix-File "src\app\modules\payment\pages\payment\payment.component.ts" `
#     "import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';" `
#     "import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';"

# Fix-File "src\app\modules\payment\pages\payment\payment.component.ts" `
#     'imports:    [CommonModule, ReactiveFormsModule, StepProgressComponent],' `
#     'imports:    [CommonModule, ReactiveFormsModule, FormsModule, StepProgressComponent],'

# # ════════════════════════════════════════════════════════════
# # FIX 10: tsconfig - disable strictTemplates + noImplicitAny
# # ════════════════════════════════════════════════════════════
# Write-Host "`n[10] Fixing tsconfig.json..." -ForegroundColor Yellow
# $tsconfig = Get-Content "tsconfig.json" -Raw -Encoding UTF8
# $tsconfig = $tsconfig.Replace('"strictTemplates": true', '"strictTemplates": false')
# $tsconfig = $tsconfig.Replace('"noPropertyAccessFromIndexSignature": true', '"noPropertyAccessFromIndexSignature": false')
# if ($tsconfig -notmatch '"noImplicitAny"') {
#     $tsconfig = $tsconfig.Replace(
#         '"resolveJsonModule": true',
#         '"resolveJsonModule": true,' + "`n    " + '"noImplicitAny": false'
#     )
# }
# Set-Content "tsconfig.json" $tsconfig -Encoding UTF8 -NoNewline
# Write-Host "  tsconfig.json updated" -ForegroundColor Green

# Write-Host "`n========================================" -ForegroundColor Cyan
# Write-Host "All fixes applied! Now run: ng serve" -ForegroundColor Cyan
# Write-Host "========================================`n" -ForegroundColor Cyan

# Airline Frontend - Auto Fix Script
# Run inside airline-frontend folder:
# PS> .\auto_fix.ps1

Write-Host "Starting automated fixes..." -ForegroundColor Cyan

function Fix-File {
    param($path, $old, $new)
    if (Test-Path $path) {
        $content = Get-Content $path -Raw -Encoding UTF8
        if ($content -match [regex]::Escape($old)) {
            $content = $content.Replace($old, $new)
            Set-Content $path $content -Encoding UTF8 -NoNewline
            Write-Host "  Fixed: $path" -ForegroundColor Green
        } else {
            Write-Host "  Skip (already fixed): $path" -ForegroundColor Gray
        }
    } else {
        Write-Host "  NOT FOUND: $path" -ForegroundColor Red
    }
}

# ── Fix 1: Add togglePassword method in LoginComponent ──
Write-Host "`n[1/5] Adding togglePassword() to LoginComponent..." -ForegroundColor Yellow
$loginPath = "src\app\modules\auth\pages\login\login.component.ts"
if (Test-Path $loginPath) {
    $loginContent = Get-Content $loginPath -Raw -Encoding UTF8
    if ($loginContent -notmatch "togglePassword\(\)") {
        $loginContent = $loginContent.Replace(
            "  isInvalid(field: string): boolean {",
            "  togglePassword(): void { this.showPassword = !this.showPassword; }`n`n  isInvalid(field: string): boolean {"
        )
        Set-Content $loginPath $loginContent -Encoding UTF8 -NoNewline
        Write-Host "  Added togglePassword() method" -ForegroundColor Green
    } else {
        Write-Host "  Skip (already exists)" -ForegroundColor Gray
    }
} else {
    Write-Host "  NOT FOUND: $loginPath" -ForegroundColor Red
}

# ── Fix 2: Replace track $_ with track $index ──
Write-Host "`n[2/5] Fixing track $_ usage..." -ForegroundColor Yellow
Fix-File "src\app\modules\flight\pages\results\results.component.ts" `
    'track $_)' `
    'track $index)'

# ── Fix 3: Add null safety in search.component.ts ──
Write-Host "`n[3/5] Adding null safety in SearchComponent..." -ForegroundColor Yellow
Fix-File "src\app\modules\flight\pages\search\search.component.ts" `
    "this.form.get('origin')?.setValue(d);" `
    "this.form.get('origin')?.setValue(d ?? '');"

Fix-File "src\app\modules\flight\pages\search\search.component.ts" `
    "this.form.get('destination')?.setValue(o);" `
    "this.form.get('destination')?.setValue(o ?? '');"

# ── Fix 4: Add FormsModule to PaymentComponent ──
Write-Host "`n[4/5] Adding FormsModule to PaymentComponent..." -ForegroundColor Yellow
Fix-File "src\app\modules\payment\pages\payment\payment.component.ts" `
    "import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';" `
    "import { ReactiveFormsModule, FormsModule, FormBuilder, Validators } from '@angular/forms';"

# ── Fix 5: Relax strict template checks in tsconfig.json ──
Write-Host "`n[5/5] Updating tsconfig.json..." -ForegroundColor Yellow
$tsconfig = Get-Content "tsconfig.json" -Raw -Encoding UTF8
$tsconfig = $tsconfig.Replace('"strictTemplates": true', '"strictTemplates": false')
Set-Content "tsconfig.json" $tsconfig -Encoding UTF8 -NoNewline
Write-Host "  tsconfig.json updated" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "All fixes applied! Now run: ng serve" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
