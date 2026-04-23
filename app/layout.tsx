import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zylo - Diga o que você nunca teve coragem',
  description: 'Envie mensagens anônimas com segurança para WhatsApp, Instagram, Facebook, TikTok e Email',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes',
  themeColor: '#121214',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}