'use client';

import React from 'react';
import { Search, PlusCircle, Users, Swords, Shield } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasActiveMatch: boolean;
  captainReady: boolean;
  pendingInvitesCount?: number;
}

export function BottomNav({
  activeTab,
  setActiveTab,
  hasActiveMatch,
  captainReady,
  pendingInvitesCount = 0,
}: BottomNavProps) {
  const tabs = [
    { id: 'discover', label: 'Tìm Kèo', icon: Search },
    {
      id: 'team',
      label: 'Quản Lý Đội',
      icon: Users,
      badge: pendingInvitesCount > 0 ? `+${pendingInvitesCount}` : undefined,
    },
    { id: 'squad', label: 'Sơ Đồ', icon: Shield, badge: captainReady ? 'RDY' : undefined },
    { id: 'post', label: 'Đăng Kèo', icon: PlusCircle },
    { id: 'match', label: 'Phòng VS', icon: Swords, badge: hasActiveMatch ? 'LIVE' : undefined },
    { id: 'profile', label: 'Hồ Sơ', icon: Shield },
  ];

  return (
    <nav className="border-t border-slate-800/80 bg-[#070b14]/95 backdrop-blur-xl px-2 py-2 flex items-center justify-around select-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => {
              sounds.playClick(isActive ? 700 : 550);
              setActiveTab(tab.id);
            }}
            className={`relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 ${
              isActive
                ? 'text-cyan-400 bg-cyan-950/50 font-bold shadow-sm shadow-cyan-500/20 scale-105'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <div className="relative">
              <Icon className="w-4 h-4 mb-0.5" />
              {tab.badge && (
                <span className="absolute -top-1.5 -right-3 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-[8px] font-black text-slate-950 leading-tight shadow">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
