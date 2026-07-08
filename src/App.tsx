/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SUBSTANCES, REACTIONS, getReaction } from './data/substances';
import { ACHIEVEMENTS, Achievement } from './data/achievements';
import { Substance, Reaction } from './types';
import GuideModal from './components/GuideModal';
import { 
  Atom, 
  Flame, 
  Droplet, 
  Zap, 
  Sparkles, 
  RotateCcw, 
  BookOpen, 
  HelpCircle, 
  Play, 
  Pause, 
  Search, 
  Maximize, 
  Check, 
  Globe, 
  Send, 
  Info,
  Layers,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

const ROWS = 36;
const CELL_SIZE = 12; // pixels

interface GridCell {
  type: string; // substance ID or 'empty'
  age: number;
}

// Beautiful inline SVG/CSS illustrations for achievements
function AchievementIllustration({ type, unlocked }: { type: string; unlocked: boolean }) {
  if (!unlocked) {
    return (
      <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 font-mono text-xs select-none gap-1 shrink-0">
        <span className="text-xl">🔒</span>
        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">LOCKED</span>
      </div>
    );
  }

  // Define interactive SVG nodes for active achievements
  switch (type) {
    case 'universe':
      return (
        <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-indigo-950 via-slate-900 to-purple-950 border border-purple-500/40 flex items-center justify-center relative overflow-hidden shadow-md shrink-0">
          <div className="absolute w-14 h-14 rounded-full border border-purple-500/20 animate-spin-slow"></div>
          <div className="absolute w-10 h-10 rounded-full border border-indigo-400/30 animate-spin-reverse"></div>
          <div className="absolute w-6 h-6 rounded-full bg-indigo-500/25 blur-md"></div>
          <div className="w-3 h-3 rounded-full bg-purple-300 animate-pulse relative z-10"></div>
          <span className="absolute text-xl">🌌</span>
        </div>
      );
    case 'star':
      return (
        <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-amber-950 via-slate-900 to-orange-950 border border-amber-500/40 flex items-center justify-center relative overflow-hidden shadow-md shrink-0">
          <div className="absolute w-12 h-12 rounded-full bg-amber-500/10 blur-md animate-pulse"></div>
          <div className="absolute w-8 h-8 rounded-full bg-amber-400/30 blur-sm"></div>
          <div className="w-6 h-6 rounded-full bg-amber-400 border border-white/50 flex items-center justify-center shadow-inner relative z-10">
            <span className="text-xs text-amber-950 font-bold">🔥</span>
          </div>
          <span className="absolute text-xs text-yellow-200 font-bold font-mono top-1 animate-bounce">⭐</span>
        </div>
      );
    case 'planet':
      return (
        <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-sky-950 via-slate-900 to-emerald-950 border border-sky-500/30 flex items-center justify-center relative overflow-hidden shadow-md shrink-0">
          <div className="absolute w-14 h-14 rounded-full border border-sky-500/15 flex items-center justify-center">
            <div className="w-16 h-0.5 bg-sky-300/30 rotate-12"></div>
          </div>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 border border-cyan-200 relative z-10 shadow-md"></div>
          <span className="absolute text-xs bottom-2 z-20">🪐</span>
        </div>
      );
    case 'blackhole':
      return (
        <div className="w-20 h-20 rounded-xl bg-black border border-purple-900 flex items-center justify-center relative overflow-hidden shadow-md shrink-0">
          <div className="absolute inset-2 rounded-full border-2 border-dashed border-purple-500/30 animate-spin-slow"></div>
          <div className="absolute w-12 h-12 rounded-full bg-purple-500/15 blur-sm"></div>
          <div className="w-6 h-6 rounded-full bg-black border-2 border-purple-500 shadow-2xl relative z-10 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
          </div>
        </div>
      );
    case 'electrolysis':
      return (
        <div className="w-20 h-20 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center relative overflow-hidden shadow-inner shrink-0">
          <div className="absolute bottom-2 left-4 w-2 h-12 bg-slate-300 rounded shadow-sm"></div>
          <div className="absolute bottom-2 right-4 w-2 h-12 bg-slate-400 rounded shadow-sm"></div>
          {/* Bubbles ascending */}
          <div className="absolute bottom-6 left-4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-10 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-8 right-4 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-4 right-4 w-2 h-2 bg-blue-300 rounded-full animate-ping"></div>
          <span className="text-2xl relative z-10">💧</span>
        </div>
      );
    case 'primordial':
      return (
        <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-teal-950 via-slate-900 to-emerald-950 border border-emerald-500/30 flex items-center justify-center relative overflow-hidden shadow-md shrink-0">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-12 h-12 border-2 border-emerald-400 rounded-full animate-ping"></div>
          </div>
          <div className="text-3xl animate-pulse relative z-10">🌱</div>
        </div>
      );
    case 'chips':
      return (
        <div className="w-20 h-20 rounded-xl bg-slate-900 border border-emerald-500/40 flex flex-col items-center justify-center relative overflow-hidden p-2 shadow-md shrink-0">
          <div className="w-10 h-10 bg-slate-800 border-2 border-emerald-400 rounded flex items-center justify-center text-xs font-bold text-emerald-300 relative z-10 shadow-md">
            Si
          </div>
          {/* Circuit trace lines */}
          <div className="absolute w-full h-0.5 bg-emerald-500/25 top-4"></div>
          <div className="absolute w-full h-0.5 bg-emerald-500/25 bottom-4"></div>
          <div className="absolute w-0.5 h-full bg-emerald-500/25 left-4"></div>
          <div className="absolute w-0.5 h-full bg-emerald-500/25 right-4"></div>
        </div>
      );
    case 'lava':
      return (
        <div className="w-20 h-20 rounded-xl bg-gradient-to-b from-orange-600 via-red-950 to-slate-950 border border-orange-500/35 flex items-center justify-center relative overflow-hidden shadow-md shrink-0">
          <div className="absolute top-2 left-4 w-3 h-10 bg-amber-400/40 rounded-full blur-xs animate-pulse"></div>
          <div className="absolute top-6 right-3 w-4 h-12 bg-orange-500/60 rounded-full blur-xs"></div>
          <span className="text-2xl relative z-10">🌋</span>
        </div>
      );
    case 'metal':
      return (
        <div className="w-20 h-20 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center relative overflow-hidden shadow-inner shrink-0">
          <div className="absolute w-14 h-4 bg-slate-400 rotate-45 rounded"></div>
          <div className="absolute w-10 h-10 bg-slate-300 border border-slate-400 rounded-lg shadow-sm"></div>
          <span className="text-2xl relative z-10">🛠️</span>
        </div>
      );
    case 'ferment':
      return (
        <div className="w-20 h-20 rounded-xl bg-gradient-to-t from-yellow-500/20 via-slate-900 to-amber-950/20 border border-yellow-300/30 flex items-center justify-center relative overflow-hidden shadow-md shrink-0">
          <div className="absolute bottom-3 w-10 h-5 bg-yellow-400/30 rounded-full blur-sm animate-pulse"></div>
          <div className="absolute top-4 left-4 w-2 h-2 bg-yellow-300 rounded-full animate-bounce"></div>
          <div className="absolute top-8 right-4 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping"></div>
          <span className="text-2xl relative z-10">🍺</span>
        </div>
      );
    case 'plastic':
      return (
        <div className="w-20 h-20 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center relative overflow-hidden shadow-inner shrink-0">
          <div className="absolute w-12 h-12 border border-dashed border-indigo-300 rounded-full rotate-45 flex items-center justify-center">
            <div className="w-10 h-10 border border-indigo-400/40 rounded-lg"></div>
          </div>
          <span className="text-2xl relative z-10">📦</span>
        </div>
      );
    case 'ai':
      return (
        <div className="w-20 h-20 rounded-xl bg-slate-950 border border-purple-500/40 flex items-center justify-center relative overflow-hidden shadow-md shrink-0">
          <div className="absolute inset-1.5 border border-purple-500/20 rounded-lg animate-pulse"></div>
          <div className="w-8 h-8 rounded-full bg-purple-500/15 flex items-center justify-center">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
          </div>
          <span className="absolute text-2xl">🧠</span>
        </div>
      );
    case 'ufo':
      return (
        <div className="w-20 h-20 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-col items-center justify-center relative overflow-hidden shadow-md shrink-0">
          <div className="absolute bottom-0 w-12 h-14 bg-cyan-400/15 blur-sm clip-path-beam"></div>
          <span className="text-2xl relative z-10 animate-bounce">🛸</span>
        </div>
      );
    case 'dynamite':
      return (
        <div className="w-20 h-20 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center relative overflow-hidden shadow-inner shrink-0">
          <div className="absolute top-2 right-4 w-1.5 h-4 bg-slate-400 rounded"></div>
          <div className="absolute top-0 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          <span className="text-2xl relative z-10">🧨</span>
        </div>
      );
    case 'glass':
      return (
        <div className="w-20 h-20 rounded-xl bg-cyan-50/40 border border-cyan-200 flex items-center justify-center relative overflow-hidden shadow-inner shrink-0">
          <div className="absolute inset-4 border border-cyan-300 rounded-full animate-pulse"></div>
          <span className="text-2xl relative z-10">🔍</span>
        </div>
      );
    case 'source':
      return (
        <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center relative overflow-hidden shadow-inner shrink-0">
          <div className="absolute inset-2 border border-dashed border-slate-300 rounded-full animate-spin-slow"></div>
          <span className="text-2xl relative z-10">💠</span>
        </div>
      );
    default:
      return (
        <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shrink-0">
          💡
        </div>
      );
  }
}

export default function App() {
  // --- STATE ---
  const [colsCount, setColsCount] = useState(32);
  const [grid, setGrid] = useState<GridCell[][]>(() => createInitialGrid(32));

  // Ref to canvas parent container to dynamically size the colsCount
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        // Tailwind p-3 padding is 12px on each side = 24px total padding
        const width = entry.contentRect.width;
        const availableWidth = width - 24;
        if (availableWidth > 0) {
          const newCols = Math.max(32, Math.floor(availableWidth / CELL_SIZE));
          setColsCount(newCols);
        }
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Sync grid columns to colsCount dynamic change
  useEffect(() => {
    setGrid(prev => {
      const currentCols = prev[0]?.length || 0;
      if (currentCols === colsCount) return prev;
      return prev.map(row => {
        if (colsCount > currentCols) {
          const extra = Array.from({ length: colsCount - currentCols }, () => ({ type: 'empty', age: 0 }));
          return [...row, ...extra];
        } else {
          return row.slice(0, colsCount);
        }
      });
    });
  }, [colsCount]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<number>(100); // ms per tick
  const [typingInput, setTypingInput] = useState('');
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  const [selectedSubstanceId, setSelectedSubstanceId] = useState<string>('water');
  const [activeTab, setActiveTab] = useState<'inspector' | 'encyclopedia' | 'reactions' | 'achievements'>('inspector');
  const [showGuide, setShowGuide] = useState(true);
  
  // Drag and drop states
  const [draggedCell, setDraggedCell] = useState<{ x: number; y: number; type: string } | null>(null);
  const [dragCurrentCell, setDragCurrentCell] = useState<{ x: number; y: number } | null>(null);
  
  // Persistence state
  const [discoveredIds, setDiscoveredIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sss_discovered_substances');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    // Default to start unlocked ones
    return SUBSTANCES.filter(s => s.unlockedAtStart).map(s => s.id);
  });

  const [triedReactionIds, setTriedReactionIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sss_tried_reactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  // UI notifications
  const [notification, setNotification] = useState<{ text: string; subText: string; type: 'success' | 'info' } | null>(null);
  const [bigBangActive, setBigBangActive] = useState(false);
  const [screenFlashColor, setScreenFlashColor] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Achievements States
  const [hoveredAchievement, setHoveredAchievement] = useState<Achievement | null>(null);
  const [panOffset, setPanOffset] = useState({ x: -200, y: 10 }); // Center level 0 universe node slightly
  const [isDraggingPan, setIsDraggingPan] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Auto-complete index
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const konamiIndexRef = useRef<number>(0);

  interface VisualEffect {
    id: string;
    type: 'spark' | 'ring' | 'star' | 'shockwave' | 'nebula';
    x: number;
    y: number;
    color: string;
    vx: number;
    vy: number;
    alpha: number;
    size: number;
    maxLife: number;
    life: number;
  }

  const effectsRef = useRef<VisualEffect[]>([]);

  // --- EXTRA SPECIAL EFFECTS ON DISCOVERY ---
  const triggerDiscoveryEffects = (substanceId: string, cellX?: number, cellY?: number) => {
    const pxX = cellX !== undefined ? cellX * CELL_SIZE + CELL_SIZE / 2 : (colsCount * CELL_SIZE) / 2;
    const pxY = cellY !== undefined ? cellY * CELL_SIZE + CELL_SIZE / 2 : (ROWS * CELL_SIZE) / 2;

    const sub = SUBSTANCES.find(s => s.id === substanceId);
    const color = sub?.color || '#facc15';

    if (substanceId === 'universe') {
      // Epic cosmic purple/pink screen flash
      setScreenFlashColor('rgba(168, 85, 247, 0.45)');
      setTimeout(() => setScreenFlashColor(null), 1200);

      // 1. Major Big Bang Shockwaves
      for (let i = 0; i < 5; i++) {
        effectsRef.current.push({
          id: Math.random().toString(),
          type: 'shockwave',
          x: pxX,
          y: pxY,
          color: i % 2 === 0 ? '#a855f7' : '#e9d5ff',
          vx: 0,
          vy: 0,
          alpha: 1.0,
          size: 5,
          maxLife: 100 + i * 25,
          life: 100 + i * 25
        });
      }

      // 2. Cosmic Nebulas (glowing clouds)
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.9 + 0.3;
        effectsRef.current.push({
          id: Math.random().toString(),
          type: 'nebula',
          x: pxX,
          y: pxY,
          color: ['#c084fc', '#818cf8', '#67e8f9', '#f472b6', '#fb7185'][Math.floor(Math.random() * 5)],
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 0.85,
          size: Math.random() * 20 + 12,
          maxLife: 140,
          life: 140
        });
      }

      // 3. Spreading glowing stars (Twinkling)
      for (let i = 0; i < 100; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5.0 + 1.5;
        effectsRef.current.push({
          id: Math.random().toString(),
          type: 'star',
          x: pxX,
          y: pxY,
          color: `hsla(${Math.random() * 360}, 95%, 70%, 1)`,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          size: Math.random() * 3.5 + 1.5,
          maxLife: 120 + Math.random() * 60,
          life: 120 + Math.random() * 60
        });
      }
      return;
    }

    const isHighTier = sub?.era === 'cosmic' || sub?.era === 'biotech' || 
                       ['star', 'galaxy', 'supernova', 'black_hole', 'life', 'dna', 'cell', 'bacteria', 'plant', 'electricity', 'magma', 'metal', 'silicon', 'human', 'ai'].includes(substanceId);

    if (isHighTier) {
      // Core screen flash in substance color (with safe low opacity)
      setScreenFlashColor(color);
      setTimeout(() => setScreenFlashColor(null), 450);

      // High-tier substance core expanding rings
      effectsRef.current.push({
        id: Math.random().toString(),
        type: 'ring',
        x: pxX,
        y: pxY,
        color: color,
        vx: 0,
        vy: 0,
        alpha: 1.0,
        size: 3,
        maxLife: 40,
        life: 40
      });

      // Sparks
      for (let i = 0; i < 35; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.0 + 1.2;
        effectsRef.current.push({
          id: Math.random().toString(),
          type: 'spark',
          x: pxX,
          y: pxY,
          color: color,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1.0,
          size: Math.random() * 3 + 1,
          maxLife: 50 + Math.random() * 25,
          life: 50 + Math.random() * 25
        });
      }
    } else {
      // Normal small flash
      setScreenFlashColor(color);
      setTimeout(() => setScreenFlashColor(null), 200);

      // Normal substance discovery small sparkles
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.8 + 0.6;
        effectsRef.current.push({
          id: Math.random().toString(),
          type: 'spark',
          x: pxX,
          y: pxY,
          color: color,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 0.9,
          size: Math.random() * 1.8 + 0.6,
          maxLife: 30 + Math.random() * 20,
          life: 30 + Math.random() * 20
        });
      }
    }
  };

  const spawnSparks = (cellX: number, cellY: number, color: string, count: number = 8, speedScale: number = 1.0) => {
    const pxX = cellX * CELL_SIZE + CELL_SIZE / 2;
    const pxY = cellY * CELL_SIZE + CELL_SIZE / 2;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 1.5 + 0.5) * speedScale;
      effectsRef.current.push({
        id: Math.random().toString(),
        type: 'spark',
        x: pxX,
        y: pxY,
        color: color,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1.0,
        size: Math.random() * 2 + 1,
        maxLife: 20 + Math.random() * 15,
        life: 20 + Math.random() * 15
      });
    }
  };

  const discoverSubstance = (id: string, posX?: number, posY?: number) => {
    setDiscoveredIds(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      const s = SUBSTANCES.find(sub => sub.id === id);
      if (s) {
        showNotification(
          `🧪 新物質を発見: ${s.nameEn} (${s.nameJa})`,
          `おめでとうございます！ギミック連打によって新しい物質を発見しました！`,
          'success'
        );
        triggerDiscoveryEffects(id, posX, posY);
      }
      return next;
    });
  };

  const updateEffects = () => {
    effectsRef.current = effectsRef.current
      .map(eff => {
        const nextLife = eff.life - 1;
        const progress = 1 - nextLife / eff.maxLife;
        let nextSize = eff.size;
        let nextAlpha = eff.alpha;

        let nextX = eff.x + eff.vx;
        let nextY = eff.y + eff.vy;

        if (eff.type === 'shockwave') {
          nextSize = eff.size + 4.0;
          nextAlpha = Math.max(0, 1.0 - progress);
        } else if (eff.type === 'ring') {
          nextSize = eff.size + 1.5;
          nextAlpha = Math.max(0, 1.0 - progress);
        } else if (eff.type === 'nebula') {
          nextX += Math.sin(eff.life / 10) * 0.25;
          nextSize = eff.size + 0.12;
          nextAlpha = Math.max(0, 0.85 * (1.0 - progress));
        } else if (eff.type === 'spark' || eff.type === 'star') {
          eff.vx *= 0.95;
          eff.vy *= 0.95;
          nextAlpha = Math.max(0, 1.0 - progress);
        }

        return {
          ...eff,
          x: nextX,
          y: nextY,
          size: nextSize,
          alpha: nextAlpha,
          life: nextLife
        };
      })
      .filter(eff => eff.life > 0);
  };

  const drawEffects = (ctx: CanvasRenderingContext2D) => {
    effectsRef.current.forEach(eff => {
      ctx.save();
      ctx.globalAlpha = eff.alpha;

      if (eff.type === 'shockwave') {
        ctx.strokeStyle = eff.color;
        ctx.lineWidth = 4 * (1 - eff.life / eff.maxLife);
        ctx.beginPath();
        ctx.arc(eff.x, eff.y, eff.size, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = eff.color;
        ctx.globalAlpha = eff.alpha * 0.12;
        ctx.beginPath();
        ctx.arc(eff.x, eff.y, eff.size, 0, Math.PI * 2);
        ctx.fill();
      } 
      else if (eff.type === 'ring') {
        ctx.strokeStyle = eff.color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = eff.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(eff.x, eff.y, eff.size, 0, Math.PI * 2);
        ctx.stroke();
      } 
      else if (eff.type === 'nebula') {
        const grad = ctx.createRadialGradient(eff.x, eff.y, 0, eff.x, eff.y, eff.size);
        grad.addColorStop(0, eff.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(eff.x, eff.y, eff.size, 0, Math.PI * 2);
        ctx.fill();
      } 
      else if (eff.type === 'star') {
        ctx.fillStyle = eff.color;
        ctx.shadowColor = eff.color;
        ctx.shadowBlur = 6;
        
        const s = eff.size;
        ctx.beginPath();
        ctx.moveTo(eff.x, eff.y - s * 2.5);
        ctx.lineTo(eff.x + s * 0.8, eff.y - s * 0.8);
        ctx.lineTo(eff.x + s * 2.5, eff.y);
        ctx.lineTo(eff.x + s * 0.8, eff.y + s * 0.8);
        ctx.lineTo(eff.x, eff.y + s * 2.5);
        ctx.lineTo(eff.x - s * 0.8, eff.y + s * 0.8);
        ctx.lineTo(eff.x - s * 2.5, eff.y);
        ctx.lineTo(eff.x - s * 0.8, eff.y - s * 0.8);
        ctx.closePath();
        ctx.fill();
      } 
      else {
        ctx.fillStyle = eff.color;
        ctx.shadowColor = eff.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(eff.x, eff.y, eff.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });
  };

  // Top-down target cursor
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>({ x: 16, y: 18 });

  // --- LOCAL PERSISTENCE STORAGE ---
  useEffect(() => {
    localStorage.setItem('sss_discovered_substances', JSON.stringify(discoveredIds));
  }, [discoveredIds]);

  useEffect(() => {
    localStorage.setItem('sss_tried_reactions', JSON.stringify(triedReactionIds));
  }, [triedReactionIds]);

  // --- CHEAT UNLOCK (KONAMI CODE) ---
  const triggerCheatUnlock = () => {
    // Discover all substances except 'universe'
    const cheatSubstances = SUBSTANCES.map(s => s.id).filter(id => id !== 'universe');
    setDiscoveredIds(cheatSubstances);

    // Unlock all reactions except those that result in 'universe'
    const cheatReactions = REACTIONS.filter(r => !r.products.includes('universe')).map(r => r.id);
    setTriedReactionIds(cheatReactions);

    showNotification(
      "✨ コナミコマンド発動！ (Cheat Activated)", 
      "「宇宙 (Universe)」以外の全ての物質と合成レシピが解放されました！"
    );
  };

  useEffect(() => {
    let inputSequence: string[] = [];
    const targetSequence = [
      'arrowup', 'arrowup',
      'arrowdown', 'arrowdown',
      'arrowleft', 'arrowright',
      'arrowleft', 'arrowright',
      'b', 'a'
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      inputSequence.push(key);
      if (inputSequence.length > targetSequence.length) {
        inputSequence.shift();
      }

      if (inputSequence.join(',') === targetSequence.join(',')) {
        triggerCheatUnlock();
        inputSequence = []; // Reset sequence
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // --- UNLOCKED SUBSTANCES LOGIC ---
  // A substance is "unlocked" (can be typed and spawned) if:
  // - It is unlocked at start, OR
  // - It has been discovered (added to discoveredIds) AND all of its reactant reactions (uses) have been tried
  const unlockedIds = useMemo(() => {
    return SUBSTANCES.filter(sub => {
      if (sub.unlockedAtStart) return true;
      if (!discoveredIds.includes(sub.id)) return false;
      const relevantReactions = REACTIONS.filter(r => r.a === sub.id || r.b === sub.id);
      return relevantReactions.every(r => triedReactionIds.includes(r.id));
    }).map(s => s.id);
  }, [discoveredIds, triedReactionIds]);

  const getSubstanceNameJa = (sub: typeof SUBSTANCES[0] | undefined) => {
    if (!sub) return '???';
    return unlockedIds.includes(sub.id) ? sub.nameJa : '???';
  };

  const getSubstanceNameJaById = (id: string) => {
    const s = SUBSTANCES.find(sub => sub.id === id);
    return getSubstanceNameJa(s);
  };

  const getSubstanceNameEn = (sub: typeof SUBSTANCES[0] | undefined) => {
    if (!sub) return '???';
    return unlockedIds.includes(sub.id) ? sub.nameEn : '???';
  };

  const getSubstanceNameEnById = (id: string) => {
    const s = SUBSTANCES.find(sub => sub.id === id);
    return getSubstanceNameEn(s);
  };

  // Handle Big Bang Victory
  useEffect(() => {
    if (discoveredIds.includes('universe') && !bigBangActive) {
      setBigBangActive(true);
      showNotification("Congratsration!!!", "宇宙の創造に成功しました！", "success");
    }
  }, [discoveredIds]);

  // Helper to show custom fadeout notification
  const showNotification = (text: string, subText: string, type: 'success' | 'info' = 'info') => {
    setNotification({ text, subText, type });
    setTimeout(() => {
      setNotification(null);
    }, 5500);
  };

  // Trigger reaction discovery safely
  const triggerDiscovery = (reaction: Reaction, p1: string, p2: string, posX?: number, posY?: number) => {
    if (!triedReactionIds.includes(reaction.id)) {
      setTriedReactionIds(prev => {
        if (prev.includes(reaction.id)) return prev;
        return [...prev, reaction.id];
      });

      // Discover reactants and products
      setDiscoveredIds(prev => {
        const next = [...prev];
        [reaction.a, reaction.b, p1, p2].forEach(id => {
          if (id && id !== 'empty' && !next.includes(id)) {
            next.push(id);
            const s = SUBSTANCES.find(sub => sub.id === id);
            if (s) {
              showNotification(
                `🧪 新物質を発見: ${s.nameEn}`,
                `すべての用途を試すとタイピングアンロックされます！`,
                'success'
              );
              // Trigger cool synthesis sparkle/universe effect
              triggerDiscoveryEffects(id, posX, posY);
            }
          }
        });
        return next;
      });

      // Check if any reactants are now fully unlocked after this reaction
      [reaction.a, reaction.b].forEach(reactantId => {
        const rSub = SUBSTANCES.find(s => s.id === reactantId);
        if (rSub) {
          // Find all reactions where this is a reactant
          const relevant = REACTIONS.filter(r => r.a === reactantId || r.b === reactantId);
          // Check if all are now tried (including the newly added one)
          const alreadyTried = [...triedReactionIds, reaction.id];
          const allDone = relevant.every(r => alreadyTried.includes(r.id));
          if (allDone) {
            showNotification(
              `🎉 タイピング解放: ${rSub.nameEn}`,
              `スペルをタイプしていつでも落下させられるようになりました！`,
              'success'
            );
          }
        }
      });

      const rSubA = SUBSTANCES.find(s => s.id === reaction.a);
      const rSubB = SUBSTANCES.find(s => s.id === reaction.b);
      const pSub1 = SUBSTANCES.find(s => s.id === p1);
      const pSub2 = p2 && p2 !== 'empty' ? SUBSTANCES.find(s => s.id === p2) : null;
      showNotification(
        `🧪 合成成功: ${rSubA ? rSubA.nameEn : reaction.a} + ${rSubB ? rSubB.nameEn : reaction.b}`,
        `成果物: ${pSub1 ? pSub1.nameEn : 'None'}${pSub2 ? '、' + pSub2.nameEn : ''}`
      );
    }
  };

  // --- INITIAL GRID PRESET ---
  function createInitialGrid(cols: number = colsCount): GridCell[][] {
    const newGrid: GridCell[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: cols }, () => ({ type: 'empty', age: 0 }))
    );

    // Create a beautiful, top-down scientific geological petri dish relative to dynamic width
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < cols; x++) {
        // 1. Water lake in top-left (proportionate to width)
        const distToWater = Math.hypot(x - Math.floor(cols * 0.25), y - 10);
        if (distToWater < 5) {
          newGrid[y][x] = { type: 'water', age: 0 };
          continue;
        }
        if (distToWater < 7.5) {
          newGrid[y][x] = { type: 'soil', age: 0 };
          continue;
        }

        // 2. Geothermal fire pocket in bottom-right (proportionate to width)
        const distToFire = Math.hypot(x - Math.floor(cols * 0.75), y - 24);
        if (distToFire < 4) {
          newGrid[y][x] = { type: 'fire', age: 0 };
          continue;
        }
        if (distToFire < 6) {
          newGrid[y][x] = { type: 'lava', age: 0 };
          continue;
        }

        // 3. Stone ridge crossing from top-right to bottom-left (proportionate to width)
        if (Math.abs((x - Math.floor(cols * 0.5)) + (y - 18) * 0.5) < 2) {
          newGrid[y][x] = { type: 'stone', age: 0 };
          continue;
        }

        // 4. Random scattered soil patches (proportionate to width)
        if (Math.hypot(x - Math.floor(cols * 0.3), y - 24) < 5) {
          newGrid[y][x] = { type: 'soil', age: 0 };
          continue;
        }
      }
    }

    return newGrid;
  }

  const tick = () => {
    setGrid(prevGrid => {
      // Create copy of grid
      const nextGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));
      const currentCols = nextGrid[0]?.length || 32;

      // 2. PROCESS CELLULAR PHYSICS FOR TOP-DOWN VIEW (Gravity is disabled, elements are stable)
      // Fire and electricity conduct/burn symmetrically, cells, bacteria, and plants grow organically.
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < currentCols; x++) {
          const cell = nextGrid[y][x];
          if (cell.type === 'empty') continue;

          const sub = SUBSTANCES.find(s => s.id === cell.type);
          if (!sub) continue;

          // SPECIALS / ORGANIC / ENERGETIC BIOME RULES
          if (sub.id === 'cell') {
            // Cell spreads to adjacent water
            if (Math.random() < 0.02) {
              const adj = [
                { ny: y + 1, nx: x },
                { ny: y - 1, nx: x },
                { ny: y, nx: x + 1 },
                { ny: y, nx: x - 1 }
              ];
              for (const { ny, nx } of adj) {
                if (ny >= 0 && ny < ROWS && nx >= 0 && nx < currentCols) {
                  if (nextGrid[ny][nx].type === 'water') {
                    nextGrid[ny][nx] = { type: 'cell', age: 0 };
                    break;
                  }
                }
              }
            }
          }

          else if (sub.id === 'bacteria') {
            // Bacteria spreads onto plant or protein matter
            if (Math.random() < 0.04) {
              const adj = [
                { ny: y + 1, nx: x },
                { ny: y - 1, nx: x },
                { ny: y, nx: x + 1 },
                { ny: y, nx: x - 1 }
              ];
              for (const { ny, nx } of adj) {
                if (ny >= 0 && ny < ROWS && nx >= 0 && nx < currentCols) {
                  if (nextGrid[ny][nx].type === 'plant' || nextGrid[ny][nx].type === 'protein') {
                    nextGrid[ny][nx] = { type: 'bacteria', age: 0 };
                    break;
                  }
                }
              }
            }
          }

          else if (sub.id === 'plant') {
            // Plant grows onto adjacent wet soil
            if (Math.random() < 0.005) {
              const adj = [
                { ny: y + 1, nx: x },
                { ny: y - 1, nx: x },
                { ny: y, nx: x + 1 },
                { ny: y, nx: x - 1 }
              ];
              // Check if any neighboring cell is water to provide moisture
              let hasWater = false;
              for (const { ny, nx } of adj) {
                if (ny >= 0 && ny < ROWS && nx >= 0 && nx < currentCols && nextGrid[ny][nx].type === 'water') {
                  hasWater = true;
                  break;
                }
              }
              if (hasWater) {
                for (const { ny, nx } of adj) {
                  if (ny >= 0 && ny < ROWS && nx >= 0 && nx < currentCols && nextGrid[ny][nx].type === 'soil') {
                    nextGrid[ny][nx] = { type: 'plant', age: 0 };
                    break;
                  }
                }
              }
            }
          }

          else if (sub.id === 'fire') {
            // Fire burns out
            if (Math.random() < 0.25) {
              nextGrid[y][x] = { type: 'empty', age: 0 };
              continue;
            }
            // Fire spreads to 4 directions
            const dirs = [
              { dy: -1, dx: 0 },
              { dy: 1, dx: 0 },
              { dy: 0, dx: -1 },
              { dy: 0, dx: 1 }
            ];
            const chosenDir = dirs[Math.floor(Math.random() * dirs.length)];
            const ny = y + chosenDir.dy;
            const nx = x + chosenDir.dx;

            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < currentCols) {
              const target = nextGrid[ny][nx];
              if (target.type === 'empty') {
                nextGrid[ny][nx] = { type: 'fire', age: 0 };
                if (Math.random() < 0.6) {
                  nextGrid[y][x] = { type: 'empty', age: 0 };
                }
              } else {
                const isCombustible = ['plant', 'yeast', 'hydrocarbon', 'cell', 'bacteria', 'protein'].includes(target.type);
                if (isCombustible) {
                  nextGrid[ny][nx] = { type: 'fire', age: 0 };
                  if (Math.random() < 0.3) {
                    const co2X = x + (Math.random() < 0.5 ? -1 : 1);
                    if (co2X >= 0 && co2X < currentCols && nextGrid[y][co2X].type === 'empty') {
                      nextGrid[y][co2X] = { type: 'carbon_dioxide', age: 0 };
                    }
                  }
                }
              }
            }
          }

          else if (sub.id === 'electricity') {
            // Electricity decays quickly
            if (Math.random() < 0.4) {
              nextGrid[y][x] = { type: 'empty', age: 0 };
              continue;
            }
            // Conducts symmetrically through conductors
            const dirs = [
              { dy: -1, dx: 0 },
              { dy: 1, dx: 0 },
              { dy: 0, dx: -1 },
              { dy: 0, dx: 1 }
            ];
            let conducted = false;
            for (const d of dirs) {
              const ny = y + d.dy;
              const nx = x + d.dx;
              if (ny >= 0 && ny < ROWS && nx >= 0 && nx < currentCols) {
                const target = nextGrid[ny][nx];
                const conducts = ['water', 'metal', 'semiconductor', 'lava'].includes(target.type);
                if (target.type === 'empty' || conducts) {
                  nextGrid[ny][nx] = { type: 'electricity', age: 0 };
                  conducted = true;
                  break;
                }
              }
            }
            if (conducted) {
              nextGrid[y][x] = { type: 'empty', age: 0 };
            }
          }
        }
      }

      return nextGrid;
    });
  };

  // Run simulation interval
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(tick, simSpeed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, simSpeed, triedReactionIds]);

  // --- RENDERING CANVAS WITH SMOOTH ANIMATION LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      // 1. Update dynamic effects
      updateEffects();

      // 2. Clear with clean Immersive UI theme background
      ctx.fillStyle = '#09090b'; // deep space black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Draw grid lines subtly
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'; // subtle grid line
      ctx.lineWidth = 0.5;

      const currentCols = grid[0]?.length || colsCount;
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < currentCols; x++) {
          const cell = grid[y]?.[x] || { type: 'empty', age: 0 };
          const isDraggedSource = draggedCell && draggedCell.x === x && draggedCell.y === y;
          
          if (cell.type !== 'empty') {
            const sub = SUBSTANCES.find(s => s.id === cell.type);
            if (sub) {
              // Apply unique stylized effects for ultimate/glowing items
              if (sub.id === 'universe') {
                // Sparkly multi-color cycling
                const hue = (Date.now() / 15) % 360;
                ctx.fillStyle = isDraggedSource ? `hsla(${hue}, 85%, 65%, 0.3)` : `hsla(${hue}, 85%, 65%, 1)`;
              } else if (sub.id === 'star') {
                // Pulse yellow/orange
                const pulse = Math.sin(Date.now() / 100) * 0.15 + 0.85;
                ctx.fillStyle = isDraggedSource ? `rgba(249, 115, 22, ${pulse * 0.3})` : `rgba(249, 115, 22, ${pulse})`;
              } else if (sub.id === 'life') {
                // Golden glow
                const val = Math.floor(Math.sin(Date.now() / 120) * 30 + 220);
                ctx.fillStyle = isDraggedSource ? `rgba(${val}, ${val}, 40, 0.3)` : `rgb(${val}, ${val}, 40)`;
              } else {
                ctx.fillStyle = isDraggedSource ? `${sub.color}4d` : sub.color; // 4d is 30% alpha in hex
              }
              
              // Draw pixel cell with small spacing gap for that lovely retro look
              ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
            }
          }

          // Draw dotted border on the source slot being dragged
          if (isDraggedSource) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.strokeRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
            ctx.setLineDash([]);
          }

          // Selected target cursor crosshair (Top-down coordinates scanner with GLOWING YELLOW border)
          if (selectedCell && selectedCell.x === x && selectedCell.y === y) {
            ctx.strokeStyle = '#facc15'; // bright vibrant glowing yellow border
            ctx.lineWidth = 2.0;
            ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

            // Draw retro high-tech scanner crosshair axes
            ctx.strokeStyle = 'rgba(250, 204, 21, 0.25)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            // Horizontal scanner axis
            ctx.moveTo(0, y * CELL_SIZE + CELL_SIZE / 2);
            ctx.lineTo(canvas.width, y * CELL_SIZE + CELL_SIZE / 2);
            // Vertical scanner axis
            ctx.moveTo(x * CELL_SIZE + CELL_SIZE / 2, 0);
            ctx.lineTo(x * CELL_SIZE + CELL_SIZE / 2, canvas.height);
            ctx.stroke();
          } else if (hoveredCell && hoveredCell.x === x && hoveredCell.y === y) {
            // If we are dragging, let's show drop capability
            if (draggedCell) {
              const targetCell = grid[y]?.[x];
              const hasReaction = targetCell && targetCell.type !== 'empty' && getReaction(draggedCell.type, targetCell.type);
              
              if (hasReaction) {
                ctx.strokeStyle = '#10b981'; // vibrant emerald green for reaction
                ctx.lineWidth = 2;
                ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                
                // Draw small pulsing plus sign or glow for reactable targets
                ctx.fillStyle = '#10b981';
                ctx.font = 'bold 8px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('+', x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
              } else if (targetCell && targetCell.type !== 'empty') {
                ctx.strokeStyle = '#ef4444'; // vibrant red for blocked/no reaction
                ctx.lineWidth = 1.5;
                ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 8px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('×', x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2);
              } else {
                ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)'; // yellow for moving to empty space
                ctx.lineWidth = 1.5;
                ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
              }
            } else {
              ctx.strokeStyle = 'rgba(250, 204, 21, 0.5)';
              ctx.lineWidth = 1;
              ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
          }
        }
      }

      // Draw connection vector line and dragged floating pixel
      if (draggedCell && dragCurrentCell) {
        // 1. Connection Line
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(draggedCell.x * CELL_SIZE + CELL_SIZE / 2, draggedCell.y * CELL_SIZE + CELL_SIZE / 2);
        ctx.lineTo(dragCurrentCell.x * CELL_SIZE + CELL_SIZE / 2, dragCurrentCell.y * CELL_SIZE + CELL_SIZE / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // 2. Dragged substance preview floating above the current target cell
        const sub = SUBSTANCES.find(s => s.id === draggedCell.type);
        if (sub) {
          ctx.fillStyle = sub.color;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetY = 4;
          ctx.shadowOffsetX = 4;
          
          const size = CELL_SIZE * 1.4; // 1.4x larger to indicate it is lifted
          const offset = (size - CELL_SIZE) / 2;
          
          ctx.fillRect(
            dragCurrentCell.x * CELL_SIZE - offset,
            dragCurrentCell.y * CELL_SIZE - offset,
            size,
            size
          );
          
          // Draw elegant white border to emphasize the floating effect
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(
            dragCurrentCell.x * CELL_SIZE - offset,
            dragCurrentCell.y * CELL_SIZE - offset,
            size,
            size
          );
          
          // Reset shadow
          ctx.shadowBlur = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowOffsetX = 0;
        }
      }

      // 4. Draw our stunning discovery special effects on top!
      drawEffects(ctx);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [grid, hoveredCell, selectedCell, draggedCell, dragCurrentCell]);

  // --- CELL INTERACTION GIMMICKS ---
  const handleCellClickGimmick = (x: number, y: number, currentType: string): string => {
    const sub = SUBSTANCES.find(s => s.id === currentType);
    const color = sub?.color || '#ffffff';

    // Spawn tiny dust/chipping sparks on every click for real-time click feedback!
    spawnSparks(x, y, color, 6, 0.8);

    let resultingType = currentType;

    setGrid(prev => {
      const next = prev.map(row => row.map(c => ({ ...c })));
      const cell = next[y]?.[x];
      if (!cell || cell.type === 'empty') return prev;

      // Increment clickCount
      const currentCount = (cell.clickCount || 0) + 1;
      cell.clickCount = currentCount;

      // 1. Stone (石) -> Gravel (砂利) on 5th click
      if (currentType === 'stone' && currentCount >= 5) {
        cell.type = 'gravel';
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = 'gravel';
        setTimeout(() => {
          discoverSubstance('gravel', x, y);
        }, 0);
      }
      // 2. Gravel (砂利) -> Sand (砂) on 5th click
      else if (currentType === 'gravel' && currentCount >= 5) {
        cell.type = 'sand';
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = 'sand';
        setTimeout(() => {
          discoverSubstance('sand', x, y);
        }, 0);
      }
      // 3. Water (水) -> Splash particles and spread to empty adjacent cells on 3rd click
      else if (currentType === 'water' && currentCount >= 3) {
        cell.clickCount = 0;
        const neighbors = [
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 },
          { dx: 0, dy: 1 },
          { dx: 0, dy: -1 }
        ];
        let splashed = false;
        neighbors.forEach(({ dx, dy }) => {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
            if (next[ny][nx].type === 'empty' && Math.random() < 0.6) {
              next[ny][nx] = { type: 'water', age: 0 };
              splashed = true;
            }
          }
        });
        if (splashed) {
          setTimeout(() => {
            spawnSparks(x, y, '#60a5fa', 15, 1.5);
          }, 0);
        }
      }
      // 4. Fire (火) -> Flare/explosion and expand to empty/flammable neighbors on 3rd click
      else if (currentType === 'fire' && currentCount >= 3) {
        cell.clickCount = 0;
        const neighbors = [
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 },
          { dx: 0, dy: -1 },
          { dx: 0, dy: 1 }
        ];
        neighbors.forEach(({ dx, dy }) => {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
            if (next[ny][nx].type === 'empty' && Math.random() < 0.5) {
              next[ny][nx] = { type: 'fire', age: 0 };
            }
          }
        });
        setTimeout(() => {
          spawnSparks(x, y, '#f97316', 20, 2.0);
        }, 0);
      }
      // 5. Soil (土) -> Secrets unearthing (Sand/Clay/Fossil) on 5th click
      else if (currentType === 'soil' && currentCount >= 5) {
        const rand = Math.random();
        let newType = 'sand';
        if (rand < 0.1) {
          newType = 'fossil';
        } else if (rand < 0.3) {
          newType = 'clay';
        } else {
          newType = 'sand';
        }
        cell.type = newType;
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = newType;
        setTimeout(() => {
          discoverSubstance(newType, x, y);
        }, 0);
      }
      // 6. Glass (ガラス) -> Shatters into Sand (砂) on 4th click
      else if (currentType === 'glass' && currentCount >= 4) {
        cell.type = 'sand';
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = 'sand';
        setTimeout(() => {
          spawnSparks(x, y, '#22d3ee', 25, 2.2);
          discoverSubstance('sand', x, y);
        }, 0);
      }
      // 7. Lava (溶岩) -> Cools into Stone (石) or Obsidian (黒曜石) on 4th click
      else if (currentType === 'lava' && currentCount >= 4) {
        const newType = Math.random() < 0.25 ? 'obsidian' : 'stone';
        cell.type = newType;
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = newType;
        setTimeout(() => {
          spawnSparks(x, y, '#374151', 12, 1.0);
          discoverSubstance(newType, x, y);
        }, 0);
      }
      // 8. Plant (植物) -> Grow upwards on 3rd click
      else if (currentType === 'plant' && currentCount >= 3) {
        cell.clickCount = 0;
        if (y > 0 && next[y - 1][x].type === 'empty') {
          next[y - 1][x] = { type: 'plant', age: 0 };
          setTimeout(() => {
            spawnSparks(x, y - 1, '#10b981', 12, 1.2);
          }, 0);
        }
      }
      // 9. UFO -> Teleport to random spot on click
      else if (currentType === 'ufo') {
        cell.clickCount = 0;
        const emptyCells: { cx: number; cy: number }[] = [];
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < colsCount; c++) {
            if (next[r][c].type === 'empty') {
              emptyCells.push({ cx: c, cy: r });
            }
          }
        }
        if (emptyCells.length > 0) {
          const target = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          next[target.cy][target.cx] = { type: 'ufo', age: 0 };
          cell.type = 'empty';
          resultingType = 'empty';
          setTimeout(() => {
            spawnSparks(x, y, '#a855f7', 15, 1.8);
            spawnSparks(target.cx, target.cy, '#a855f7', 15, 1.8);
          }, 0);
        }
      }
      // 10. Bacteria/Cell -> Divide on 3rd click
      else if ((currentType === 'bacteria' || currentType === 'cell') && currentCount >= 3) {
        cell.clickCount = 0;
        const neighbors = [
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 },
          { dx: 0, dy: -1 },
          { dx: 0, dy: 1 }
        ];
        const emptyNeighbors = neighbors.filter(({ dx, dy }) => {
          const nx = x + dx;
          const ny = y + dy;
          return nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS && next[ny][nx].type === 'empty';
        });
        if (emptyNeighbors.length > 0) {
          const spot = emptyNeighbors[Math.floor(Math.random() * emptyNeighbors.length)];
          next[y + spot.dy][x + spot.dx] = { type: currentType, age: 0 };
          setTimeout(() => {
            spawnSparks(x + spot.dx, y + spot.dy, color, 10, 1.2);
          }, 0);
        }
      }
      // 11. Dynamite/Gunpowder -> Explode on 3rd click
      else if ((currentType === 'dynamite' || currentType === 'gunpowder') && currentCount >= 3) {
        cell.type = 'empty';
        resultingType = 'empty';
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
              if (Math.random() < 0.6) {
                next[ny][nx] = { type: 'fire', age: 0 };
              } else {
                next[ny][nx] = { type: 'empty', age: 0 };
              }
            }
          }
        }
        setTimeout(() => {
          spawnSparks(x, y, '#f97316', 30, 3.0);
          spawnSparks(x, y, '#ef4444', 30, 2.5);
          setScreenFlashColor('rgba(239, 68, 68, 0.25)');
          setTimeout(() => setScreenFlashColor(null), 300);
        }, 0);
      }
      // 12. Electricity (電気) -> High frequency shockwave on 3rd click!
      else if (currentType === 'electricity' && currentCount >= 3) {
        cell.clickCount = 0;
        setTimeout(() => {
          spawnSparks(x, y, '#facc15', 25, 2.0);
          effectsRef.current.push({
            id: Math.random().toString(),
            type: 'shockwave',
            x: x * CELL_SIZE + CELL_SIZE / 2,
            y: y * CELL_SIZE + CELL_SIZE / 2,
            color: '#facc15',
            vx: 0,
            vy: 0,
            alpha: 1.0,
            size: 3,
            maxLife: 25,
            life: 25
          });
        }, 0);
        // Charge nearby metallic items
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
              if (['metal', 'semiconductor', 'steel', 'bronze'].includes(next[ny][nx].type)) {
                setTimeout(() => {
                  spawnSparks(nx, ny, '#e2e8f0', 8, 1.2);
                }, 0);
              }
            }
          }
        }
      }
      // 13. Steam (水蒸気) -> Rain condensation on 3rd click!
      else if (currentType === 'steam' && currentCount >= 3) {
        cell.type = 'water';
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = 'water';
        setTimeout(() => {
          spawnSparks(x, y, '#3b82f6', 15, 1.2);
        }, 0);
      }
      // 14. Obsidian (黒曜石) -> Shatter into sharp glass on 6th click
      else if (currentType === 'obsidian' && currentCount >= 6) {
        cell.type = 'glass';
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = 'glass';
        setTimeout(() => {
          spawnSparks(x, y, '#a855f7', 20, 1.5);
          discoverSubstance('glass', x, y);
        }, 0);
      }
      // 15. Oxygen (酸素) / Hydrogen (水素) / Carbon Dioxide (二酸化炭素) -> Pop gas bubble!
      else if (['oxygen', 'hydrogen', 'carbon_dioxide'].includes(currentType) && currentCount >= 3) {
        cell.type = 'empty';
        resultingType = 'empty';
        const popColor = currentType === 'oxygen' ? '#38bdf8' : (currentType === 'hydrogen' ? '#22d3ee' : '#94a3b8');
        setTimeout(() => {
          spawnSparks(x, y, popColor, 18, 1.5);
          effectsRef.current.push({
            id: Math.random().toString(),
            type: 'ring',
            x: x * CELL_SIZE + CELL_SIZE / 2,
            y: y * CELL_SIZE + CELL_SIZE / 2,
            color: popColor,
            vx: 0,
            vy: 0,
            alpha: 0.8,
            size: 1,
            maxLife: 20,
            life: 20
          });
        }, 0);
      }
      // 16. Metal (金属) -> Magnetize or polish sparkle!
      else if (currentType === 'metal' && currentCount >= 5) {
        cell.clickCount = 0;
        // Search if any magnet is nearby (within 3 cells)
        let magnetNearby = false;
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
              if (next[ny][nx].type === 'magnet') {
                magnetNearby = true;
                break;
              }
            }
          }
        }
        if (magnetNearby) {
          cell.type = 'magnet';
          cell.age = 0;
          resultingType = 'magnet';
          setTimeout(() => {
            spawnSparks(x, y, '#f43f5e', 18, 1.5);
            discoverSubstance('magnet', x, y);
          }, 0);
        } else {
          setTimeout(() => {
            spawnSparks(x, y, '#fef08a', 15, 1.8);
          }, 0);
        }
      }
      // 17. Magnet (磁石) -> Drag nearby metallic items on click!
      else if (currentType === 'magnet') {
        cell.clickCount = 0;
        setTimeout(() => {
          effectsRef.current.push({
            id: Math.random().toString(),
            type: 'ring',
            x: x * CELL_SIZE + CELL_SIZE / 2,
            y: y * CELL_SIZE + CELL_SIZE / 2,
            color: '#f43f5e',
            vx: 0,
            vy: 0,
            alpha: 0.9,
            size: 2,
            maxLife: 30,
            life: 30
          });
        }, 0);
        // Shift metallic items closer
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
              const targetType = next[ny][nx].type;
              if (['metal', 'steel', 'iron', 'semiconductor', 'bronze', 'magnet'].includes(targetType)) {
                // Move 1 step towards x,y if that spot is empty
                const stepX = dx > 0 ? -1 : (dx < 0 ? 1 : 0);
                const stepY = dy > 0 ? -1 : (dy < 0 ? 1 : 0);
                const tx = nx + stepX;
                const ty = ny + stepY;
                if (tx >= 0 && tx < colsCount && ty >= 0 && ty < ROWS && next[ty][tx].type === 'empty') {
                  next[ty][tx] = { type: targetType, age: 0 };
                  next[ny][nx] = { type: 'empty', age: 0 };
                }
              }
            }
          }
        }
      }
      // 18. Yeast (酵母) -> Fermentation Swell on 3rd click
      else if (currentType === 'yeast' && currentCount >= 3) {
        cell.clickCount = 0;
        const neighbors = [
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 },
          { dx: 0, dy: -1 },
          { dx: 0, dy: 1 }
        ];
        neighbors.forEach(({ dx, dy }) => {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
            if (next[ny][nx].type === 'empty' && Math.random() < 0.45) {
              next[ny][nx] = { type: 'yeast', age: 0 };
            }
          }
        });
        setTimeout(() => {
          spawnSparks(x, y, '#fed7aa', 12, 1.1);
        }, 0);
      }
      // 19. Acid (酸) -> Corrosive splash on 3rd click
      else if (currentType === 'acid' && currentCount >= 3) {
        cell.clickCount = 0;
        setTimeout(() => {
          spawnSparks(x, y, '#a3e635', 20, 1.8);
        }, 0);
        const neighbors = [
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 },
          { dx: 0, dy: -1 },
          { dx: 0, dy: 1 }
        ];
        neighbors.forEach(({ dx, dy }) => {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
            const targetCell = next[ny][nx];
            if (targetCell.type !== 'empty' && targetCell.type !== 'acid' && targetCell.type !== 'glass') {
              if (Math.random() < 0.75) {
                next[ny][nx] = { type: 'empty', age: 0 };
                setTimeout(() => {
                  spawnSparks(nx, ny, '#a3e635', 8, 1.0);
                }, 0);
              }
            }
          }
        });
      }
      // 20. Fossil (化石) -> Prehistoric resurrection on 5th click
      else if (currentType === 'fossil' && currentCount >= 5) {
        const outcomes = ['life', 'stone', 'diamond', 'carbon'];
        const chosen = outcomes[Math.floor(Math.random() * outcomes.length)];
        cell.type = chosen;
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = chosen;
        setTimeout(() => {
          spawnSparks(x, y, '#a7f3d0', 25, 2.0);
          discoverSubstance(chosen, x, y);
        }, 0);
      }
      // 21. Gold (金) -> Golden Radiance on 3rd click
      else if (currentType === 'gold' && currentCount >= 3) {
        cell.clickCount = 0;
        setTimeout(() => {
          spawnSparks(x, y, '#eab308', 30, 2.2);
          effectsRef.current.push({
            id: Math.random().toString(),
            type: 'shockwave',
            x: x * CELL_SIZE + CELL_SIZE / 2,
            y: y * CELL_SIZE + CELL_SIZE / 2,
            color: '#fbbf24',
            vx: 0,
            vy: 0,
            alpha: 1.0,
            size: 4,
            maxLife: 35,
            life: 35
          });
        }, 0);
      }
      // 22. Diamond (ダイヤモンド) -> Prismatic burst on 5th click!
      else if (currentType === 'diamond' && currentCount >= 5) {
        cell.clickCount = 0;
        const rainbowColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
        setTimeout(() => {
          rainbowColors.forEach((rainbowCol, i) => {
            const angle = (i / rainbowColors.length) * Math.PI * 2;
            const speed = 2.5;
            effectsRef.current.push({
              id: Math.random().toString(),
              type: 'star',
              x: x * CELL_SIZE + CELL_SIZE / 2,
              y: y * CELL_SIZE + CELL_SIZE / 2,
              color: rainbowCol,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1.0,
              size: 3,
              maxLife: 30,
              life: 30
            });
          });
        }, 0);
      }
      // 23. Star (恒星) -> Supernova on 4th click!
      else if (currentType === 'star' && currentCount >= 4) {
        cell.type = 'black_hole';
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = 'black_hole';
        setTimeout(() => {
          discoverSubstance('black_hole', x, y);
          setScreenFlashColor('rgba(251, 146, 60, 0.3)');
          setTimeout(() => setScreenFlashColor(null), 500);
          effectsRef.current.push({
            id: Math.random().toString(),
            type: 'shockwave',
            x: x * CELL_SIZE + CELL_SIZE / 2,
            y: y * CELL_SIZE + CELL_SIZE / 2,
            color: '#fdba74',
            vx: 0,
            vy: 0,
            alpha: 1.0,
            size: 5,
            maxLife: 50,
            life: 50
          });
        }, 0);
        // Vaporize 3x3 surrounding cells
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
              next[ny][nx] = { type: 'empty', age: 0 };
            }
          }
        }
      }
      // 24. Black Hole (ブラックホール) -> Suction on click!
      else if (currentType === 'black_hole') {
        cell.clickCount = 0;
        setTimeout(() => {
          effectsRef.current.push({
            id: Math.random().toString(),
            type: 'nebula',
            x: x * CELL_SIZE + CELL_SIZE / 2,
            y: y * CELL_SIZE + CELL_SIZE / 2,
            color: '#6366f1',
            vx: 0,
            vy: 0,
            alpha: 1.0,
            size: 6,
            maxLife: 40,
            life: 40
          });
        }, 0);
        // Absorb everything in 3-cell radius
        for (let dy = -3; dy <= 3; dy++) {
          for (let dx = -3; dx <= 3; dx++) {
            if (dx === 0 && dy === 0) continue;
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
              if (next[ny][nx].type !== 'empty' && next[ny][nx].type !== 'black_hole') {
                next[ny][nx] = { type: 'empty', age: 0 };
                setTimeout(() => {
                  spawnSparks(nx, ny, '#818cf8', 5, 0.8);
                }, 0);
              }
            }
          }
        }
      }
      // 25. AI (人工知能) -> Super intelligence wave on 3rd click!
      else if (currentType === 'ai' && currentCount >= 3) {
        cell.clickCount = 0;
        setTimeout(() => {
          spawnSparks(x, y, '#60a5fa', 20, 1.5);
          effectsRef.current.push({
            id: Math.random().toString(),
            type: 'ring',
            x: x * CELL_SIZE + CELL_SIZE / 2,
            y: y * CELL_SIZE + CELL_SIZE / 2,
            color: '#3b82f6',
            vx: 0,
            vy: 0,
            alpha: 0.9,
            size: 3,
            maxLife: 25,
            life: 25
          });
        }, 0);
      }
      // 26. Laser (レーザー) -> Beam fire down on click!
      else if (currentType === 'laser') {
        cell.clickCount = 0;
        setTimeout(() => {
          spawnSparks(x, y, '#f43f5e', 15, 2.0);
        }, 0);
        // Burn path downwards
        for (let ny = y + 1; ny < ROWS; ny++) {
          const target = next[ny][x];
          if (target.type !== 'empty') {
            next[ny][x] = { type: 'fire', age: 0 };
            setTimeout(() => {
              spawnSparks(x, ny, '#f43f5e', 10, 1.5);
            }, 0);
            break;
          }
        }
      }
      // 27. Uranium (ウラン) -> Quantum decay on 5th click!
      else if (currentType === 'uranium' && currentCount >= 5) {
        cell.type = 'lead';
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = 'lead';
        setTimeout(() => {
          discoverSubstance('lead', x, y);
          setScreenFlashColor('rgba(34, 197, 94, 0.3)');
          setTimeout(() => setScreenFlashColor(null), 600);
          effectsRef.current.push({
            id: Math.random().toString(),
            type: 'shockwave',
            x: x * CELL_SIZE + CELL_SIZE / 2,
            y: y * CELL_SIZE + CELL_SIZE / 2,
            color: '#22c55e',
            vx: 0,
            vy: 0,
            alpha: 1.0,
            size: 6,
            maxLife: 45,
            life: 45
          });
        }, 0);
        // Transmute neighbors: water -> steam, soil -> lava
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
              if (next[ny][nx].type === 'water') {
                next[ny][nx] = { type: 'steam', age: 0 };
              } else if (next[ny][nx].type === 'soil') {
                next[ny][nx] = { type: 'lava', age: 0 };
              }
            }
          }
        }
      }
      // 28. Alcohol (アルコール) -> Volatilization flare on 3rd click
      else if (currentType === 'alcohol' && currentCount >= 3) {
        cell.type = 'fire';
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = 'fire';
        setTimeout(() => {
          spawnSparks(x, y, '#ef4444', 18, 1.6);
        }, 0);
      }
      // 29. Plastic (プラスチック) -> Recycle into hydrocarbon on 5th click
      else if (currentType === 'plastic' && currentCount >= 5) {
        cell.type = 'hydrocarbon';
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = 'hydrocarbon';
        setTimeout(() => {
          spawnSparks(x, y, '#1e293b', 12, 1.0);
          discoverSubstance('hydrocarbon', x, y);
        }, 0);
      }
      // 30. Rust (錆) -> Crumbles on 4th click
      else if (currentType === 'rust' && currentCount >= 4) {
        cell.type = 'soil';
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = 'soil';
        setTimeout(() => {
          spawnSparks(x, y, '#7c2d12', 12, 1.1);
        }, 0);
      }
      // 31. Virus (ウイルス) -> Infection spread on 3rd click
      else if (currentType === 'virus' && currentCount >= 3) {
        cell.clickCount = 0;
        const neighbors = [
          { dx: -1, dy: 0 },
          { dx: 1, dy: 0 },
          { dx: 0, dy: -1 },
          { dx: 0, dy: 1 }
        ];
        neighbors.forEach(({ dx, dy }) => {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
            const targetType = next[ny][nx].type;
            if (['plant', 'bacteria', 'cell', 'algae', 'yeast'].includes(targetType)) {
              next[ny][nx] = { type: 'virus', age: 0 };
              setTimeout(() => {
                spawnSparks(nx, ny, '#f43f5e', 8, 1.0);
              }, 0);
            }
          }
        });
      }
      // 32. Algae (藻類) -> Grow into plant on 3rd click
      else if (currentType === 'algae' && currentCount >= 3) {
        cell.type = 'plant';
        cell.clickCount = 0;
        cell.age = 0;
        resultingType = 'plant';
        setTimeout(() => {
          spawnSparks(x, y, '#4ade80', 12, 1.2);
          discoverSubstance('plant', x, y);
        }, 0);
      }
      // 33. Helium (ヘリウム) / Neon (ネオン) / Argon (アルゴン) -> Neon plasma light ring on 3rd click
      else if (['helium', 'neon', 'argon'].includes(currentType) && currentCount >= 3) {
        cell.clickCount = 0;
        const neonColor = currentType === 'helium' ? '#f472b6' : (currentType === 'neon' ? '#fb7185' : '#c084fc');
        setTimeout(() => {
          spawnSparks(x, y, neonColor, 15, 1.5);
          effectsRef.current.push({
            id: Math.random().toString(),
            type: 'ring',
            x: x * CELL_SIZE + CELL_SIZE / 2,
            y: y * CELL_SIZE + CELL_SIZE / 2,
            color: neonColor,
            vx: 0,
            vy: 0,
            alpha: 0.95,
            size: 2,
            maxLife: 20,
            life: 20
          });
        }, 0);
      }
      // 34. Life (生命) -> Cure nearby viruses and enrich soil on click!
      else if (currentType === 'life') {
        cell.clickCount = 0;
        setTimeout(() => {
          spawnSparks(x, y, '#10b981', 18, 1.3);
          effectsRef.current.push({
            id: Math.random().toString(),
            type: 'shockwave',
            x: x * CELL_SIZE + CELL_SIZE / 2,
            y: y * CELL_SIZE + CELL_SIZE / 2,
            color: '#34d399',
            vx: 0,
            vy: 0,
            alpha: 0.8,
            size: 3,
            maxLife: 25,
            life: 25
          });
        }, 0);
        // Transmute surrounding: virus -> bacteria, soil -> plant
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < colsCount && ny >= 0 && ny < ROWS) {
              if (next[ny][nx].type === 'virus') {
                next[ny][nx] = { type: 'bacteria', age: 0 };
              } else if (next[ny][nx].type === 'soil') {
                next[ny][nx] = { type: 'plant', age: 0 };
              }
            }
          }
        }
      }

      return next;
    });

    return resultingType;
  };

  // --- CANVAS COORD SELECTION ---
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor(((e.clientX - rect.left) * scaleX) / CELL_SIZE);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / CELL_SIZE);

    if (x >= 0 && x < colsCount && y >= 0 && y < ROWS) {
      setSelectedCell({ x, y });
      setHoveredCell({ x, y });

      // If the clicked cell contains a substance, inspect it and start dragging
      const cell = grid[y]?.[x];
      if (cell && cell.type !== 'empty') {
        const nextType = handleCellClickGimmick(x, y, cell.type);
        setSelectedSubstanceId(nextType);
        setActiveTab('inspector');
        setDraggedCell({ x, y, type: nextType });
        setDragCurrentCell({ x, y });
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const rawX = Math.floor(((e.clientX - rect.left) * scaleX) / CELL_SIZE);
    const rawY = Math.floor(((e.clientY - rect.top) * scaleY) / CELL_SIZE);

    // Clamping to grid boundaries ensures no distance limit on dragging even when the cursor is off-canvas
    const x = Math.max(0, Math.min(colsCount - 1, rawX));
    const y = Math.max(0, Math.min(ROWS - 1, rawY));

    setHoveredCell({ x, y });
    if (draggedCell) {
      setDragCurrentCell({ x, y });
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedCell || !dragCurrentCell) {
      setDraggedCell(null);
      setDragCurrentCell(null);
      return;
    }

    const fromX = draggedCell.x;
    const fromY = draggedCell.y;
    const toX = dragCurrentCell.x;
    const toY = dragCurrentCell.y;

    // Same cell, do nothing
    if (fromX === toX && fromY === toY) {
      setDraggedCell(null);
      setDragCurrentCell(null);
      return;
    }

    const movingType = draggedCell.type;
    const targetCell = grid[toY]?.[toX];

    if (targetCell) {
      if (targetCell.type === 'empty') {
        // Move pixel
        setGrid(prev => {
          const next = prev.map(row => row.map(c => ({ ...c })));
          next[toY][toX] = { type: movingType, age: 0 };
          next[fromY][fromX] = { type: 'empty', age: 0 };
          return next;
        });
        setSelectedCell({ x: toX, y: toY });
      } else {
        // Reaction checking (Drop to synthesize)
        const reaction = getReaction(movingType, targetCell.type);
        if (reaction) {
          const prod1 = reaction.products[0];
          const prod2 = reaction.products[1] || 'empty';

          setGrid(prev => {
            const next = prev.map(row => row.map(c => ({ ...c })));
            next[toY][toX] = { type: prod1, age: 0 };
            next[fromY][fromX] = { type: prod2, age: 0 };
            return next;
          });
          setSelectedCell({ x: toX, y: toY });
          triggerDiscovery(reaction, prod1, prod2, toX, toY);
        } else {
          // No reaction possible, and target is occupied. Do not replace or swap.
          setSelectedCell({ x: fromX, y: fromY });
        }
      }
    }

    setDraggedCell(null);
    setDragCurrentCell(null);
  };

  const handleCanvasLeave = () => {
    setHoveredCell(null);
    // Keep dragged states so dragging is not canceled when cursor leaves the canvas boundaries
  };

  // --- TYPING COMMAND CONTROLLER ---
  // Suggestions filter as user types the English name
  const filteredSuggestions = useMemo(() => {
    if (!typingInput) return [];
    const query = typingInput.toLowerCase();
    return SUBSTANCES.filter(sub => 
      sub.nameEn.toLowerCase().startsWith(query)
    );
  }, [typingInput]);

  useEffect(() => {
    setActiveSuggestionIndex(0);
  }, [typingInput]);

  // Global Keydown Event Listener for screen-wide typing
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Konami Code Cheat (Up Up Down Down Left Right Left Right B A)
      const konamiCode = [
        'arrowup', 'arrowup',
        'arrowdown', 'arrowdown',
        'arrowleft', 'arrowright',
        'arrowleft', 'arrowright',
        'b', 'a'
      ];
      const pressedKey = e.key.toLowerCase();
      if (pressedKey === konamiCode[konamiIndexRef.current]) {
        konamiIndexRef.current++;
        if (konamiIndexRef.current === konamiCode.length) {
          konamiIndexRef.current = 0;
          
          // Unlock all substances except 'universe'
          const substancesToUnlock = SUBSTANCES.filter(s => s.id !== 'universe').map(s => s.id);
          const reactionsToUnlock = REACTIONS.filter(r => {
            const isUniverseInput = r.a === 'universe' || r.b === 'universe';
            const isUniverseOutput = r.products.includes('universe');
            return !isUniverseInput && !isUniverseOutput;
          }).map(r => r.id);

          setDiscoveredIds(substancesToUnlock);
          setTriedReactionIds(reactionsToUnlock);
          showNotification("🔓 裏技発動！", "「宇宙」を除く、すべての物質とレシピが解禁されました！", "success");
        }
      } else {
        if (pressedKey === konamiCode[0]) {
          konamiIndexRef.current = 1;
        } else {
          konamiIndexRef.current = 0;
        }
      }

      // Ignore typing if focused on any standard inputs (e.g., AI oracle prompt box)
      const activeEl = document.activeElement;
      if (
        activeEl && 
        (activeEl.tagName === 'INPUT' || 
         activeEl.tagName === 'TEXTAREA' || 
         activeEl.getAttribute('contenteditable') === 'true')
      ) {
        if (activeEl.id !== 'terminal_input') {
          return;
        }
      }

      const trimmedQuery = typingInput.trim().toLowerCase();

      if (e.key === 'Enter') {
        e.preventDefault();
        
        // Support clear / empty / delete spelling
        if (trimmedQuery === 'empty' || trimmedQuery === 'clear' || trimmedQuery === 'delete') {
          if (!selectedCell) {
            showNotification("📍 選択されたセルがありません", "キャンバス上のセルをクリックして選択してください。");
            return;
          }
          const targetX = selectedCell.x;
          const targetY = selectedCell.y;
          setGrid(prev => {
            const next = prev.map(row => [...row]);
            const offsets = [
              { dx: 0, dy: 0 },
              { dx: -1, dy: 0 },
              { dx: 1, dy: 0 },
              { dx: 0, dy: -1 },
              { dx: 0, dy: 1 }
            ];
            offsets.forEach(({ dx, dy }) => {
              const cx = targetX + dx;
              const cy = targetY + dy;
              if (cx >= 0 && cx < colsCount && cy >= 0 && cy < ROWS) {
                next[cy][cx] = { type: 'empty', age: 0 };
              }
            });
            return next;
          });
          setTypingInput('');
          showNotification(`🧹 物質消去`, `座標 [${targetX}, ${targetY}] 付近の物質を消去しました。`);
          return;
        }

        if (filteredSuggestions.length > 0 && activeSuggestionIndex < filteredSuggestions.length) {
          // Trigger auto-complete on Enter
          const selected = filteredSuggestions[activeSuggestionIndex];
          triggerDrop(selected.id);
        } else {
          // Direct match
          const found = SUBSTANCES.find(s => s.nameEn.toLowerCase() === trimmedQuery);
          if (found) {
            triggerDrop(found.id);
          } else if (trimmedQuery) {
            showNotification(`⚠️ 未知の物質: "${typingInput}"`, "物質の英語名（スペル）を正しく入力してください。");
          }
        }
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setTypingInput(prev => prev.slice(0, -1));
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setTypingInput('');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveSuggestionIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key.length === 1 && /^[a-zA-Z_ ]$/.test(e.key)) {
        if (e.key === ' ') {
          e.preventDefault();
        }
        setTypingInput(prev => prev + e.key.toLowerCase());
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [typingInput, filteredSuggestions, activeSuggestionIndex, selectedCell]);

  const triggerDrop = (substanceId: string) => {
    const sub = SUBSTANCES.find(s => s.id === substanceId);
    if (!sub) return;

    if (!unlockedIds.includes(substanceId)) {
      showNotification(
        `🔒 未解禁の物質: ${sub.nameEn}`, 
        "この物質はまだ発見されていません！図鑑でレシピをヒントに合成してください。"
      );
      return;
    }

    if (!selectedCell) {
      showNotification(
        "📍 降下位置が指定されていません",
        "キャンバス上のセルをクリックして、物質を降らせる位置を指定してください。"
      );
      return;
    }

    // Spawn small 5-cell cross centered around selectedCell
    const targetX = selectedCell.x;
    const targetY = selectedCell.y;
    
    interface ReactedDetail {
      reaction: any; // Type Reaction from imported modules
      prod1: string;
      prod2: string;
    }
    const triggeredReactions: ReactedDetail[] = [];

    setGrid(prev => {
      const next = prev.map(row => [...row]);
      const offsets = [
        { dx: 0, dy: 0 },
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 }
      ];
      offsets.forEach(({ dx, dy }) => {
        const cx = targetX + dx;
        const cy = targetY + dy;
        if (cx >= 0 && cx < colsCount && cy >= 0 && cy < ROWS) {
          const currentCell = next[cy][cx];
          if (currentCell.type === 'empty') {
            next[cy][cx] = { type: substanceId, age: 0 };
          } else {
            const reaction = getReaction(substanceId, currentCell.type);
            if (reaction) {
              const prod1 = reaction.products[0];
              const prod2 = reaction.products[1] || 'empty';
              next[cy][cx] = { type: prod1, age: 0 };
              triggeredReactions.push({ reaction, prod1, prod2 });
            }
          }
        }
      });
      return next;
    });

    // Trigger any discovered reactions sequentially
    triggeredReactions.forEach(({ reaction, prod1, prod2 }) => {
      triggerDiscovery(reaction, prod1, prod2, targetX, targetY);
    });

    setTypingInput('');
  };

  // --- EXTRA UTILITIES ---
  const clearCanvas = () => {
    setGrid(Array.from({ length: ROWS }, () =>
      Array.from({ length: colsCount }, () => ({ type: 'empty', age: 0 }))
    ));
    showNotification("🧹 キャンバスをクリアしました", "空っぽの世界から、新たな物質創造を始めましょう。");
  };

  const loadPreset = () => {
    setGrid(createInitialGrid());
    showNotification("📐 初期テンプレートを読み込みました", "岩石の器に水がたまった、地球初期の環境です。");
  };

  const executeReset = () => {
    localStorage.removeItem('sss_discovered_substances');
    localStorage.removeItem('sss_tried_reactions');
    setDiscoveredIds(SUBSTANCES.filter(s => s.unlockedAtStart).map(s => s.id));
    setTriedReactionIds([]);
    setBigBangActive(false);
    setGrid(createInitialGrid());
    setShowResetConfirm(false);
    showNotification("💫 宇宙の輪廻", "すべての記憶がリセットされ、真空の初期世界へ巻き戻されました。");
  };

  const resetProgress = () => {
    executeReset();
  };

  // --- ENCYCLOPEDIA FILTER / SORT ---
  const categories = [
    { label: 'すべて', value: 'all' },
    { label: '初期物質', value: 'initial' },
    { label: '大気・気体', value: 'gas' },
    { label: '元素・化学', value: 'element' },
    { label: '有機・生命', value: 'life' },
    { label: '宇宙・神秘', value: 'cosmic' }
  ];
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSubstances = useMemo(() => {
    return SUBSTANCES.filter(sub => {
      // Discovery filter
      const isDiscovered = discoveredIds.includes(sub.id);
      if (!isDiscovered) return false;

      // Category filter
      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'initial') return sub.unlockedAtStart;
      if (selectedCategory === 'gas') return sub.state === 'gas';
      if (selectedCategory === 'element') return ['metal', 'silicon', 'semiconductor', 'magnet', 'clay', 'glass', 'lava', 'obsidian', 'helium', 'lithium', 'beryllium', 'boron', 'nitrogen', 'fluorine', 'neon', 'sodium', 'chlorine', 'magnesium', 'aluminum', 'phosphorus', 'sulfur', 'argon', 'potassium', 'calcium', 'titanium', 'chromium', 'iron', 'copper', 'zinc', 'silver', 'platinum', 'mercury', 'lead', 'uranium'].includes(sub.id);
      if (selectedCategory === 'life') return ['carbon', 'hydrocarbon', 'yeast', 'protein', 'amino_acid', 'cell', 'plant', 'bacteria', 'life'].includes(sub.id);
      if (selectedCategory === 'cosmic') return ['star', 'planet', 'black_hole', 'universe'].includes(sub.id);
      return true;
    });
  }, [selectedCategory, discoveredIds]);

  // INSPECTOR DATA SELECTOR
  // Target cell currently being focused by hover or select
  const currentInspectedSubstance = useMemo(() => {
    if (hoveredCell) {
      const cell = grid[hoveredCell.y]?.[hoveredCell.x];
      if (cell && cell.type !== 'empty') {
        return SUBSTANCES.find(s => s.id === cell.type) || null;
      }
    }
    // Excel-like active block fallback (the clicked cell)
    if (selectedCell) {
      const cell = grid[selectedCell.y]?.[selectedCell.x];
      if (cell && cell.type !== 'empty') {
        return SUBSTANCES.find(s => s.id === cell.type) || null;
      }
    }
    // Fallback to currently selected spawn substance
    return SUBSTANCES.find(s => s.id === selectedSubstanceId) || null;
  }, [hoveredCell, selectedCell, grid, selectedSubstanceId]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-yellow-200 selection:text-slate-900 relative overflow-x-hidden" id="app_root">
      
      {/* Decorative Outer Glow Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0 opacity-0">
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-yellow-500/5 rounded-full blur-[160px]"></div>
      </div>

      {/* HEADER SECTION */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between shrink-0 relative z-10 shadow-sm" id="game_header">
        <div className="flex items-center gap-3.5">
          <button 
            onClick={() => setShowGuide(true)}
            className="w-10 h-10 bg-yellow-100 hover:bg-yellow-200 active:scale-95 transition-all border border-yellow-400 flex items-center justify-center rounded cursor-pointer group shadow-sm"
            title="操作方法ガイドを開く"
            id="sigma_guide_btn"
          >
            <span className="text-yellow-700 font-bold text-xl group-hover:scale-110 transition-transform">Σ</span>
          </button>
          <div>
            <h1 className="text-xs uppercase tracking-widest text-slate-900 font-bold font-mono">
              Cosmos Synthesis Engine
            </h1>
            <p className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">
              Subject: GAIA-01 // Phase: Primitive Formation
            </p>
          </div>
        </div>

        {/* HUD STATUS INDICATORS */}
        <div className="hidden md:flex items-center gap-6 font-mono text-[11px] text-slate-600">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">discovered materia</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-slate-900 font-bold">{discoveredIds.length} <span className="text-slate-400">/</span> {SUBSTANCES.length}</span>
            </div>
          </div>
          <div className="h-7 w-px bg-slate-200"></div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">synthesis recipe verified</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-slate-900 font-bold">{triedReactionIds.length} <span className="text-slate-400">/</span> {REACTIONS.length}</span>
            </div>
          </div>
        </div>

        {/* EVOLUTION PROGRESS TRACKER */}
        <div className="flex flex-col items-end gap-1 font-mono">
          <div className="text-[10px] uppercase tracking-tighter text-slate-600">
            Evolution Progress: <span className="text-yellow-600 font-bold">{Math.round((discoveredIds.length / SUBSTANCES.length) * 100)}%</span>
          </div>
          <div className="w-48 sm:w-64 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-slate-800 transition-all duration-500 shadow-sm"
              style={{ width: `${(discoveredIds.length / SUBSTANCES.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      {/* MAIN GAMEBOARD WORKSPACE */}
      <main className="flex-1 w-full max-w-[100vw] px-4 lg:px-8 py-4 lg:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10" id="game_workspace">
        
        {/* LEFT COLUMN: SIMULATION CANVAS & INPUT CONTROLS (cols 1-8) */}
        <section className="lg:col-span-8 flex flex-col gap-4" id="simulation_section">
          

          {/* SIMULATOR SCREEN & CONTROL DASHBOARD */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm text-slate-900" id="sandbox_frame">
            
            {/* CANVAS WRAPPER */}
            <div ref={containerRef} className="w-full flex justify-center bg-[#09090b] p-3 rounded-lg border border-slate-300 relative group shadow-sm overflow-hidden" id="canvas_container">
              {/* Top-down sky helper indicator line */}
              <div className="absolute top-3 left-3 right-3 h-0.5 border-t border-dashed border-white/5 pointer-events-none"></div>

              {/* Dynamic screen flash overlay for discovery feedback */}
              {screenFlashColor && (
                <div 
                  className="absolute inset-0 z-20 pointer-events-none transition-all duration-300 animate-pulse"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${screenFlashColor} 0%, transparent 75%)`,
                    mixBlendMode: 'screen'
                  }}
                />
              )}

              {/* CONFINED NOTIFICATION TOAST OVER CANVAS */}
              {notification && (
                <div className="absolute top-4 left-4 right-4 z-30 transition-all duration-300 animate-fade-in" id="toast_notification">
                  <div className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/95 backdrop-blur-sm shadow-xl flex flex-col gap-0.5 text-slate-100">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 shrink-0 animate-pulse" />
                      <span>{notification.text}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 font-mono pl-3 leading-relaxed">{notification.subText}</p>
                  </div>
                </div>
              )}

              {/* FLOATING GLOBAL TYPING HUD - Only display when typingInput has at least 1 character */}
              {typingInput.length > 0 && (
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center gap-1.5 min-w-[280px]">
                  <div className="bg-white border border-slate-300 rounded-xl px-4 py-2.5 shadow-lg backdrop-blur-md flex flex-col items-center gap-1 text-center">
                    <div className="text-[10px] uppercase font-mono font-bold text-yellow-600 tracking-widest flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-yellow-500 animate-pulse shrink-0" />
                      <span>Cosmos Spell Engine</span>
                    </div>
                    
                    <div className="flex items-baseline gap-1 font-mono text-base font-bold text-slate-900">
                      <span className="text-slate-400 select-none mr-1">&gt;</span>
                      <span className="tracking-wide">
                        {typingInput}
                        <span className="animate-pulse text-yellow-500 inline-block w-1.5 h-4 ml-0.5 bg-yellow-500" />
                      </span>
                    </div>

                    {/* Suggestion list inline inside HUD */}
                    {filteredSuggestions.length > 0 && (
                      <div className="mt-2 w-full max-h-24 overflow-y-auto flex flex-col gap-1 border-t border-slate-100 pt-1.5 text-[11px] font-mono">
                        {filteredSuggestions.map((sub, idx) => {
                          const isUnlocked = unlockedIds.includes(sub.id);
                          const isSelected = idx === activeSuggestionIndex;
                          return (
                            <div 
                              key={sub.id}
                              className={`flex items-center justify-between px-2 py-0.5 rounded transition-colors ${
                                isSelected 
                                  ? 'bg-yellow-50 text-slate-950 border border-yellow-200 font-bold' 
                                  : 'text-slate-600'
                              }`}
                            >
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full border border-slate-300 shrink-0" style={{ backgroundColor: sub.color }} />
                                <span className="text-slate-800">{sub.nameEn}</span>
                                <span className="text-[9px] text-slate-500">({getSubstanceNameJa(sub)})</span>
                              </div>
                              <span className="text-[9px] font-semibold text-yellow-600">
                                {isUnlocked ? 'ENTER' : '🔒'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <canvas
                ref={canvasRef}
                width={colsCount * CELL_SIZE}
                height={ROWS * CELL_SIZE}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={handleCanvasLeave}
                onMouseUp={handleCanvasMouseUp}
                className="cursor-crosshair bg-slate-950 max-w-full rounded shadow-inner"
                id="sand_canvas"
              />

              {/* Grid HUD overlay */}
              <div className="absolute bottom-4 left-4 bg-slate-900/95 border border-slate-700 px-3 py-1.5 rounded text-[10px] font-mono text-slate-100 flex flex-col gap-1 pointer-events-none shadow-md max-w-[280px]">
                <div className="flex gap-2">
                  <span>GRID: {colsCount}x{ROWS}</span>
                  <span>•</span>
                  <span>SPEED: {simSpeed}ms</span>
                </div>
                {selectedCell ? (
                  <div className="flex gap-2 items-center">
                    <span className="text-yellow-400 font-bold">選択セル (Active): X:{selectedCell.x} Y:{selectedCell.y}</span>
                    <span className="text-slate-300">
                      ({grid[selectedCell.y]?.[selectedCell.x]?.type === 'empty' 
                        ? 'Empty' 
                        : getSubstanceNameEnById(grid[selectedCell.y]?.[selectedCell.x]?.type)})
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <span className="text-yellow-400/75 font-bold">選択セル (Active): なし</span>
                  </div>
                )}
                {hoveredCell && (!selectedCell || hoveredCell.x !== selectedCell.x || hoveredCell.y !== selectedCell.y) && (
                  <div className="text-slate-400 text-[9px]">
                    ホバー (Hover): X:{hoveredCell.x} Y:{hoveredCell.y} 
                    ({grid[hoveredCell.y]?.[hoveredCell.x]?.type === 'empty' 
                      ? 'Empty' 
                      : getSubstanceNameEnById(grid[hoveredCell.y]?.[hoveredCell.x]?.type)})
                  </div>
                )}
              </div>
            </div>

            {/* CONTROL PANEL BUTTONS */}
            <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs" id="canvas_controls">
              
              {/* Play Pause Simulation */}
              <div className="flex items-center gap-1.5 bg-slate-50 p-1 border border-slate-200 rounded-lg">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-3 py-1.5 rounded flex items-center gap-1 transition-all cursor-pointer ${
                    isPlaying 
                      ? 'bg-slate-900 text-white font-semibold border border-slate-950 shadow-sm' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                  }`}
                  title={isPlaying ? "Pause Physics" : "Resume Physics"}
                  id="play_pause_btn"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current text-white animate-pulse" />
                      <span>動作中 (SIMULATING)</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current text-slate-500" />
                      <span>一時停止 (PAUSED)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1 px-2 text-[10px] text-slate-500 border-l border-slate-200">
                  <span>速度:</span>
                  <select
                    value={simSpeed}
                    onChange={(e) => setSimSpeed(Number(e.target.value))}
                    className="bg-white border border-slate-300 rounded text-xs px-1.5 py-0.5 text-slate-800 outline-none"
                    id="speed_select"
                  >
                    <option value={150}>遅め (150ms)</option>
                    <option value={100}>標準 (100ms)</option>
                    <option value={50}>速め (50ms)</option>
                    <option value={20}>極速 (20ms)</option>
                  </select>
                </div>
              </div>

              {/* Grid Templates / Clears */}
              <div className="flex items-center gap-2">
                <button
                  onClick={loadPreset}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 rounded border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reload default landscape"
                  id="preset_btn"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>地形を復元 (Reset Map)</span>
                </button>
                
                <button
                  onClick={clearCanvas}
                  className="px-3 py-1.5 bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-700 rounded border border-slate-300 transition-colors cursor-pointer"
                  title="Clear all substances"
                  id="clear_btn"
                >
                  空間クリア (Clear)
                </button>

                {showResetConfirm ? (
                  <div className="flex items-center gap-1 bg-red-50 border border-red-200 p-1 rounded" id="reset_confirm_group">
                    <button
                      onClick={executeReset}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[11px] font-bold cursor-pointer transition-colors"
                      title="Confirm reset"
                      id="reset_confirm_yes"
                    >
                      リセット確定
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded text-[11px] border border-slate-300 cursor-pointer transition-colors"
                      id="reset_confirm_no"
                    >
                      やめる
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 rounded border border-red-200 transition-colors font-bold cursor-pointer"
                    title="Reset scientific unlocks"
                    id="reset_progress_btn"
                  >
                    輪廻転生 (Reset All Save)
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* RIGHT COLUMN: DETAILED SIDEBAR PANELS (cols 9-12) */}
        <section className="lg:col-span-4 flex flex-col gap-4 h-[calc(100vh-140px)] min-h-[500px]" id="sidebar_section">
          
          {/* TAB SELECTION NAVIGATION */}
          <div className="grid grid-cols-4 bg-slate-100 p-1 border border-slate-200 rounded-xl font-mono text-xs font-semibold shrink-0" id="sidebar_tabs">
            <button
              onClick={() => setActiveTab('inspector')}
              className={`py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'inspector' 
                  ? 'bg-white text-slate-900 border border-slate-300/85 shadow-sm font-bold' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
              }`}
              id="tab_inspector"
            >
              物質詳細
            </button>
            <button
              onClick={() => setActiveTab('encyclopedia')}
              className={`py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'encyclopedia' 
                  ? 'bg-white text-slate-900 border border-slate-300/85 shadow-sm font-bold' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
              }`}
              id="tab_encyclopedia"
            >
              発見図鑑
            </button>
            <button
              onClick={() => setActiveTab('reactions')}
              className={`py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'reactions' 
                  ? 'bg-white text-slate-900 border border-slate-300/85 shadow-sm font-bold' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
              }`}
              id="tab_reactions"
            >
              合成レシピ
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'achievements' 
                  ? 'bg-white text-slate-900 border border-slate-300/85 shadow-sm font-bold' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
              }`}
              id="tab_achievements"
            >
              実績
            </button>
          </div>

          {/* TAB CONTENT SPACE */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-5 overflow-y-auto flex flex-col gap-4 shadow-sm relative text-slate-800" id="tab_content">
            
            {/* DRAGGING SYNTHESIS PREVIEW */}
            {draggedCell && (
              <div className="flex flex-col gap-4 animate-fade-in" id="drag_preview_panel">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-slate-100 to-yellow-500/10 blur-xl pointer-events-none"></div>
                  
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
                    <h3 className="text-sm font-bold text-slate-800 tracking-wider uppercase font-mono">
                      ドラッグ合成プレビュー
                    </h3>
                  </div>

                  {/* 1. SOURCE SUBSTANCE */}
                  {(() => {
                    const sourceSub = SUBSTANCES.find(s => s.id === draggedCell.type);
                    if (!sourceSub) return null;
                    return (
                      <div className="flex flex-col gap-2 bg-white/85 p-3 rounded-lg border border-slate-100 shadow-sm">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                          持ち上げている物質
                        </span>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg border border-slate-200 shadow-inner flex items-center justify-center font-mono font-bold shrink-0 text-sm"
                            style={{ 
                              backgroundColor: sourceSub.color,
                              color: ['white', 'yellow', 'cyan', 'pink'].some(c => sourceSub.color.toLowerCase().includes(c)) ? '#0f172a' : '#ffffff'
                            }}
                          >
                            {sourceSub.nameEn.slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-mono font-bold text-slate-900 block">{sourceSub.nameEn}</span>
                            <span className="text-xs text-slate-500 font-bold block">{sourceSub.nameJa}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Connecting Icon */}
                  <div className="flex justify-center my-0.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm font-sans font-bold">
                      ↓
                    </div>
                  </div>

                  {/* 2. TARGET CELL SUBSTANCE */}
                  {(() => {
                    const targetCell = dragCurrentCell ? grid[dragCurrentCell.y]?.[dragCurrentCell.x] : null;
                    const targetSub = targetCell && targetCell.type !== 'empty' ? SUBSTANCES.find(s => s.id === targetCell.type) : null;
                    
                    return (
                      <div className="flex flex-col gap-2 bg-white/80 p-3 rounded-lg border border-slate-100 shadow-sm">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                          ドロップ先のセル ({dragCurrentCell ? `X: ${dragCurrentCell.x}, Y: ${dragCurrentCell.y}` : '-'})
                        </span>
                        {targetSub ? (
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-8 h-8 rounded-lg border border-slate-200 shadow-inner flex items-center justify-center font-mono font-bold shrink-0 text-sm"
                              style={{ 
                                backgroundColor: targetSub.color,
                                color: ['white', 'yellow', 'cyan', 'pink'].some(c => targetSub.color.toLowerCase().includes(c)) ? '#0f172a' : '#ffffff'
                              }}
                            >
                              {targetSub.nameEn.slice(0, 2)}
                            </div>
                            <div>
                              <span className="font-mono font-bold text-slate-900 block">{targetSub.nameEn}</span>
                              <span className="text-xs text-slate-500 font-bold block">{targetSub.nameJa}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-400 italic text-xs py-1">
                            <span className="w-5 h-5 rounded border border-dashed border-slate-300 bg-slate-50/50 flex items-center justify-center font-sans font-bold text-[10px]">Ø</span>
                            <span>空気 / 空きスペース</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Connecting Arrow */}
                  <div className="flex justify-center my-0.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm font-sans font-bold">
                      ➔
                    </div>
                  </div>

                  {/* 3. DROP RESULT */}
                  {(() => {
                    const targetCell = dragCurrentCell ? grid[dragCurrentCell.y]?.[dragCurrentCell.x] : null;
                    const targetType = targetCell ? targetCell.type : 'empty';
                    const isTargetEmpty = targetType === 'empty';
                    
                    if (isTargetEmpty) {
                      return (
                        <div className="flex flex-col gap-1.5 p-3.5 bg-slate-100/70 border border-slate-200 rounded-lg shadow-sm">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                            合成結果
                          </span>
                          <div className="font-mono font-bold text-slate-500 text-lg tracking-wide py-0.5">
                            -
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                            空きスペースです。ドロップすると、持ち上げている物質がここに移動します。
                          </p>
                        </div>
                      );
                    }
                    
                    const reaction = getReaction(draggedCell.type, targetType);
                    if (reaction) {
                      const p1 = reaction.products[0];
                      const p2 = reaction.products[1] || 'empty';
                      const p1Sub = SUBSTANCES.find(s => s.id === p1);
                      const p2Sub = p2 !== 'empty' ? SUBSTANCES.find(s => s.id === p2) : null;
                      
                      return (
                        <div className="flex flex-col gap-2 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-bold">
                              合成結果
                            </span>
                            <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              ✨ 合成可能
                            </span>
                          </div>
                          
                          <div className="flex flex-col gap-1.5 mt-1">
                            <span className="text-xs text-emerald-800 font-bold">新しい生成物:</span>
                            <div className="flex flex-col gap-2">
                              {p1Sub && (
                                <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded border border-emerald-100 shadow-sm">
                                  <div 
                                    className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center font-mono font-bold shrink-0 text-xs text-white"
                                    style={{ backgroundColor: p1Sub.color }}
                                  >
                                    {p1Sub.nameEn.slice(0, 2)}
                                  </div>
                                  <div>
                                    <span className="font-mono text-xs font-bold text-slate-800 block leading-tight">{p1Sub.nameEn}</span>
                                    <span className="text-[10px] text-slate-500 block leading-none">{p1Sub.nameJa}</span>
                                  </div>
                                </div>
                              )}
                              {p2Sub && (
                                <div className="flex items-center gap-2 bg-white/90 p-1.5 rounded border border-emerald-100 shadow-sm">
                                  <div 
                                    className="w-6 h-6 rounded border border-slate-200 flex items-center justify-center font-mono font-bold shrink-0 text-xs text-white"
                                    style={{ backgroundColor: p2Sub.color }}
                                  >
                                    {p2Sub.nameEn.slice(0, 2)}
                                  </div>
                                  <div>
                                    <span className="font-mono text-xs font-bold text-slate-800 block leading-tight">{p2Sub.nameEn}</span>
                                    <span className="text-[10px] text-slate-500 block leading-none">{p2Sub.nameJa}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-[10px] text-emerald-700/80 mt-1 leading-relaxed border-t border-emerald-100 pt-1.5 font-mono">
                            {reaction.description}
                          </p>
                        </div>
                      );
                    } else {
                      return (
                        <div className="flex flex-col gap-1.5 p-3.5 bg-rose-50 border border-rose-200 rounded-lg shadow-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-500 font-bold">
                              合成結果
                            </span>
                            <span className="text-[10px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                              ❌ 合成不可
                            </span>
                          </div>
                          <div className="font-mono font-bold text-rose-600 text-xs tracking-wide py-0.5">
                            置き換えなし (不反応)
                          </div>
                          <p className="text-[10px] text-rose-500 leading-relaxed font-mono">
                            この2つの物質を組み合わせても反応は発生しません。不反応のため、元のピクセルはそのまま保護されます。
                          </p>
                        </div>
                      );
                    }
                  })()}

                </div>
              </div>
            )}

            {/* 1. INSPECTOR TAB */}
            {!draggedCell && activeTab === 'inspector' && currentInspectedSubstance && (
              <div className="flex flex-col gap-4 animate-fade-in" id="inspector_panel">
                
                {/* SUBSTANCE CARD HEADER */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-slate-100 to-yellow-500/5 blur-xl pointer-events-none"></div>
                  
                  {/* Color spot & Names */}
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl border border-slate-200 shadow-inner flex items-center justify-center font-mono font-bold shrink-0 text-lg"
                      style={{ 
                        backgroundColor: currentInspectedSubstance.color,
                        boxShadow: `0 0 16px ${currentInspectedSubstance.color}25`,
                        color: ['white', 'yellow', 'cyan', 'pink'].some(c => currentInspectedSubstance.color.toLowerCase().includes(c)) ? '#0f172a' : '#ffffff'
                      }}
                    >
                      {currentInspectedSubstance.nameEn.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-mono font-bold tracking-wide text-slate-900">{currentInspectedSubstance.nameEn}</span>
                      </div>
                      <span className="text-xs text-slate-500 font-bold block">
                        和名: {getSubstanceNameJa(currentInspectedSubstance)} 
                        {currentInspectedSubstance.id === 'water' && ' [H₂O]'}
                        {currentInspectedSubstance.id === 'oxygen' && ' [O₂]'}
                        {currentInspectedSubstance.id === 'hydrogen' && ' [H₂]'}
                        {currentInspectedSubstance.id === 'carbon_dioxide' && ' [CO₂]'}
                        {currentInspectedSubstance.id === 'silicon' && ' [Si]'}
                        {currentInspectedSubstance.id === 'carbon' && ' [C]'}
                      </span>
                    </div>
                  </div>

                  {/* Scientific metadata tags */}
                  <div className="flex flex-wrap gap-1.5 border-t border-slate-200 pt-2 text-[10px] font-mono">
                    <span className="px-2 py-0.5 bg-white text-slate-700 rounded border border-slate-200">
                      状態: {
                        currentInspectedSubstance.state === 'solid' ? '固相 (Solid)' :
                        currentInspectedSubstance.state === 'liquid' ? '液相 (Liquid)' :
                        currentInspectedSubstance.state === 'gas' ? '気相 (Gas)' :
                        currentInspectedSubstance.state === 'transient' ? '過渡相 (Transient)' : '宇宙相 (Cosmic)'
                      }
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${
                      unlockedIds.includes(currentInspectedSubstance.id)
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      タイプ降下: {unlockedIds.includes(currentInspectedSubstance.id) ? '解放済 (Spawnable)' : '未解放 (Locked)'}
                    </span>
                  </div>
                </div>

                {/* CHEMICAL / PHYSICAL DESCRIPTION */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">科学的性質と説明 (Description)</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {currentInspectedSubstance.description}
                  </p>
                </div>

                {/* HOW TO CREATE */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">合成方法 (How to Create)</span>
                  <div className="text-xs font-mono bg-emerald-50/50 p-3 rounded-lg border border-emerald-200 text-slate-700 flex flex-col gap-1.5">
                    {(() => {
                      if (currentInspectedSubstance.unlockedAtStart) {
                        return (
                          <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>初期の物質（最初から自由に使用可能）</span>
                          </div>
                        );
                      }
                      const recipes = REACTIONS.filter(r => r.products.includes(currentInspectedSubstance.id));
                      if (recipes.length === 0) {
                        return <span className="text-slate-500 italic">作成レシピがありません（特殊な存在、または初期物質です）</span>;
                      }
                      return recipes.map(r => {
                        const subA = SUBSTANCES.find(s => s.id === r.a);
                        const subB = SUBSTANCES.find(s => s.id === r.b);
                        const nameA = subA ? subA.nameEn : r.a;
                        const nameB = subB ? subB.nameEn : r.b;
                        return (
                          <div key={r.id} className="border-b border-emerald-100 last:border-0 pb-1.5 last:pb-0 mb-1.5 last:mb-0">
                            <div className="font-bold text-slate-900 flex items-center gap-1">
                              <span className="text-emerald-600 font-sans">➔</span>
                              <span>{nameA}</span>
                              <span className="text-slate-400 font-sans font-normal">+</span>
                              <span>{nameB}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed pl-3.5">
                              {r.description}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* RECIPE USES (THE CORE PROGRESSION AND UNLOCK MECHANIC) */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                    この物質を反応物として使う合成レシピ ({
                      REACTIONS.filter(r => r.a === currentInspectedSubstance.id || r.b === currentInspectedSubstance.id).length
                    }パターン)
                  </span>
                  
                  <div className="flex flex-col gap-1.5 font-mono text-[11px]" id="uses_list">
                    {(() => {
                      const relevant = REACTIONS.filter(r => r.a === currentInspectedSubstance.id || r.b === currentInspectedSubstance.id);
                      if (relevant.length === 0) {
                        return (
                          <div className="p-3 bg-indigo-50 text-indigo-800 border border-indigo-100 rounded-lg text-xs">
                            🌌 この物質は究極の終着点です。これ以上の合成素材としての用途はありません。
                          </div>
                        );
                      }

                      return relevant.map(reaction => {
                        const hasTried = triedReactionIds.includes(reaction.id);
                        
                        const partnerId = reaction.a === currentInspectedSubstance.id ? reaction.b : reaction.a;
                        const partnerSub = SUBSTANCES.find(s => s.id === partnerId);
                        const isPartnerDiscovered = partnerSub && discoveredIds.includes(partnerId);

                        const p1Sub = SUBSTANCES.find(s => s.id === reaction.products[0]);
                        const p2Sub = reaction.products[1] ? SUBSTANCES.find(s => s.id === reaction.products[1]) : null;

                        return (
                          <div 
                            key={reaction.id}
                            className={`p-2.5 rounded-lg border flex flex-col gap-1.5 transition-all ${
                              hasTried 
                                ? 'bg-slate-50 border-slate-200 text-slate-800 shadow-sm' 
                                : 'bg-slate-50/20 border-slate-200/60 border-dashed text-slate-400'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">
                                {hasTried ? '🧪 実証済' : '❓ 未実験の可能性'}
                              </span>
                              {!hasTried && (
                                <span className="text-[10px] text-yellow-700 bg-yellow-50 px-1.5 rounded">未検証</span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-1">
                              <span className="font-bold text-slate-900">{currentInspectedSubstance.nameEn}</span>
                              <span className="text-slate-400 font-sans">+</span>
                              
                              {hasTried ? (
                                <span className="font-bold text-slate-900">{partnerSub?.nameEn || partnerId}</span>
                              ) : isPartnerDiscovered ? (
                                <span className="font-bold text-slate-600 underline decoration-dotted" title="すでに発見した物質です">{partnerSub?.nameEn || partnerId}</span>
                              ) : (
                                <span className="font-bold text-slate-400 bg-white border border-slate-200 px-1 py-0.5 rounded">? [未発見の物質]</span>
                              )}

                              <span className="text-slate-400 font-sans">➔</span>

                              {hasTried ? (
                                <span className="font-bold text-slate-900">
                                  {p1Sub?.nameEn || reaction.products[0]}
                                  {p2Sub ? ` & ${p2Sub.nameEn}` : ''}
                                </span>
                              ) : (
                                <span className="font-bold text-slate-400 bg-white border border-slate-200 px-1 py-0.5 rounded">? [未知の成果物]</span>
                              )}
                            </div>

                            {/* Little chemical formula description helper */}
                            {hasTried ? (
                              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{reaction.description}</p>
                            ) : (
                              <p className="text-[10px] text-slate-400 italic mt-0.5">
                                ヒント: {
                                  partnerId === 'fire' ? '超熱源で熱を加えてみよう。' :
                                  partnerId === 'water' ? '水に落として混ざり合わせてみよう。' :
                                  partnerId === 'electricity' ? '高電圧の電気ショックを与えてみよう。' :
                                  partnerId === 'soil' ? '土と反応させてみよう。' :
                                  partnerId === 'stone' ? '固い岩石と合体させてみよう。' :
                                  'より高度な、新しく見つけた物質を降らせて混和しよう。'
                                }
                              </p>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>

              </div>
            )}

            {/* IF NO HOVER OR SELECT IN INSPECTOR */}
            {!draggedCell && activeTab === 'inspector' && !currentInspectedSubstance && (
              <div className="flex flex-col items-center justify-center text-center p-8 text-slate-500 font-mono flex-1" id="inspector_empty">
                <Search className="w-10 h-10 text-slate-700 mb-3 animate-pulse" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">物質をインスペクト中</p>
                <p className="text-[11px] mt-1.5 leading-relaxed max-w-xs">
                  キャンバス上のピクセルをクリックしてインスペクトが可能です。また、ピクセルをドラッグして別のピクセルの上に重ねてドロップ（Drop）することで、合成化学反応を起こせます！
                </p>
              </div>
            )}

            {/* 2. ENCYCLOPEDIA TAB */}
            {!draggedCell && activeTab === 'encyclopedia' && (
              <div className="flex flex-col gap-4 animate-fade-in" id="encyclopedia_panel">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono text-slate-500">発見した物質の一覧・事典</span>
                  <div className="flex flex-wrap gap-1 mt-1 border-b border-slate-200 pb-2">
                    {categories.map(c => (
                      <button
                        key={c.value}
                        onClick={() => setSelectedCategory(c.value)}
                        className={`px-2 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${
                          selectedCategory === c.value 
                            ? 'bg-yellow-50 text-yellow-700 font-bold border border-yellow-300 shadow-sm' 
                            : 'bg-slate-50 text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        id={`cat_tab_${c.value}`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-1" id="dictionary_list">
                  {filteredSubstances.map(sub => {
                    const isUnlocked = unlockedIds.includes(sub.id);
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setSelectedSubstanceId(sub.id);
                          setSelectedCell(null);
                          setActiveTab('inspector');
                        }}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-left hover:border-slate-400 hover:bg-slate-100 transition-all flex items-center justify-between cursor-pointer"
                        id={`dict_item_${sub.id}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span 
                            className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-300 shadow-sm"
                            style={{ backgroundColor: sub.color }}
                          />
                          <div>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-xs font-mono font-bold text-slate-900">{sub.nameEn}</span>
                              <span className="text-[10px] text-slate-500 font-sans">({getSubstanceNameJa(sub)})</span>
                            </div>
                            <span className="text-[9px] font-mono text-slate-400 uppercase">
                              {sub.state}
                            </span>
                          </div>
                        </div>
                        <div>
                          {isUnlocked ? (
                            <span className="text-[9px] text-yellow-700 border border-yellow-200 bg-yellow-50 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                              降下可能
                            </span>
                          ) : (
                            <span className="text-[9px] text-slate-600 border border-slate-200 bg-slate-100 px-2 py-0.5 rounded-full font-mono uppercase font-bold">
                              合成実験中
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}

                  {filteredSubstances.length === 0 && (
                    <div className="text-center py-8 text-slate-400 font-mono text-xs">
                      該当する発見済みの物質はありません。
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 3. REACTIONS RECIPE TAB */}
            {!draggedCell && activeTab === 'reactions' && (
              <div className="flex flex-col gap-3 animate-fade-in" id="reactions_panel">
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-slate-500">実証された化学・技術合成式</span>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    現在までに検証できた全合成式の一覧 ({triedReactionIds.length} / {REACTIONS.length})
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 max-h-[420px] overflow-y-auto pr-1" id="formulas_list">
                  {REACTIONS.map(rx => {
                    const hasTried = triedReactionIds.includes(rx.id);
                    const subA = SUBSTANCES.find(s => s.id === rx.a);
                    const subB = SUBSTANCES.find(s => s.id === rx.b);
                    const p1 = SUBSTANCES.find(s => s.id === rx.products[0]);
                    const p2 = rx.products[1] ? SUBSTANCES.find(s => s.id === rx.products[1]) : null;

                    return (
                      <div 
                        key={rx.id} 
                        className={`p-2.5 rounded-lg border font-mono text-xs ${
                          hasTried 
                            ? 'bg-slate-50 border-slate-200 text-slate-800' 
                            : 'bg-white border-slate-200/60 border-dashed text-slate-400'
                        }`}
                        id={`formula_card_${rx.id}`}
                      >
                        <div className="flex justify-between items-center mb-1 text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                          <span>RECIPE ID: {rx.id}</span>
                          <span>{hasTried ? '🧪 実証済' : '❓ 未検証'}</span>
                        </div>
                        {hasTried ? (
                          <>
                            <div className="flex flex-wrap items-center gap-1.5 font-bold text-slate-900">
                              <span>{subA?.nameEn}</span>
                              <span className="text-slate-400 font-sans">+</span>
                              <span>{subB?.nameEn}</span>
                              <span className="text-slate-400 font-sans">➔</span>
                              <span className="text-yellow-600 font-bold">
                                {p1?.nameEn}
                                {p2 ? ` & ${p2.nameEn}` : ''}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1 font-sans border-t border-slate-200 pt-1 leading-relaxed">
                              {rx.description}
                            </p>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5 italic text-slate-400">
                            <span>{discoveredIds.includes(rx.a) ? subA?.nameEn : '???'}</span>
                            <span className="font-sans">+</span>
                            <span>{discoveredIds.includes(rx.b) ? subB?.nameEn : '???'}</span>
                            <span className="font-sans">➔</span>
                            <span>未知の物質</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. ACHIEVEMENTS TAB */}
            {!draggedCell && activeTab === 'achievements' && (
              <div className="flex flex-col gap-3 animate-fade-in flex-1 h-full min-h-[480px]" id="achievements_panel">
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-slate-500">宇宙と物質の進化実績</span>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5 leading-relaxed">
                    最終目標「宇宙」を頂点とする合成と発展の系譜。ドラッグで図を移動でき、各実績にホバーすると詳細（吹き出し）と図が表示されます。
                  </p>
                </div>

                {/* Tree Viewport (Canvas / Outer Container) */}
                <div 
                  className="relative flex-1 min-h-[380px] max-h-[480px] bg-slate-900 border border-slate-950 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing shadow-inner"
                  onMouseDown={(e) => {
                    // SVG, buttons, or popup clicks shouldn't pan
                    if ((e.target as HTMLElement).closest('.achievement-node') || (e.target as HTMLElement).closest('.achievement-popup')) return;
                    setIsDraggingPan(true);
                    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
                  }}
                  onMouseMove={(e) => {
                    if (!isDraggingPan) return;
                    setPanOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
                  }}
                  onMouseUp={() => setIsDraggingPan(false)}
                  onMouseLeave={() => setIsDraggingPan(false)}
                >
                  {/* Inner Absolute Container that is panned */}
                  <div 
                    className="absolute origin-top-left transition-transform duration-75 select-none"
                    style={{ 
                      transform: `translate(${panOffset.x}px, ${panOffset.y}px)`, 
                      width: '1050px', 
                      height: '750px' 
                    }}
                  >
                    {/* SVG Connector lines */}
                    <svg className="absolute inset-0 pointer-events-none w-[1050px] h-[750px] z-0">
                      {ACHIEVEMENTS.map(ach => {
                        const isUnlocked = ach.requiredSubstanceIds?.every(id => discoveredIds.includes(id)) || 
                                           ach.requiredReactionIds?.every(id => triedReactionIds.includes(id));

                        return ach.parentIds.map(parentId => {
                          const parent = ACHIEVEMENTS.find(a => a.id === parentId);
                          if (!parent) return null;

                          const isParentUnlocked = parent.requiredSubstanceIds?.every(id => discoveredIds.includes(id)) || 
                                                   parent.requiredReactionIds?.every(id => triedReactionIds.includes(id));

                          const isLineUnlocked = isUnlocked && isParentUnlocked;

                          // Coordinates
                          const x1 = parent.x + 65; // half of node width (130px)
                          const y1 = parent.y + 24; // half of node height (48px)
                          const x2 = ach.x + 65;
                          const y2 = ach.y + 24;
                          const dy = y2 - y1;

                          // Bezier Curve
                          const pathData = `M ${x1} ${y1} C ${x1} ${y1 + dy * 0.4}, ${x2} ${y2 - dy * 0.4}, ${x2} ${y2}`;

                          return (
                            <path
                              key={`${parent.id}-${ach.id}`}
                              d={pathData}
                              fill="none"
                              stroke={isLineUnlocked ? '#eab308' : '#1e293b'}
                              strokeWidth={isLineUnlocked ? 2.5 : 1.5}
                              strokeDasharray={isLineUnlocked ? 'none' : '4,4'}
                              className="transition-all duration-300"
                            />
                          );
                        });
                      })}
                    </svg>

                    {/* Nodes layer */}
                    {ACHIEVEMENTS.map(ach => {
                      const isUnlocked = ach.requiredSubstanceIds?.every(id => discoveredIds.includes(id)) || 
                                         ach.requiredReactionIds?.every(id => triedReactionIds.includes(id));

                      return (
                        <div
                          key={ach.id}
                          className={`absolute z-10 w-[130px] h-[48px] rounded-lg border flex flex-col justify-center items-center p-1.5 transition-all cursor-pointer select-none achievement-node ${
                            isUnlocked 
                              ? 'bg-[#0f172a] border-yellow-500/80 text-white shadow-md hover:scale-105 hover:border-yellow-400' 
                              : 'bg-slate-950 border-slate-850 text-slate-600 hover:border-slate-800'
                          }`}
                          style={{ left: ach.x, top: ach.y }}
                          onMouseEnter={() => setHoveredAchievement(ach)}
                          onMouseLeave={() => setHoveredAchievement(null)}
                        >
                          <span className="text-sm shrink-0">{isUnlocked ? ach.iconEmoji : '🔒'}</span>
                          <span className="text-[9px] font-mono font-bold truncate max-w-full tracking-tight">
                            {isUnlocked ? ach.title : '？？？？'}
                          </span>
                        </div>
                      );
                    })}

                    {/* FUKIDASHI POPUP (Hover Tooltip Floating inside the draggable area) */}
                    {hoveredAchievement && (() => {
                      const ach = hoveredAchievement;
                      const isUnlocked = ach.requiredSubstanceIds?.every(id => discoveredIds.includes(id)) || 
                                         ach.requiredReactionIds?.every(id => triedReactionIds.includes(id));

                      // Calculate absolute popup position. Since we are inside the same panned div, 
                      // it will follow the pan perfectly!
                      // Let's place it right above the node.
                      const popupWidth = 260;
                      const popupHeight = 150;
                      const px = ach.x + 65 - (popupWidth / 2);
                      const py = ach.y - popupHeight - 12;

                      return (
                        <div 
                          className="absolute z-30 w-[260px] bg-white text-slate-800 border border-slate-300 rounded-xl p-3 shadow-2xl flex flex-col gap-2 pointer-events-none achievement-popup"
                          style={{ left: px, top: py }}
                        >
                          {/* Triangle pointing down */}
                          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]"></div>

                          {/* Popup Content */}
                          <div className="flex gap-3">
                            {/* Illustration inside the bubble */}
                            <AchievementIllustration type={ach.illustrationType} unlocked={isUnlocked} />

                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-mono font-bold text-slate-900 leading-tight">
                                    {isUnlocked ? ach.title : '未解放の実績'}
                                  </span>
                                  {isUnlocked && <span className="text-[10px] text-green-700 bg-green-50 px-1.5 py-0.2 rounded font-bold shrink-0">完了</span>}
                                </div>
                                <span className="text-[9px] text-slate-400 font-mono block">
                                  {ach.titleEn}
                                </span>
                              </div>
                              <span className="text-[9px] text-yellow-700 font-bold font-mono bg-yellow-50 px-1.5 py-0.5 rounded border border-yellow-150 self-start mt-1 truncate max-w-full">
                                {isUnlocked ? ach.subtitle : '解放条件：？？？'}
                              </span>
                            </div>
                          </div>

                          <p className="text-[9.5px] text-slate-600 leading-relaxed font-sans border-t border-slate-100 pt-1.5">
                            {isUnlocked ? ach.description : 'この実績はまだアンロックされていません。科学の力で物質を合成し、新たな発見を成し遂げてください。'}
                          </p>
                        </div>
                      );
                    })()}

                  </div>

                  {/* Reset view controller */}
                  <button 
                    onClick={() => setPanOffset({ x: -200, y: 10 })}
                    className="absolute bottom-2.5 right-2.5 p-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-[10px] font-mono z-20 cursor-pointer transition-all active:scale-95 flex items-center gap-1"
                    title="Reset view pan"
                  >
                    <Maximize className="w-3 h-3" />
                    <span>位置リセット</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* PROGRESS METRICS BAR */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 shrink-0 flex flex-col gap-2 font-mono text-xs text-slate-500" id="progress_card">
            <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold block">
              🌌 創生エネルギーの充実度 (Progression Index):
            </span>
            <div className="w-full bg-white rounded-full h-3 border border-slate-200 overflow-hidden relative shadow-inner">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-amber-500 h-full transition-all duration-500"
                style={{ width: `${(discoveredIds.length / SUBSTANCES.length) * 100}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-slate-700">
                {Math.round((discoveredIds.length / SUBSTANCES.length) * 100)}%
              </span>
            </div>
          </div>

        </section>

      </main>

      {/* FOOTER METRICS */}
      <footer className="border-t border-[#2a2a40] bg-[#050508]/90 px-6 py-4 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row justify-between items-center gap-4 mt-auto shrink-0 relative z-10" id="game_footer">
        <span>© 2026 Science Synthesis Sandbox • Designed for Education</span>
        <div className="flex items-center gap-3">
          <span>Target: Universe Big Bang</span>
          <span>•</span>
          <span className="text-slate-500">Language: English (Substances) / Japanese (UI)</span>
        </div>
      </footer>

      {/* OPERATIONAL GUIDE MODAL */}
      <GuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />

    </div>
  );
}
