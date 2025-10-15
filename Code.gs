// Ganti dengan ID Spreadsheet Anda
var SPREADSHEET_ID = "17yJO8_g1GAjv958x_b20mLq66q72A6ZoR4W8voU7C5E"; 

// Nama sheet untuk menyimpan data mentah
var SHEET_NAME = "Data";

/**
 * Fungsi ini akan dijalankan ketika ada permintaan POST ke URL web app.
 * Ini akan menangani data yang masuk dan menambahkannya ke Google Sheet.
 */
function doPost(e) {
  try {
    // Pastikan ada konten dalam body request
    if (e.postData.contents) {
      var data = JSON.parse(e.postData.contents);

      // Validasi data dasar (pastikan objek tidak kosong)
      if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
        
        // Jika sheet "Data" tidak ada, buat baru
        if (!sheet) {
          sheet = SpreadsheetApp.openById(SPREADSHEET_ID).insertSheet(SHEET_NAME);
          // Tentukan header jika sheet baru dibuat (sesuaikan dengan data Anda)
          sheet.appendRow(["Timestamp", "Nama", "Skor", "Waktu"]); 
        }

        // Ambil header dari sheet untuk mencocokkan data
        var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        var newRow = headers.map(function(header) {
          // Tambahkan timestamp secara otomatis jika ada kolomnya
          if (header.toLowerCase() === "timestamp") {
            return new Date();
          }
          // Cocokkan data dari JSON dengan nama header (case-insensitive)
          for (var key in data) {
            if (key.toLowerCase() === header.toLowerCase()) {
              return data[key];
            }
          }
          return ""; // Beri nilai kosong jika tidak ada data yang cocok
        });

        // Tambahkan baris baru ke sheet
        sheet.appendRow(newRow);

        // Panggil fungsi untuk memperbarui leaderboard
        updateLeaderboard();

        // Kirim respons sukses
        return ContentService
          .createTextOutput(JSON.stringify({ "status": "success", "message": "Data berhasil ditambahkan dan leaderboard diperbarui." }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        throw new Error("Data yang diterima kosong atau formatnya salah.");
      }
    } else {
      throw new Error("Tidak ada data yang diterima.");
    }
  } catch (error) {
    // Logging error untuk debugging
    Logger.log(error.toString());
    
    // Kirim respons error
    return ContentService
      .createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Fungsi ini hanya untuk pengujian awal atau jika ada yang mengakses URL via browser.
 */
function doGet(e) {
  return HtmlService.createHtmlOutput("Endpoint Google Apps Script untuk Leaderboard sudah aktif. Gunakan metode POST untuk mengirim data.");
}

/**
 * Fungsi ini membaca data dari sheet "Data", mengurutkannya, 
 * dan menampilkannya di sheet "Leaderboard".
 */
function updateLeaderboard() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var dataSheet = ss.getSheetByName(SHEET_NAME);
  var leaderboardSheet = ss.getSheetByName("Leaderboard");

  // Jika sheet "Leaderboard" tidak ada, buat baru
  if (!leaderboardSheet) {
    leaderboardSheet = ss.insertSheet("Leaderboard");
  }

  // Hapus konten lama di sheet Leaderboard
  leaderboardSheet.clear();

  // Ambil semua data dari sheet "Data", kecuali header
  var dataRange = dataSheet.getDataRange();
  var dataValues = dataRange.getValues();
  
  // Jika tidak ada data (hanya header), hentikan eksekusi
  if (dataValues.length <= 1) {
    leaderboardSheet.appendRow(["Leaderboard masih kosong."]);
    return;
  }
  
  var headers = dataValues.shift(); // Ambil dan simpan header
  
  // Cari indeks kolom "Skor" dan "Waktu" (case-insensitive)
  var scoreIndex = -1;
  var timeIndex = -1;
  headers.forEach(function(header, i) {
    if (header.toLowerCase() === 'skor') {
      scoreIndex = i;
    }
    if (header.toLowerCase() === 'waktu') {
      timeIndex = i;
    }
  });

  // Pastikan kolom "Skor" ada
  if (scoreIndex === -1) {
    leaderboardSheet.appendRow(["Error: Kolom 'Skor' tidak ditemukan di sheet 'Data'."]);
    return;
  }

  // Urutkan data: Skor tertinggi, lalu Waktu tercepat (jika ada)
  dataValues.sort(function(a, b) {
    // Urutkan berdasarkan Skor (Descending)
    var scoreA = parseFloat(a[scoreIndex]) || 0;
    var scoreB = parseFloat(b[scoreIndex]) || 0;
    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }
    
    // Jika Skor sama, urutkan berdasarkan Waktu (Ascending), jika ada
    if (timeIndex !== -1) {
      var timeA = parseFloat(a[timeIndex]) || Infinity;
      var timeB = parseFloat(b[timeIndex]) || Infinity;
      return timeA - timeB;
    }
    
    return 0; // Jika skor sama dan tidak ada waktu
  });

  // Tambahkan kembali header ke sheet Leaderboard
  leaderboardSheet.appendRow(headers);
  
  // Tulis data yang sudah diurutkan ke sheet Leaderboard
  leaderboardSheet.getRange(2, 1, dataValues.length, headers.length).setValues(dataValues);
}
