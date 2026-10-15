export type PlayerRole = 'Đội trưởng' | 'Tiền đạo' | 'Tiền vệ' | 'Hậu vệ' | 'Thủ môn';
export type PositionCategory = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface Player {
  id: string;
  name: string;
  shirt: string;
  role: PlayerRole;
  position: PositionCategory;
  rating: number; // 70 - 99
  speed: number;
  stamina: number;
  fairPlay: number;
  skin: string;
  hair: string;
  jersey: string;
  style: number;
  phone?: string;
  status?: 'active' | 'pending';
}

export type TeamTier = 'Đồng' | 'Bạc' | 'Vàng' | 'Bạch Kim' | 'Kim Cương' | 'Elite';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  tier: TeamTier;
  fairPlayScore: number; // 0 - 100
  district: string;
  homePitch: string;
  roster: Player[];
  wins: number;
  draws: number;
  losses: number;
  accentColor: string;
  leaderId?: string;
  foundedYear?: string;
  slogan?: string;
}

export type MatchType = 'Đối thủ' | 'Cầu thủ lẻ';
export type MatchFormat = '5v5' | '7v7' | '11v11';
export type SkillLevel = 'Vui là chính' | 'Trung bình' | 'Khá' | 'Mạnh';
export type CourtStatus = 'Đã có sân' | 'Chưa có sân';

export interface MatchPost {
  id: string;
  mine: boolean;
  type: MatchType;
  team: string;
  teamId?: string;
  format: MatchFormat;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "19:00"
  duration?: string; // e.g. "90 phút"
  district: string;
  level: SkillLevel;
  court: CourtStatus;
  venue: string;
  cost: string; // 'Chia đôi' | 'Chia đều' | 'Thỏa thuận' | 'Đội mình bao sân'
  note: string;
  vacancies?: string[];
  status: 'open' | 'closed';
  createdAt: string;
  requestsCount?: number;
}

export interface MatchRequest {
  id: string;
  kind: 'sent' | 'received';
  postId: string;
  team: string;
  date: string;
  type: MatchType;
  timestamp: number;
}

export interface MatchRoom {
  id: string;
  teamA: Team;
  teamB: Team;
  date: string;
  time: string;
  district: string;
  venue: string;
  format: MatchFormat;
  court: CourtStatus;
  cost: string;
  source: 'quick' | 'feed' | 'mine';
  myConfirmed: boolean;
  theirConfirmed: boolean;
  status: 'lobby' | 'locked' | 'completed';
  scoreA?: number;
  scoreB?: number;
  mvpPlayer?: string;
  tacticalReport?: {
    summary: string;
    possessionA: number;
    possessionB: number;
    shotsA: number;
    shotsB: number;
    foulsA: number;
    foulsB: number;
    keyMoments: string[];
    aiAnalysis: string;
  };
}

export interface PitchInfo {
  id: string;
  name: string;
  district: string;
  address: string;
  formats: string[];
  surface: string;
  lights: string;
  pricePerHour: string;
  phone: string;
  amenities: string[];
  rating: number;
  reviewsCount: number;
  verified: boolean;
}

export interface FilterState {
  district: string;
  format: string;
  type: string;
  court: string;
  level: string;
  search: string;
}

/* New: Team Roster, RSVP Attendance & Match Schedule */
export type AttendanceStatus = 'in' | 'out' | 'pending';

export interface ScheduledMatch {
  id: string;
  teamId: string;
  title: string;
  format: MatchFormat;
  requiredPlayers: number; // 5 for 5v5, 7 for 7v7, 11 for 11v11
  date: string;
  time: string;
  venue: string;
  district: string;
  opponent?: string;
  courtStatus: CourtStatus;
  cost: string;
  note: string;
  attendance: Record<string, AttendanceStatus>; // memberId -> 'in' | 'out' | 'pending'
  status: 'draft' | 'rsvp_open' | 'ready_to_match' | 'matched' | 'completed';
  createdAt: string;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  teamName: string;
  invitedName: string;
  invitedPhone: string;
  position: PositionCategory;
  role: PlayerRole;
  status: 'pending' | 'accepted' | 'declined';
  invitedBy: string;
  createdAt: string;
}

export interface TeamNotification {
  id: string;
  teamId: string;
  title: string;
  message: string;
  type: 'match_scheduled' | 'member_joined' | 'member_ready' | 'invite_received' | 'rsvp_update';
  matchId?: string;
  timestamp: number;
  read: boolean;
}

/* CS2 End-of-Match Lineup Showcase */
export interface CS2AgentPose {
  player: Player;
  killsOrGoals: number;
  assists: number;
  staminaUsed: number;
  title: string;
  weaponOrGear: string;
  isMvp?: boolean;
}

export interface CS2MatchOutcome {
  type: 'victory' | 'defeat';
  scoreA: number;
  scoreB: number;
  teamA: Team;
  teamB: Team;
  mvp: {
    name: string;
    shirt: string;
    award: string;
    mvpStarCount: number;
  };
  headline: string;
  subheadline: string;
}
