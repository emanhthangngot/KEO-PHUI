'use client';

import React from 'react';
import { Volume2, VolumeX, Moon, Sun, Smartphone, LayoutGrid, Bell } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080d18]/90 dark:bg-[#080d18]/95 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('discover');
            }}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center font-black italic text-slate-950 text-sm shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              K5
            </div>
            <div>
              <span className="text-lg font-black tracking-tighter italic text-white group-hover:text-cyan-300 transition-colors">
                KÈO<span className="text-cyan-400">{'//'}</span>FIVE
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-800/60 border border-slate-700/50">
                SÂN PHỦI TP.HCM
              </span>
            </div>
          </button>
        </div>

        {/* Dashboard Nav Links (Visible in large desktop view) */}
        {viewMode === 'dashboard' && (
          <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-xs">
            {[
              { id: 'discover', label: 'Khám Phá Kèo' },
              { id: 'post', label: 'Đăng Kèo Mới' },
              { id: 'squad', label: 'Lobby & Sơ Đồ' },
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
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-cyan-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}

        {/* Action Controls & Utilities */}
        <div className="flex items-center gap-2">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Tắt âm thanh hiệu ứng' : 'Bật âm thanh hiệu ứng'}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'Chuyển sang chế độ Ban Ngày' : 'Chuyển sang chế độ Sân Đêm'}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* View Mode Switcher (Desktop only) */}
          <div className="hidden md:flex items-center p-0.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('phone');
              }}
              title="Khung điện thoại tương tác"
              className={`p-1.5 rounded-md flex items-center gap-1 text-[11px] font-bold transition-all ${
                viewMode === 'phone'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Phone Frame</span>
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setViewMode('dashboard');
              }}
              title="Giao diện Grid to rộng"
              className={`p-1.5 rounded-md flex items-center gap-1 text-[11px] font-bold transition-all ${
                viewMode === 'dashboard'
                  ? 'bg-cyan-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Full Grid</span>
            </button>
          </div>

          {/* Notifications Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenNotifications();
            }}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
            title="Thông báo"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-orange-500 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
