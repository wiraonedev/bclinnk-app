# Bclinnk CM - Mobile WebView App (Android & iOS)

Aplikasi mobile WebView wrapper berbasis React Native & Expo untuk portal **Bclinnk Channel Manager (Extranet)** (`https://cm.bclinnk.com/`).

Aplikasi ini dirancang khusus untuk operasional staf dan pengelola hotel/properti di platform **Android** dan **iOS**:
- **Target Portal**: `https://cm.bclinnk.com/` (Channel Manager & Operasional Kamar).
- **Persistent Session & Caching**: Sesi login dan cookies disimpan secara persisten sehingga pengguna tidak perlu login berulang kali setiap membuka aplikasi.
- **Dukungan Unduh Laporan**: Link ekspor laporan (Excel, PDF, CSV) otomatis dialihkan ke Download Manager native.
- **Dukungan Unggah Berkas & Kamera**: Mendukung `<input type="file">` untuk unggah foto properti atau dokumen dengan izin kamera dan penyimpanan Android & iOS.
- **In-App Browser**: Membuka tautan eksternal (OTA eksternal, WhatsApp, portal bank) tanpa menutup aplikasi.
- **Android Back Button**: Navigasi mundur riwayat WebView dan proteksi double-tap untuk keluar aplikasi.
- **Resilience & Offline Screen**: Tampilan offline yang ramah pengguna dengan tombol Coba Lagi jika koneksi internet terputus.
- **Hybrid Push Notification (`expo-notifications`)**: Mendukung notifikasi native via WebView JS Bridge (`window.BclinnkNative.notify`), polyfill otomatis HTML5 `new Notification()`, Deep Navigation saat notifikasi di-tap, serta siap dihubungkan ke Firebase Cloud Messaging.
- **100% Free Cloud Build**: Dibuat langsung di cloud GitHub Actions secara gratis tanpa membutuhkan Mac atau Android Studio di komputer lokal.

---

## 🛠️ Pilihan Workflow Build di GitHub Actions

| Workflow | File YAML | Output Format | Kegunaan Utama |
| :--- | :--- | :--- | :--- |
| **Build Android APK** | `build-apk.yml` | `.apk` | Pengujian langsung / instalasi manual di HP Android (*unknown source / sideloading*). |
| **Build Android App Bundle** | `build-aab.yml` | `.aab` | Format resmi wajib Google Play Store (*Internal Testing / Production*). |
| **Build iOS App** | `build-ios.yml` | `.app.zip` / `.ipa` | **100% Gratis**: Simulator build (`.zip`) untuk Mac/Simulator dan Unsigned `.ipa` untuk iPhone fisik via Sideloadly. |

---

## 🍏 Panduan Build iOS Gratis di GitHub Actions

Anda tidak membutuhkan komputer Mac untuk mem-build aplikasi iOS. Cukup gunakan runner `macos-15` (Sequoia / Apple Silicon M1/M2) gratis di GitHub Actions:

### 1. Menjalankan Build iOS
1. Buka repositori Anda di browser: [https://github.com/wiraonedev/bclinnk-app/actions](https://github.com/wiraonedev/bclinnk-app/actions).
2. Di panel sebelah kiri, pilih workflow **"Build iOS App"**.
3. Klik tombol dropdown **Run workflow** di sebelah kanan.
4. Pilih target build:
   - `both` (Default): Menghasilkan Simulator `.app.zip` dan Device `.ipa` sekaligus.
   - `simulator`: Menghasilkan berkas Simulator untuk Mac / web testing.
   - `device-ipa`: Menghasilkan berkas Unsigned `.ipa` untuk dipasang ke iPhone fisik.
5. Klik tombol hijau **Run workflow** dan tunggu proses selesai (~6–9 menit).

### 2. Memasang ke iPhone Fisik (Tanpa Bayar Apple Developer)
1. Unduh artifact **`bclinnk-ios-build`** dari halaman run workflow.
2. Di dalamnya terdapat file **`bclinnk-cm-unsigned.ipa`**.
3. Unduh software gratis [Sideloadly](https://sideloadly.io/) atau AltStore di PC/Mac Anda.
4. Hubungkan iPhone ke komputer via kabel USB, buka Sideloadly, seret file `bclinnk-cm-unsigned.ipa`, masukkan Apple ID gratis Anda, lalu klik **Start**.
5. Di iPhone, buka *Settings > General > VPN & Device Management*, lalu percayai (*Trust*) akun pengembang Anda. Aplikasi Bclinnk CM siap dibuka!

---

## 🔔 Cara Menggunakan Fitur Push Notification dari Website (`cm.bclinnk.com`)

Aplikasi ini telah menyuntikkan jembatan JavaScript (*JS Bridge*) ke dalam halaman `cm.bclinnk.com`:

### 1. Memicu Notifikasi Langsung dari Kode Web / Console
```javascript
// Cara A: Menggunakan helper resmi BclinnkNative
window.BclinnkNative.notify(
  'Reservasi Baru Masuk!',
  'Kamar Deluxe - Check-in 15 Nov',
  { url: 'https://cm.bclinnk.com/' } // Opsional: URL tujuan saat notifikasi di-tap
);

// Cara B: Menggunakan standar HTML5 Web Notification (otomatis di-polyfill ke Native)
new Notification('Booking Baru #INV-001', {
  body: 'Tamu: Budi Santoso (2 Malam)',
  data: { url: 'https://cm.bclinnk.com/' }
});
```

---

## 🚀 Panduan Build APK & AAB Android

1. Buka tab **Actions** di repositori GitHub.
2. Pilih **"Build Android APK"** (untuk `.apk`) atau **"Build Android App Bundle (.aab)"** (untuk Google Play Store).
3. Klik **Run workflow**, tunggu selesai, lalu unduh hasilnya dari bagian **Artifacts**.

---

## ⚙️ Mengubah Target URL (Dinamis)

Aplikasi ini dirancang modular. Jika Anda ingin mengarahkan WebView ke properti lain atau halaman utama portal Bclinnk:
1. Buka file [`src/config/appConfig.ts`](file:///Users/raiwirawan/Desktop/MAGANG_BC_SOLUTIONS_2026/WEBSITE_DEVELOPMENT/November/01-11-2026-membuat-aplikasi-android-bclinnk/src/config/appConfig.ts).
2. Ubah properti `initialUrl`:
   ```typescript
   export const APP_CONFIG = {
     appName: 'Bclinnk CM',
     initialUrl: 'https://cm.bclinnk.com/', // Ganti dengan URL baru
     // ...
   };
   ```

---

## 📂 Struktur Direktori Proyek

```
├── .github/
│   └── workflows/
│       ├── build-apk.yml        # CI/CD Build APK Android (Testing/Unknown sources)
│       ├── build-aab.yml        # CI/CD Build AAB Android (Google Play Store)
│       └── build-ios.yml        # CI/CD Build iOS (Simulator .zip & Unsigned .ipa)
├── assets/                      # Icon, Splash Screen, Adaptive Icon
├── src/
│   ├── components/
│   │   ├── BclinnkWebView.tsx   # Komponen utama WebView wrapper
│   │   ├── LoadingBar.tsx       # Indikator loading halus di atas
│   │   └── OfflineView.tsx      # Halaman saat koneksi internet terputus
│   ├── config/
│   │   └── appConfig.ts         # Konfigurasi URL dan tema
│   ├── hooks/
│   │   ├── useBackButton.ts     # Penanganan tombol Back Android
│   │   └── useNotifications.ts  # Penanganan Push Notification & Deep Link
│   └── utils/
│       ├── urlHandler.ts        # Klasifikasi link internal, eksternal, & deep link
│       └── webViewBridge.ts     # Jembatan komunikasi WebView <-> Native
├── App.tsx                      # Entry point React Native
├── app.config.js                # Konfigurasi dinamis Expo (Android & iOS Firebase auto-detect)
├── app.json                     # Konfigurasi package ID (com.bclinnk.app) & infoPlist iOS
└── package.json
```
