'use client';
/* eslint-disable @next/next/no-img-element */

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
  Flame,
} from 'lucide-react';

interface MatchRoomTabProps {
  match: MatchRoom | null;
  onConfirmMatch: () => void;
  onSimulateRivalConfirm: () => void;
  onOpenReportModal: () => void;
  onExitMatch: () => void;
  onNavigateToDiscover: () => void;
  onNavigateToSquad: () => void;
  onTriggerCS2?: (type: 'victory' | 'defeat') => void;
}

export function MatchRoomTab({
  match,
  onConfirmMatch,
  onSimulateRivalConfirm,
  onOpenReportModal,
  onExitMatch,
  onNavigateToDiscover,
  onNavigateToSquad,
  onTriggerCS2,
}: MatchRoomTabProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  if (!match) {
    return (
      <div className="py-16 text-center rounded-3xl border border-dashed border-slate-800 bg-[#0e1726]/60 p-8 space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 mx-auto shadow-lg shadow-cyan-500/10">
          <Swords className="w-8 h-8" />
        </div>
        <div className="space-y-1.5 max-w-sm mx-auto">
          <h2 className="text-lg font-black text-white uppercase tracking-tight">CHƯA CÓ TRẬN ĐẤU ĐANG KẾT NỐI</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hãy vào mục Tìm Kèo để gửi yêu cầu cáp kèo, hoặc lên lịch thi đấu và điểm danh đủ quân số trong mục Quản Lý Đội.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateToDiscover();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase transition-colors"
          >
            Khám phá bảng kèo
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              onNavigateToSquad();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs uppercase hover:brightness-110 transition-all shadow-md shadow-cyan-500/20"
          >
            Vào Sơ Đồ &amp; Đội Hình
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
      sounds.playWhistle();
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then((confettiModule) => {
          const confettiFn = confettiModule.default || confettiModule;
          confettiFn({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#f59e0b', '#10b981', '#ffffff'],
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
      <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
        <div>
          <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
            MATCH ROOM · ID #{match.id.slice(-6).toUpperCase()}
          </span>
          <h1 className="text-xl sm:text-2xl font-black italic text-white tracking-tight uppercase">
            {isLocked ? (
              <span className="text-emerald-400">MATCH LOCKED · ĐÃ CHỐT TRẬN</span>
            ) : (
              <span>MATCH FOUND · ĐANG CHỜ CHỐT KÈO</span>
            )}
          </h1>
          <p className="text-xs text-slate-400">
            {match.format} · {match.district} · Cả 2 đội trưởng cần xác nhận để chốt sân bóng
          </p>
        </div>

        <button
          onClick={handleShare}
          className="px-3.5 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Đã sao chép!' : 'Chia sẻ'}</span>
        </button>
      </div>

      {/* Main Esports VS Faceoff Arena */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-gradient-to-br from-[#0e1a2f] via-[#091120] to-[#060a12] p-5 sm:p-7 space-y-6 shadow-2xl">
        {/* Top Format Banner */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
          <span className="text-cyan-400 font-bold uppercase tracking-wide">
            BÓNG ĐÁ PHỦI TP.HCM · {match.format} GIAO HỮU
          </span>
          <span className="text-slate-400">
            NGUỒN KÈO: {match.source === 'quick' ? 'GHÉP NHANH' : 'BẢNG TIN'}
          </span>
        </div>

        {/* 2 Crests Faceoff */}
        <div className="relative py-4 sm:py-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 items-center">
            {/* Team A */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-2.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 flex items-center justify-center font-black italic text-2xl shadow-xl shadow-cyan-500/25">
                {getTeamInitials(match.teamA.name)}
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <h2 className="text-base sm:text-xl font-black text-white uppercase">{match.teamA.name}</h2>
                  <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-700/50 px-2 py-0.5 rounded-full">
                    BẠN
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Khu vực: <strong className="text-slate-200">{match.teamA.district}</strong>
                </p>
                <p className="text-xs text-emerald-400 font-bold mt-0.5">
                  Uy tín: {match.teamA.fairPlayScore}/100 · Hạng {match.teamA.tier}
                </p>
              </div>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right space-y-2.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-black italic text-2xl shadow-xl shadow-amber-500/25">
                {getTeamInitials(match.teamB.name)}
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-end">
                  <h2 className="text-base sm:text-xl font-black text-white uppercase">{match.teamB.name}</h2>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/70 border border-amber-700/50 px-2 py-0.5 rounded-full">
                    ĐỐI THỦ
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Khu vực: <strong className="text-slate-200">{match.teamB.district}</strong>
                </p>
                <p className="text-xs text-teal-400 font-bold mt-0.5">
                  Uy tín: {match.teamB.fairPlayScore}/100 · Hạng {match.teamB.tier}
                </p>
              </div>
            </div>
          </div>

          {/* Central VS Tag */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
            <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-2 border-amber-400 bg-slate-950 text-amber-400 flex items-center justify-center font-black italic text-xl shadow-2xl shadow-amber-500/30">
              VS
            </div>
            <span className="mt-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800">
              {match.court}
            </span>
          </div>
        </div>

        {/* Rosters Comparison (Esports line-up preview) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {/* Team A Roster */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
              ĐỘI HÌNH BẠN (5 CẦU THỦ)
            </span>
            <div className="space-y-1.5">
              {match.teamA.roster.slice(0, 5).map((player) => (
                <div
                  key={player.id}
                  className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 flex items-center gap-2.5 text-xs shadow-sm"
                >
                  <img
                    src={generatePlayerAvatar(player)}
                    alt={player.name}
                    className="w-7 h-7 rounded-lg border border-slate-700 object-cover shrink-0 bg-slate-950"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-white text-[11px] truncate">{player.name}</p>
                    <p className="text-[10px] text-slate-400">
                      #{player.shirt} · {player.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team B Roster */}
          <div className="space-y-2">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
              ĐỘI HÌNH ĐỐI THỦ
            </span>
            <div className="space-y-1.5">
              {match.teamB.roster.slice(0, 5).map((player) => (
                <div
                  key={player.id}
                  className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 flex flex-row-reverse items-center gap-2.5 text-xs text-right shadow-sm"
                >
                  <img
                    src={generatePlayerAvatar(player)}
                    alt={player.name}
                    className="w-7 h-7 rounded-lg border border-slate-700 object-cover shrink-0 bg-slate-950"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-white text-[11px] truncate">{player.name}</p>
                    <p className="text-[10px] text-slate-400">
                      #{player.shirt} · {player.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kickoff Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs p-4 rounded-2xl border border-slate-800 bg-slate-950/70 text-slate-300">
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Ngày thi đấu</span>
            <strong className="text-white">{match.date}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Giờ bóng lăn</span>
            <strong className="text-white">{match.time}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Địa điểm sân</span>
            <strong className="text-white truncate block">{match.venue}</strong>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 uppercase block font-semibold">Chi phí chia</span>
            <strong className="text-cyan-400">{match.cost}</strong>
          </div>
        </div>

        {/* Dual Captain Confirmation System */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Captain A Confirmation */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors shadow-md ${
              match.myConfirmed
                ? 'bg-emerald-950/30 border-emerald-500/60'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div>
              <p className="font-bold text-white text-xs">♛ {match.teamA.name} (Bạn)</p>
              <p className={`text-xs font-semibold ${match.myConfirmed ? 'text-emerald-400' : 'text-slate-400'}`}>
                {match.myConfirmed ? '✓ Đã xác nhận ra sân' : '● Chưa bấm xác nhận'}
              </p>
            </div>
            {match.myConfirmed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <button
                onClick={handleConfirm}
                className="py-1.5 px-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors shadow"
              >
                Xác nhận ngay
              </button>
            )}
          </div>

          {/* Captain B Confirmation */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between transition-colors shadow-md ${
              match.theirConfirmed
                ? 'bg-emerald-950/30 border-emerald-500/60'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div>
              <p className="font-bold text-white text-xs">♛ {match.teamB.name} (Đối thủ)</p>
              <p className={`text-xs font-semibold ${match.theirConfirmed ? 'text-emerald-400' : 'text-slate-400'}`}>
                {match.theirConfirmed ? '✓ Đối thủ đã đồng ý' : '● Đang chờ đối thủ chốt'}
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playClick(match.theirConfirmed ? 500 : 700);
                onSimulateRivalConfirm();
              }}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
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
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              isLocked
                ? 'bg-emerald-500 text-slate-950 cursor-default shadow-lg shadow-emerald-500/25'
                : match.myConfirmed
                ? 'bg-slate-900 text-cyan-300 border border-cyan-500/50 cursor-default'
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
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 whitespace-nowrap"
            >
              <Trophy className="w-4 h-4" />
              BÁO CÁO &amp; KẾT QUẢ
            </button>
          )}
        </div>

        {/* CS2 Quick Test Buttons in Match Room */}
        {onTriggerCS2 && (
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-400 font-medium">
              Hiệu ứng kết quả trận đấu CS2:
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => onTriggerCS2('victory')}
                className="w-1/2 sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black uppercase text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/15"
              >
                <Trophy className="w-3.5 h-3.5" /> Thử CS2 VICTORY
              </button>
              <button
                onClick={() => onTriggerCS2('defeat')}
                className="w-1/2 sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:brightness-110 text-white font-black uppercase text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20"
              >
                <Flame className="w-3.5 h-3.5" /> Thử CS2 DEFEAT
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
          <span>* Dữ liệu trận đấu được lưu trữ cục bộ trong thiết bị.</span>
          <button
            onClick={() => {
              sounds.playClick(400);
              onExitMatch();
            }}
            className="text-rose-400 hover:text-rose-300 underline font-semibold"
          >
            Rời khỏi phòng trận này
          </button>
        </div>
      </section>
    </div>
  );
}
