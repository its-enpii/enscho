export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-slate-500 font-medium mb-1">Total Jurusan</h3>
           <p className="text-3xl font-bold text-slate-900">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-slate-500 font-medium mb-1">Total Berita</h3>
           <p className="text-3xl font-bold text-slate-900">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-slate-500 font-medium mb-1">Pengunjung Hari Ini</h3>
           <p className="text-3xl font-bold text-slate-900">120</p>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-100 p-6 rounded-xl">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Selamat Datang, Admin!</h2>
        <p className="text-slate-600">
          Gunakan menu di sebelah kiri untuk mengelola konten website sekolah. 
          Anda dapat memperbarui konfigurasi sekolah, menambah jurusan, menulis berita, dan mengupload foto galeri.
        </p>
      </div>
    </div>
  );
}
