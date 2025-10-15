# Google Apps Script untuk Leaderboard Otomatis

Skrip ini menyediakan backend sederhana untuk menerima data dan secara otomatis membuat serta memperbarui leaderboard di dalam Google Sheet.

## 📝 Prasyarat

1.  Akun Google.
2.  Spreadsheet Google baru.

## 🚀 Langkah-langkah Setup & Deployment

### 1. Siapkan Google Sheet Anda

1.  Buat [Google Sheet](https://sheets.new) baru.
2.  Salin **ID Spreadsheet** dari URL. ID ini adalah string panjang di antara `/d/` dan `/edit`.
    -   Contoh URL: `https://docs.google.com/spreadsheets/d/`**`ABC123XYZ456`**`/edit`
    -   Contoh ID: `ABC123XYZ456`

### 2. Konfigurasi Skrip

1.  Buka proyek Google Apps Script yang berisi file `Code.gs`.
2.  Buka file `Code.gs`.
3.  Ganti nilai variabel `SPREADSHEET_ID` dengan ID Spreadsheet yang sudah Anda salin.
    ```javascript
    // Ganti dengan ID Spreadsheet Anda
    var SPREADSHEET_ID = "GANTI_DENGAN_ID_ANDA";
    ```
4.  Secara default, skrip akan membuat dua sheet:
    *   `Data`: Untuk menyimpan semua data mentah yang masuk.
    *   `Leaderboard`: Untuk menampilkan data yang sudah diurutkan.
    Anda bisa mengubah nama sheet `Data` di variabel `SHEET_NAME` jika perlu.

### 3. Deploy sebagai Web App

1.  Di editor Apps Script, klik **Deploy** > **New deployment**.
2.  Klik ikon gerigi (⚙️) di sebelah "Select type", lalu pilih **Web app**.
3.  Isi konfigurasi berikut:
    *   **Description**: (Opsional) Beri deskripsi, misalnya "API Leaderboard".
    *   **Execute as**: `Me`.
    *   **Who has access**: `Anyone` (Pilih `Anyone, even anonymous` jika Anda ingin endpoint ini bisa diakses secara publik tanpa perlu login Google).
4.  Klik **Deploy**.
5.  Google akan meminta Anda untuk memberikan izin. Klik **Authorize access**, pilih akun Google Anda, dan ikuti petunjuk untuk memberikan izin yang diperlukan.
6.  Setelah selesai, Anda akan mendapatkan **Web app URL**. Salin URL ini. Ini adalah endpoint API Anda.

## ⚙️ Cara Menggunakan (Mengirim Data)

Kirim data ke **Web app URL** yang Anda dapatkan menggunakan metode `POST` dengan body berformat JSON. Pastikan `Content-Type` di-set ke `application/json`.

Header di sheet `Data` akan dibuat secara otomatis saat data pertama kali masuk, berdasarkan *key* dari JSON yang Anda kirim. Skrip ini secara khusus akan mencari *key* `Skor` dan `Waktu` untuk pengurutan.

### Contoh menggunakan cURL

Berikut adalah contoh cara mengirim data menggunakan `cURL` dari terminal. Ganti `YOUR_WEB_APP_URL` dengan URL Anda.

```bash
curl -L -X POST 'YOUR_WEB_APP_URL' \
-H 'Content-Type: application/json' \
--data-raw '{
    "Nama": "Pemain Satu",
    "Skor": 1500,
    "Waktu": 120.5
}'
```

### Contoh data lain:

```bash
curl -L -X POST 'YOUR_WEB_APP_URL' \
-H 'Content-Type: application/json' \
--data-raw '{
    "Nama": "Pemain Dua",
    "Skor": 1800,
    "Waktu": 110.2
}'
```

Setiap kali Anda mengirim data baru, sheet `Data` akan terisi, dan sheet `Leaderboard` akan otomatis diperbarui dan diurutkan.
