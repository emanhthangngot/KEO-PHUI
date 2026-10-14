import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'KÈO//FIVE V2 - Cáp Kèo Bóng Đá Phủi TP.HCM & Game Matchmaking',
  description: 'Nền tảng cáp kèo bóng đá phủi và matchmaking game lobby TP.HCM: đăng tuyển kèo, đội trưởng Ready, phòng VS Esports, sơ đồ chiến thuật và quản lý đội.',
  openGraph: {
    title: 'KÈO//FIVE V2 - Sân Phủi TP.HCM Matchmaking',
    description: 'Cáp kèo bóng đá phủi TP.HCM với giao diện Game Lobby, Đội trưởng Ready và Phòng VS Esports.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KÈO//FIVE V2 - Sân Phủi TP.HCM Matchmaking',
    description: 'Cáp kèo bóng đá phủi TP.HCM với giao diện Game Lobby, Đội trưởng Ready và Phòng VS Esports.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased selection:bg-teal-500 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
