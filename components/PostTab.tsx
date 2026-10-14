'use client';

import React, { useState } from 'react';
import { MatchPost, MatchType, MatchFormat, SkillLevel, CourtStatus } from '@/lib/types';
import { DISTRICTS, getDayOffset } from '@/lib/data';
import { sounds } from '@/lib/sounds';
import { Calendar, MapPin, Plus, Check, Trash2, Edit3, ShieldAlert } from 'lucide-react';
import { getTeamInitials } from '@/lib/avatars';

interface PostTabProps {
  userTeamName: string;
  userDistrict: string;
  myPosts: MatchPost[];
  onCreatePost: (post: Omit<MatchPost, 'id' | 'createdAt' | 'requestsCount'>) => void;
  onDeletePost: (id: string) => void;
  onTogglePostStatus: (id: string) => void;
}

export function PostTab({
  userTeamName,
  userDistrict,
  myPosts,
  onCreatePost,
  onDeletePost,
  onTogglePostStatus,
}: PostTabProps) {
  const [postType, setPostType] = useState<MatchType>('Đối thủ');
  const [format, setFormat] = useState<MatchFormat>('5v5');
  const [level, setLevel] = useState<SkillLevel>('Trung bình');
  const [date, setDate] = useState<string>(getDayOffset(1));
  const [time, setTime] = useState<string>('19:30');
  const [duration, setDuration] = useState<string>('90 phút');
  const [district, setDistrict] = useState<string>(userDistrict || 'Thủ Đức');
  const [court, setCourt] = useState<CourtStatus>('Đã có sân');
  const [venue, setVenue] = useState<string>('Sân Cây Sậy - Thủ Đức');
  const [cost, setCost] = useState<string>('Chia đôi');
  const [note, setNote] = useState<string>(
    'Đội đá giao hữu vui vẻ sau giờ làm, tôn trọng đối thủ và chơi đúng giờ.'
  );
  const [vacancies, setVacancies] = useState<string[]>(['Hậu vệ']);

  const quickDates = [
    { label: 'Hôm nay', val: getDayOffset(0) },
    { label: 'Ngày mai', val: getDayOffset(1) },
    { label: '3 ngày tới', val: getDayOffset(3) },
    { label: 'Cuối tuần', val: getDayOffset(5) },
  ];

  const quickTimes = ['17:30', '19:00', '20:30', '21:30'];

  const toggleVacancy = (role: string) => {
    sounds.playClick();
    if (vacancies.includes(role)) {
      setVacancies(vacancies.filter((r) => r !== role));
    } else {
      setVacancies([...vacancies, role]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;

    sounds.playReady();
    onCreatePost({
      mine: true,
      type: postType,
      team: userTeamName,
      format,
      date,
      time,
      duration,
      district,
      level,
      court,
      venue: venue.trim() || (court === 'Đã có sân' ? `Sân bóng tại ${district}` : 'Thỏa thuận sân'),
      cost,
      note: note.trim(),
      vacancies: postType === 'Cầu thủ lẻ' ? vacancies : undefined,
      status: 'open',
    });

    // Reset some fields
    setNote('Đội đá giao hữu lành mạnh, fair play, không va chạm thô bạo.');
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Title */}
      <div>
        <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">
          PUBLIC KÈO BOARD · TP.HCM
        </span>
        <h1 className="text-xl sm:text-2xl font-black italic text-white tracking-tight mt-0.5">
          ĐĂNG TUYỂN <span className="text-cyan-400">KÈO MỚI.</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Đăng thông tin trận giao hữu hoặc tuyển cầu thủ lẻ. Đội khác trên toàn TP.HCM sẽ thấy và gửi yêu cầu cáp kèo.
        </p>
      </div>

      {/* Segmented Type Switcher */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setPostType('Đối thủ');
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            postType === 'Đối thủ'
              ? 'bg-gradient-to-r from-teal-400 to-cyan-400 text-slate-950 shadow-md shadow-teal-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚔ TÌM ĐỘI ĐỐI THỦ
        </button>
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setPostType('Cầu thủ lẻ');
          }}
          className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            postType === 'Cầu thủ lẻ'
              ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-slate-950 shadow-md shadow-orange-500/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ♟ TUYỂN CẦU THỦ LẺ
        </button>
      </div>

      {/* 2-Column Responsive Layout: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#101a2c]/80 p-4 sm:p-5 space-y-4"
        >
          {/* Quick Date Shortcuts */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Chọn nhanh ngày đá
            </label>
            <div className="flex flex-wrap gap-1.5">
              {quickDates.map((qd) => (
                <button
                  key={qd.label}
                  type="button"
                  onClick={() => {
                    sounds.playClick(600);
                    setDate(qd.val);
                  }}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all ${
                    date === qd.val
                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  {qd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Format */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Quy mô sân
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as MatchFormat)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="5v5">Sân 5 (5v5)</option>
                <option value="7v7">Sân 7 (7v7)</option>
                <option value="11v11">Sân 11 (11v11)</option>
              </select>
            </div>

            {/* Level */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Trình độ đội
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as SkillLevel)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Vui là chính">Vui là chính</option>
                <option value="Trung bình">Trung bình</option>
                <option value="Khá">Khá</option>
                <option value="Mạnh">Mạnh / Có giải</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Ngày thi đấu
              </label>
              <input
                type="date"
                min={getDayOffset(0)}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Giờ lăn bóng
              </label>
              <div className="flex gap-1.5">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* District */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Khu vực TP.HCM
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Court Status */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Tình trạng sân
              </label>
              <select
                value={court}
                onChange={(e) => setCourt(e.target.value as CourtStatus)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="Đã có sân">Đã có sân (Đã đặt trước)</option>
                <option value="Chưa có sân">Chưa có sân (Thỏa thuận tìm sân)</option>
              </select>
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Tên sân bóng / Địa chỉ
            </label>
            <input
              type="text"
              placeholder="VD: Sân Chảo Lửa - 30 Phan Thúc Duyện, Tân Bình"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Cost sharing */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Hình thức chi phí sân
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Chia đôi', 'Chia đều', 'Thỏa thuận', 'Đội mình bao'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    sounds.playClick(600);
                    setCost(c);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    cost === c
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/70'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Vacancies (if recruiting solo players) */}
          {postType === 'Cầu thủ lẻ' && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Vị trí còn thiếu
              </label>
              <div className="flex flex-wrap gap-2">
                {['Tiền đạo (ST)', 'Tiền vệ (MID)', 'Hậu vệ (DEF)', 'Thủ môn (GK)'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleVacancy(role)}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      vacancies.includes(role)
                        ? 'bg-orange-500 text-slate-950'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {vacancies.includes(role) && <Check className="w-3.5 h-3.5" />}
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Ghi chú tuyển kèo (yêu cầu, tính chất trận)
            </label>
            <textarea
              rows={3}
              required
              maxLength={280}
              placeholder="Ghi rõ lối chơi của đội, nước ngọt chia hay bao, yêu cầu mang áo màu gì..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 active:scale-98 transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> ĐĂNG KÈO LÊN BẢNG TIN
          </button>
        </form>

        {/* Live Card Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#101a2c]/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                XEM TRƯỚC TIN KÈO THỰC TẾ
              </span>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/70 px-2 py-0.5 rounded-full border border-cyan-800/50">
                LIVE PREVIEW
              </span>
            </div>

            {/* Card preview representation */}
            <div className="rounded-2xl border border-cyan-500/50 bg-gradient-to-br from-[#121c2e] to-[#0c1422] p-4 relative overflow-hidden shadow-md">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 to-cyan-500" />
              
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-teal-950/80 text-teal-300 border border-teal-700/50 flex items-center justify-center font-black italic text-sm">
                    {getTeamInitials(userTeamName)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black text-sm text-white truncate">{userTeamName}</h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                      <span className="text-teal-400 font-semibold">{postType === 'Đối thủ' ? 'Tìm đối' : 'Tuyển quân'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{format}</span>
                      <span aria-hidden="true">·</span>
                      <span>Trình {level}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/70 text-emerald-300 border border-emerald-800/60">
                  ĐANG MỞ
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 my-2 py-2 px-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-300 truncate">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{date} lúc {time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300 truncate">
                  <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  <span className="truncate">{district}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 my-2 leading-relaxed">
                {note}
              </p>

              <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span>Sân: <strong className="text-teal-300">{court}</strong></span>
                  <span>Phí: <strong className="text-white">{cost}</strong></span>
                </div>
                <p className="text-[10px] text-slate-500 truncate">
                  Địa điểm: {venue || 'Thỏa thuận'}
                </p>
              </div>
            </div>
          </div>

          {/* Previously Posted Kèo List */}
          <div className="rounded-2xl border border-slate-800 bg-[#101a2c]/60 p-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
              <span>KÈO ĐÃ ĐĂNG CỦA TÔI ({myPosts.length})</span>
            </h3>

            {myPosts.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                Bạn chưa đăng tin kèo nào trong phiên này.
              </p>
            ) : (
              <div className="space-y-2">
                {myPosts.map((mp) => (
                  <div
                    key={mp.id}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-white truncate">
                        {mp.format} · {mp.district} ({mp.date})
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {mp.court} · {mp.status === 'open' ? 'Đang mở nhận yêu cầu' : 'Đã đóng'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => {
                          sounds.playClick();
                          onTogglePostStatus(mp.id);
                        }}
                        className="py-1 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 font-semibold"
                      >
                        {mp.status === 'open' ? 'Đóng' : 'Mở lại'}
                      </button>
                      <button
                        onClick={() => {
                          sounds.playClick(400);
                          onDeletePost(mp.id);
                        }}
                        className="p-1 rounded-lg hover:bg-red-950/60 text-slate-500 hover:text-red-400 transition-colors"
                        title="Xóa tin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
