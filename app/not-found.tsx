import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-cyan-950/60 border border-cyan-700/50 flex items-center justify-center text-cyan-300 text-2xl font-black">
        404
      </div>
      <h1 className="text-xl font-bold">Không tìm thấy trang</h1>
      <p className="text-sm text-slate-400 max-w-sm">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-bold text-xs uppercase shadow-lg shadow-cyan-500/20"
      >
        Về trang chủ Kèo Five
      </Link>
    </div>
  );
}
