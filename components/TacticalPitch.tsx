'use client';

import React, { useState } from 'react';
import { Player } from '@/lib/types';
import { sounds } from '@/lib/sounds';

interface TacticalPitchProps {
  roster: Player[];
  teamName: string;
  format?: '5v5' | '7v7';
}

type Formation5v5 = '1-2-1' | '2-1-1' | '2-2';
type Formation7v7 = '2-3-1' | '3-2-1' | '3-1-2';

export function TacticalPitch({ roster, teamName, format = '5v5' }: TacticalPitchProps) {
  const [formation5, setFormation5] = useState<Formation5v5>('1-2-1');
  const [formation7, setFormation7] = useState<Formation7v7>('2-3-1');
  const [heatMapMode, setHeatMapMode] = useState<'formation' | 'team_heat' | 'player_heat'>('formation');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(roster[0]?.id || '');

  const selectedPlayer = roster.find((p) => p.id === selectedPlayerId) || roster[0];

  // Coordinates (x: 0-100%, y: 0-100%) for 5v5 formations
  const getCoordinates5v5 = (formation: Formation5v5) => {
    switch (formation) {
      case '1-2-1': // Diamond
        return [
          { top: '85%', left: '50%', role: 'GK' },
          { top: '65%', left: '50%', role: 'CB' },
          { top: '45%', left: '22%', role: 'LM' },
          { top: '45%', left: '78%', role: 'RM' },
          { top: '22%', left: '50%', role: 'ST' },
        ];
      case '2-1-1': // Pyramid
        return [
          { top: '85%', left: '50%', role: 'GK' },
          { top: '68%', left: '28%', role: 'LB' },
          { top: '68%', left: '72%', role: 'RB' },
          { top: '45%', left: '50%', role: 'CM' },
          { top: '22%', left: '50%', role: 'ST' },
        ];
      case '2-2': // Square
        return [
          { top: '85%', left: '50%', role: 'GK' },
          { top: '68%', left: '30%', role: 'LB' },
          { top: '68%', left: '70%', role: 'RB' },
          { top: '30%', left: '30%', role: 'LF' },
          { top: '30%', left: '70%', role: 'RF' },
        ];
    }
  };

  const coords = getCoordinates5v5(formation5);

  return (
    <div className="space-y-3">
      {/* Controls Bar: Formation & Heatmap Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Formation Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/60 dark:bg-slate-950/80 rounded-xl border border-slate-700/50">
          <span className="text-[10px] font-semibold text-slate-400 px-1">Sơ đồ:</span>
          {(['1-2-1', '2-1-1', '2-2'] as Formation5v5[]).map((f) => (
            <button
              key={f}
              onClick={() => {
                sounds.playClick(650);
                setFormation5(f);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                formation5 === f
                  ? 'bg-teal-500 text-slate-950 shadow-sm shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Heat Map Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-900/60 dark:bg-slate-950/80 rounded-xl border border-slate-700/50">
          <button
            onClick={() => {
              sounds.playClick();
              setHeatMapMode('formation');
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
              heatMapMode === 'formation'
                ? 'bg-cyan-400 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Vị trí
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setHeatMapMode('team_heat');
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
              heatMapMode === 'team_heat'
                ? 'bg-orange-400 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Heatmap Đội
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setHeatMapMode('player_heat');
            }}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
              heatMapMode === 'player_heat'
                ? 'bg-emerald-400 text-slate-950'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cầu thủ
          </button>
        </div>
      </div>

      {/* Football Pitch Tactical Board */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-emerald-600/40 bg-gradient-to-b from-emerald-950 via-[#0a231b] to-emerald-950 shadow-inner p-2 select-none">
        {/* Subtle Pitch Grass Stripes */}
        <div className="absolute inset-0 flex flex-col pointer-events-none opacity-20">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 ${i % 2 === 0 ? 'bg-black/30' : 'bg-white/10'}`}
            />
          ))}
        </div>

        {/* Pitch Tactical SVG Markings */}
        <svg
          className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] pointer-events-none opacity-50"
          viewBox="0 0 100 130"
          preserveAspectRatio="none"
        >
          {/* Outer Boundary */}
          <rect x="0" y="0" width="100" height="130" fill="none" stroke="#6ee7b7" strokeWidth="1" />
          
          {/* Halfway line */}
          <line x1="0" y1="65" x2="100" y2="65" stroke="#6ee7b7" strokeWidth="1" />
          
          {/* Center Circle */}
          <circle cx="50" cy="65" r="14" fill="none" stroke="#6ee7b7" strokeWidth="1" />
          <circle cx="50" cy="65" r="1.5" fill="#6ee7b7" />
          
          {/* Top Penalty Box */}
          <rect x="22" y="0" width="56" height="22" fill="none" stroke="#6ee7b7" strokeWidth="1" />
          <rect x="36" y="0" width="28" height="8" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
          <circle cx="50" cy="14" r="1" fill="#6ee7b7" />
          <path d="M 38 22 A 12 12 0 0 0 62 22" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />

          {/* Bottom Penalty Box (Our Team defending this side) */}
          <rect x="22" y="108" width="56" height="22" fill="none" stroke="#6ee7b7" strokeWidth="1" />
          <rect x="36" y="122" width="28" height="8" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
          <circle cx="50" cy="116" r="1" fill="#6ee7b7" />
          <path d="M 38 108 A 12 12 0 0 1 62 108" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />

          {/* Corner arcs */}
          <path d="M 0 4 A 4 4 0 0 0 4 0" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
          <path d="M 96 0 A 4 4 0 0 0 100 4" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
          <path d="M 0 126 A 4 4 0 0 1 4 130" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
          <path d="M 96 130 A 4 4 0 0 1 100 126" fill="none" stroke="#6ee7b7" strokeWidth="0.8" />
        </svg>

        {/* Heat Map Overlays */}
        {heatMapMode === 'team_heat' && (
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 animate-fadeIn">
            {/* High pressure attacking third & midfield */}
            <div className="absolute top-[20%] left-[30%] w-48 h-32 rounded-full bg-orange-500/35 blur-2xl" />
            <div className="absolute top-[40%] left-[20%] w-56 h-36 rounded-full bg-yellow-400/30 blur-2xl" />
            <div className="absolute top-[55%] left-[45%] w-44 h-32 rounded-full bg-red-500/25 blur-2xl" />
            <div className="absolute top-[75%] left-[40%] w-32 h-24 rounded-full bg-emerald-400/20 blur-xl" />
          </div>
        )}

        {heatMapMode === 'player_heat' && selectedPlayer && (
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 animate-fadeIn">
            {selectedPlayer.position === 'FWD' && (
              <div className="absolute top-[18%] left-[32%] w-44 h-32 rounded-full bg-cyan-400/40 blur-2xl" />
            )}
            {selectedPlayer.position === 'MID' && (
              <div className="absolute top-[40%] left-[25%] w-56 h-36 rounded-full bg-cyan-400/40 blur-2xl" />
            )}
            {selectedPlayer.position === 'DEF' && (
              <div className="absolute top-[65%] left-[30%] w-52 h-28 rounded-full bg-cyan-400/40 blur-2xl" />
            )}
            {selectedPlayer.position === 'GK' && (
              <div className="absolute top-[80%] left-[38%] w-32 h-20 rounded-full bg-cyan-400/45 blur-xl" />
            )}
          </div>
        )}

        {/* Interactive Player Pins */}
        {roster.slice(0, 5).map((player, idx) => {
          const coord = coords[idx] || { top: '50%', left: '50%', role: 'MID' };
          const isSelected = selectedPlayerId === player.id;

          return (
            <button
              key={player.id}
              onClick={() => {
                sounds.playClick(750);
                setSelectedPlayerId(player.id);
              }}
              style={{ top: coord.top, left: coord.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center transition-all duration-300 focus:outline-none z-10`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform ${
                  isSelected
                    ? 'bg-cyan-400 text-slate-950 scale-125 ring-4 ring-cyan-400/50 shadow-cyan-400/50'
                    : 'bg-slate-900 text-white border-2 border-teal-400 group-hover:scale-110'
                }`}
              >
                {player.shirt}
              </div>
              <span
                className={`mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded shadow ${
                  isSelected
                    ? 'bg-cyan-400 text-slate-950 font-black'
                    : 'bg-black/80 text-white'
                } whitespace-nowrap`}
              >
                {player.name.split(' ').slice(-1)[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Player Quick Stat Card */}
      {selectedPlayer && (
        <div className="p-2.5 rounded-xl bg-slate-900/80 dark:bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-[10px]">
              #{selectedPlayer.shirt}
            </span>
            <div>
              <p className="font-bold text-white leading-tight">
                {selectedPlayer.name}
                <span className="text-slate-400 font-normal ml-1">({selectedPlayer.role})</span>
              </p>
              <p className="text-[10px] text-teal-300">
                OVR {selectedPlayer.rating} · Uy tín {selectedPlayer.fairPlay}%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-300">
            <div>
              <span className="text-slate-400">Tốc độ: </span>
              <strong className="text-white">{selectedPlayer.speed}</strong>
            </div>
            <div>
              <span className="text-slate-400">Thể lực: </span>
              <strong className="text-white">{selectedPlayer.stamina}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
