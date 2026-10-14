'use client';

import React, { useState } from 'react';
import { Player, Team } from '@/lib/types';
import { generatePlayerAvatar } from '@/lib/avatars';
import { DISTRICTS } from '@/lib/data';
import { sounds } from '@/lib/sounds';
import { TacticalPitch } from './TacticalPitch';
import { Shield, Zap, Edit2, UserCheck, AlertTriangle } from 'lucide-react';

interface SquadTabProps {
  userTeam: Team;
  captainReady: boolean;
  onToggleReady: () => void;
  onEditTeam: () => void;
  onQuickMatch: (district: string, timeSlot: string) => void;
  isSearchingMatch: boolean;
  onSelectPlayerToEdit?: (player: Player) => void;
}

export function SquadTab({
  userTeam,
  captainReady,
  onToggleReady,
  onEditTeam,
  onQuickMatch,
  isSearchingMatch,
  onSelectPlayerToEdit,
}: SquadTabProps) {
  const [prefDistrict, setPrefDistrict] = useState<string>(userTeam.district || 'Thủ Đức');
  const [prefTime, setPrefTime] = useState<string>('19:00–21:00');
  const [prefCourt, setPrefCourt] = useState<string>('Đã có sân');

  const handleLaunchMatch = () => {
    if (!captainReady) {
      sounds.playClick(400);
      return;
    }
    sounds.playReady();
    onQuickMatch(prefDistrict, prefTime);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header section with Captain Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
            CAPTAIN CONTROL &amp; LOBBY
          </span>
          <h1 className="text-xl sm:text-2xl font-black italic text-white tracking-tight">
            ĐỘI HÌNH <span className="text-cyan-400">CHIẾN THUẬT</span>
          </h1>
          <p className="text-xs text-slate-400">
            5 avatar đại diện đội hình ra sân. Đội trưởng bật Ready một lần để kích hoạt tìm trận.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              onEditTeam();
            }}
            className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5 text-cyan-400" /> Sửa đội hình
          </button>
        </div>
      </div>

      {/* Main Team Card & Captain Ready Switch */}
      <section className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-gradient-to-br from-[#102334] via-[#0d1a2c] to-[#0a121e] p-4 sm:p-5 shadow-lg space-y-4">
        {/* Team Banner */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-slate-950 flex items-center justify-center font-black italic text-xl shadow-lg shadow-teal-500/20">
              {userTeam.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">{userTeam.name}</h2>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-700/40">
                  Hạng {userTeam.tier}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Khu vực: <strong className="text-slate-200">{userTeam.district}</strong> · Uy tín: <strong className="text-teal-400">{userTeam.fairPlayScore}/100</strong>
              </p>
            </div>
          </div>

          <div className="hidden sm:block text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Thành tích phủi
            </span>
            <span className="text-xs font-black text-white">
              {userTeam.wins} Thắng · {userTeam.draws} Hòa · {userTeam.losses} Thua
            </span>
          </div>
        </div>

        {/* 5 Avatar Roster Grid */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              5 CẦU THỦ ĐẠI DIỆN TRẬN ĐẤU
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold">
              Bấm vào cầu thủ để sửa tên/áo
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {userTeam.roster.slice(0, 5).map((player, idx) => (
              <button
                key={player.id}
                onClick={() => {
                  sounds.playClick();
                  if (onSelectPlayerToEdit) {
                    onSelectPlayerToEdit(player);
                  } else {
                    onEditTeam();
                  }
                }}
                className={`group relative rounded-xl sm:rounded-2xl border transition-all duration-300 p-1.5 sm:p-2.5 flex flex-col items-center text-center overflow-hidden ${
                  captainReady
                    ? 'border-teal-500/60 bg-teal-950/30 shadow-md shadow-teal-500/10'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                {/* Avatar Image */}
                <div className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl overflow-hidden mb-1.5 border border-slate-700/60 group-hover:scale-105 transition-transform bg-slate-950">
                  <img
                    src={generatePlayerAvatar(player)}
                    alt={player.name}
                    className="w-full h-full object-cover"
                  />
                  {idx === 0 && (
                    <span className="absolute bottom-0 right-0 px-1 rounded-tl-md bg-amber-400 text-[8px] font-black text-slate-950">
                      C
                    </span>
                  )}
                </div>

                {/* Name */}
                <span className="font-bold text-[10px] sm:text-xs text-white truncate max-w-full">
                  {player.name.split(' ').slice(-1)[0]}
                </span>

                {/* Shirt & Role */}
                <span className="text-[9px] text-slate-400 font-semibold mt-0.5">
                  #{player.shirt} · {player.role === 'Đội trưởng' ? 'CAP' : player.position}
                </span>

                {/* Micro Rating */}
                <span className="text-[8px] font-black text-teal-400 mt-0.5">
                  OVR {player.rating}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Big Captain Ready Toggle Switch */}
        <div className="p-3 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${captainReady ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
              <strong className="text-xs sm:text-sm font-black text-white uppercase tracking-wide">
                ĐỘI TRƯỞNG SẴN SÀNG (CAPTAIN READY)
              </strong>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              {captainReady
                ? 'Cả đội đã sẵn sàng! Hệ thống ghép kèo sẽ tự động tìm đối thủ cùng trình độ.'
                : 'Đội trưởng bật nút này để đại diện toàn đội vào hàng chờ tìm đối thủ.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onToggleReady}
            role="switch"
            aria-checked={captainReady}
            className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              captainReady ? 'bg-cyan-400 shadow-lg shadow-cyan-400/40' : 'bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                captainReady ? 'translate-x-8 bg-slate-950 text-cyan-400 font-black' : 'translate-x-0'
              } flex items-center justify-center text-[10px]`}
            >
              {captainReady ? '✓' : ''}
            </span>
          </button>
        </div>
      </section>

      {/* 2-Column Section: Tactical Pitch & Quick Match Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Tactical Pitch Board Column */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#101a2c]/80 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              SƠ ĐỒ CHIẾN THUẬT &amp; BẢN ĐỒ NHIỆT
            </span>
            <span className="text-[10px] font-bold text-teal-400 bg-teal-950/70 px-2 py-0.5 rounded-md border border-teal-800/40">
              TACTICAL BOARD
            </span>
          </div>

          <TacticalPitch roster={userTeam.roster} teamName={userTeam.name} format="5v5" />
        </div>

        {/* Quick Match Preferences & Finder Column */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#101a2c]/80 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                THIẾT LẬP GHÉP TRẬN NHANH
              </span>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-950/70 px-2 py-0.5 rounded-md border border-orange-800/40">
                ESPORTS MATCHING
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Thể thức ghép
                </label>
                <div className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold">
                  Sân 5 (5v5 - Quick Match 5 Avatar)
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Ưu tiên khu vực
                </label>
                <select
                  value={prefDistrict}
                  onChange={(e) => setPrefDistrict(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Khung giờ muốn đá
                </label>
                <select
                  value={prefTime}
                  onChange={(e) => setPrefTime(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="17:00–19:00">17:00 – 19:00 (Tan tầm)</option>
                  <option value="19:00–21:00">19:00 – 21:00 (Giờ vàng)</option>
                  <option value="21:00–23:00">21:00 – 23:00 (Kèo muộn)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Tình trạng sân ưu tiên
                </label>
                <select
                  value={prefCourt}
                  onChange={(e) => setPrefCourt(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Đã có sân">Ưu tiên đội đã có sân</option>
                  <option value="Tất cả">Tất cả tình trạng</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {!captainReady && (
              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-700/50 flex items-center gap-2 text-[11px] text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Bạn cần bật công tắc &ldquo;Đội trưởng sẵn sàng&rdquo; ở trên trước khi bấm tìm trận.</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleLaunchMatch}
              disabled={!captainReady || isSearchingMatch}
              className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                isSearchingMatch
                  ? 'bg-slate-800 text-cyan-400 cursor-wait'
                  : captainReady
                  ? 'bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 text-slate-950 hover:brightness-110 active:scale-98 shadow-cyan-500/25'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSearchingMatch ? (
                <>
                  <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  ĐANG TÌM ĐỐI THỦ NGANG TRÌNH...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {captainReady ? '⚔ TÌM TRẬN NGAY (QUICK MATCH)' : 'ĐỘI TRƯỞNG CHƯA READY'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
