import React, { useState, useEffect } from 'react';
import { 
  Zap, RotateCcw, ShieldCheck, Lock, Truck, 
  Building2, Vault, CheckCircle2, Terminal, AlertTriangle 
} from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

interface LogEntry {
  id: number;
  time: string;
  message: string;
  type: 'snipe' | 'info';
}

const ESCROW_OPTIONS = [
  {
    id: 'armored',
    title: 'Armored White-Glove Transit',
    eta: '1–2 business days',
    price: '₹4,500',
    description:
      'GPS-tracked armored vault courier with certified escrow handover and full transit insurance.',
    icon: Truck,
  },
  {
    id: 'vault-courier',
    title: 'Insured Priority Vault',
    eta: '3–5 business days',
    price: '₹1,800',
    description:
      'High-security sealed dispatch with biometric signature verification at recipient door.',
    icon: Lock,
  },
  {
    id: 'hub-pickup',
    title: 'Physical Vault Inspection Pick-up',
    eta: 'Immediate / By Appointment',
    price: 'Free',
    description:
      'Direct handover at BidSphere Verification Hubs (Mumbai, Delhi, Bangalore).',
    icon: Building2,
  },
];

export function SimulatorBentoGrid() {
  // Simulator State
  const [secondsLeft, setSecondsLeft] = useState(14);
  const [simulatedBid, setSimulatedBid] = useState(418000);
  const [snipeCount, setSnipeCount] = useState(0);
  const [extendedFlash, setExtendedFlash] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 1,
      time: '14:22:01.04',
      message: 'STOMP channel /topic/lot/101 subscribed (11ms)',
      type: 'info',
    },
    {
      id: 2,
      time: '14:22:09.18',
      message: 'Closing window active (<30s). SnipeGuard™ armed.',
      type: 'info',
    },
  ]);

  // Escrow State
  const [selectedEscrow, setSelectedEscrow] = useState('armored');

  // Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 14));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trigger Anti-Snipe Extension
  const handleSimulateSnipe = () => {
    const newClock = Math.min(secondsLeft + 30, 59);
    const nextBid = simulatedBid + 15000;
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(
      Math.floor(now.getMilliseconds() / 10)
    ).padStart(2, '0')}`;

    setSecondsLeft(newClock);
    setSimulatedBid(nextBid);
    setSnipeCount((prev) => prev + 1);
    setExtendedFlash(true);

    setLogs((prev) => [
      {
        id: Date.now(),
        time: timestamp,
        message: `Bot snipe detected at 00:${String(secondsLeft).padStart(
          2,
          '0'
        )}s → Clock extended +30s (Bid ₹${nextBid.toLocaleString('en-IN')})`,
        type: 'snipe',
      },
      ...prev.slice(0, 2),
    ]);

    setTimeout(() => setExtendedFlash(false), 900);
  };

  const handleResetSimulator = () => {
    setSecondsLeft(14);
    setSimulatedBid(418000);
    setSnipeCount(0);
    setLogs([
      {
        id: Date.now(),
        time: 'RESET',
        message: 'Simulator clock reset to 00:14s threshold window.',
        type: 'info',
      },
    ]);
  };

  const isCriticalWindow = secondsLeft < 30;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
      
      {/* LEFT CARD: Anti-Sniping Protection Engine */}
      <div className="card-surface p-7 sm:p-8 flex flex-col justify-between h-full">
        <div className="space-y-6">
          
          {/* Card Header Metadata */}
          <div className="flex items-center justify-between gap-4">
            <StatusBadge variant="gold" pulse>
              Live Simulator
            </StatusBadge>
            <span className="mono-metric text-xs text-slate-400">
              Protocol: <span className="text-slate-200">SNIPE_PROTECT_V2</span>
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Anti-Sniping Protection Engine
            </h3>
            <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
              In traditional auctions, automated bot scripts place bids at 0.1 seconds remaining, stealing items before humans can react. BidSphere monitors the closing window and automatically extends the clock by <span className="text-gold-300 font-medium">+30 seconds</span> whenever a last-second bid is detected.
            </p>
          </div>

          {/* Interactive Countdown Box */}
          <div
            className={`subcard-surface p-5 transition-all duration-300 ${
              extendedFlash
                ? 'border-gold-400/60 bg-gold-400/[0.07]'
                : 'border-white/[0.07]'
            }`}
          >
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-slate-400 font-medium">
                Auction Clock Remaining:
              </span>
              <span className="mono-metric text-gold-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-gold-400" />
                Threshold: &lt; 30s
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Digital Clock */}
              <div className="flex items-baseline gap-2.5">
                <span
                  className={`mono-metric text-4xl sm:text-5xl font-bold tracking-tight transition-colors ${
                    extendedFlash
                      ? 'text-gold-300'
                      : isCriticalWindow
                      ? 'text-telemetry-danger'
                      : 'text-telemetry-live'
                  }`}
                >
                  00:{String(secondsLeft).padStart(2, '0')}
                </span>
                <span className="mono-metric text-xs text-slate-400">
                  remaining
                </span>
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleSimulateSnipe}
                  className="btn-gold px-4 py-2.5 text-xs cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Simulate Snipe Bid</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetSimulator}
                  title="Reset Clock"
                  className="p-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 border border-white/[0.08] text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="mt-4 w-full h-1.5 bg-obsidian-950 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  extendedFlash
                    ? 'bg-gold-400'
                    : isCriticalWindow
                    ? 'bg-telemetry-danger'
                    : 'bg-telemetry-live'
                }`}
                style={{ width: `${Math.min((secondsLeft / 60) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Live Concurrency Event Log (Fills vertical space & balances card height) */}
          <div className="subcard-surface p-4 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] mono-metric text-slate-400 border-b border-white/[0.05] pb-2">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-gold-400" />
                OPTIMISTIC_LOCK_TELEMETRY
              </span>
              <span>Extensions Triggered: {snipeCount}</span>
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              {logs.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-2 leading-relaxed"
                >
                  <span className="text-slate-500 shrink-0">[{entry.time}]</span>
                  <span
                    className={
                      entry.type === 'snipe'
                        ? 'text-gold-300 font-medium'
                        : 'text-slate-400'
                    }
                  >
                    {entry.message}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Left Card Footer (Aligned with Right Card Footer) */}
        <div className="pt-5 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
          <span>Concurrency Control: Optimistic Locking (v2)</span>
          <span className="inline-flex items-center gap-1.5 text-telemetry-live font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Zero Bot Snipes Permitted
          </span>
        </div>
      </div>

      {/* RIGHT CARD: Instant Escrow & Logistics */}
      <div className="card-surface p-7 sm:p-8 flex flex-col justify-between h-full">
        <div className="space-y-6">
          
          {/* Card Header Metadata */}
          <div className="flex items-center justify-between gap-4">
            <StatusBadge variant="live">Settlement Flow</StatusBadge>
            <span className="mono-metric text-xs text-slate-400">
              Stage: <span className="text-slate-200">Post-Auction</span>
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Instant Escrow & Logistics
            </h3>
            <p className="mt-2.5 text-sm text-slate-400 leading-relaxed">
              Winning lots transition seamlessly into verified escrow. Buyers select insured transit or physical hub collection with zero counterparty risk.
            </p>
          </div>

          {/* Interactive Logistics Radio Cards (Gold active state instead of purple) */}
          <div className="space-y-3">
            {ESCROW_OPTIONS.map((option) => {
              const isSelected = selectedEscrow === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedEscrow(option.id)}
                  className={`w-full text-left p-4 transition-all duration-200 flex items-start gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'subcard-active'
                      : 'subcard-surface hover:border-white/[0.14]'
                  }`}
                >
                  {/* Custom Radio Indicator */}
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-gold-400 bg-gold-400/20'
                        : 'border-slate-600 bg-transparent'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-gold-400" />
                    )}
                  </div>

                  {/* Option Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <span className="text-sm font-semibold text-white">
                          {option.title}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({option.eta})
                        </span>
                      </div>
                      <span
                        className={`mono-metric text-xs font-semibold shrink-0 ${
                          isSelected ? 'text-gold-300' : 'text-slate-300'
                        }`}
                      >
                        {option.price}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Card Footer (Aligned with Left Card Footer) */}
        <div className="pt-5 mt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
          <span>Insured by New India Assurance Co.</span>
          <span className="inline-flex items-center gap-1.5 text-telemetry-live font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Escrow Protected
          </span>
        </div>
      </div>

    </div>
  );
}

export default SimulatorBentoGrid;
