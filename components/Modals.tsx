'use client';

import React, { useState } from 'react';
import { MatchPost, Team, Player, MatchRoom, TeamNotification } from '@/lib/types';
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
  Bell,
  Flame,
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0e1726] border border-slate-700/80 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 flex items-center justify-center font-black italic text-lg shrink-0 shadow-md shadow-cyan-500/20">
              {getTeamInitials(post.team)}
            </div>
            <div>
              <h3 className="font-black text-base text-white">{post.team}</h3>
              <p className="text-xs text-cyan-400 font-semibold mt-0.5">
                {post.type === 'Đối thủ' ? 'Tìm đối thủ giao hữu' : 'Tuyển cầu thủ lẻ'} · {post.format}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-2 gap-2.5 text-xs p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300">
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
            <strong className="text-cyan-300">{post.court}</strong>
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
          <p className="text-xs text-slate-200 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 leading-relaxed">
            {post.note}
          </p>
        </div>

        {/* Vacancies (if any) */}
        {post.vacancies && post.vacancies.length > 0 && (
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
              VỊ TRÍ CẦN TUYỂN
            </span>
            <div className="flex flex-wrap gap-2">
              {post.vacancies.map((v) => (
                <span
                  key={v}
                  className="px-3 py-1 rounded-full bg-orange-950/70 border border-orange-800/60 text-orange-300 text-xs font-bold"
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
            <div className="text-center py-3 rounded-2xl text-xs text-orange-400 font-semibold border border-orange-800/50 bg-orange-950/40">
              Đây là tin do đội bạn tạo. Bạn có thể sửa hoặc đóng tin ở trang Đăng Kèo.
            </div>
          ) : (
            <button
              onClick={() => {
                sounds.playReady();
                onApply(post);
              }}
              disabled={isApplied || post.status !== 'open'}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                isApplied
                  ? 'bg-slate-900 text-cyan-300 border border-cyan-500/60 cursor-default'
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
  onSave: (team: Team) => void;
}

export function TeamEditModal({ isOpen, onClose, team, onSave }: TeamEditModalProps) {
  const [teamName, setTeamName] = useState(team.name);
  const [district, setDistrict] = useState(team.district);
  const [homePitch, setHomePitch] = useState(team.homePitch || '');
  const [accentColor, setAccentColor] = useState(team.accentColor || '#06b6d4');
  const [roster, setRoster] = useState<Player[]>(team.roster);

  if (!isOpen) return null;

  const handlePlayerChange = (id: string, field: keyof Player, value: string | number) => {
    setRoster(
      roster.map((p) => {
        if (p.id === id) {
          return { ...p, [field]: value };
        }
        return p;
      })
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playReady();
    onSave({
      ...team,
      name: teamName,
      district,
      homePitch,
      accentColor,
      roster,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0e1726] border border-slate-700/80 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm uppercase text-white">CHỈNH SỬA ĐỘI BÓNG &amp; 5 AVATAR</h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Tên đội bóng</label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Khu vực quận</label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">Sân bóng nhà</label>
            <input
              type="text"
              value={homePitch}
              onChange={(e) => setHomePitch(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Roster edit */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="block text-[11px] text-slate-300 uppercase font-bold">
              DANH SÁCH 5 CẦU THỦ RA SÂN
            </span>

            <div className="space-y-2">
              {roster.slice(0, 5).map((player, idx) => (
                <div key={player.id} className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center gap-2.5">
                  <span className="text-xs text-slate-500 w-4 font-bold">{idx + 1}</span>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handlePlayerChange(player.id, 'name', e.target.value)}
                    placeholder="Tên cầu thủ"
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                  <input
                    type="text"
                    maxLength={2}
                    value={player.shirt}
                    onChange={(e) => handlePlayerChange(player.id, 'shirt', e.target.value)}
                    placeholder="Số"
                    className="w-12 py-1.5 px-1 rounded-lg bg-slate-950 border border-slate-700 text-white text-center text-xs focus:outline-none focus:border-cyan-400 font-bold"
                  />
                  <select
                    value={player.position}
                    onChange={(e) => handlePlayerChange(player.id, 'position', e.target.value)}
                    className="py-1.5 px-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-bold"
                  >
                    <option value="GK">GK</option>
                    <option value="DEF">DEF</option>
                    <option value="MID">MID</option>
                    <option value="FWD">FWD</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 hover:brightness-110 text-slate-950 font-black uppercase text-xs tracking-wider transition-all shadow-md shadow-cyan-500/20"
          >
            LƯU THAY ĐỔI ĐỘI BÓNG
          </button>
        </form>
      </div>
    </div>
  );
}

/* 3. Notification Modal */
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  captainReady: boolean;
  requestsCount: number;
  hasMatch: boolean;
  onClear: () => void;
  notifications?: TeamNotification[];
}

export function NotificationModal({
  isOpen,
  onClose,
  captainReady,
  requestsCount,
  hasMatch,
  onClear,
  notifications = [],
}: NotificationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md bg-[#0e1726] border border-slate-700/80 rounded-3xl p-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto no-scrollbar">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm uppercase text-white">THÔNG BÁO ĐỘI BÓNG &amp; HỆ THỐNG</h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Team Notifications Stream */}
        <div className="space-y-2.5 text-xs">
          {notifications.map((notif) => (
            <div key={notif.id} className="p-3.5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-1 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{notif.title}</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded-full font-bold">
                  MỚI
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{notif.message}</p>
            </div>
          ))}

          {/* System Status Tickers */}
          <div className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-xs">Trạng thái Đội trưởng</p>
              <p className="text-[11px] text-slate-400">
                {captainReady ? 'Đã bật Ready - Sẵn sàng ghép trận' : 'Chưa bật Ready'}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                captainReady ? 'border-cyan-500 text-cyan-300 bg-cyan-950/70' : 'border-slate-700 text-slate-500'
              }`}
            >
              {captainReady ? 'SẴN SÀNG' : 'OFFLINE'}
            </span>
          </div>

          <div className="p-3 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div>
              <p className="font-bold text-white text-xs">Yêu cầu cáp kèo</p>
              <p className="text-[11px] text-slate-400">
                {requestsCount} yêu cầu đang xử lý
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500 text-amber-300 bg-amber-950/70">
              {requestsCount} YÊU CẦU
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onClear();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase transition-colors"
        >
          Đóng thông báo
        </button>
      </div>
    </div>
  );
}

/* 4. Post-Match Report Modal */
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

  if (!isOpen || !match) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playReady();
    onClose();
    onCompleteMatch(scoreA, scoreB, mvp);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-[#0e1726] border border-slate-700/80 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm uppercase text-white">BÁO CÁO KẾT QUẢ &amp; KÍCH HOẠT CS2 SHOWCASE</h3>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80 text-center space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              NHẬP TỶ SỐ CUỐI TRẬN
            </span>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <span className="block font-bold text-white text-xs mb-1 truncate max-w-[120px]">
                  {match.teamA.name}
                </span>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={scoreA}
                  onChange={(e) => setScoreA(parseInt(e.target.value) || 0)}
                  className="w-18 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-center font-black text-2xl focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <span className="text-2xl font-black text-slate-600">:</span>

              <div className="text-center">
                <span className="block font-bold text-white text-xs mb-1 truncate max-w-[120px]">
                  {match.teamB.name}
                </span>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={scoreB}
                  onChange={(e) => setScoreB(parseInt(e.target.value) || 0)}
                  className="w-18 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-center font-black text-2xl focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Bình chọn Cầu thủ xuất sắc nhất (MVP)
            </label>
            <select
              value={mvp}
              onChange={(e) => setMvp(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
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

          <div className="p-3.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/20 text-xs text-emerald-300">
            ✓ Xác nhận tỷ số sẽ tự động kích hoạt màn <strong>CS2 Post-Match Showcase</strong> (Victory hoặc Defeat) và cộng điểm Uy Tín Fair-Play.
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
          >
            ✓ XÁC NHẬN KẾT QUẢ &amp; MỞ MÀN CS2 SHOWCASE
          </button>
        </form>
      </div>
    </div>
  );
}
