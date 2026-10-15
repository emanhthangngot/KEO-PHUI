'use client';

import React, { useState, useEffect } from 'react';
import {
  MatchPost,
  Team,
  MatchRoom,
  MatchRequest,
  FilterState,
  ScheduledMatch,
  TeamInvite,
  TeamNotification,
  CS2MatchOutcome,
} from '@/lib/types';
import {
  DEFAULT_USER_TEAM,
  INITIAL_POSTS,
  RIVAL_TEAMS,
  INITIAL_SCHEDULED_MATCH,
  INITIAL_TEAM_INVITES,
  INITIAL_TEAM_NOTIFICATIONS,
  getDayOffset,
} from '@/lib/data';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { DiscoverTab } from '@/components/DiscoverTab';
import { PostTab } from '@/components/PostTab';
import { SquadTab } from '@/components/SquadTab';
import { MatchRoomTab } from '@/components/MatchRoomTab';
import { ScheduleTab } from '@/components/ScheduleTab';
import { ProfileTab } from '@/components/ProfileTab';
import { TeamManagementView } from '@/components/TeamManagementView';
import { CS2MatchShowcase } from '@/components/CS2MatchShowcase';
import {
  PostDetailModal,
  TeamEditModal,
  NotificationModal,
  MatchReportModal,
} from '@/components/Modals';
import { sounds } from '@/lib/sounds';
import { Zap, ArrowRight, Shield, Swords, Trophy, Users, CheckCircle2 } from 'lucide-react';

export function FootballApp() {
  // Navigation & View mode
  const [activeTab, setActiveTab] = useState<string>('discover');
  const [viewMode, setViewMode] = useState<'phone' | 'dashboard'>('phone');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Core application state lazily initialized from localStorage
  const [userTeam, setUserTeam] = useState<Team>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('keofive_v2_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.userTeam) return parsed.userTeam;
        }
      } catch {}
    }
    return DEFAULT_USER_TEAM;
  });

  const [captainReady, setCaptainReady] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('keofive_v2_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (typeof parsed.captainReady === 'boolean') return parsed.captainReady;
        }
      } catch {}
    }
    return false;
  });

  const [posts, setPosts] = useState<MatchPost[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('keofive_v2_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.posts) && parsed.posts.length > 0) return parsed.posts;
        }
      } catch {}
    }
    return INITIAL_POSTS;
  });

  const [requests, setRequests] = useState<MatchRequest[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('keofive_v2_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.requests)) return parsed.requests;
        }
      } catch {}
    }
    return [];
  });

  const [activeMatch, setActiveMatch] = useState<MatchRoom | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('keofive_v2_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.activeMatch) return parsed.activeMatch;
        }
      } catch {}
    }
    return null;
  });

  // Scheduled match & attendance quorum
  const [scheduledMatch, setScheduledMatch] = useState<ScheduledMatch | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('keofive_v2_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.scheduledMatch) return parsed.scheduledMatch;
        }
      } catch {}
    }
    return INITIAL_SCHEDULED_MATCH;
  });

  // Team invites
  const [teamInvites, setTeamInvites] = useState<TeamInvite[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('keofive_v2_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.teamInvites)) return parsed.teamInvites;
        }
      } catch {}
    }
    return INITIAL_TEAM_INVITES;
  });

  // Team notifications
  const [teamNotifications, setTeamNotifications] = useState<TeamNotification[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('keofive_v2_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed.teamNotifications)) return parsed.teamNotifications;
        }
      } catch {}
    }
    return INITIAL_TEAM_NOTIFICATIONS;
  });

  // CS2 Match Outcome Showcase
  const [cs2Outcome, setCs2Outcome] = useState<CS2MatchOutcome | null>(null);
  const [isCS2Open, setIsCS2Open] = useState<boolean>(false);

  const [isSearchingMatch, setIsSearchingMatch] = useState<boolean>(false);

  // Filter state
  const [filter, setFilter] = useState<FilterState>({
    district: 'Tất cả',
    format: 'Tất cả',
    type: 'Tất cả',
    court: 'Tất cả',
    level: 'Tất cả',
    search: '',
  });

  // Modals & Drawers
  const [selectedPost, setSelectedPost] = useState<MatchPost | null>(null);
  const [isTeamEditOpen, setIsTeamEditOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage((current) => (current === msg ? null : current)), 3500);
  };

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        'keofive_v2_data',
        JSON.stringify({
          userTeam,
          captainReady,
          posts,
          requests,
          activeMatch,
          scheduledMatch,
          teamInvites,
          teamNotifications,
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, [userTeam, captainReady, posts, requests, activeMatch, scheduledMatch, teamInvites, teamNotifications]);

  // Actions
  const handleToggleReady = () => {
    const next = !captainReady;
    setCaptainReady(next);
    if (next) {
      sounds.playReady();
      showToast('Đội trưởng đã bật READY đại diện cho cả đội!');
    } else {
      sounds.playClick(450);
      showToast('Đã tắt trạng thái Ready của đội.');
    }
  };

  const handleCreatePost = (newPostData: Omit<MatchPost, 'id' | 'createdAt' | 'requestsCount'>) => {
    const newPost: MatchPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      createdAt: 'Vừa xong',
      requestsCount: 0,
    };
    setPosts([newPost, ...posts]);
    showToast('Đã đăng kèo thành công lên bảng tin công khai!');
    setActiveTab('discover');
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
    showToast('Đã xóa tin đăng kèo.');
  };

  const handleTogglePostStatus = (id: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'open' ? 'closed' : 'open';
          showToast(nextStatus === 'open' ? 'Đã mở lại tin kèo.' : 'Đã đóng nhận yêu cầu cho tin này.');
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  const handleApplyToPost = (post: MatchPost) => {
    if (requests.some((r) => r.postId === post.id)) {
      showToast('Bạn đã gửi yêu cầu cho kèo này rồi!');
      return;
    }

    const newReq: MatchRequest = {
      id: `req-${Date.now()}`,
      kind: 'sent',
      postId: post.id,
      team: post.team,
      date: post.date,
      type: post.type,
      timestamp: Date.now(),
    };
    setRequests([...requests, newReq]);
    setSelectedPost(null);

    if (post.type === 'Đối thủ') {
      const rival = RIVAL_TEAMS.find((t) => t.name === post.team) || {
        ...RIVAL_TEAMS[0],
        name: post.team,
      };

      const newMatch: MatchRoom = {
        id: `match-${Date.now()}`,
        teamA: userTeam,
        teamB: rival,
        date: post.date,
        time: post.time,
        district: post.district,
        venue: post.venue,
        format: post.format,
        court: post.court,
        cost: post.cost,
        source: 'feed',
        myConfirmed: true,
        theirConfirmed: false,
        status: 'lobby',
      };

      setActiveMatch(newMatch);
      setActiveTab('match');
      sounds.playMatchFound();
      showToast('MATCH FOUND! Đang chuyển đến phòng VS để chốt kèo.');
    } else {
      showToast('Đã gửi yêu cầu tham gia đá lẻ tới đội trưởng!');
      setActiveTab('schedule');
    }
  };

  const handleQuickMatch = (district: string, timeSlot: string) => {
    setIsSearchingMatch(true);
    showToast('Đang tìm đối thủ phù hợp cùng khu vực TP.HCM...');

    setTimeout(() => {
      setIsSearchingMatch(false);
      const rival = RIVAL_TEAMS.find((t) => t.district === district) || RIVAL_TEAMS[0];

      const newMatch: MatchRoom = {
        id: `match-quick-${Date.now()}`,
        teamA: userTeam,
        teamB: rival,
        date: getDayOffset(1),
        time: timeSlot.split('–')[0] || '19:30',
        district: district,
        venue: rival.homePitch || `Sân bóng tại ${district}`,
        format: '5v5',
        court: 'Đã có sân',
        cost: 'Chia đôi',
        source: 'quick',
        myConfirmed: false,
        theirConfirmed: false,
        status: 'lobby',
      };

      setActiveMatch(newMatch);
      setActiveTab('match');
      sounds.playMatchFound();
      showToast('MATCH FOUND! Đã tìm thấy đối thủ ngang trình!');
    }, 1200);
  };

  const handleConfirmMatch = () => {
    if (!activeMatch) return;
    const updated = { ...activeMatch, myConfirmed: true };
    setActiveMatch(updated);
    if (updated.theirConfirmed) {
      showToast('HAI ĐỘI TRƯỞNG ĐÃ CHỐT TRẬN THÀNH CÔNG!');
    } else {
      showToast('Đội trưởng bạn đã xác nhận. Chờ đối thủ bấm đồng ý.');
    }
  };

  const handleSimulateRivalConfirm = () => {
    if (!activeMatch) return;
    const nextVal = !activeMatch.theirConfirmed;
    const updated = { ...activeMatch, theirConfirmed: nextVal };
    setActiveMatch(updated);
    if (nextVal && updated.myConfirmed) {
      sounds.playWhistle();
      if (typeof window !== 'undefined') {
        import('canvas-confetti').then((confettiModule) => {
          const confettiFn = confettiModule.default || confettiModule;
          confettiFn({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#06b6d4', '#f59e0b', '#10b981'],
          });
        }).catch(() => {});
      }
      showToast('ĐỐI THỦ ĐÃ XÁC NHẬN! TRẬN ĐẤU ĐÃ ĐƯỢC KHOÁ.');
    } else {
      showToast(nextVal ? 'Đối thủ đồng ý (giả lập).' : 'Đối thủ rút xác nhận (giả lập).');
    }
  };

  // Complete Match and Trigger CS2 Showcase
  const handleCompleteMatch = (scoreA: number, scoreB: number, mvp: string) => {
    if (!activeMatch) return;
    const isWin = scoreA >= scoreB;

    setUserTeam((prev) => ({
      ...prev,
      fairPlayScore: Math.min(100, prev.fairPlayScore + (isWin ? 5 : 2)),
      wins: scoreA > scoreB ? prev.wins + 1 : prev.wins,
      draws: scoreA === scoreB ? prev.draws + 1 : prev.draws,
      losses: scoreA < scoreB ? prev.losses + 1 : prev.losses,
    }));

    setActiveMatch({
      ...activeMatch,
      status: 'completed',
      scoreA,
      scoreB,
      mvpPlayer: mvp,
    });

    // Construct CS2 Outcome
    const outcome: CS2MatchOutcome = {
      type: isWin ? 'victory' : 'defeat',
      scoreA,
      scoreB,
      teamA: activeMatch.teamA,
      teamB: activeMatch.teamB,
      mvp: {
        name: mvp,
        shirt: activeMatch.teamA.roster[0]?.shirt || '09',
        award: isWin ? 'CẦU THỦ ĐỊNH ĐOẠT TRẬN ĐẤU' : 'CẦU THỦ NỖ LỰC NHẤT TRẬN',
        mvpStarCount: isWin ? 3 : 1,
      },
      headline: isWin ? 'CHIẾN THẮNG TUYỆT ĐỐI' : 'THẤT BẠI ĐẦY TIẾC NUỐI',
      subheadline: isWin
        ? `${activeMatch.teamA.name} GIÀNH TRỌN 3 ĐIỂM SÂN PHỦI`
        : 'ĐỐI THỦ PHẢN CÔNG HIỆU QUẢ Ở HIỆP 2',
    };

    setCs2Outcome(outcome);
    setIsCS2Open(true);
    showToast('Đã lưu kết quả thi đấu & kích hoạt màn CS2 Showcase!');
  };

  // Quick Trigger for testing CS2 victory/defeat effects
  const handleTriggerCS2 = (type: 'victory' | 'defeat') => {
    const isWin = type === 'victory';
    const outcome: CS2MatchOutcome = {
      type,
      scoreA: isWin ? 5 : 2,
      scoreB: isWin ? 3 : 4,
      teamA: userTeam,
      teamB: activeMatch?.teamB || RIVAL_TEAMS[0],
      mvp: {
        name: userTeam.roster[0]?.name || 'MINH THẮNG',
        shirt: userTeam.roster[0]?.shirt || '09',
        award: isWin ? 'CẦU THỦ XUẤT SẮC NHẤT TRẬN' : 'CẦU THỦ ĐIỂM SÁNG',
        mvpStarCount: isWin ? 3 : 1,
      },
      headline: isWin ? 'CHIẾN THẮNG THUYẾT PHỤC' : 'THẤT BẠI CẦN RÚT KINH NGHIỆM',
      subheadline: isWin
        ? 'HÀNG CÔNG TỎA SÁNG RỰC RỠ TRÊN SÂN'
        : 'ĐỐI THỦ TẬN DỤNG TỐT CƠ HỘI PHẢN CÔNG',
    };

    setCs2Outcome(outcome);
    setIsCS2Open(true);
  };

  // Launch matchmaking when quorum is met in scheduled match
  const handleLaunchMatchmakingFromSchedule = (match: ScheduledMatch) => {
    setCaptainReady(true);
    showToast(`Quân số đã đủ (${match.requiredPlayers}/${match.requiredPlayers})! Đang tìm đối thủ...`);
    handleQuickMatch(match.district, match.time);
  };

  // Publish match post to discover feed
  const handlePublishPostFromSchedule = (match: ScheduledMatch) => {
    const newPost: MatchPost = {
      id: `post-sched-${Date.now()}`,
      mine: true,
      type: 'Đối thủ',
      team: userTeam.name,
      teamId: userTeam.id,
      format: match.format,
      date: match.date,
      time: match.time,
      district: match.district,
      level: 'Khá',
      court: match.courtStatus,
      venue: match.venue,
      cost: match.cost,
      note: match.note,
      status: 'open',
      createdAt: 'Vừa xong',
      requestsCount: 0,
    };

    setPosts([newPost, ...posts]);
    setActiveTab('discover');
    sounds.playReady();
    showToast('Đã đăng tin tìm đối thủ lên bảng kèo công khai!');
  };

  const handleExitMatch = () => {
    setActiveMatch(null);
    showToast('Đã rời khỏi phòng trận.');
  };

  const handleResetDemo = () => {
    try {
      localStorage.removeItem('keofive_v2_data');
    } catch {}
    setUserTeam(DEFAULT_USER_TEAM);
    setCaptainReady(false);
    setPosts(INITIAL_POSTS);
    setRequests([]);
    setActiveMatch(null);
    setScheduledMatch(INITIAL_SCHEDULED_MATCH);
    setTeamInvites(INITIAL_TEAM_INVITES);
    setTeamNotifications(INITIAL_TEAM_NOTIFICATIONS);
    setActiveTab('discover');
    showToast('Đã đặt lại dữ liệu demo ban đầu!');
  };

  // Render current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'discover':
        return (
          <DiscoverTab
            posts={posts}
            filter={filter}
            setFilter={setFilter}
            onOpenDetail={(p) => setSelectedPost(p)}
            onApply={handleApplyToPost}
            appliedPostIds={requests.map((r) => r.postId)}
            captainReady={captainReady}
            onNavigateToSquad={() => setActiveTab('team')}
            onNavigateToPost={() => setActiveTab('post')}
            onNavigateToPitches={() => setActiveTab('profile')}
            onTogglePostStatus={handleTogglePostStatus}
          />
        );
      case 'team':
        return (
          <TeamManagementView
            userTeam={userTeam}
            onUpdateTeam={setUserTeam}
            scheduledMatch={scheduledMatch}
            onUpdateScheduledMatch={setScheduledMatch}
            teamInvites={teamInvites}
            onUpdateTeamInvites={setTeamInvites}
            teamNotifications={teamNotifications}
            onAddNotification={(notif) => {
              const newN: TeamNotification = {
                ...notif,
                id: `notif-${Date.now()}`,
                timestamp: Date.now(),
                read: false,
              };
              setTeamNotifications((prev) => [newN, ...prev]);
              showToast(`Thông báo mới: ${notif.title}`);
            }}
            onLaunchMatchmaking={handleLaunchMatchmakingFromSchedule}
            onPublishPostFromMatch={handlePublishPostFromSchedule}
          />
        );
      case 'squad':
        return (
          <SquadTab
            userTeam={userTeam}
            captainReady={captainReady}
            onToggleReady={handleToggleReady}
            onEditTeam={() => setIsTeamEditOpen(true)}
            onQuickMatch={handleQuickMatch}
            isSearchingMatch={isSearchingMatch}
          />
        );
      case 'post':
        return (
          <PostTab
            userTeamName={userTeam.name}
            userDistrict={userTeam.district}
            myPosts={posts.filter((p) => p.mine)}
            onCreatePost={handleCreatePost}
            onDeletePost={handleDeletePost}
            onTogglePostStatus={handleTogglePostStatus}
          />
        );
      case 'match':
        return (
          <MatchRoomTab
            match={activeMatch}
            onConfirmMatch={handleConfirmMatch}
            onSimulateRivalConfirm={handleSimulateRivalConfirm}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onExitMatch={handleExitMatch}
            onNavigateToDiscover={() => setActiveTab('discover')}
            onNavigateToSquad={() => setActiveTab('team')}
            onTriggerCS2={handleTriggerCS2}
          />
        );
      case 'schedule':
        return (
          <ScheduleTab
            activeMatch={activeMatch}
            requests={requests}
            onOpenMatchRoom={() => setActiveTab('match')}
            onNavigateToDiscover={() => setActiveTab('discover')}
            onNavigateToPost={() => setActiveTab('post')}
            onNavigateToPitches={() => setActiveTab('profile')}
          />
        );
      case 'profile':
        return (
          <ProfileTab
            userTeam={userTeam}
            onEditTeam={() => setIsTeamEditOpen(true)}
            onResetDemo={handleResetDemo}
            onSelectFeature={(feat) => {
              showToast(`Tính năng "${feat}" nằm trong lộ trình v2.5.`);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-[#050810]' : 'light-theme bg-[#eef3f8]'} text-[#f4f8ff] flex flex-col font-sans transition-colors duration-300`}>
      {/* Top Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        isDark={isDark}
        setIsDark={setIsDark}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        unreadCount={teamNotifications.filter((n) => !n.read).length + requests.length + (activeMatch ? 1 : 0)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onTriggerCS2Effect={handleTriggerCS2}
      />

      {/* Main Content Arena */}
      <main className="flex-1 flex items-center justify-center p-0 md:p-6 lg:p-8">
        {viewMode === 'phone' ? (
          /* Phone Frame Showcase Layout (Desktop has companion side panel + interactive phone) */
          <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Left Companion Explainer Panel - Sleek Sports Identity */}
            <div className="hidden lg:flex flex-col space-y-4 max-w-sm shrink-0 rounded-3xl border border-slate-700/80 bg-gradient-to-br from-[#0e1726]/90 via-[#0a101b] to-[#070b14] p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider bg-cyan-950/70 px-2.5 py-0.5 rounded-full border border-cyan-800/50">
                  KÈO FIVE · SÂN PHỦI TP.HCM
                </span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-700/50 px-2 py-0.5 rounded-full">
                  PRO V2.5
                </span>
              </div>

              <h1 className="text-3xl font-black italic tracking-tight text-white uppercase leading-none">
                TẠO ĐỘI.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">ĐỦ QUÂN SỐ.</span><br />
                CÁP KÈO.
              </h1>

              <p className="text-xs text-slate-300 leading-relaxed">
                Nền tảng bóng đá phủi TP.HCM: Tạo đội bóng, mời cầu thủ, duyệt thành viên tự động, set lịch thi đấu và kiểm tra quân số nghiêm ngặt trước khi mở khóa cáp kèo!
              </p>

              {/* Feature Highlights */}
              <div className="space-y-2.5 pt-1 text-xs">
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-3 shadow-sm hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs uppercase">
                    <Users className="w-4 h-4 text-cyan-400" /> 01. Quản Lý Đội &amp; Tuyển Quân
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Leader gửi lời mời, cầu thủ bấm Accept gia nhập ngay vào danh sách thi đấu chính thức.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-3 shadow-sm hover:border-amber-500/40 transition-colors">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase">
                    <Shield className="w-4 h-4 text-amber-400" /> 02. Quorum Gate Cáp Kèo
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Lên lịch và thông báo toàn đội. Bắt buộc đủ 5/5 người điểm danh có mặt mới được chốt kèo.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-3 shadow-sm hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase">
                    <Trophy className="w-4 h-4 text-emerald-400" /> 03. Hiệu Ứng Thắng/Thua CS2
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Màn ăn mừng CS2 Victory / Defeat hoành tráng với âm thanh nổ sấm rền và vinh danh MVP.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={() => handleTriggerCS2('victory')}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20"
                >
                  <Trophy className="w-4 h-4" /> Trải Nghiệm CS2 Victory
                </button>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setViewMode('dashboard');
                  }}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-white transition-colors pt-1"
                >
                  Mở chế độ Full Grid toàn màn hình <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Phone Frame - Modern Curvature with Ambient Glow */}
            <div className="w-full md:w-[412px] h-[100dvh] md:h-[844px] md:max-h-[calc(100vh-60px)] md:rounded-[44px] md:border-[8px] md:border-[#202c3e] bg-[#070b14] flex flex-col overflow-hidden relative shadow-[0_25px_80px_rgba(0,0,0,0.85),0_0_50px_rgba(6,182,212,0.15)]">
              {/* Dynamic Island / Status Bar */}
              <div className="h-9 px-6 flex items-center justify-between text-[11px] font-bold text-slate-400 select-none shrink-0 z-20 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-md">
                <span>TP.HCM · 21:30</span>
                <div className="hidden sm:block w-20 h-4 bg-slate-950 rounded-full mx-auto border border-slate-800" />
                <div className="flex items-center gap-1.5 text-cyan-400 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Scrollable Screen Body */}
              <div className="flex-1 overflow-y-auto px-3.5 py-3 no-scrollbar relative z-10">
                {renderTabContent()}
              </div>

              {/* Bottom Nav Bar */}
              <BottomNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                hasActiveMatch={Boolean(activeMatch)}
                captainReady={captainReady}
                pendingInvitesCount={teamInvites.filter((i) => i.status === 'pending').length}
              />
            </div>
          </div>
        ) : (
          /* Full Screen Responsive Grid Dashboard */
          <div className="w-full max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                FULL GRID DASHBOARD · KÈO FIVE SÂN PHỦI TP.HCM
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setViewMode('phone');
                }}
                className="text-xs font-bold text-slate-400 hover:text-white underline"
              >
                ← Chuyển về khung điện thoại (Mobile Frame)
              </button>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-[#0a101b]/95 p-5 sm:p-7 shadow-2xl backdrop-blur-xl">
              {renderTabContent()}
            </div>
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-cyan-400 text-black font-mono font-black text-xs shadow-2xl flex items-center gap-2 transition-all border border-cyan-200"
        >
          <Zap className="w-4 h-4 text-black" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onApply={handleApplyToPost}
        isApplied={selectedPost ? requests.some((r) => r.postId === selectedPost.id) : false}
      />

      <TeamEditModal
        isOpen={isTeamEditOpen}
        onClose={() => setIsTeamEditOpen(false)}
        team={userTeam}
        onSave={(updated) => {
          setUserTeam(updated);
          showToast('Đã lưu thông tin đội bóng và 5 cầu thủ!');
        }}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        captainReady={captainReady}
        requestsCount={requests.length}
        hasMatch={Boolean(activeMatch)}
        onClear={() => {}}
        notifications={teamNotifications}
      />

      <MatchReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        match={activeMatch}
        onCompleteMatch={handleCompleteMatch}
      />

      {/* CS2 Victory / Defeat Showcase Modal */}
      <CS2MatchShowcase
        outcome={cs2Outcome}
        isOpen={isCS2Open}
        onClose={() => setIsCS2Open(false)}
        onSwitchMode={handleTriggerCS2}
      />
    </div>
  );
}
