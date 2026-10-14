'use client';

import React from 'react';
import { Search, PlusCircle, Users, Swords, Shield } from 'lucide-react';
import { sounds } from '@/lib/sounds';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  hasActiveMatch: boolean;
  captainReady: boolean;
}

export function BottomNav({ activeTab, setActiveTab, hasActiveMatch, captainReady }: BottomNavProps) {
  const tabs = [
    { id: 'discover', label: 'Tìm Kèo', icon: Search },
    { id: 'post', label: 'Đăng Kèo', icon: PlusCircle },
    { id: 'squad', label: 'Đội Hình', icon: Users, badge: captainReady ? 'RDY' : undefined },
    { id: 'match', label: 'Phòng VS', icon: Swords, badge: hasActiveMatch ? 'LIVE' : undefined },
    { id: 'profile', label: 'Hồ Sơ', icon: Shield },
  ];

  return (
    <nav className="border-t border-slate-800/80 bg-[#080d18]/95 backdrop-blur-md px-2 py-1.5 flex items-center justify-around select-none">
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
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl min-w-[56px] transition-all ${
              isActive
                ? 'text-cyan-400 bg-cyan-950/40 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {tab.badge && (
                <span className="absolute -top-1.5 -right-3 px-1 py-0.2 rounded-sm bg-orange-500 text-[8px] font-black text-slate-950 leading-tight">
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
