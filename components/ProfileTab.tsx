'use client';

import React, { useState } from 'react';
import { Team, Player, PitchInfo } from '@/lib/types';
import { generatePlayerAvatar } from '@/lib/avatars';
import { FAMOUS_PITCHES, DISTRICTS } from '@/lib/data';
import { sounds } from '@/lib/sounds';
import {
  Shield,
  Trophy,
  MapPin,
  Phone,
  Star,
  Users,
  Video,
  Sparkles,
  RotateCcw,
  CheckCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface ProfileTabProps {
  userTeam: Team;
  onEditTeam: () => void;
  onResetDemo: () => void;
  onOpenPitchModal?: (pitch: PitchInfo) => void;
  onSelectFeature: (featureName: string) => void;
}

export function ProfileTab({
  userTeam,
  onEditTeam,
  onResetDemo,
  onOpenPitchModal,
  onSelectFeature,
}: ProfileTabProps) {
  const captain = userTeam.roster[0] || {
    name: 'MINH THẮNG',
    shirt: '09',
    role: 'Đội trưởng',
    rating: 88,
  };

  const [pitchDistrict, setPitchDistrict] = useState<string>('Tất cả');

  const filteredPitches = FAMOUS_PITCHES.filter((p) => {
    if (pitchDistrict === 'Tất cả') return true;
    return p.district === pitchDistrict;
  });

  return (
    <div className="space-y-4 pb-6">
      {/* Title */}
      <div>
        <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
          COMMUNITY &amp; TEAM PROFILE
        </span>
        <h1 className="text-xl sm:text-2xl font-black italic text-white tracking-tight">
          HỒ SƠ <span className="text-cyan-400">ĐỘI BÓNG</span>
        </h1>
        <p className="text-xs text-slate-400">
          Chỉ số uy tín fair-play, thành tích phủi, danh bạ sân bóng và hệ sinh thái giải đấu.
        </p>
      </div>

      {/* Hero Profile Card */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-700 bg-gradient-to-br from-[#122338] via-[#0d1726] to-[#070d18] p-5 sm:p-6 text-center space-y-4 shadow-xl">
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-xl shadow-cyan-400/20 bg-slate-950">
            <img
              src={generatePlayerAvatar(captain)}
              alt={captain.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 px-1.5 py-0.5 rounded-tl-lg bg-amber-400 text-[9px] font-black text-slate-950">
              CAP #{captain.shirt}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white mt-3">
            {captain.name}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            ♛ Đội trưởng <strong className="text-cyan-300">{userTeam.name}</strong> · {userTeam.district}
          </p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-black text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800/60">
              HẠNG {userTeam.tier.toUpperCase()}
            </span>
            <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800/60">
              FAIR-PLAY {userTeam.fairPlayScore}/100
            </span>
          </div>
        </div>

        {/* 3 Metric Summary Boxes */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="block text-lg sm:text-xl font-black text-white">
              {userTeam.wins + userTeam.draws + userTeam.losses}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Tổng trận</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="block text-lg sm:text-xl font-black text-emerald-400">
              96%
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Đúng giờ</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="block text-lg sm:text-xl font-black text-cyan-400">
              {userTeam.wins}W - {userTeam.draws}D
            </span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Thắng / Hòa</span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              sounds.playClick();
              onEditTeam();
            }}
            className="py-1.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors"
          >
            Chỉnh sửa tên đội &amp; 5 cầu thủ
          </button>
        </div>
      </section>

      {/* Sân Bóng Phủi TP.HCM Directory */}
      <section className="rounded-2xl border border-slate-800 bg-[#101a2c]/80 p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-cyan-400" />
              DANH BẠ SÂN BÓNG PHỦI TP.HCM
            </h3>
            <p className="text-[11px] text-slate-400">
              Cụm sân có thảm cỏ nhân tạo tốt, đèn led đêm chuẩn, có trọng tài và căng tin.
            </p>
          </div>

          <select
            value={pitchDistrict}
            onChange={(e) => setPitchDistrict(e.target.value)}
            className="py-1.5 px-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 shrink-0"
          >
            <option value="Tất cả">Tất cả quận / TP.HCM</option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredPitches.map((pitch) => (
            <div
              key={pitch.id}
              className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-white">{pitch.name}</h4>
                    {pitch.verified && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-teal-950 text-teal-300 border border-teal-800">
                        XÁC THỰC
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span className="truncate">{pitch.address}</span>
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-400 shrink-0">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{pitch.rating}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 space-y-1">
                <p>
                  <span className="text-slate-500">Quy mô: </span>
                  <strong className="text-slate-200">{pitch.formats.join(' · ')}</strong>
                  <span className="mx-2 text-slate-600">|</span>
                  <span className="text-slate-500">Giá: </span>
                  <strong className="text-cyan-300">{pitch.pricePerHour}</strong>
                </p>
                <p className="text-slate-400 truncate">
                  Tiện ích: {pitch.amenities.join(' · ')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                <a
                  href={`tel:${pitch.phone.replace(/\s+/g, '')}`}
                  onClick={() => sounds.playClick()}
                  className="flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-bold"
                >
                  <Phone className="w-3.5 h-3.5" /> Gọi đặt sân ({pitch.phone})
                </a>

                {onOpenPitchModal && (
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenPitchModal(pitch);
                    }}
                    className="text-slate-400 hover:text-white font-semibold"
                  >
                    Chi tiết →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem Hub Grid */}
      <section className="rounded-2xl border border-slate-800 bg-[#101a2c]/80 p-4 space-y-3">
        <span className="text-xs font-bold text-white uppercase tracking-wider block">
          TÍNH NĂNG MỞ RỘNG TRONG HỆ SINH THÁI
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'tournament', title: 'Giải Đấu Phủi', desc: 'Bảng đấu, điều lệ và đăng ký giải S5/S7', icon: Trophy },
            { id: 'ranking', title: 'Ranking Đội Bóng', desc: 'Xếp hạng phủi TP.HCM theo điểm uy tín', icon: Shield },
            { id: 'video', title: 'Replay & Highlight', desc: 'Kho lưu trữ video trận đấu có gắn mốc', icon: Video },
            { id: 'ai', title: 'AI Phân Tích Trận', desc: 'Computer vision tracking và sơ đồ nhiệt', icon: Sparkles },
            { id: 'trust', title: 'Hệ Thống Đánh Giá', desc: 'Xác nhận tỷ số và đánh giá fair-play', icon: CheckCircle },
            { id: 'members', title: 'Tuyển Thành Viên', desc: 'Mở rộng đội hình và đăng ký áo bib', icon: Users },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  onSelectFeature(item.id);
                }}
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all text-left flex flex-col justify-between group"
              >
                <div>
                  <Icon className="w-5 h-5 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                  <h4 className="font-bold text-xs text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <span className="text-[9px] font-bold text-cyan-400 mt-2 flex items-center gap-0.5">
                  Xem lộ trình <ChevronRight className="w-3 h-3" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Reset State Control */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={() => {
            sounds.playClick(400);
            if (confirm('Bạn có chắc muốn đặt lại dữ liệu demo về trạng thái ban đầu?')) {
              onResetDemo();
            }
          }}
          className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Đặt lại dữ liệu mẫu ứng dụng
        </button>
      </div>
    </div>
  );
}
