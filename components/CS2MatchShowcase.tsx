'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from 'react';
import { CS2MatchOutcome, Player } from '@/lib/types';
import { generatePlayerAvatar } from '@/lib/avatars';
import { sounds } from '@/lib/sounds';
import {
  Trophy,
  X,
  Star,
  RotateCcw,
  Sparkles,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CS2MatchShowcaseProps {
  outcome: CS2MatchOutcome | null;
  isOpen: boolean;
  onClose: () => void;
  onSwitchMode?: (type: 'victory' | 'defeat') => void;
}

export function CS2MatchShowcase({
  outcome,
  isOpen,
  onClose,
  onSwitchMode,
}: CS2MatchShowcaseProps) {
  useEffect(() => {
    if (isOpen && outcome) {
      if (outcome.type === 'victory') {
        sounds.playCS2Victory();
        try {
          confetti({
            particleCount: 120,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#facc15', '#38bdf8', '#10b981', '#ffffff'],
          });
        } catch {}
      } else {
        sounds.playCS2Defeat();
      }
    }
  }, [isOpen, outcome]);

  if (!isOpen || !outcome) return null;

  const isVictory = outcome.type === 'victory';

  const mvpPlayer: Player = outcome.teamA.roster[0] || {
    id: 'p-1',
    name: outcome.mvp.name,
    shirt: outcome.mvp.shirt,
    role: 'Đội trưởng',
    position: 'FWD',
    rating: 92,
    speed: 91,
    stamina: 88,
    fairPlay: 99,
    skin: '#dca078',
    hair: '#222531',
    jersey: '#32b4b2',
    style: 0,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto no-scrollbar animate-fadeIn">
      {/* Dynamic Ambient Background */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
          isVictory
            ? 'bg-radial from-amber-500/20 via-cyan-950/25 to-black'
            : 'bg-radial from-rose-950/40 via-slate-950/80 to-black'
        }`}
      />

      {/* Main Sleek Rounded Modal Container */}
      <div
        className={`relative w-full max-w-3xl border rounded-3xl p-6 sm:p-8 space-y-6 text-white my-auto shadow-2xl backdrop-blur-2xl ${
          isVictory
            ? 'border-amber-400/50 bg-[#0a0f1b]/95 shadow-amber-500/20'
            : 'border-rose-600/50 bg-[#0e090e]/95 shadow-rose-950/40'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] uppercase font-black px-3 py-1 rounded-full border ${
                isVictory
                  ? 'border-amber-400/60 text-amber-300 bg-amber-950/60'
                  : 'border-rose-500/60 text-rose-300 bg-rose-950/60'
              }`}
            >
              CS2 MATCH SHOWCASE
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              SÂN PHỦI TP.HCM · POST-MATCH ARENA
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onSwitchMode && (
              <button
                onClick={() => {
                  sounds.playClick();
                  onSwitchMode(isVictory ? 'defeat' : 'victory');
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/15 text-slate-200 transition-colors flex items-center gap-1.5"
                title="Bấm để chuyển qua lại giữa màn Thắng và màn Thua CS2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {isVictory ? 'Xem bản Thất Bại (DEFEAT)' : 'Xem bản Chiến Thắng (VICTORY)'}
              </button>
            )}
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CS2 Massive Hero Stencil Banner */}
        <div className="text-center space-y-1 relative py-2">
          <div className="text-xs tracking-widest text-slate-400 uppercase font-bold">
            [ KẾT QUẢ THI ĐẤU CHÍNH THỨC ]
          </div>

          <div
            className="text-5xl sm:text-7xl font-black tracking-tight uppercase italic transform scale-100 animate-pulse transition-transform duration-300"
            style={{
              textShadow: isVictory
                ? '0 0 35px rgba(245, 158, 11, 0.7), 0 0 70px rgba(245, 158, 11, 0.3)'
                : '0 0 35px rgba(225, 29, 72, 0.7), 0 0 70px rgba(225, 29, 72, 0.3)',
            }}
          >
            {isVictory ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
                VICTORY
              </span>
            ) : (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-red-500 to-rose-700">
                DEFEAT
              </span>
            )}
          </div>

          <p
            className={`text-sm sm:text-base font-bold uppercase tracking-wide ${
              isVictory ? 'text-amber-300' : 'text-rose-400'
            }`}
          >
            {outcome.headline} · {outcome.subheadline}
          </p>
        </div>

        {/* Sleek Scoreboard Card */}
        <div className="grid grid-cols-3 items-center rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:p-5 text-center shadow-lg">
          {/* Team A */}
          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 uppercase font-bold">
              ĐỘI NHÀ
            </span>
            <div className="font-black text-sm sm:text-lg text-white truncate px-2">
              {outcome.teamA.name}
            </div>
            <div className="text-[11px] text-cyan-400 font-semibold">
              Khu vực {outcome.teamA.district}
            </div>
          </div>

          {/* Central Score */}
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-3">
              <span className={outcome.scoreA >= outcome.scoreB ? 'text-amber-400' : 'text-slate-400'}>
                {outcome.scoreA}
              </span>
              <span className="text-slate-600 font-light">:</span>
              <span className={outcome.scoreB >= outcome.scoreA ? 'text-rose-400' : 'text-slate-400'}>
                {outcome.scoreB}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase font-bold">
              TỶ SỐ CHÍNH THỨC
            </span>
          </div>

          {/* Team B */}
          <div className="space-y-1">
            <span className="block text-[10px] text-slate-400 uppercase font-bold">
              ĐỐI THỦ
            </span>
            <div className="font-black text-sm sm:text-lg text-white truncate px-2">
              {outcome.teamB.name}
            </div>
            <div className="text-[11px] text-slate-400 font-semibold">
              Khu vực {outcome.teamB.district}
            </div>
          </div>
        </div>

        {/* CS2 MVP Showcase Spotlight Card */}
        <div
          className={`rounded-3xl border p-5 sm:p-6 relative overflow-hidden shadow-xl ${
            isVictory
              ? 'border-amber-400/50 bg-gradient-to-r from-amber-950/40 via-slate-950/90 to-cyan-950/30 shadow-amber-500/10'
              : 'border-slate-700 bg-slate-900/80 shadow-black/40'
          }`}
        >
          {/* Top MVP Badge */}
          <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
              <span className="font-black text-xs sm:text-sm tracking-wider text-amber-300 uppercase">
                {isVictory ? 'CS2 MATCH MVP · CẦU THỦ XUẤT SẮC NHẤT' : 'CONSOLATION MVP · CẦU THỦ ĐIỂM SÁNG'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/40">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>MVP STAR x{outcome.mvp.mvpStarCount}</span>
            </div>
          </div>

          {/* MVP Content Grid */}
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            {/* Player Avatar */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-amber-400/80 bg-slate-950 overflow-hidden relative shadow-xl shadow-amber-500/25">
                <img
                  src={generatePlayerAvatar(mvpPlayer)}
                  alt={outcome.mvp.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[10px] rounded-bl-lg">
                  #{outcome.mvp.shirt}
                </div>
              </div>
            </div>

            {/* MVP Stats & Accolades */}
            <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                  {outcome.mvp.name}
                </h3>
                <span className="text-[11px] font-bold text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full bg-amber-950/60 uppercase">
                  {outcome.mvp.award}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {isVictory
                  ? 'Ghi dấu ấn đậm nét với các pha dứt điểm hiểm hóc, định đoạt thế trận trong những phút then chốt.'
                  : 'Nỗ lực thi đấu không biết mệt mỏi, tạo ra điểm tựa tinh thần vững chắc cho toàn đội dù kết quả chưa trọn vẹn.'}
              </p>

              {/* Accolades Metric Row */}
              <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-2.5">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Bàn thắng</span>
                  <span className="text-sm font-black text-amber-300">
                    {isVictory ? '3 BÀN (HAT-TRICK)' : '2 BÀN'}
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-2.5">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Kiến tạo</span>
                  <span className="text-sm font-black text-cyan-300">
                    {isVictory ? '2 KIẾN TẠO' : '1 KIẾN TẠO'}
                  </span>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/60 p-2.5">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Chỉ số OVR</span>
                  <span className="text-sm font-black text-emerald-400">
                    {isVictory ? '9.6 / 10' : '8.2 / 10'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Player Squad Podium Breakdown */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              ĐỘI HÌNH RA SÂN (5 CẦU THỦ THI ĐẤU)
            </span>
            <span className="text-xs font-bold text-teal-400">
              ĐIỂM FAIR-PLAY: +{isVictory ? '15' : '5'} PTS
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2.5">
            {outcome.teamA.roster.slice(0, 5).map((player, idx) => (
              <div
                key={player.id}
                className={`rounded-2xl border p-2.5 text-center space-y-1 relative shadow-sm ${
                  idx === 0
                    ? 'border-amber-400/60 bg-amber-950/30'
                    : 'border-white/10 bg-slate-950/60'
                }`}
              >
                <div className="w-11 h-11 sm:w-13 sm:h-13 mx-auto rounded-xl border border-white/20 overflow-hidden bg-slate-950 shadow">
                  <img
                    src={generatePlayerAvatar(player)}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-[11px] font-bold text-white truncate">
                  {player.name.split(' ').slice(-1)[0]}
                </div>
                <div className="text-[10px] text-slate-400">
                  #{player.shirt} · {player.position}
                </div>
                <div className="text-[10px] font-bold text-teal-400">
                  {idx === 0 ? '★ MVP' : `${player.rating} OVR`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10">
          <div className="text-xs text-slate-300 text-center sm:text-left">
            {isVictory
              ? '✓ Chiến thắng được ghi nhận vào bảng xếp hạng phủi TP.HCM.'
              : '✓ Dữ liệu trận đấu đã được lưu. Hãy tiếp tục cáp kèo mới!'}
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
          >
            HOÀN TẤT &amp; TIẾP TỤC
          </button>
        </div>
      </div>
    </div>
  );
}
