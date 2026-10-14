'use client';

import React, { useState } from 'react';
import { MatchRoom } from '@/lib/types';
import { generatePlayerAvatar, getTeamInitials } from '@/lib/avatars';
import { sounds } from '@/lib/sounds';
import {
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  DollarSign,
  Shield,
  Trophy,
  Swords,
  Share2,
  Sparkles,
} from 'lucide-react';

interface MatchRoomTabProps {
  match: MatchRoom | null;
  onConfirmMatch: () => void;
  onSimulateRivalConfirm: () => void;
  onOpenReportModal: () => void;
  onExitMatch: () => void;
  onNavigateToDiscover: () => void;
  onNavigateToSquad: () => void;
}

export function MatchRoomTab({
  match,
  onConfirmMatch,
  onSimulateRivalConfirm,
  onOpenReportModal,
  onExitMatch,
  onNavigateToDiscover,
  onNavigateToSquad,
}: MatchRoomTabProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!match) {
    return (
      <div className="py-16 text-center rounded-3xl border border-dashed border-slate-800 bg-[#101a2c]/40 p-6 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-700/50 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-cyan-500/10">
          <Swords className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-sm mx-auto">
          <h2 className="text-lg font-black text-white">CHƯA CÓ TRẬN ĐẤU ĐANG KẾT NỐI</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hãy vào mục Tìm Kèo để gửi yêu cầu cáp kèo, hoặc bật công tắc Ready ở Đội Hình để ghép nhanh với đối thủ ngang trình.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateToDiscover();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Khám phá bảng kèo
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateToSquad();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs hover:brightness-110 transition-all shadow-md shadow-cyan-500/20"
          >
            Vào Lobby ghép đối
          </button>
        </div>
      </div>
    );
  }

  const isLocked = match.myConfirmed && match.theirConfirmed;

  const handleShare = () => {
    sounds.playClick();
    setCopiedLink(true);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleConfirm = () => {
    if (match.myConfirmed) return;
    onConfirmMatch();
    if (match.theirConfirmed) {
      // Trigger celebrations!
      sounds.playWhistle();
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then((confettiModule) => {
          const confettiFn = confettiModule.default || confettiModule;
          confettiFn({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#56ebd9', '#ff936a', '#d6ef7b', '#ffffff'],
          });
        }).catch(() => {});
      }
    } else {
      sounds.playReady();
    }
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Top Status Bar */}
      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
            MATCH ROOM · ID #{match.id.slice(-6).toUpperCase()}
          </span>
          <h1 className="text-xl sm:text-2xl font-black italic text-white tracking-tight">
            {isLocked ? (
              <span className="text-emerald-400">MATCH LOCKED · ĐÃ CHỐT</span>
            ) : (
              <span>MATCH FOUND · ĐANG CHỜ CHỐT</span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Chia sẻ link phòng"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <span
            className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
              isLocked
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-amber-500 text-slate-950 animate-pulse'
            }`}
          >
            {isLocked ? 'CHỐT KÈO' : 'CHỜ 2 ĐỘI'}
          </span>
        </div>
      </div>

      {copiedLink && (
        <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-700 text-teal-300 text-xs text-center font-bold">
          ✓ Đã sao chép liên kết phòng trận đấu vào bộ nhớ tạm!
        </div>
      )}

      {/* Main Esports VS Arena Box */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-b from-[#132238] via-[#0b1322] to-[#070b14] p-4 sm:p-6 shadow-2xl">
        {/* Subtle Pitch Markings / Grid Pattern in background */}
        <div className="absolute inset-0 pitch-pattern opacity-10 pointer-events-none" />

        {/* Ambient Neon Gradients */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* Top Banner Tag */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>BÓNG ĐÁ PHỦI {match.format.toUpperCase()} · TP.HCM</span>
            <span className="text-yellow-400 font-mono tracking-wider">
              {match.court.toUpperCase()}
            </span>
          </div>

          {/* Teams Faceoff Header */}
          <div className="grid grid-cols-11 items-center gap-2">
            {/* Team A (Cyan Neon) */}
            <div className="col-span-5 text-center flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 flex items-center justify-center font-black italic text-xl sm:text-2xl shadow-xl shadow-cyan-400/20 transform -skew-x-6 border-2 border-cyan-300">
                <span className="transform skew-x-6">{getTeamInitials(match.teamA.name)}</span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white mt-2 truncate max-w-full">
                {match.teamA.name}
              </h2>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded-full border border-cyan-800/60 mt-1">
                TEAM A · ĐỘI BẠN
              </span>
            </div>

            {/* Center VS Element */}
            <div className="col-span-1 text-center flex flex-col items-center justify-center">
              <div className="font-black italic text-2xl sm:text-3xl text-white tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] animate-pulse">
                VS
              </div>
            </div>

            {/* Team B (Orange Neon) */}
            <div className="col-span-5 text-center flex flex-col items-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-slate-950 flex items-center justify-center font-black italic text-xl sm:text-2xl shadow-xl shadow-orange-500/20 transform -skew-x-6 border-2 border-orange-300">
                <span className="transform skew-x-6">{getTeamInitials(match.teamB.name)}</span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white mt-2 truncate max-w-full">
                {match.teamB.name}
              </h2>
              <span className="text-[10px] font-bold text-orange-300 bg-orange-950/70 px-2 py-0.5 rounded-full border border-orange-800/60 mt-1">
                TEAM B · ĐỐI THỦ
              </span>
            </div>
          </div>

          {/* Rosters Comparison (Esports line-up preview) */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {/* Team A Roster */}
            <div className="space-y-1.5">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">
                ĐỘI HÌNH BẠN (5 AVATAR)
              </span>
              <div className="space-y-1">
                {match.teamA.roster.slice(0, 5).map((player) => (
                  <div
                    key={player.id}
                    className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-2 text-xs"
                  >
                    <img
                      src={generatePlayerAvatar(player)}
                      alt={player.name}
                      className="w-7 h-7 rounded-lg object-cover shrink-0 bg-slate-950"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-white text-[11px] truncate">{player.name}</p>
                      <p className="text-[9px] text-slate-400">
                        #{player.shirt} · {player.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team B Roster */}
            <div className="space-y-1.5">
              <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider text-center">
                ĐỘI HÌNH ĐỐI THỦ
              </span>
              <div className="space-y-1">
                {match.teamB.roster.slice(0, 5).map((player) => (
                  <div
                    key={player.id}
                    className="p-1.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-row-reverse items-center gap-2 text-xs text-right"
                  >
                    <img
                      src={generatePlayerAvatar(player)}
                      alt={player.name}
                      className="w-7 h-7 rounded-lg object-cover shrink-0 bg-slate-950"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-white text-[11px] truncate">{player.name}</p>
                      <p className="text-[9px] text-slate-400">
                        #{player.shirt} · {player.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Match Meta Row */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Thời gian</span>
              <strong className="text-white">{match.date} · {match.time}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Khu vực</span>
              <strong className="text-white">{match.district}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Sân bóng</span>
              <strong className="text-teal-300 truncate block">{match.venue}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Phí sân</span>
              <strong className="text-white">{match.cost}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Confirmation Control Box */}
      <section className="rounded-2xl border border-slate-800 bg-[#101a2c]/80 p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            XÁC NHẬN CỦA HAI ĐỘI TRƯỞNG
          </span>
          <span className="text-[10px] text-slate-400">
            Cần cả 2 bên xác nhận để khoá trận
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Captain A Confirmation */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
              match.myConfirmed
                ? 'bg-teal-950/40 border-teal-500/60'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div>
              <p className="font-bold text-white">♛ {match.teamA.name} (Bạn)</p>
              <p className={`text-[11px] font-semibold ${match.myConfirmed ? 'text-teal-400' : 'text-slate-400'}`}>
                {match.myConfirmed ? '✓ Đã xác nhận ra sân' : '● Chưa bấm xác nhận'}
              </p>
            </div>
            {match.myConfirmed ? (
              <CheckCircle2 className="w-5 h-5 text-teal-400" />
            ) : (
              <button
                onClick={handleConfirm}
                className="py-1.5 px-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs transition-colors shadow"
              >
                Xác nhận ngay
              </button>
            )}
          </div>

          {/* Captain B Confirmation */}
          <div
            className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
              match.theirConfirmed
                ? 'bg-teal-950/40 border-teal-500/60'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div>
              <p className="font-bold text-white">♛ {match.teamB.name} (Đối thủ)</p>
              <p className={`text-[11px] font-semibold ${match.theirConfirmed ? 'text-teal-400' : 'text-slate-400'}`}>
                {match.theirConfirmed ? '✓ Đối thủ đã đồng ý' : '● Đang chờ đối thủ chốt'}
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playClick(match.theirConfirmed ? 500 : 700);
                onSimulateRivalConfirm();
              }}
              className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold border border-slate-700"
            >
              {match.theirConfirmed ? '↩ Huỷ giả lập' : '◎ Giả lập đối thủ'}
            </button>
          </div>
        </div>

        {/* Master Confirmation Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleConfirm}
            disabled={match.myConfirmed}
            className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              isLocked
                ? 'bg-emerald-500 text-slate-950 cursor-default shadow-lg shadow-emerald-500/20'
                : match.myConfirmed
                ? 'bg-slate-800 text-teal-300 border border-teal-700/50 cursor-default'
                : 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 hover:brightness-110 active:scale-98 shadow-lg shadow-cyan-500/25'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isLocked
              ? '✓ TRẬN ĐẤU ĐÃ CHỐT THÀNH CÔNG!'
              : match.myConfirmed
              ? '✓ BẠN ĐÃ XÁC NHẬN · CHỜ ĐỐI THỦ'
              : '✓ ĐỘI TRƯỞNG XÁC NHẬN CHỐT KÈO'}
          </button>

          {isLocked && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenReportModal();
              }}
              className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-gradient-to-r from-orange-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 whitespace-nowrap"
            >
              <Trophy className="w-4 h-4" />
              BÁO CÁO &amp; AI TRACKING
            </button>
          )}
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
          <span>* Các thông tin trận đấu được đồng bộ và lưu trữ trong thiết bị.</span>
          <button
            onClick={() => {
              sounds.playClick(400);
              onExitMatch();
            }}
            className="text-red-400 hover:text-red-300 underline font-semibold"
          >
            Rời khỏi phòng trận này
          </button>
        </div>
      </section>
    </div>
  );
}
