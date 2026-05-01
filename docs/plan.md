# CVision Plan
---

Image : D:\Project\CVision\docs\ai_resume_analyzer_architecture.svg


### Filosofi Sebelum Nulis Satu Baris Kode

Sebelum lo bahkan buka terminal, gua mau lo paham dulu *kenapa* setiap keputusan teknologi diambil. Banyak junior yang langsung loncat ke koding tanpa ngerti *mengapa* arsitekturnya dibentuk seperti itu, dan akibatnya pas ada masalah, mereka nggak tau harus ngapain. Proyek ini kecil di permukaan — "cuma upload PDF terus AI analisis" — tapi di dalamnya ada banyak keputusan arsitektur yang akan nentuin seberapa jauh proyek ini bisa berkembang dan seberapa mudah lo bisa debug kalau ada yang rusak.

Inti dari proyek ini adalah sebuah *pipeline*: file masuk, teks diekstrak, teks dikirim ke AI, respons AI distrukturisasi, data disimpan, dan hasil ditampilkan ke user. Setiap tahap pipeline itu bisa gagal secara independen, dan tugas lo sebagai arsitek adalah memastikan kalau salah satu tahap gagal, sistem bisa memberi tahu user dengan jelas kenapa gagal, bukan cuma lempar error 500 yang nggak berguna.

---

### Phase 1 — Memahami Domain dan Memetakan User Journey

Hal pertama yang selalu gua lakukan sebelum menyentuh tech stack adalah duduk dan benar-benar memahami *apa yang user ingin rasakan*. Bukan fiturnya, tapi perasaannya. User yang datang ke aplikasi ini adalah mahasiswa atau fresh graduate yang cemas dengan CV-nya. Mereka insecure, mereka nggak tau apakah CV mereka cukup baik, dan mereka mau jawaban yang *terasa dipercaya*, bukan asal-asalan.

Dari situ lo bisa derive bahwa UI harus *terasa premium dan meyakinkan*. Loading state-nya harus *informatif*, bukan cuma spinner kosong. Hasil analisisnya harus *terlihat seperti dari profesional HR sungguhan*, bukan keluaran chatbot yang asal jawab. Ini bukan soal estetika saja, ini soal *kepercayaan user terhadap produk*.

User journey-nya sederhana: user landing di halaman utama, mereka lihat value proposition yang langsung jelas, mereka daftar atau login, mereka upload CV, mereka tunggu analisis, mereka baca hasil, dan mereka bisa kembali lihat riwayat analisis sebelumnya. Setiap titik di journey itu harus *mulus* dan *tidak membingungkan*. Kalau ada titik di mana user harus berpikir lebih dari tiga detik tentang apa yang harus dilakukan, itu adalah bug desain, bukan fitur.

---

### Phase 2 — Memilih Tech Stack dan Alasannya

Sekarang kita bicara tech stack. Kenapa Next.js 15 dengan App Router? Karena App Router memberi lo *server components by default*, yang artinya halaman-halaman yang tidak butuh interaktivitas bisa di-render di server tanpa mengirim JavaScript ke browser. Landing page, halaman histori yang statik, semua itu bisa jadi server component. Hanya bagian yang memang butuh interaktivitas — upload zone, form analisis, hasil yang bisa di-tab-tab — yang perlu menjadi client component. Ini bagus untuk performa dan untuk SEO kalau nanti lo mau jadikan proyek ini serius.

Kenapa Tailwind CSS? Karena di proyek dengan deadline mepet seperti tugas kuliah, Tailwind memungkinkan lo untuk styling langsung di JSX tanpa bolak-balik ke file CSS. Tidak ada naming convention yang perlu dipikir, tidak ada specificity conflict, dan hasilnya konsisten. Tapi Tailwind sendiri cukup low-level, makanya lo butuh shadcn/ui di atasnya. shadcn bukan library komponen dalam arti tradisional — lo tidak install package-nya dan pakai komponennya begitu saja. Lo *copy komponen itu ke dalam codebase lo sendiri*, yang artinya lo punya full kontrol untuk memodifikasinya. Itu sangat penting untuk proyek yang punya desain spesifik.

Kenapa Prisma sebagai ORM? Karena Prisma punya *type safety yang sangat kuat*. Setiap query yang lo tulis akan di-typecheck oleh TypeScript. Kalau lo coba akses kolom yang tidak ada, TypeScript akan komplain sebelum kode bahkan dijalankan. Di proyek yang ada user data dan analisis tersimpan, bug di layer database bisa sangat mahal — Prisma meminimalisir risiko itu. Selain itu, Prisma Schema Language yang mereka pakai sangat mudah dibaca dan menjadi *dokumentasi hidup* dari struktur database lo.

Kenapa MySQL di localhost? Karena ini tugas kuliah. Lo tidak perlu setup database cloud yang kompleks. MySQL yang jalan di localhost lo sudah lebih dari cukup untuk development dan demo. Nanti kalau mau deploy serius, bisa migrasi ke PlanetScale atau Railway dengan perubahan yang minimal karena Prisma mengabstraksi layer database tersebut.

Kenapa NextAuth v5? Karena authentication adalah salah satu bagian paling berbahaya untuk diimplementasi sendiri. Hashing password, session management, CSRF protection, semua itu sudah ditangani oleh NextAuth. Tugas lo cukup konfigurasi provider-nya. Untuk proyek ini kita pakai Credentials Provider karena user registrasi dengan email dan password biasa, bukan OAuth.

Kenapa Zustand untuk state management? Karena Redux terlalu verbose untuk proyek seukuran ini dan Context API React bisa menyebabkan re-render yang tidak perlu kalau tidak hati-hati. Zustand ringan, intuitif, dan state-nya bisa di-share antar komponen tanpa perlu wrapper Provider yang bertumpuk.

Kenapa TanStack Query alias React Query? Karena fetching, caching, dan sinkronisasi server state adalah problem yang kompleks dan sudah diselesaikan dengan sangat baik oleh library ini. Ketika user navigasi ke halaman History, React Query akan cek apakah data sudah di-cache dan masih fresh. Kalau iya, data langsung ditampilkan tanpa loading. Kalau tidak, baru fetch ulang. Ini membuat aplikasi terasa jauh lebih cepat dari yang sebenarnya.

Kenapa Zod untuk validasi? Karena validasi harus terjadi di *dua tempat* — di frontend untuk UX, dan di backend untuk keamanan. Dengan Zod, lo bisa define schema validasi satu kali dan pakai di keduanya. Ini menghilangkan *validation drift*, yaitu kondisi di mana validasi di frontend dan backend tidak sinkron dan menyebabkan bug yang sangat sulit di-debug.

---

### Phase 3 — Arsitektur Database yang Tepat

Sekarang kita bicara tentang bagaimana data disimpan. Ada dua entitas utama: `User` dan `Analysis`. Relasinya straightforward — satu user bisa punya banyak analysis, tapi satu analysis hanya milik satu user.

Yang menarik adalah bagaimana menyimpan hasil analisis AI. Hasil dari Gemini akan berupa JSON yang kompleks — ada array of strings untuk kekuatan dan kelemahan, ada array of objects untuk saran perbaikan, ada object nested untuk keyword analysis, dan sebagainya. Lo punya dua pilihan: normalize data itu ke tabel-tabel relasional yang terpisah, atau simpan sebagai JSON column di MySQL.

Untuk proyek ini, jawaban yang tepat adalah JSON column. Ini karena struktur output AI bisa berubah seiring iterasi — mungkin nanti lo mau tambah skor baru, atau ubah format saran perbaikan. Kalau lo normalize ke tabel-tabel terpisah, setiap perubahan struktur output membutuhkan migrasi database. Dengan JSON column, lo cukup update logika parsing-nya di kode. Prisma mendukung JSON columns dengan sangat baik dan tetap memberikan type safety melalui TypeScript types yang lo definisikan sendiri.

Satu hal krusial lainnya: simpan `rawText` dari PDF, bukan file PDF-nya itu sendiri. Menyimpan binary file di database adalah anti-pattern yang akan memperlambat database lo secara signifikan seiring bertambahnya data. Yang lo butuhkan untuk semua operasi — re-analysis, searching, auditing — adalah teks, bukan file. Simpan nama file dan ukurannya untuk referensi, tapi teksnya yang jadi data primer.

Indexing juga penting. Pastikan kolom `userId` di tabel `Analysis` punya index, karena query yang paling sering dijalankan adalah "ambil semua analisis untuk user ini", dan tanpa index, MySQL akan melakukan full table scan setiap kali, yang semakin lambat seiring bertambahnya data.

---

### Phase 4 — Pipeline AI yang Robust

Ini jantung dari aplikasi. Pipeline-nya harus dirancang dengan asumsi bahwa setiap tahap *bisa dan akan gagal* pada suatu titik, dan sistem harus gracefully handle kegagalan itu.

Tahap pertama adalah *penerimaan file*. Ketika user upload PDF, lo harus validasi beberapa hal secara berurutan sebelum melakukan operasi yang mahal: apakah tipe MIME-nya memang `application/pdf`? Apakah ukurannya di bawah batas yang lo tetapkan, misalnya 5MB? Validasi ini murah dan harus dilakukan pertama sebelum file bahkan disentuh lebih jauh.

Tahap kedua adalah *ekstraksi teks*. Library `pdf-parse` akan membaca buffer file dan mengekstrak teks dari layer teks PDF. Di sini ada edge case penting yang banyak developer tidak antisipasi: PDF yang merupakan hasil scan atau foto, bukan PDF digital, tidak punya text layer. `pdf-parse` akan berhasil berjalan tapi menghasilkan teks yang kosong atau sangat pendek. Lo harus validasi panjang minimum teks yang diekstrak — kalau kurang dari, misalnya, 100 karakter, kemungkinan besar itu PDF scan dan lo harus beri tahu user bahwa PDF-nya tidak bisa diproses, bukan malah kirim teks kosong ke Gemini yang akan menghasilkan analisis yang nonsensical.

Tahap ketiga adalah *pembentukan prompt untuk Gemini*. Ini adalah seni tersendiri yang disebut *prompt engineering*. Prompt yang baik adalah prompt yang sangat spesifik tentang format output yang diinginkan. Gemini harus diperintahkan untuk mengembalikan *hanya JSON murni*, tanpa markdown code fence, tanpa penjelasan, tanpa preamble. Kalau lo tidak tegas soal ini, Gemini kadang akan membungkus JSON dengan backticks markdown, dan JSON.parse() akan gagal karena menemukan karakter yang tidak valid.

Prompt juga harus memberikan *persona* yang jelas kepada Gemini — "kamu adalah HR profesional berpengalaman 10 tahun" — karena ini secara signifikan meningkatkan kualitas dan relevansi output. Tanpa persona, output cenderung generic dan tidak berguna. Selain itu, kalau user memasukkan target posisi kerja, itu harus dimasukkan ke prompt karena akan membuat analisis jauh lebih targeted — CV untuk Software Engineer tentu dinilai berbeda dari CV untuk Marketing Manager.

Tahap keempat adalah *parsing respons Gemini*. Lo harus selalu wrap `JSON.parse()` dalam try-catch, karena walaupun prompt sudah sangat jelas, Gemini sesekali bisa mengembalikan format yang tidak valid, terutama kalau teks CV-nya sangat panjang atau berisi karakter-karakter aneh. Kalau parsing gagal, jangan lempar error 500 ke user — beri tahu mereka bahwa analisis tidak berhasil dan minta mereka coba lagi. Ini jauh lebih baik dari perspektif UX.

Tahap kelima adalah *penyimpanan ke database*. Setelah lo punya hasil analisis yang valid, simpan semuanya ke database dalam satu operasi Prisma create. Ini penting untuk *idempotency* — kalau save gagal di tengah jalan, lo tidak ingin sebagian data tersimpan dan sebagian tidak. Prisma menangani ini dengan baik melalui transactions kalau diperlukan.

---

### Phase 5 — Frontend Architecture yang Maintainable

Struktur folder frontend harus mencerminkan domain bisnis, bukan framework. Jangan organize berdasarkan "components, pages, hooks" saja — organize berdasarkan *fitur*. Semua yang berkaitan dengan resume analysis — upload component, result display, feedback cards — masuk ke `components/resume/`. Semua yang berkaitan dengan dashboard masuk ke `components/dashboard/`. Ini membuat codebase lebih mudah di-navigate ketika lo atau orang lain kembali ke proyek ini setelah beberapa minggu.

Untuk halaman utama atau landing page, ini adalah *first impression* dan harus meyakinkan user bahwa produk ini legitimate dan berguna. Landing page yang baik menjelaskan *satu hal dengan sangat jelas*: apa yang produk ini lakukan dan mengapa user harus peduli. Hindari daftar fitur yang panjang. Satu kalimat hero yang powerful lebih efektif dari sepuluh bullet point.

Komponen UploadZone adalah salah satu komponen paling kritis dari sisi UX. Ia harus support *drag and drop* karena itu cara alami orang berinteraksi dengan file upload. Gunakan library `react-dropzone` karena menangani semua edge case drag-and-drop dengan benar, termasuk dragging dari aplikasi eksternal, multiple file rejection, dan keyboard accessibility. Visual feedback saat file di-drag di atas zone harus jelas — border berubah warna, ada indikasi "lepas untuk upload" — karena tanpa feedback itu banyak user yang tidak yakin apakah aksi mereka berhasil.

Loading state saat analisis berjalan harus *informatif dan menenangkan*. Proses analisis Gemini bisa memakan waktu 10-15 detik untuk CV yang panjang. Itu adalah waktu yang terasa sangat lama kalau user hanya melihat spinner. Progress bar dengan pesan seperti "Mengekstrak teks dari PDF...", "Mengirim ke AI...", "Memproses hasil..." akan membuat waiting time terasa lebih pendek secara psikologis, bahkan kalau progress bar itu tidak mencerminkan progress real-time yang sesungguhnya.

Halaman hasil analisis adalah *money shot* dari aplikasi ini. Ini harus dirancang untuk memberi tahu user banyak informasi secara efisien tanpa overwhelming mereka. Gunakan tabs untuk mengelompokkan informasi — skor ada di atas sebagai summary, detail analisis per bagian ada di tab sendiri, keyword analysis ada di tab sendiri. Kode warna yang konsisten — merah untuk masalah, kuning untuk peringatan, hijau untuk positif — membantu user scan informasi dengan cepat.

---

### Phase 6 — Security yang Tidak Boleh Diabaikan

Walaupun ini tugas kuliah, kebiasaan security yang baik harus dimulai dari awal. Beberapa hal yang wajib ada.

Pertama, *authentication guard di setiap API route yang butuh login*. Setiap route yang menyentuh data user harus check session terlebih dahulu. Kalau session tidak ada atau tidak valid, return 401 immediately tanpa memproses request lebih lanjut. Ini mencegah unauthorized access ke data user lain.

Kedua, *ownership check di setiap database operation*. Ketika user minta data analisis dengan ID tertentu, jangan cukup hanya check apakah record dengan ID itu ada — check apakah `userId` pada record itu memang sama dengan user yang sedang login. Tanpa ini, seorang user bisa mengakses data analisis user lain hanya dengan mengganti-ganti angka ID di URL.

Ketiga, *validasi dan sanitasi semua input*. Setiap data yang masuk melalui request body harus divalidasi dengan Zod sebelum diproses. Ini bukan hanya untuk keamanan, tapi juga untuk memastikan data yang masuk ke database selalu dalam format yang benar.

Keempat, *rate limiting di endpoint analisis*. Gemini API punya quota. Seorang user yang iseng bisa melakukan loop request dan menghabiskan seluruh quota lo dalam hitungan menit. Implementasi sederhana adalah menyimpan timestamp analisis terakhir per user di database dan membatasi misalnya maksimal 10 analisis per user per hari.

---

### Phase 7 — Error Handling sebagai First-Class Citizen

Ini adalah hal yang paling sering diabaikan oleh developer junior dan paling sering menjadi sumber masalah di production. Error handling bukan sesuatu yang lo tambahkan di akhir setelah semua fitur jalan — itu harus didesain sejak awal bersama happy path-nya.

Setiap API route harus punya error handling yang mengembalikan pesan error yang *meaningful* ke frontend, bukan stack trace Node.js yang tidak berguna untuk user. Pesan error yang baik adalah pesan yang memberi tahu user *apa yang salah* dan *apa yang harus mereka lakukan*. "Gagal menganalisis CV" adalah pesan error yang buruk. "File PDF tidak bisa dibaca karena kemungkinan merupakan hasil scan. Coba upload PDF digital." adalah pesan error yang baik.

Di frontend, semua error dari API harus ditangkap dan ditampilkan melalui sistem notifikasi yang konsisten. Library Sonner yang lo install adalah toast notification library yang direkomendasikan shadcn. Gunakan ini untuk semua feedback ke user — sukses, error, warning — sehingga user selalu tahu apa yang terjadi tanpa harus refresh halaman atau bolak-balik lihat network tab di DevTools.

---

### Phase 8 — Testing dan Quality Assurance

Untuk proyek kuliah, lo mungkin tidak perlu unit test yang komprehensif, tapi ada beberapa *critical path* yang harus lo test secara manual dengan sangat seksama sebelum demo.

Test pertama: upload PDF yang valid dengan teks yang benar. Ini adalah happy path. Pastikan hasilnya muncul dengan benar dan tersimpan ke database.

Test kedua: upload PDF yang merupakan hasil scan. Pastikan sistem memberi tahu user dengan jelas bahwa PDF tidak bisa diproses, bukan hang atau crash.

Test ketiga: upload file bukan PDF, misalnya .docx atau .jpg. Pastikan sistem menolak dengan pesan yang jelas.

Test keempat: upload PDF yang sangat besar, di atas batas yang lo tetapkan. Pastikan ditolak sebelum mulai processing.

Test kelima: testing dengan koneksi internet yang lambat atau terputus saat Gemini API dipanggil. Pastikan ada timeout handling dan user diberi tahu kalau request gagal, bukan cuma loading selamanya.

Test keenam: testing ketika user mencoba mengakses histori analisis user lain dengan manipulasi URL. Pastikan sistem mengembalikan 404 atau 403, bukan data yang sebenarnya.

---

### Phase 9 — Polish dan Detail yang Membedakan

Inilah yang membedakan proyek yang *selesai* dengan proyek yang *bagus*. Detail kecil yang membuat user merasa aplikasi ini dibuat dengan care.

Skeleton loading state — ketika halaman history di-load, tampilkan skeleton yang bentuknya sama dengan kartu histori yang sebenarnya, bukan cuma spinner di tengah halaman. Ini secara visual jauh lebih sopan kepada user.

Empty state yang informatif — ketika user baru registrasi dan belum pernah upload CV, halaman dashboard dan history tidak boleh kosong begitu saja. Tampilkan ilustrasi dan call-to-action yang mengajak mereka untuk menganalisis CV pertama mereka.

Responsive design — pastikan semua halaman berfungsi dengan baik di mobile. Banyak mahasiswa akan mencoba aplikasi ini dari handphone mereka, dan kalau uploadnya tidak bisa dilakukan di mobile, itu adalah pengalaman yang sangat buruk.

Favicon dan metadata yang benar — hal sepele tapi sering dilupakan. Pastikan tab browser menampilkan nama aplikasi yang benar dan favicon yang proper, bukan icon default Next.js.

---

### Phase 10 — Deployment dan Final Touches

Untuk tugas kuliah yang mungkin di-demo di localhost, pastikan ada `README.md` yang jelas tentang cara setup dan menjalankan proyek. Dosen atau asisten yang menilai harus bisa menjalankan proyek lo *tanpa harus tanya-tanya*. README yang baik berisi: prasyarat yang dibutuhkan, langkah-langkah instalasi, cara setup environment variables, cara menjalankan migrasi database, dan cara menjalankan development server. Kalau perlu, sertakan juga sample `.env.example` yang berisi semua key yang dibutuhkan tanpa nilai yang sesungguhnya.

Kalau lo mau deploy ke Vercel untuk demo yang lebih meyakinkan, pastikan environment variables diset dengan benar di dashboard Vercel, dan MySQL local lo perlu diganti dengan database yang bisa diakses dari luar, misalnya PlanetScale yang gratis untuk use case kecil dan kompatibel penuh dengan Prisma.

---

### Urutan Pengerjaan yang Direkomendasikan

Gua selalu menyarankan untuk build dari *dalam ke luar* — mulai dari layer yang paling fundamental, pastikan ia bekerja, baru tambah layer di atasnya.

Mulai dari database: setup Prisma, tulis schema, jalankan migrasi, verifikasi tabel terbentuk dengan benar di MySQL.

Lanjut ke authentication: implementasi registrasi dan login, pastikan session berfungsi, pastikan API route yang dilindungi mengembalikan 401 untuk request tanpa session.

Lanjut ke core AI pipeline: implementasi PDF parsing dan Gemini integration terlebih dahulu sebagai fungsi standalone yang bisa di-test langsung tanpa UI. Test di script Node.js sederhana sebelum menghubungkannya ke API route.

Lanjut ke API routes: bungkus fungsi-fungsi yang sudah bekerja ke dalam HTTP handlers, tambahkan validasi dan error handling.

Baru terakhir bangun UI di atasnya: landing page, auth pages, dashboard, upload zone, results display. Di fase ini lo sudah tahu API bekerja dengan benar, jadi lo bisa fokus pada UX tanpa khawatir tentang backend.

---
