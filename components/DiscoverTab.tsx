'use client';

import React from 'react';
import { MatchPost, FilterState } from '@/lib/types';
import { DISTRICTS } from '@/lib/data';
import { getTeamInitials } from '@/lib/avatars';
import { sounds } from '@/lib/sounds';
import { Search, MapPin, Clock, Calendar, Users, Zap, RotateCcw, Plus, Check } from 'lucide-react';

interface DiscoverTabProps {
  posts: MatchPost[];
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  onOpenDetail: (post: MatchPost) => void;
  onApply: (post: MatchPost) => void;
  appliedPostIds: string[];
  captainReady: boolean;
  onNavigateToSquad: () => void;
  onNavigateToPost: () => void;
  onNavigateToPitches: () => void;
  onTogglePostStatus: (postId: string) => void;
}

export function DiscoverTab({
  posts,
  filter,
  setFilter,
  onOpenDetail,
  onApply,
  appliedPostIds,
  captainReady,
  onNavigateToSquad,
  onNavigateToPost,
  onNavigateToPitches,
  onTogglePostStatus,
}: DiscoverTabProps) {
  // Filter logic
  const filteredPosts = posts.filter((p) => {
    if (filter.district !== 'Tất cả' && p.district !== filter.district) return false;
    if (filter.format !== 'Tất cả' && p.format !== filter.format) return false;
    if (filter.type !== 'Tất cả' && p.type !== filter.type) return false;
    if (filter.court !== 'Tất cả' && p.court !== filter.court) return false;
    if (filter.level !== 'Tất cả' && p.level !== filter.level) return false;
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase();
      const matchTeam = p.team.toLowerCase().includes(q);
      const matchVenue = p.venue.toLowerCase().includes(q);
      const matchNote = p.note.toLowerCase().includes(q);
      const matchDistrict = p.district.toLowerCase().includes(q);
      if (!matchTeam && !matchVenue && !matchNote && !matchDistrict) return false;
    }
    return true;
  });

  const resetFilters = () => {
    sounds.playClick();
    setFilter({
      district: 'Tất cả',
      format: 'Tất cả',
      type: 'Tất cả',
      court: 'Tất cả',
      level: 'Tất cả',
      search: '',
    });
  };

  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr + 'T12:00:00');
      return new Intl.DateTimeFormat('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit' }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4 pb-4">
      {/* Hero Quick Match Banner */}
      <section className="relative overflow-hidden rounded-2xl border border-teal-500/30 bg-gradient-to-br from-[#0e2c34] via-[#0d1e30] to-[#121626] p-4 sm:p-5 shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-lg">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-700/40">
                <Zap className="w-3 h-3 text-cyan-400" /> QUICK MATCH LOBBY
              </span>
              <span className="text-xs text-slate-400">
                Trạng thái: <strong className={captainReady ? 'text-cyan-400' : 'text-orange-400'}>{captainReady ? 'Đội trưởng Ready' : 'Chưa Ready'}</strong>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black italic tracking-tight text-white">
              CÁP KÈO. <span className="text-cyan-400">MATCH ĐỐI.</span> RA SÂN.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bật Ready đại diện toàn đội để hệ thống ghép cặp tự động, hoặc duyệt các tin tuyển đối thủ từ cộng đồng bóng đá phong trào TP.HCM.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => {
                sounds.playClick();
                onNavigateToSquad();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5" /> VÀO LOBBY GHÉP ĐỐI
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onNavigateToPost();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> ĐĂNG KÈO MỚI
            </button>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="rounded-2xl border border-slate-800 bg-[#101a2c]/80 p-3 sm:p-4 space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên đội, sân bóng, hoặc khu vực (VD: Thủ Đức, Chảo Lửa...)"
            value={filter.search}
            onChange={(e) => setFilter((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/70 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Khu vực
            </label>
            <select
              value={filter.district}
              onChange={(e) => setFilter((prev) => ({ ...prev, district: e.target.value }))}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Tất cả">Tất cả TP.HCM</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Thể thức
            </label>
            <select
              value={filter.format}
              onChange={(e) => setFilter((prev) => ({ ...prev, format: e.target.value }))}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Tất cả">Tất cả sân</option>
              <option value="5v5">Sân 5 (5v5)</option>
              <option value="7v7">Sân 7 (7v7)</option>
              <option value="11v11">Sân 11 (11v11)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Loại kèo
            </label>
            <select
              value={filter.type}
              onChange={(e) => setFilter((prev) => ({ ...prev, type: e.target.value }))}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Tất cả">Tất cả thể loại</option>
              <option value="Đối thủ">Tìm đối thủ</option>
              <option value="Cầu thủ lẻ">Tuyển người lẻ</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tình trạng sân
            </label>
            <select
              value={filter.court}
              onChange={(e) => setFilter((prev) => ({ ...prev, court: e.target.value }))}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Đã có sân">Đã có sân</option>
              <option value="Chưa có sân">Chưa có sân</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Xóa lọc
            </button>
          </div>
        </div>
      </section>

      {/* Feed Header */}
      <div className="flex items-center justify-between text-xs px-1">
        <span className="font-bold text-white tracking-wide">
          {filteredPosts.length} KÈO KHẢ DỤNG
        </span>
        <button
          onClick={() => {
            sounds.playClick();
            onNavigateToPitches();
          }}
          className="text-cyan-400 hover:text-cyan-300 font-semibold"
        >
          ⌖ Xem bản đồ sân TP.HCM →
        </button>
      </div>

      {/* Match Cards List (CSS Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredPosts.length === 0 ? (
          <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-slate-800 bg-[#101a2c]/40 space-y-3">
            <Users className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="space-y-1">
              <p className="font-bold text-white text-sm">Không tìm thấy kèo phù hợp</p>
              <p className="text-xs text-slate-400">Thử đặt lại bộ lọc hoặc tự mình đăng một kèo mới để các đội khác liên hệ.</p>
            </div>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
            >
              Đặt lại bộ lọc
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isApplied = appliedPostIds.includes(post.id);
            return (
              <article
                key={post.id}
                className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden bg-gradient-to-br from-[#121c2e] to-[#0c1422] p-4 flex flex-col justify-between ${
                  post.mine
                    ? 'border-orange-500/40 hover:border-orange-400/70'
                    : 'border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5'
                }`}
              >
                {/* Accent top indicator */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    post.mine ? 'bg-gradient-to-r from-orange-400 to-amber-500' : 'bg-gradient-to-r from-teal-400 to-cyan-500'
                  }`}
                />

                <div>
                  {/* Top Header: Team Crest + Badges */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-sm shrink-0 border ${
                          post.mine
                            ? 'bg-orange-950/80 text-orange-300 border-orange-700/50'
                            : 'bg-teal-950/80 text-teal-300 border-teal-700/50'
                        }`}
                      >
                        {getTeamInitials(post.team)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-black text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
                            {post.team}
                          </h3>
                          {post.mine && (
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-orange-500 text-slate-950 uppercase">
                              ĐỘI TÔI
                            </span>
                          )}
                        </div>
                        {/* Unboxed metadata separated by middot */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                          <span className="text-teal-400 font-semibold">{post.type === 'Đối thủ' ? 'Tìm đối thủ' : 'Tuyển quân'}</span>
                          <span aria-hidden="true">·</span>
                          <span>{post.format}</span>
                          <span aria-hidden="true">·</span>
                          <span>Trình {post.level}</span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        post.status === 'open'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {post.status === 'open' ? 'ĐANG MỞ' : 'ĐÃ ĐÓNG'}
                    </span>
                  </div>

                  {/* Location & Time Row */}
                  <div className="grid grid-cols-2 gap-2 my-2 py-2 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{formatDateLabel(post.date)} lúc {post.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300 truncate">
                      <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                      <span className="truncate">{post.district}</span>
                    </div>
                  </div>

                  {/* Note / Description */}
                  <p className="text-xs text-slate-300/90 line-clamp-2 my-2 leading-relaxed">
                    {post.note}
                  </p>

                  {/* Court and Cost details */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>
                      Sân: <strong className={post.court === 'Đã có sân' ? 'text-teal-300' : 'text-amber-300'}>{post.court}</strong>
                    </span>
                    <span>
                      Tiền sân: <strong className="text-white">{post.cost}</strong>
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800/70">
                  <button
                    onClick={() => {
                      sounds.playClick();
                      onOpenDetail(post);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white font-semibold text-xs border border-slate-700/60 transition-colors"
                  >
                    Chi tiết
                  </button>

                  {post.mine ? (
                    <button
                      onClick={() => {
                        sounds.playClick();
                        onTogglePostStatus(post.id);
                      }}
                      className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                    >
                      {post.status === 'open' ? 'Đóng tin' : 'Mở lại'}
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        sounds.playClick(isApplied ? 400 : 700);
                        onApply(post);
                      }}
                      disabled={post.status !== 'open' || isApplied}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1 ${
                        isApplied
                          ? 'bg-teal-900/40 text-teal-300 border border-teal-700/60 cursor-default'
                          : 'bg-gradient-to-r from-teal-400 to-cyan-400 hover:brightness-110 active:scale-95 text-slate-950 shadow-md shadow-teal-500/20'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> ĐÃ GỬI
                        </>
                      ) : post.type === 'Đối thủ' ? (
                        '⚔ CÁP KÈO'
                      ) : (
                        '✚ XIN THAM GIA'
                      )}
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
