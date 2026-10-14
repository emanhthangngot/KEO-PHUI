'use client';

import React, { useState, useEffect } from 'react';
import {
  MatchPost,
  Team,
  MatchRoom,
  MatchRequest,
  FilterState,
} from '@/lib/types';
import {
  DEFAULT_USER_TEAM,
  INITIAL_POSTS,
  RIVAL_TEAMS,
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
import {
  PostDetailModal,
  TeamEditModal,
  NotificationModal,
  MatchReportModal,
} from '@/components/Modals';
import { sounds } from '@/lib/sounds';
import { Zap, ArrowRight } from 'lucide-react';

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
        })
      );
    } catch {
      // Ignore storage errors
    }
  }, [userTeam, captainReady, posts, requests, activeMatch]);

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
            colors: ['#56ebd9', '#ff936a', '#d6ef7b'],
          });
        }).catch(() => {});
      }
      showToast('ĐỐI THỦ ĐÃ XÁC NHẬN! TRẬN ĐẤU ĐÃ ĐƯỢC KHOÁ.');
    } else {
      showToast(nextVal ? 'Đối thủ đồng ý (giả lập).' : 'Đối thủ rút xác nhận (giả lập).');
    }
  };

  const handleCompleteMatch = (scoreA: number, scoreB: number, mvp: string) => {
    if (!activeMatch) return;
    setUserTeam((prev) => ({
      ...prev,
      fairPlayScore: Math.min(100, prev.fairPlayScore + 3),
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
    showToast('Đã lưu kết quả thi đấu & cộng điểm uy tín!');
  };

  const handleExitMatch = () => {
    setActiveMatch(null);
    showToast('Đã rời khỏi phòng trận.');
  };

  const handleResetDemo = () => {
    try {
      localStorage.removeItem('keofive_v2_data');
    } catch {
      // Ignore
    }
    setUserTeam(DEFAULT_USER_TEAM);
    setCaptainReady(false);
    setPosts(INITIAL_POSTS);
    setRequests([]);
    setActiveMatch(null);
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
            onNavigateToSquad={() => setActiveTab('squad')}
            onNavigateToPost={() => setActiveTab('post')}
            onNavigateToPitches={() => setActiveTab('profile')}
            onTogglePostStatus={handleTogglePostStatus}
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
      case 'match':
        return (
          <MatchRoomTab
            match={activeMatch}
            onConfirmMatch={handleConfirmMatch}
            onSimulateRivalConfirm={handleSimulateRivalConfirm}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onExitMatch={handleExitMatch}
            onNavigateToDiscover={() => setActiveTab('discover')}
            onNavigateToSquad={() => setActiveTab('squad')}
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
    <div className={`min-h-screen ${isDark ? 'dark bg-[#060a12]' : 'light-theme bg-[#f0f4f9]'} text-[#f4f8ff] flex flex-col font-sans transition-colors duration-300`}>
      {/* Top Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        isDark={isDark}
        setIsDark={setIsDark}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        unreadCount={requests.length + (activeMatch ? 1 : 0)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Arena */}
      <main className="flex-1 flex items-center justify-center p-0 md:p-6 lg:p-8">
        {viewMode === 'phone' ? (
          /* Phone Frame Showcase Layout (Desktop has companion side panel + interactive phone) */
          <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14">
            {/* Left Companion Explainer Panel (visible on lg+) */}
            <div className="hidden lg:flex flex-col space-y-4 max-w-sm shrink-0">
              <span className="text-[11px] font-black tracking-widest text-cyan-400 uppercase">
                KÈO//FIVE 2.0 · SÂN PHỦI TP.HCM
              </span>
              <h1 className="text-4xl font-black italic tracking-tighter text-white leading-[1.05]">
                TÌM KÈO.<br />
                <span className="text-cyan-400">MATCH ĐỐI.</span><br />
                RA SÂN.
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Từ đăng tin tìm đối thủ bóng đá phong trào truyền thống đến matchmaking thể thức Esports. Tích hợp sơ đồ chiến thuật 5v5/7v7, bản đồ nhiệt, và phòng chốt kèo hai đội trưởng.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 flex items-center justify-center font-black text-xs shrink-0">
                    01
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Bảng Tin Cáp Kèo Phủi</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Lọc theo quận, sân 5/7, giờ đá, trình độ; nhận hoặc xin kèo chỉ với 1 chạm.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 flex items-center justify-center font-black text-xs shrink-0">
                    02
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Đội Trưởng Ready &amp; Sơ Đồ</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">5 avatar đại diện ra sân. Bật Ready để kích hoạt ghép đối thủ ngang trình.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 flex items-center justify-center font-black text-xs shrink-0">
                    03
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Phòng VS &amp; Xác Nhận Kèo</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Hai bên xác nhận giờ đá, chi phí và sân bóng trước khi ra sân thi đấu.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    setViewMode('dashboard');
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Mở chế độ Full Grid to rộng <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Phone Frame */}
            <div className="w-full md:w-[412px] h-[100dvh] md:h-[844px] md:max-h-[calc(100vh-60px)] md:rounded-[42px] md:border-[8px] md:border-[#243142] md:outline md:outline-2 md:outline-[#0b121e] md:shadow-[0_25px_80px_rgba(0,0,0,0.8),0_0_50px_rgba(46,203,207,0.15)] bg-[#080d18] flex flex-col overflow-hidden relative">
              {/* Phone Status Bar (Mock iOS/Android status) */}
              <div className="h-9 px-6 flex items-end justify-between text-[11px] font-bold text-slate-300 select-none shrink-0 z-20">
                <span>21:14</span>
                <div className="hidden sm:block w-20 h-4 bg-slate-950 rounded-full mx-auto" />
                <div className="flex items-center gap-1 text-[10px]">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Scrollable Screen Body */}
              <div className="flex-1 overflow-y-auto px-4 py-2 no-scrollbar relative z-10">
                {renderTabContent()}
              </div>

              {/* Bottom Nav Bar */}
              <BottomNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                hasActiveMatch={Boolean(activeMatch)}
                captainReady={captainReady}
              />
            </div>
          </div>
        ) : (
          /* Full Screen Responsive Grid Dashboard */
          <div className="w-full max-w-7xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                FULL GRID VIEW · TP.HCM FOOTBALL DASHBOARD
              </span>
              <button
                onClick={() => {
                  sounds.playClick();
                  setViewMode('phone');
                }}
                className="text-xs font-bold text-slate-400 hover:text-white underline"
              >
                ← Quay lại khung điện thoại
              </button>
            </div>

            <div className="bg-[#0c1524] rounded-3xl border border-slate-800 p-4 sm:p-6 shadow-2xl">
              {renderTabContent()}
            </div>
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-teal-300 text-slate-950 font-black text-xs shadow-2xl flex items-center gap-2 animate-bounce transition-all border border-teal-200"
        >
          <Zap className="w-4 h-4 text-slate-950" />
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
      />

      <MatchReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        match={activeMatch}
        onCompleteMatch={handleCompleteMatch}
      />
    </div>
  );
}
