'use client';

import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Smartphone, LayoutGrid, Bell, Trophy, Shield, Flame } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface HeaderProps {
  viewMode: 'phone' | 'dashboard';
  setViewMode: (m: 'phone' | 'dashboard') => void;
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTriggerCS2Effect?: (type: 'victory' | 'defeat') => void;
}

export function Header({
  viewMode,
  setViewMode,
  isDark,
  setIsDark,
  soundEnabled,
  setSoundEnabled,
  unreadCount,
  onOpenNotifications,
  activeTab,
  setActiveTab,
  onTriggerCS2Effect,
}: HeaderProps) {
  const toggleSound = () => {
    const next = !soundEnabled;
    sounds.enabled = next;
    setSoundEnabled(next);
    if (next) sounds.playClick(800);
  };

  const toggleTheme = () => {
    sounds.playClick(600);
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070b14]/90 backdrop-blur-xl px-4 sm:px-6 py-3 transition-colors shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Lockup - Modern Sleek Sports Identity */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('discover');
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 text-slate-950 flex items-center justify-center font-black italic text-sm shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-all">
              K5
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight italic text-white group-hover:text-cyan-300 transition-colors">
                  KÈO FIVE
                </span>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800/50">
                  TP.HCM
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block -mt-0.5">
                Sân Phủi &amp; Matchmaking Lobby
              </p>
            </div>
          </button>
        </div>

        {/* Dashboard Nav Links (Visible in large desktop view) */}
        {viewMode === 'dashboard' && (
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs shadow-inner">
            {[
              { id: 'discover', label: 'Khám Phá Kèo' },
              { id: 'team', label: 'Quản Lý Đội' },
              { id: 'squad', label: 'Sơ Đồ Chiến Thuật' },
              { id: 'post', label: 'Đăng Kèo Mới' },
              { id: 'match', label: 'Phòng VS Match' },
              { id: 'schedule', label: 'Lịch Thi Đấu' },
              { id: 'profile', label: 'Hồ Sơ & Sân' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  sounds.playClick();
                  setActiveTab(item.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2">
          {/* Quick CS2 Win/Loss Showcase Trigger */}
          {onTriggerCS2Effect && (
            <div className="hidden sm:flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 gap-1">
              <button
                onClick={() => {
                  sounds.playClick();
                  onTriggerCS2Effect('victory');
                }}
                title="Xem thử hiệu ứng CHIẾN THẮNG CS2"
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg text-amber-300 hover:bg-amber-950/40 hover:text-amber-200 transition-colors flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> CS2 Thắng
              </button>
              <button
                onClick={() => {
                  sounds.playClick();
                  onTriggerCS2Effect('defeat');
                }}
                title="Xem thử hiệu ứng THẤT BẠI CS2"
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-200 transition-colors flex items-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-rose-500" /> CS2 Thua
              </button>
            </div>
          )}

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all shadow-sm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Chuyển sang chế độ Ban Ngày' : 'Chuyển sang chế độ Sân Đêm'}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all shadow-sm"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* View Mode Switcher (Desktop only) */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800 gap-1">
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('phone');
              }}
              title="Khung điện thoại tương tác"
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[11px] font-bold transition-all ${
                viewMode === 'phone'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Mobile</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('dashboard');
              }}
              title="Giao diện Grid to rộng"
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[11px] font-bold transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Dashboard</span>
            </button>
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenNotifications();
            }}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800 transition-all shadow-sm"
            title="Thông báo đội bóng"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center shadow-md animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
