# CatatUang

Aplikasi mobile offline untuk mencatat transaksi harian dan memisahkan keuangan **Catering** dan **Pribadi**.

## Tech Stack

- React Native (Expo SDK 54) + TypeScript
- expo-router (bottom tabs)
- expo-sqlite (penyimpanan lokal)

## Fitur MVP

1. **Tambah Transaksi** – tanggal, tipe (pemasukan/pengeluaran), kategori (catering/pribadi), deskripsi, jumlah
2. **Daftar Transaksi** – filter Hari Ini / Bulan Ini, dikelompokkan per tanggal, total harian
3. **Ringkasan Bulanan** – total pemasukan/pengeluaran catering, laba catering, total pribadi, saldo bersih

## Menjalankan

```bash
npm install
npm start
```

Lalu pilih iOS simulator, Android emulator, atau pindai QR dengan Expo Go.

## Struktur Proyek

- `app/` – layar (Expo Router)
- `src/db/` – inisialisasi SQLite & repository transaksi
- `src/models/` – tipe data
- `src/hooks/` – useDatabase, useTransactions, useSummary
- `src/components/` – komponen UI
- `src/utils/` – format Rupiah, helper tanggal
- `src/constants/` – tema (warna, spacing)

## Arsitektur

Layered: **Screen → Hook → Repository → Database**. Data hanya disimpan lokal (offline).
