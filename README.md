# CVision - Analisis CV AI 🚀

CVision adalah aplikasi *web* modern yang memanfaatkan kecerdasan buatan (AI) untuk menganalisis Curriculum Vitae (CV) pengguna. Aplikasi ini dirancang untuk memberikan masukan komprehensif agar CV kamu lebih ramah sistem ATS (*Applicant Tracking System*) dan meningkatkan peluangmu diterima kerja.

Seluruh antarmuka, umpan balik AI, dan dokumentasi aplikasi ini **100% menggunakan Bahasa Indonesia** yang ramah untuk pengguna awam.

---

## Fitur Utama ✨

- 🤖 **Analisis AI Cerdas**: Menggunakan teknologi **Google Gemini AI** untuk mengekstrak dan menganalisis struktur bahasa, panjang kalimat, dan dampak profesional dalam CV kamu.
- 🎯 **Skor ATS Terperinci**: Dapatkan skor untuk kesan pertama, tingkat keringkasan, dan tata bahasa.
- 💡 **Umpan Balik Layman-Friendly**: Bahasa yang digunakan AI tidak menghakimi, melainkan memotivasi dan sangat mudah dipahami.
- 🔑 **Pendeteksi Kata Kunci**: Lihat kata kunci penting apa saja yang sudah ada di CV-mu dan apa yang masih kurang (berdasarkan target pekerjaan yang dituju).
- 💾 **Riwayat Analisis**: Fitur penyimpanan riwayat ke *database* MySQL, lengkap dengan fitur hapus riwayat mandiri.
- 🔐 **Sistem Autentikasi Aman**: Registrasi dan login super aman menggunakan `NextAuth.js` dan hashing *Bcrypt*.

---

## Teknologi yang Digunakan 🛠️

Aplikasi ini dibangun menggunakan *stack* teknologi *Full-Stack* yang modern:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions, Server Components)
- **Database**: [MySQL](https://www.mysql.com/) diakses melalui [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan skema warna OKLCH kustom (Deep Purple & Vibrant Blue)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/) (`@google/generative-ai`)
- **PDF Parser**: `pdf-parse` untuk ekstraksi teks CV

---

## Panduan Instalasi Lokal 💻

Ikuti langkah-langkah di bawah ini untuk menjalankan CVision di komputermu sendiri:

### 1. Kloning Repository
```bash
git clone <url-repository>
cd cvision
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables (`.env`)
Buat file bernama `.env` di *root* folder proyek kamu, lalu isi dengan format berikut:

```env
# Koneksi ke Database MySQL lokal (pastikan XAMPP/MySQL service menyala)
DATABASE_URL="mysql://root:@localhost:3306/cvision"

# Rahasia untuk NextAuth (bisa di-generate menggunakan perintah: openssl rand -base64 32)
NEXTAUTH_SECRET="rahasia_super_aman_anda"
NEXTAUTH_URL="http://localhost:3000"

# API Key Google Gemini (Dapatkan di Google AI Studio)
GEMINI_API_KEY="AIzaSy_API_KEY_ANDA_DI_SINI"

# Opsional: Jika Gemini melimitasi, kita bisa atur rantai model cadangan
GEMINI_MODEL="gemini-2.0-flash,gemini-1.5-flash-8b"
```

### 4. Setup Database Prisma
Setelah mengatur `.env`, lakukan migrasi untuk membuat tabel di MySQL:
```bash
npx prisma generate
npx prisma db push
```

### 5. Jalankan Server Development
```bash
npm run dev
```

Akses `http://localhost:3000` di browser Anda! 🎉

---

## Struktur Folder 📂

- `/app`: Rute utama Next.js (Halaman Landing, Dashboard, Auth)
- `/components`: Komponen antarmuka yang dapat digunakan ulang (UploadZone, AnalysisResult, dsb)
- `/components/ui`: Komponen dasar dari *shadcn/ui*
- `/lib`: Fungsi utilitas, store Zustand, instansiasi Prisma, dan konfigurasi AI Gemini
- `/prisma`: Definisi skema database Prisma

---

## Lisensi 📝

Proyek ini dibuat untuk tujuan edukasi dan portofolio pengembangan aplikasi berbasis AI.
