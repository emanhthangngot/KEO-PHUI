'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState } from 'react';
import {
  Team,
  Player,
  PositionCategory,
  PlayerRole,
  ScheduledMatch,
  TeamInvite,
  TeamNotification,
  AttendanceStatus,
  MatchFormat,
} from '@/lib/types';
import { DISTRICTS, FREE_AGENTS, getDayOffset } from '@/lib/data';
import { generatePlayerAvatar } from '@/lib/avatars';
import { sounds } from '@/lib/sounds';

let idSequence = 1000;
function createId(prefix: string): string {
  idSequence += 1;
  return `${prefix}-${idSequence}`;
}

import {
  Users,
  UserPlus,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Plus,
  Shield,
  Bell,
  Clock,
  Swords,
  ChevronRight,
  Flame,
  Check,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface TeamManagementViewProps {
  userTeam: Team;
  onUpdateTeam: (updatedTeam: Team) => void;
  scheduledMatch: ScheduledMatch | null;
  onUpdateScheduledMatch: (match: ScheduledMatch | null) => void;
  teamInvites: TeamInvite[];
  onUpdateTeamInvites: (invites: TeamInvite[]) => void;
  teamNotifications: TeamNotification[];
  onAddNotification: (notif: Omit<TeamNotification, 'id' | 'timestamp' | 'read'>) => void;
  onLaunchMatchmaking: (match: ScheduledMatch) => void;
  onPublishPostFromMatch: (match: ScheduledMatch) => void;
}

export function TeamManagementView({
  userTeam,
  onUpdateTeam,
  scheduledMatch,
  onUpdateScheduledMatch,
  teamInvites,
  onUpdateTeamInvites,
  teamNotifications,
  onAddNotification,
  onLaunchMatchmaking,
  onPublishPostFromMatch,
}: TeamManagementViewProps) {
  // Tab within Team Management
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'invites' | 'schedule' | 'create'>('roster');

  // Form: Create Team
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamShort, setNewTeamShort] = useState('');
  const [newTeamDistrict, setNewTeamDistrict] = useState('Thủ Đức');
  const [newTeamPitch, setNewTeamPitch] = useState('Sân Cây Sậy, Rạch Chiếc');
  const [newTeamColor, setNewTeamColor] = useState('#06b6d4');
  const [newTeamSlogan, setNewTeamSlogan] = useState('Đá hết mình - Vui hết mình');

  // Form: Invite Player
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [invitePosition, setInvitePosition] = useState<PositionCategory>('MID');
  const [inviteRole, setInviteRole] = useState<PlayerRole>('Tiền vệ');

  // Form: Schedule Match (Set kèo)
  const [schedTitle, setSchedTitle] = useState('KÈO PHỦI GIAO HỮU CUỐI TUẦN');
  const [schedFormat, setSchedFormat] = useState<MatchFormat>('5v5');
  const [schedDate, setSchedDate] = useState(() => getDayOffset(1));
  const [schedTime, setSchedTime] = useState('19:30');
  const [schedVenue, setSchedVenue] = useState('Sân Chảo Lửa, Hoàng Hoa Thám');
  const [schedDistrict, setSchedDistrict] = useState(userTeam.district || 'Tân Bình');
  const [schedCost, setSchedCost] = useState('Chia đôi (khoảng 150k/đội)');
  const [schedNote, setSchedNote] = useState('Đá nhiệt tình fair-play, có nước đá & trọng tài. Anh em đến sớm 15p khởi động.');

  // Quorum calculations
  const requiredPlayers = scheduledMatch ? (scheduledMatch.format === '7v7' ? 7 : (scheduledMatch.format === '11v11' ? 11 : 5)) : 5;
  const confirmedPlayersCount = scheduledMatch
    ? Object.values(scheduledMatch.attendance).filter((s) => s === 'in').length
    : 0;
  const hasQuorum = scheduledMatch ? confirmedPlayersCount >= requiredPlayers : false;

  // 1. Handle Create Team
  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;

    sounds.playReady();
    const leaderPlayer: Player = {
      id: createId('p'),
      name: 'MINH THẮNG (BẠN)',
      shirt: '09',
      role: 'Đội trưởng',
      position: 'FWD',
      rating: 89,
      speed: 90,
      stamina: 87,
      fairPlay: 99,
      skin: '#dca078',
      hair: '#222531',
      jersey: newTeamColor,
      style: 0,
    };

    const newTeam: Team = {
      id: createId('team'),
      name: newTeamName.toUpperCase(),
      shortName: (newTeamShort || newTeamName.slice(0, 3)).toUpperCase(),
      tier: 'Đồng',
      fairPlayScore: 100,
      district: newTeamDistrict,
      homePitch: newTeamPitch,
      roster: [leaderPlayer],
      wins: 0,
      draws: 0,
      losses: 0,
      accentColor: newTeamColor,
      slogan: newTeamSlogan,
    };

    onUpdateTeam(newTeam);
    onAddNotification({
      teamId: newTeam.id,
      title: 'THÀNH LẬP ĐỘI BÓNG THÀNH CÔNG',
      message: `Bạn đã tạo thành công đội ${newTeam.name}. Bạn đang là Đội trưởng (Leader)!`,
      type: 'member_joined',
    });

    setActiveSubTab('roster');
  };

  // 2. Handle Send Invite
  const handleSendInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim()) return;

    sounds.playClick();
    const newInvite: TeamInvite = {
      id: createId('inv'),
      teamId: userTeam.id,
      teamName: userTeam.name,
      invitedName: inviteName.toUpperCase(),
      invitedPhone: invitePhone || '09xx xxx xxx',
      position: invitePosition,
      role: inviteRole,
      status: 'pending',
      invitedBy: `${userTeam.roster[0]?.name || 'Đội trưởng'} (Leader)`,
      createdAt: 'Vừa xong',
    };

    onUpdateTeamInvites([newInvite, ...teamInvites]);
    onAddNotification({
      teamId: userTeam.id,
      title: 'ĐÃ GỬI LỜI MỜI GIA NHẬP ĐỘI',
      message: `Đội trưởng đã gửi lời mời tới cầu thủ ${newInvite.invitedName} (${newInvite.position}).`,
      type: 'invite_received',
    });

    setInviteName('');
    setInvitePhone('');
    setActiveSubTab('invites');
  };

  // 1-Click invite free agent from pool
  const handleInviteFreeAgent = (agent: Player) => {
    sounds.playClick();
    const newInvite: TeamInvite = {
      id: createId('inv-fa'),
      teamId: userTeam.id,
      teamName: userTeam.name,
      invitedName: agent.name,
      invitedPhone: agent.phone || '09xx xxx xxx',
      position: agent.position,
      role: agent.role,
      status: 'pending',
      invitedBy: `${userTeam.roster[0]?.name || 'Đội trưởng'} (Leader)`,
      createdAt: 'Vừa xong',
    };

    onUpdateTeamInvites([newInvite, ...teamInvites]);
    onAddNotification({
      teamId: userTeam.id,
      title: 'ĐÃ GỬI LỜI MỜI CẦU THỦ TỰ DO',
      message: `Đã gửi lời mời tới ${agent.name} (${agent.position} - OVR ${agent.rating}).`,
      type: 'invite_received',
    });
    setActiveSubTab('invites');
  };

  // 3. Player Accept Invite to join squad
  const handleAcceptInvite = (invite: TeamInvite) => {
    sounds.playReady();

    // Check if player already exists in roster
    const exists = userTeam.roster.some((p) => p.name.toLowerCase() === invite.invitedName.toLowerCase());
    if (exists) {
      onUpdateTeamInvites(teamInvites.filter((inv) => inv.id !== invite.id));
      return;
    }

    const newPlayer: Player = {
      id: createId('p'),
      name: invite.invitedName,
      shirt: String(Math.floor(Math.random() * 80) + 11),
      role: invite.role,
      position: invite.position,
      rating: Math.floor(Math.random() * 12) + 80,
      speed: Math.floor(Math.random() * 15) + 80,
      stamina: Math.floor(Math.random() * 15) + 80,
      fairPlay: 98,
      skin: '#dca078',
      hair: '#222531',
      jersey: userTeam.accentColor || '#06b6d4',
      style: 1,
      phone: invite.invitedPhone,
      status: 'active',
    };

    // Add to userTeam roster
    const updatedRoster = [...userTeam.roster, newPlayer];
    onUpdateTeam({
      ...userTeam,
      roster: updatedRoster,
    });

    // Mark invite accepted
    onUpdateTeamInvites(
      teamInvites.map((inv) => (inv.id === invite.id ? { ...inv, status: 'accepted' as const } : inv))
    );

    // If there's an active scheduled match, add them to attendance
    if (scheduledMatch) {
      onUpdateScheduledMatch({
        ...scheduledMatch,
        attendance: {
          ...scheduledMatch.attendance,
          [newPlayer.id]: 'pending',
        },
      });
    }

    // Broadcast notification to whole team
    onAddNotification({
      teamId: userTeam.id,
      title: 'THÀNH VIÊN MỚI GIA NHẬP ĐỘI',
      message: `🎉 Cầu thủ ${newPlayer.name} (${newPlayer.position}) đã chấp nhận lời mời và gia nhập đội hình!`,
      type: 'member_joined',
    });
  };

  // Decline Invite
  const handleDeclineInvite = (inviteId: string) => {
    sounds.playClick(400);
    onUpdateTeamInvites(
      teamInvites.map((inv) => (inv.id === inviteId ? { ...inv, status: 'declined' as const } : inv))
    );
  };

  // Remove player from squad
  const handleRemovePlayer = (playerId: string) => {
    if (userTeam.roster.length <= 1) return;
    sounds.playClick(350);
    const updatedRoster = userTeam.roster.filter((p) => p.id !== playerId);
    onUpdateTeam({
      ...userTeam,
      roster: updatedRoster,
    });
  };

  // 4. Leader Schedules Match & Broadcasts Notification
  const handleScheduleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playTacticalPing();

    const minQuota = schedFormat === '7v7' ? 7 : (schedFormat === '11v11' ? 11 : 5);

    // Initial attendance: Leader is 'in', first few members can be 'in' or 'pending'
    const initialAttendance: Record<string, AttendanceStatus> = {};
    userTeam.roster.forEach((p, idx) => {
      initialAttendance[p.id] = idx === 0 ? 'in' : (idx === 1 ? 'in' : 'pending');
    });

    const newMatch: ScheduledMatch = {
      id: createId('sched'),
      teamId: userTeam.id,
      title: schedTitle.toUpperCase(),
      format: schedFormat,
      requiredPlayers: minQuota,
      date: schedDate,
      time: schedTime,
      venue: schedVenue,
      district: schedDistrict,
      courtStatus: 'Đã có sân',
      cost: schedCost,
      note: schedNote,
      attendance: initialAttendance,
      status: 'rsvp_open',
      createdAt: 'Vừa xong',
    };

    onUpdateScheduledMatch(newMatch);

    // Broadcast notification to ALL team members
    onAddNotification({
      teamId: userTeam.id,
      title: `LỊCH ĐẤU MỚI: ${schedTitle} (${schedFormat})`,
      message: `Đội trưởng vừa lên lịch trận đấu lúc ${schedTime} ngày ${schedDate} tại ${schedVenue}. Yêu cầu tất cả ${userTeam.roster.length} thành viên điểm danh để đủ quân số cáp kèo!`,
      type: 'match_scheduled',
      matchId: newMatch.id,
    });
  };

  // 5. Member Attendance (RSVP)
  const handleSetAttendance = (playerId: string, status: AttendanceStatus) => {
    if (!scheduledMatch) return;
    sounds.playClick(status === 'in' ? 750 : 350);

    const updatedAttendance = {
      ...scheduledMatch.attendance,
      [playerId]: status,
    };

    const nextConfirmed = Object.values(updatedAttendance).filter((s) => s === 'in').length;
    const nextStatus = nextConfirmed >= scheduledMatch.requiredPlayers ? 'ready_to_match' : 'rsvp_open';

    onUpdateScheduledMatch({
      ...scheduledMatch,
      attendance: updatedAttendance,
      status: nextStatus,
    });

    if (nextConfirmed >= scheduledMatch.requiredPlayers && !hasQuorum) {
      sounds.playReady();
      onAddNotification({
        teamId: userTeam.id,
        title: 'ĐÃ ĐỦ QUÂN SỐ CÁP KÈO',
        message: `Đội đã có đủ ${nextConfirmed}/${scheduledMatch.requiredPlayers} thành viên xác nhận tham gia. Khóa cáp kèo đã được mở!`,
        type: 'member_ready',
        matchId: scheduledMatch.id,
      });
    }
  };

  // Quick simulate all roster attend
  const handleSimulateAllIn = () => {
    if (!scheduledMatch) return;
    sounds.playReady();

    const fullAttendance: Record<string, AttendanceStatus> = {};
    userTeam.roster.forEach((p) => {
      fullAttendance[p.id] = 'in';
    });

    onUpdateScheduledMatch({
      ...scheduledMatch,
      attendance: fullAttendance,
      status: 'ready_to_match',
    });

    onAddNotification({
      teamId: userTeam.id,
      title: 'ĐÃ ĐỦ QUÂN SỐ CÁP KÈO (5/5)',
      message: 'Toàn bộ thành viên đã xác nhận có mặt! Đội trưởng có thể tiến hành cáp kèo ngay.',
      type: 'member_ready',
      matchId: scheduledMatch.id,
    });
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Top Banner Card */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-700/70 bg-gradient-to-br from-[#0e1a2f] via-[#091120] to-[#060a12] p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 text-slate-950 flex items-center justify-center font-black italic text-xl shadow-lg shadow-cyan-500/20 shrink-0">
              {userTeam.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {userTeam.name}
                </h1>
                <span className="text-[11px] font-bold text-amber-300 bg-amber-950/70 px-2.5 py-0.5 rounded-full border border-amber-700/50">
                  Hạng {userTeam.tier}
                </span>
                <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/70 px-2.5 py-0.5 rounded-full border border-cyan-700/50">
                  Leader: {userTeam.roster[0]?.name || 'Bạn'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Khu vực: <strong className="text-white">{userTeam.district}</strong> · Uy tín: <strong className="text-teal-400">{userTeam.fairPlayScore}/100</strong> · Sĩ số: <strong className="text-cyan-400">{userTeam.roster.length} thành viên</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Thành tích: <strong className="text-white">{userTeam.wins}T · {userTeam.draws}H · {userTeam.losses}B</strong>
            </span>
          </div>
        </div>

        {/* Modern Segmented Sub-Navigation Bar */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveSubTab('roster');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'roster'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Quân Số ({userTeam.roster.length})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveSubTab('invites');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'invites'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Mời Cầu Thủ ({teamInvites.filter((i) => i.status === 'pending').length})
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveSubTab('schedule');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'schedule'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Set Lịch &amp; Điểm Danh
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveSubTab('create');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeSubTab === 'create'
                ? 'bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 shadow-md shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            Tạo Đội Mới
          </button>
        </div>
      </section>

      {/* SUB-TAB 1: ROSTER & SQUAD MANAGEMENT */}
      {activeSubTab === 'roster' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                DANH SÁCH THÀNH VIÊN ĐỘI ({userTeam.roster.length} CẦU THỦ)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Các thành viên sẽ tham gia điểm danh mỗi khi đội trưởng lên lịch trận đấu.
              </p>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                setActiveSubTab('invites');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-950/70 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 border border-cyan-700/50 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <UserPlus className="w-3.5 h-3.5" /> Mời thêm cầu thủ
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {userTeam.roster.map((player, idx) => (
              <div
                key={player.id}
                className="group relative rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-cyan-500/40 p-3.5 flex items-center justify-between gap-3 transition-all shadow-md hover:shadow-cyan-500/5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl border border-slate-700/80 bg-slate-950 shrink-0 relative overflow-hidden shadow-inner">
                    <img
                      src={generatePlayerAvatar(player)}
                      alt={player.name}
                      className="w-full h-full object-cover"
                    />
                    {idx === 0 && (
                      <span className="absolute bottom-0 right-0 bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 rounded-tl-md">
                        C
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white text-xs truncate group-hover:text-cyan-300 transition-colors">
                      {player.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      #{player.shirt} · <span className="text-cyan-400 font-semibold">{player.position}</span> · {player.role}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-teal-400 font-semibold mt-0.5">
                      <span>OVR {player.rating}</span>
                      <span>·</span>
                      <span>Tốc {player.speed}</span>
                      <span>·</span>
                      <span>Lực {player.stamina}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                    {idx === 0 ? 'ĐỘI TRƯỞNG' : (idx < 5 ? 'ĐÁ CHÍNH' : 'DỰ BỊ')}
                  </span>
                  {idx > 0 && (
                    <button
                      onClick={() => handleRemovePlayer(player.id)}
                      title="Xóa cầu thủ khỏi đội"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Roster Status Callout */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Tình trạng đội hình</span>
              <p className="text-white font-bold">
                {userTeam.roster.length >= 5
                  ? `Đội đã có đủ ${userTeam.roster.length} thành viên để thi đấu thể thức Sân 5.`
                  : `Đội mới có ${userTeam.roster.length}/5 cầu thủ. Cần thêm ${5 - userTeam.roster.length} cầu thủ để đủ thể thức sân 5!`}
              </p>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                setActiveSubTab('schedule');
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-bold uppercase text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              Lên lịch trận đấu ngay <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INVITE PLAYERS & ACCEPTANCE */}
      {activeSubTab === 'invites' && (
        <div className="space-y-6">
          {/* Pending Invites with ACCEPT / DECLINE mechanism */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  LỜI MỜI ĐANG CHỜ PHẢN HỒI (PENDING INVITES)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cầu thủ bấm &ldquo;Chấp nhận&rdquo; để tham gia ngay vào đội hình chính thức.
                </p>
              </div>
              <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-800/50">
                {teamInvites.filter((i) => i.status === 'pending').length} đang chờ
              </span>
            </div>

            {teamInvites.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400">
                Chưa có lời mời nào được gửi. Hãy chọn cầu thủ tự do bên dưới hoặc điền form để gửi lời mời!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teamInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className={`rounded-2xl border p-4 flex flex-col justify-between gap-3 shadow-md ${
                      invite.status === 'accepted'
                        ? 'border-emerald-500/50 bg-emerald-950/20'
                        : invite.status === 'declined'
                        ? 'border-rose-500/30 bg-rose-950/10 opacity-70'
                        : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-white text-sm font-bold">{invite.invitedName}</strong>
                          <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/70 border border-cyan-800/50 px-2 py-0.5 rounded-full">
                            {invite.position} · {invite.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          SĐT: {invite.invitedPhone} · Mời bởi: <strong className="text-slate-200">{invite.invitedBy}</strong>
                        </p>
                        <p className="text-[10px] text-slate-500 mt-0.5">Gửi lúc: {invite.createdAt}</p>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          invite.status === 'accepted'
                            ? 'border-emerald-500 text-emerald-300 bg-emerald-950/60'
                            : invite.status === 'declined'
                            ? 'border-rose-500 text-rose-300 bg-rose-950/60'
                            : 'border-amber-500 text-amber-300 bg-amber-950/60 animate-pulse'
                        }`}
                      >
                        {invite.status === 'accepted'
                          ? '✓ ĐÃ VÀO ĐỘI'
                          : invite.status === 'declined'
                          ? '✕ ĐÃ TỪ CHỐI'
                          : '⏳ CHỜ PHẢN HỒI'}
                      </span>
                    </div>

                    {/* Interactive Accept / Decline actions */}
                    {invite.status === 'pending' ? (
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-400">
                          Phản hồi từ cầu thủ:
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeclineInvite(invite.id)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-rose-500/40 text-rose-300 hover:bg-rose-950/40 transition-colors"
                          >
                            Từ chối
                          </button>
                          <button
                            onClick={() => handleAcceptInvite(invite)}
                            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                          >
                            <Check className="w-3.5 h-3.5" /> Chấp nhận gia nhập (Accept)
                          </button>
                        </div>
                      </div>
                    ) : invite.status === 'accepted' ? (
                      <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Cầu thủ đã chính thức có mặt trong danh sách thi đấu!
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form: Invite Player Directly */}
          <div className="rounded-3xl border border-slate-800 bg-[#0e1726]/90 p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  GỬI LỜI MỜI CẦU THỦ MỚI (NHẬP THÔNG TIN)
                </h3>
              </div>
              <span className="text-xs text-slate-400">Đội trưởng gửi trực tiếp</span>
            </div>

            <form onSubmit={handleSendInviteSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Tên cầu thủ
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: QUANG HẢI"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Số điện thoại / Zalo
                  </label>
                  <input
                    type="text"
                    placeholder="VD: 0912 345 678"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Vị trí thi đấu
                  </label>
                  <select
                    value={invitePosition}
                    onChange={(e) => setInvitePosition(e.target.value as PositionCategory)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="GK">Thủ môn (GK)</option>
                    <option value="DEF">Hậu vệ (DEF)</option>
                    <option value="MID">Tiền vệ (MID)</option>
                    <option value="FWD">Tiền đạo (FWD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Vai trò dự kiến
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as PlayerRole)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="Tiền đạo">Tiền đạo</option>
                    <option value="Tiền vệ">Tiền vệ</option>
                    <option value="Hậu vệ">Hậu vệ</option>
                    <option value="Thủ môn">Thủ môn</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black uppercase text-xs transition-colors flex items-center gap-2 shadow-md shadow-cyan-500/20"
              >
                <Plus className="w-4 h-4" /> Gửi Lời Mời Vào Đội
              </button>
            </form>
          </div>

          {/* Free Agents Pool */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  THỊ TRƯỜNG CẦU THỦ TỰ DO TP.HCM (FREE AGENTS)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Bấm &ldquo;+ Mời&rdquo; để gửi lời mời lập tức cho cầu thủ tự do.
                </p>
              </div>
              <span className="text-xs text-slate-400">1-Chạm gửi lời mời</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FREE_AGENTS.map((agent) => (
                <div
                  key={agent.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 flex items-center justify-between gap-3 hover:border-amber-400/50 transition-all shadow-md"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl border border-slate-700 bg-slate-950 shrink-0 overflow-hidden shadow">
                      <img
                        src={generatePlayerAvatar(agent)}
                        alt={agent.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-xs truncate">{agent.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        #{agent.shirt} · <span className="text-cyan-400 font-semibold">{agent.position}</span> · OVR <strong className="text-amber-300">{agent.rating}</strong>
                      </p>
                      <p className="text-[10px] text-slate-500">SĐT: {agent.phone}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInviteFreeAgent(agent)}
                    className="px-3 py-1.5 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 text-xs font-bold transition-all shrink-0 shadow-sm"
                  >
                    + Mời
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SET LỊCH TRẬN ĐẤU & ĐIỂM DANH QUÂN SỐ (QUORUM GATE) */}
      {activeSubTab === 'schedule' && (
        <div className="space-y-6">
          {/* Active Scheduled Match & Quorum Control */}
          {scheduledMatch ? (
            <div className="rounded-3xl border border-slate-700/80 bg-gradient-to-br from-[#0c182d] via-[#091120] to-[#060a12] p-5 sm:p-7 space-y-6 shadow-2xl">
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full border border-cyan-400 text-cyan-300 bg-cyan-950/60 uppercase tracking-wider">
                      LỊCH THI ĐẤU · {scheduledMatch.format}
                    </span>
                    <span className="text-xs text-slate-400">
                      YÊU CẦU QUÂN SỐ: TỐI THIỂU {requiredPlayers} CẦU THỦ
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white uppercase mt-1">
                    {scheduledMatch.title}
                  </h2>
                  <p className="text-xs text-slate-300 flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-cyan-400" /> {scheduledMatch.date} lúc {scheduledMatch.time}</span>
                    <span>·</span>
                    <span>📍 {scheduledMatch.venue} ({scheduledMatch.district})</span>
                  </p>
                </div>

                {/* Quorum Badge */}
                <div
                  className={`rounded-2xl border px-4 py-3 text-center sm:text-right shadow-lg ${
                    hasQuorum
                      ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 shadow-emerald-500/10'
                      : 'border-amber-500/60 bg-amber-950/40 text-amber-300 shadow-amber-500/10'
                  }`}
                >
                  <div className="flex items-center gap-1.5 justify-center sm:justify-end font-bold text-xs">
                    {hasQuorum ? (
                      <Unlock className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-400" />
                    )}
                    <span>{hasQuorum ? 'ĐÃ ĐỦ QUÂN SỐ CÁP KÈO' : 'CHƯA ĐỦ QUÂN SỐ'}</span>
                  </div>
                  <div className="text-lg font-black mt-0.5">
                    {confirmedPlayersCount} / {requiredPlayers} CẦU THỦ CÓ MẶT
                  </div>
                </div>
              </div>

              {/* Attendance Checklist for every member */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-300">
                    BẢNG ĐIỂM DANH THÀNH VIÊN ({confirmedPlayersCount}/{userTeam.roster.length} CÓ MẶT)
                  </span>

                  <button
                    onClick={handleSimulateAllIn}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 underline"
                  >
                    + Điểm danh nhanh tất cả thành viên có mặt
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {userTeam.roster.map((player) => {
                    const status = scheduledMatch.attendance[player.id] || 'pending';
                    const isAttending = status === 'in';
                    const isAbsent = status === 'out';

                    return (
                      <div
                        key={player.id}
                        className={`rounded-2xl border p-3 flex items-center justify-between gap-2.5 transition-all shadow-sm ${
                          isAttending
                            ? 'border-emerald-500/60 bg-emerald-950/25'
                            : isAbsent
                            ? 'border-rose-500/30 bg-rose-950/15'
                            : 'border-slate-800 bg-slate-900/70'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl border border-slate-700 bg-slate-950 shrink-0 overflow-hidden shadow">
                            <img
                              src={generatePlayerAvatar(player)}
                              alt={player.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{player.name}</p>
                            <p className="text-[10px] text-slate-400">
                              #{player.shirt} · {player.position}
                            </p>
                          </div>
                        </div>

                        {/* Interactive RSVP buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleSetAttendance(player.id, 'in')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              isAttending
                                ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                            }`}
                          >
                            Có mặt
                          </button>
                          <button
                            onClick={() => handleSetAttendance(player.id, 'out')}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              isAbsent
                                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                            }`}
                          >
                            Bận
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* STRICT QUORUM LOCK / UNLOCK BAR */}
              <div
                className={`rounded-3xl border p-5 space-y-4 shadow-xl ${
                  hasQuorum
                    ? 'border-emerald-500/60 bg-gradient-to-br from-emerald-950/30 to-slate-900/60 shadow-emerald-500/10'
                    : 'border-amber-500/60 bg-gradient-to-br from-amber-950/30 to-slate-900/60 shadow-amber-500/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  {hasQuorum ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <strong className="text-sm uppercase block text-white font-black">
                      {hasQuorum
                        ? 'QUÂN SỐ ĐÃ ĐẠT TIÊU CHUẨN CÁP KÈO (ĐỦ 5/5)'
                        : `CHƯA ĐỦ QUÂN SỐ ĐỂ CÁP KÈO (HIỆN CÓ: ${confirmedPlayersCount}/${requiredPlayers})`}
                    </strong>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {hasQuorum
                        ? 'Tất cả điều kiện đã thỏa mãn! Đội trưởng có thể mở sảnh ghép trận hoặc đăng tìm đối thủ ngay bây giờ.'
                        : `Quy tắc bắt buộc: Phải có ít nhất ${requiredPlayers} cầu thủ điểm danh có mặt thì mới có thể cáp kèo. Cần thêm ${requiredPlayers - confirmedPlayersCount} cầu thủ!`}
                    </p>
                  </div>
                </div>

                {/* Quorum Progress Line */}
                <div className="w-full bg-slate-950 h-3 rounded-full border border-slate-700/80 overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      hasQuorum
                        ? 'bg-gradient-to-r from-teal-400 to-emerald-400 shadow-md shadow-emerald-500/30'
                        : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    }`}
                    style={{
                      width: `${Math.min(100, (confirmedPlayersCount / requiredPlayers) * 100)}%`,
                    }}
                  />
                </div>

                {/* Cáp Kèo Action Buttons - LOCKED OR ACTIVE */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                  <button
                    disabled={!hasQuorum}
                    onClick={() => onLaunchMatchmaking(scheduledMatch)}
                    className={`w-full sm:w-1/2 py-3.5 px-5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                      hasQuorum
                        ? 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 hover:brightness-110 active:scale-98 shadow-lg shadow-emerald-500/25'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    {hasQuorum ? (
                      <>
                        <Swords className="w-4 h-4" /> TIẾN HÀNH CÁP KÈO NGAY (MATCHMAKING)
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> KHÓA CÁP KÈO (THIẾU {requiredPlayers - confirmedPlayersCount} CẦU THỦ)
                      </>
                    )}
                  </button>

                  <button
                    disabled={!hasQuorum}
                    onClick={() => onPublishPostFromMatch(scheduledMatch)}
                    className={`w-full sm:w-1/2 py-3.5 px-5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
                      hasQuorum
                        ? 'border-cyan-400 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 shadow-md shadow-cyan-500/10'
                        : 'border-slate-800 text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    Đăng Tin Tìm Đối Thủ Lên Bảng Kèo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400">
              Chưa có trận đấu nào được set lịch. Hãy điền thông tin bên dưới để lên lịch và thông báo toàn đội!
            </div>
          )}

          {/* Form: Leader Sets Match & Broadcasts Notifications */}
          <div className="rounded-3xl border border-slate-800 bg-[#0e1726]/90 p-5 sm:p-7 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                  LÊN LỊCH TRẬN ĐẤU MỚI CHO ĐỘI (SET KÈO)
                </h3>
              </div>
              <span className="text-xs text-amber-300">
                Tự động gửi thông báo cho tất cả {userTeam.roster.length} thành viên
              </span>
            </div>

            <form onSubmit={handleScheduleMatchSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Tiêu đề trận đấu
                  </label>
                  <input
                    type="text"
                    required
                    value={schedTitle}
                    onChange={(e) => setSchedTitle(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Thể thức thi đấu
                  </label>
                  <select
                    value={schedFormat}
                    onChange={(e) => setSchedFormat(e.target.value as MatchFormat)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="5v5">Sân 5 (5v5 - Cần tối thiểu 5 cầu thủ)</option>
                    <option value="7v7">Sân 7 (7v7 - Cần tối thiểu 7 cầu thủ)</option>
                    <option value="11v11">Sân 11 (11v11 - Cần tối thiểu 11 cầu thủ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Ngày thi đấu
                  </label>
                  <input
                    type="date"
                    required
                    value={schedDate}
                    onChange={(e) => setSchedDate(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Giờ bóng lăn
                  </label>
                  <input
                    type="time"
                    required
                    value={schedTime}
                    onChange={(e) => setSchedTime(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Khu vực quận
                  </label>
                  <select
                    value={schedDistrict}
                    onChange={(e) => setSchedDistrict(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Địa chỉ sân bóng
                  </label>
                  <input
                    type="text"
                    required
                    value={schedVenue}
                    onChange={(e) => setSchedVenue(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Chi phí thuê sân
                  </label>
                  <input
                    type="text"
                    value={schedCost}
                    onChange={(e) => setSchedCost(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Ghi chú chiến thuật &amp; dặn dò thành viên
                  </label>
                  <textarea
                    rows={2}
                    value={schedNote}
                    onChange={(e) => setSchedNote(e.target.value)}
                    className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 hover:brightness-110 text-slate-950 font-black uppercase text-xs transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Bell className="w-4 h-4" /> LÊN LỊCH &amp; BẮT ĐẦU ĐIỂM DANH TOÀN ĐỘI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CREATE NEW TEAM */}
      {activeSubTab === 'create' && (
        <div className="rounded-3xl border border-slate-800 bg-[#0e1726]/90 p-6 sm:p-7 space-y-5 max-w-2xl shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider">
              KHỞI TẠO ĐỘI BÓNG PHỦI TP.HCM
            </span>
            <h2 className="text-xl font-black text-white uppercase mt-0.5">
              TẠO ĐỘI MỚI VÀ TRỞ THÀNH ĐỘI TRƯỞNG
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Bạn sẽ là người quản lý, mời thêm cầu thủ, set lịch thi đấu và đại diện cáp kèo.
            </p>
          </div>

          <form onSubmit={handleCreateTeamSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Tên đội bóng
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: FC PHỦI SÀI GÒN"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Tên viết tắt (Tag 3-4 ký tự)
                </label>
                <input
                  type="text"
                  placeholder="VD: PSG"
                  maxLength={4}
                  value={newTeamShort}
                  onChange={(e) => setNewTeamShort(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Quận hoạt động chính
                </label>
                <select
                  value={newTeamDistrict}
                  onChange={(e) => setNewTeamDistrict(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Sân nhà ưu tiên
                </label>
                <input
                  type="text"
                  placeholder="VD: Sân Chảo Lửa"
                  value={newTeamPitch}
                  onChange={(e) => setNewTeamPitch(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Màu áo đấu chủ đạo
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newTeamColor}
                    onChange={(e) => setNewTeamColor(e.target.value)}
                    className="w-10 h-10 p-0 rounded-xl border border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-white font-bold">{newTeamColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Khẩu hiệu / Slogan
                </label>
                <input
                  type="text"
                  placeholder="VD: Đá vui vẻ - Đoàn kết là chính"
                  value={newTeamSlogan}
                  onChange={(e) => setNewTeamSlogan(e.target.value)}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="py-3.5 px-7 rounded-2xl bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 font-black uppercase text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/25"
              >
                <Plus className="w-4 h-4" /> TẠO ĐỘI VÀ THIẾT LẬP ĐỘI TRƯỞNG
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
