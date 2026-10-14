'use client';

import React, { useState } from 'react';
import { MatchPost, Team, Player, MatchRoom, PitchInfo } from '@/lib/types';
import { sounds } from '@/lib/sounds';
import { getTeamInitials, generatePlayerAvatar } from '@/lib/avatars';
import {
  X,
  Calendar,
  MapPin,
  Clock,
  Shield,
  Trophy,
  CheckCircle2,
  Phone,
  Sparkles,
  BarChart3,
  Award,
} from 'lucide-react';

/* 1. Post Detail Modal */
interface PostDetailModalProps {
  post: MatchPost | null;
  onClose: () => void;
  onApply: (post: MatchPost) => void;
  isApplied: boolean;
}

export function PostDetailModal({ post, onClose, onApply, isApplied }: PostDetailModalProps) {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0e1726] border border-slate-700 sm:rounded-3xl rounded-t-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-950/80 text-teal-300 border border-teal-700/50 flex items-center justify-center font-black italic text-lg shrink-0">
              {getTeamInitials(post.team)}
            </div>
            <div>
              <h3 className="font-black text-base text-white">{post.team}</h3>
              <p className="text-xs text-teal-400 font-semibold">
                {post.type === 'Đối thủ' ? 'Tìm đối thủ giao hữu' : 'Tuyển cầu thủ lẻ'} · {post.format}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Ngày thi đấu</span>
            <strong className="text-white">{post.date}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Giờ bóng lăn</span>
            <strong className="text-white">{post.time} ({post.duration || '90p'})</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Khu vực</span>
            <strong className="text-white">{post.district}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Tình trạng sân</span>
            <strong className="text-teal-300">{post.court}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Địa điểm sân</span>
            <strong className="text-white truncate block">{post.venue || 'Thỏa thuận'}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Chi phí thuê sân</span>
            <strong className="text-white">{post.cost}</strong>
          </div>
        </div>

        {/* Note */}
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            GHI CHÚ TỪ ĐỘI BÓNG
          </span>
          <p className="text-xs text-slate-200 p-3 rounded-xl bg-slate-900/60 border border-slate-800 leading-relaxed">
            {post.note}
          </p>
        </div>

        {/* Vacancies (if any) */}
        {post.vacancies && post.vacancies.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              VỊ TRÍ CẦN TUYỂN
            </span>
            <div className="flex flex-wrap gap-1.5">
              {post.vacancies.map((v) => (
                <span
                  key={v}
                  className="px-2.5 py-1 rounded-lg bg-orange-950/70 border border-orange-800/60 text-orange-300 text-xs font-bold"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2">
          {post.mine ? (
            <div className="text-center py-2 text-xs text-orange-400 font-semibold bg-orange-950/40 border border-orange-800/50 rounded-xl">
              Đây là tin do đội bạn tạo. Bạn có thể sửa hoặc đóng tin ở trang Đăng Kèo.
            </div>
          ) : (
            <button
              onClick={() => {
                sounds.playReady();
                onApply(post);
              }}
              disabled={isApplied || post.status !== 'open'}
              className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                isApplied
                  ? 'bg-slate-800 text-teal-300 border border-teal-700/60 cursor-default'
                  : 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 hover:brightness-110 active:scale-98 shadow-cyan-500/20'
              }`}
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> ĐÃ GỬI YÊU CẦU CHO ĐỘI NÀY
                </>
              ) : post.type === 'Đối thủ' ? (
                '⚔ GỬI YÊU CẦU CÁP KÈO'
              ) : (
                '✚ XIN THAM GIA ĐÁ LẺ'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* 2. Team Edit Modal */
interface TeamEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  onSave: (updatedTeam: Team) => void;
}

export function TeamEditModal({ isOpen, onClose, team, onSave }: TeamEditModalProps) {
  const [teamName, setTeamName] = useState(team.name);
  const [district, setDistrict] = useState(team.district);
  const [roster, setRoster] = useState<Player[]>([...team.roster]);

  if (!isOpen) return null;

  const handleUpdatePlayer = (index: number, field: keyof Player, val: string) => {
    const updated = [...roster];
    updated[index] = { ...updated[index], [field]: val };
    setRoster(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playReady();
    onSave({
      ...team,
      name: teamName.trim() || team.name,
      district,
      roster,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0e1726] border border-slate-700 sm:rounded-3xl rounded-t-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-base text-white">CHỈNH SỬA ĐỘI HÌNH &amp; CẦU THỦ</h3>
            <p className="text-xs text-slate-400">Đội trưởng đại diện sửa thông tin 5 avatar ra sân</p>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tên đội bóng
            </label>
            <input
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              5 CẦU THỦ CHÍNH THỨC
            </span>

            {roster.slice(0, 5).map((player, idx) => (
              <div
                key={player.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-teal-400 text-xs">
                    Cầu thủ {idx + 1} {idx === 0 && '(Đội trưởng)'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">ID: {player.id}</span>
                </div>
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-7">
                    <input
                      type="text"
                      placeholder="Tên cầu thủ"
                      value={player.name}
                      onChange={(e) => handleUpdatePlayer(idx, 'name', e.target.value)}
                      className="w-full py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="Số áo"
                      maxLength={3}
                      value={player.shirt}
                      onChange={(e) => handleUpdatePlayer(idx, 'shirt', e.target.value)}
                      className="w-full py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-center font-bold"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={player.role}
                      onChange={(e) => handleUpdatePlayer(idx, 'role', e.target.value as any)}
                      className="w-full py-1.5 px-1 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
                    >
                      <option value="Đội trưởng">Đội trưởng</option>
                      <option value="Tiền đạo">Tiền đạo</option>
                      <option value="Tiền vệ">Tiền vệ</option>
                      <option value="Hậu vệ">Hậu vệ</option>
                      <option value="Thủ môn">Thủ môn</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-cyan-500/20"
          >
            ✓ LƯU THAY ĐỔI ĐỘI HÌNH
          </button>
        </form>
      </div>
    </div>
  );
}

/* 3. Notifications Drawer Modal */
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  captainReady: boolean;
  requestsCount: number;
  hasMatch: boolean;
  onClear: () => void;
}

export function NotificationModal({
  isOpen,
  onClose,
  captainReady,
  requestsCount,
  hasMatch,
  onClear,
}: NotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0e1726] border border-slate-700 sm:rounded-3xl rounded-t-3xl p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-base text-white">THÔNG BÁO HỆ THỐNG</h3>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Trạng thái Đội trưởng</p>
              <p className="text-[11px] text-slate-400">
                {captainReady ? 'Đã bật Ready - Sẵn sàng ghép trận' : 'Chưa bật Ready'}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                captainReady ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {captainReady ? 'SẴN SÀNG' : 'OFFLINE'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Yêu cầu cáp kèo</p>
              <p className="text-[11px] text-slate-400">
                Bạn đã gửi {requestsCount} yêu cầu nhận kèo tới các đội
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-400 border border-teal-800">
              {requestsCount} YÊU CẦU
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="font-bold text-white">Phòng đấu Match Room</p>
              <p className="text-[11px] text-slate-400">
                {hasMatch ? 'Bạn đang có một phòng VS đang hoạt động' : 'Chưa có phòng trận'}
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-950 text-orange-400 border border-orange-800">
              {hasMatch ? 'KÍCH HOẠT' : 'TRỐNG'}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onClear();
            onClose();
          }}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
        >
          Đóng thông báo
        </button>
      </div>
    </div>
  );
}

/* 4. Post-Match AI Tactical Report Modal */
interface MatchReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchRoom | null;
  onCompleteMatch: (scoreA: number, scoreB: number, mvp: string) => void;
}

export function MatchReportModal({
  isOpen,
  onClose,
  match,
  onCompleteMatch,
}: MatchReportModalProps) {
  const [scoreA, setScoreA] = useState(4);
  const [scoreB, setScoreB] = useState(3);
  const [mvp, setMvp] = useState(match?.teamA.roster[0]?.name || 'MINH THẮNG');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !match) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playReady();
    setSubmitted(true);
    onCompleteMatch(scoreA, scoreB, mvp);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0e1726] border border-slate-700 sm:rounded-3xl rounded-t-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-base text-white">BÁO CÁO KẾT QUẢ &amp; AI TRACKING</h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="space-y-4 text-xs py-2">
            <div className="p-4 rounded-2xl bg-teal-950/60 border border-teal-600/60 text-center space-y-2">
              <span className="text-3xl font-black text-white">
                {match.teamA.name} {scoreA} - {scoreB} {match.teamB.name}
              </span>
              <p className="text-teal-300 font-bold">
                ✓ Trận đấu đã được lưu thành công vào lịch sử thành tích!
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/80 text-teal-200 font-bold">
                <Award className="w-4 h-4 text-amber-400" /> MVP Trận: {mvp}
              </div>
            </div>

            {/* AI Tactical Insights */}
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>AI TACTICAL ANALYSIS</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {match.teamA.name} kiểm soát thế trận tốt hơn ở khu vực trung lộ (56% thời lượng bóng). Khả năng phản công nhanh của bộ đôi tiền đạo tạo ra nhiều đột biến ở hiệp 2. Tinh thần fair-play của 2 đội đạt điểm tuyệt đối 98/100, không có va chạm nguy hiểm.
              </p>
              <div className="pt-2 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
                <div>Kiểm soát: <strong className="text-white">56% - 44%</strong></div>
                <div>Số cú sút: <strong className="text-white">12 - 9</strong></div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold"
            >
              Hoàn tất &amp; Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                NHẬP TỶ SỐ CUỐI TRẬN
              </span>
              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <span className="block font-bold text-white text-xs mb-1 truncate max-w-[100px]">
                    {match.teamA.name}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={scoreA}
                    onChange={(e) => setScoreA(parseInt(e.target.value) || 0)}
                    className="w-16 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-center font-black text-xl"
                  />
                </div>

                <span className="text-xl font-black text-slate-500">-</span>

                <div className="text-center">
                  <span className="block font-bold text-white text-xs mb-1 truncate max-w-[100px]">
                    {match.teamB.name}
                  </span>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={scoreB}
                    onChange={(e) => setScoreB(parseInt(e.target.value) || 0)}
                    className="w-16 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-center font-black text-xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Bình chọn Cầu thủ xuất sắc nhất (MVP)
              </label>
              <select
                value={mvp}
                onChange={(e) => setMvp(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                {match.teamA.roster.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} (#{p.shirt} - {match.teamA.name})
                  </option>
                ))}
                {match.teamB.roster.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} (#{p.shirt} - {match.teamB.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-xl bg-teal-950/40 border border-teal-800/50 text-[11px] text-teal-300">
              ✓ Hoàn tất trận đấu sẽ cộng <strong className="text-white">+15 Điểm Uy Tín Fair-Play</strong> cho cả 2 đội vào bảng xếp hạng phong trào.
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shadow-orange-500/20"
            >
              ✓ XÁC NHẬN KẾT QUẢ &amp; TẠO BÁO CÁO
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
