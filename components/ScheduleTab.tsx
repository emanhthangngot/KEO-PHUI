'use client';

import React from 'react';
import { MatchRoom, MatchRequest } from '@/lib/types';
import { sounds } from '@/lib/sounds';
import { getTeamInitials } from '@/lib/avatars';
import { Calendar, Clock, MapPin, Swords, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

interface ScheduleTabProps {
  activeMatch: MatchRoom | null;
  requests: MatchRequest[];
  onOpenMatchRoom: () => void;
  onNavigateToDiscover: () => void;
  onNavigateToPost: () => void;
  onNavigateToPitches: () => void;
}

export function ScheduleTab({
  activeMatch,
  requests,
  onOpenMatchRoom,
  onNavigateToDiscover,
  onNavigateToPost,
  onNavigateToPitches,
}: ScheduleTabProps) {
  const isLocked = activeMatch?.myConfirmed && activeMatch?.theirConfirmed;

  return (
    <div className="space-y-4 pb-6">
      {/* Title */}
      <div>
        <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
          FIXTURES &amp; TIMELINE
        </span>
        <h1 className="text-xl sm:text-2xl font-black italic text-white tracking-tight">
          LỊCH ĐẤU &amp; <span className="text-cyan-400">YÊU CẦU</span>
        </h1>
        <p className="text-xs text-slate-400">
          Theo dõi các trận đã chốt, phòng ghép đang chờ đối thủ và các yêu cầu cáp kèo đã gửi.
        </p>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="block text-xl sm:text-2xl font-black text-white">
            {isLocked ? 1 : 0}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Trận đã chốt</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="block text-xl sm:text-2xl font-black text-cyan-400">
            {activeMatch && !isLocked ? 1 : 0}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Đang chờ chốt</span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
          <span className="block text-xl sm:text-2xl font-black text-orange-400">
            {requests.length}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Yêu cầu đã gửi</span>
        </div>
      </div>

      {/* Active Match Section */}
      <section className="rounded-2xl border border-slate-800 bg-[#101a2c]/80 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            PHÒNG TRẬN HIỆN TẠI
          </span>
          {activeMatch && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isLocked
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                  : 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
              }`}
            >
              {isLocked ? 'ĐÃ CHỐT TRẬN' : 'CHỜ XÁC NHẬN'}
            </span>
          )}
        </div>

        {activeMatch ? (
          <div className="rounded-2xl border border-teal-500/30 bg-gradient-to-br from-[#122336] to-[#0c1424] p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-950/80 text-teal-300 border border-teal-700/50 flex items-center justify-center font-black italic text-base">
                  {getTeamInitials(activeMatch.teamB.name)}
                </div>
                <div>
                  <h3 className="font-black text-sm text-white">
                    {activeMatch.teamA.name} <span className="text-cyan-400">VS</span> {activeMatch.teamB.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeMatch.date} lúc {activeMatch.time} · {activeMatch.district}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 px-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{activeMatch.venue}</span>
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <Clock className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">{activeMatch.cost}</span>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onOpenMatchRoom();
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
            >
              <Swords className="w-3.5 h-3.5" />
              {isLocked ? 'XEM PHÒNG TRẬN ĐÃ CHỐT' : 'MỞ PHÒNG VS ĐỂ XÁC NHẬN'}
            </button>
          </div>
        ) : (
          <div className="py-6 text-center space-y-2 border border-dashed border-slate-800 rounded-xl bg-slate-900/40">
            <p className="text-xs text-slate-400">Chưa có trận đấu nào được ghép nối hiện tại.</p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigateToDiscover();
                }}
                className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
              >
                Tìm kèo ngay
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onNavigateToPost();
                }}
                className="py-1.5 px-3 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition-colors"
              >
                Đăng kèo mới
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Sent Requests List */}
      <section className="rounded-2xl border border-slate-800 bg-[#101a2c]/80 p-4 space-y-3">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">
          YÊU CẦU CÁP KÈO ĐÃ GỬI ({requests.length})
        </span>

        {requests.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            Bạn chưa gửi yêu cầu cáp kèo nào. Duyệt bảng tin và bấm &ldquo;Cáp kèo&rdquo; để gửi lời mời.
          </p>
        ) : (
          <div className="space-y-2">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="font-bold text-white truncate">
                    Giao lưu với: <span className="text-cyan-300">{req.team}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {req.type === 'Đối thủ' ? 'Xin cáp kèo đội' : 'Xin tham gia đá lẻ'} · Ngày {req.date}
                  </p>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-800/50 shrink-0">
                  ĐÃ GỬI LỜI MỜI
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Sân bóng nearby callout */}
      <section className="rounded-2xl border border-slate-800 bg-[#101a2c]/80 p-4 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xs font-black text-white">Chưa chốt được sân đá bóng?</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Xem danh bạ cụm sân cỏ nhân tạo phủi nổi tiếng tại TP.HCM (Chảo Lửa, K334, Cây Sậy...).
          </p>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            onNavigateToPitches();
          }}
          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs shrink-0 border border-slate-700 transition-colors flex items-center gap-1"
        >
          Khám phá sân <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </section>
    </div>
  );
}
