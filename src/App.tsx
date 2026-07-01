/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SUBSTANCES, REACTIONS, getReaction } from './data/substances';
import { Substance, Reaction } from './types';
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

const COLS = 32;
const ROWS = 36;
const CELL_SIZE = 12; // pixels

interface GridCell {
  type: string; // substance ID or 'empty'
  age: number;
}

export default function App() {
  // --- STATE ---
  const [grid, setGrid] = useState<GridCell[][]>(() => createInitialGrid());
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<number>(100); // ms per tick
  const [typingInput, setTypingInput] = useState('');
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
  const [selectedSubstanceId, setSelectedSubstanceId] = useState<string>('water');
  const [activeTab, setActiveTab] = useState<'inspector' | 'encyclopedia' | 'reactions' | 'oracle'>('inspector');
  
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Oracle state (AI assistant)
  const [oracleQuestion, setOracleQuestion] = useState('');
  const [oracleAnswer, setOracleAnswer] = useState<string>('「何が知りたい、大いなる創造主よ？ 物質の合成法やスペル、あるいは宇宙の真理について、私に尋ねるがよい。」');
  const [isOracleLoading, setIsOracleLoading] = useState(false);

  // Auto-complete index
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);

  // Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Top-down target cursor
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>({ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) });

  // --- LOCAL PERSISTENCE STORAGE ---
  useEffect(() => {
    localStorage.setItem('sss_discovered_substances', JSON.stringify(discoveredIds));
  }, [discoveredIds]);

  useEffect(() => {
    localStorage.setItem('sss_tried_reactions', JSON.stringify(triedReactionIds));
  }, [triedReactionIds]);

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

  // Handle Big Bang Victory
  useEffect(() => {
    if (discoveredIds.includes('universe') && !bigBangActive) {
      setBigBangActive(true);
      showNotification("宇宙創造 (The Big Bang)", "おめでとうございます！究極の物質「宇宙」を創造し、生命の揺りかごを完成させました！", "success");
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
  const triggerDiscovery = (reaction: Reaction, p1: string, p2: string) => {
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
                `🧪 新物質を発見: ${s.nameEn} (${s.nameJa})`,
                `すべての用途を試すとタイピングアンロックされます！`,
                'success'
              );
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
              `🎉 タイピング解放: ${rSub.nameEn} (${rSub.nameJa})`,
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
  function createInitialGrid(): GridCell[][] {
    const newGrid: GridCell[][] = Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({ type: 'empty', age: 0 }))
    );

    // Create a beautiful, top-down scientific geological petri dish
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        // 1. Water lake in top-left
        const distToWater = Math.hypot(x - 8, y - 10);
        if (distToWater < 5) {
          newGrid[y][x] = { type: 'water', age: 0 };
          continue;
        }
        if (distToWater < 7.5) {
          newGrid[y][x] = { type: 'soil', age: 0 };
          continue;
        }

        // 2. Geothermal fire pocket in bottom-right
        const distToFire = Math.hypot(x - 24, y - 24);
        if (distToFire < 4) {
          newGrid[y][x] = { type: 'fire', age: 0 };
          continue;
        }
        if (distToFire < 6) {
          newGrid[y][x] = { type: 'lava', age: 0 };
          continue;
        }

        // 3. Stone ridge crossing from top-right to bottom-left
        if (Math.abs((x - 18) + (y - 18) * 0.5) < 2) {
          newGrid[y][x] = { type: 'stone', age: 0 };
          continue;
        }

        // 4. Random scattered soil patches
        if (Math.hypot(x - 10, y - 24) < 5) {
          newGrid[y][x] = { type: 'soil', age: 0 };
          continue;
        }
      }
    }

    return newGrid;
  }

  // --- SIMULATION TICK STEP ---
  const tick = () => {
    setGrid(prevGrid => {
      // Create copy of grid
      const nextGrid = prevGrid.map(row => row.map(cell => ({ ...cell })));

      // 2. PROCESS CELLULAR PHYSICS FOR TOP-DOWN VIEW (Gravity is disabled, elements are stable)
      // Fire and electricity conduct/burn symmetrically, cells, bacteria, and plants grow organically.
      for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
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
                if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
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
                if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
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
                if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && nextGrid[ny][nx].type === 'water') {
                  hasWater = true;
                  break;
                }
              }
              if (hasWater) {
                for (const { ny, nx } of adj) {
                  if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS && nextGrid[ny][nx].type === 'soil') {
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

            if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
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
                    if (co2X >= 0 && co2X < COLS && nextGrid[y][co2X].type === 'empty') {
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
              if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
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

  // --- RENDERING CANVAS ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with clean Immersive UI theme background
    ctx.fillStyle = '#09090b'; // deep space black
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines subtly
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'; // subtle grid line
    ctx.lineWidth = 0.5;

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = grid[y][x];
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
  }, [grid, hoveredCell, selectedCell, draggedCell, dragCurrentCell]);

  // --- CANVAS COORD SELECTION ---
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor(((e.clientX - rect.left) * scaleX) / CELL_SIZE);
    const y = Math.floor(((e.clientY - rect.top) * scaleY) / CELL_SIZE);

    if (x >= 0 && x < COLS && y >= 0 && y < ROWS) {
      setSelectedCell({ x, y });
      setHoveredCell({ x, y });

      // If the clicked cell contains a substance, inspect it and start dragging
      const cell = grid[y]?.[x];
      if (cell && cell.type !== 'empty') {
        setSelectedSubstanceId(cell.type);
        setActiveTab('inspector');
        setDraggedCell({ x, y, type: cell.type });
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
    const x = Math.max(0, Math.min(COLS - 1, rawX));
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
          triggerDiscovery(reaction, prod1, prod2);
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
              if (cx >= 0 && cx < COLS && cy >= 0 && cy < ROWS) {
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
        if (cx >= 0 && cx < COLS && cy >= 0 && cy < ROWS) {
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
      triggerDiscovery(reaction, prod1, prod2);
    });

    setTypingInput('');
  };

  // --- ASK AI ORACLE ---
  const handleAskOracle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oracleQuestion.trim()) return;

    setIsOracleLoading(true);
    setOracleAnswer("大いなる神の思考をチャネリング中（Oracleが思索しています）...");

    try {
      const discoveredList = discoveredIds.map(id => {
        const s = SUBSTANCES.find(sub => sub.id === id);
        return s ? `${s.nameEn}(${getSubstanceNameJa(s)})` : id;
      });

      const triedReactionsList = triedReactionIds.map(id => {
        const r = REACTIONS.find(rx => rx.id === id);
        if (!r) return id;
        const ra = getSubstanceNameJaById(r.a);
        const rb = getSubstanceNameJaById(r.b);
        const rp = r.products.map(p => getSubstanceNameJaById(p)).join('と');
        return `${ra} + ${rb} ➔ ${rp}`;
      });

      const response = await fetch('/api/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: oracleQuestion,
          discoveredList,
          triedReactionsList
        })
      });

      const data = await response.json();
      if (data.answer) {
        setOracleAnswer(data.answer);
      } else {
        setOracleAnswer("申し訳ありません、神々の知恵へのアクセスに失敗しました。接続エラーが発生したようです。");
      }
    } catch (err) {
      console.error(err);
      setOracleAnswer("Oracleへのチャネリングが途切れました。しばらく時間をおいて再度お試しください。");
    } finally {
      setIsOracleLoading(false);
      setOracleQuestion('');
    }
  };

  // --- EXTRA UTILITIES ---
  const clearCanvas = () => {
    setGrid(Array.from({ length: ROWS }, () =>
      Array.from({ length: COLS }, () => ({ type: 'empty', age: 0 }))
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
          <div className="w-10 h-10 bg-yellow-100 border border-yellow-400 flex items-center justify-center rounded animate-pulse">
            <span className="text-yellow-700 font-bold text-xl">Σ</span>
          </div>
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
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10" id="game_workspace">
        
        {/* LEFT COLUMN: SIMULATION CANVAS & INPUT CONTROLS (cols 1-7) */}
        <section className="lg:col-span-7 flex flex-col gap-4" id="simulation_section">
          

          {/* SIMULATOR SCREEN & CONTROL DASHBOARD */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4 shadow-sm text-slate-900" id="sandbox_frame">
            
            {/* CANVAS WRAPPER */}
            <div className="flex justify-center bg-[#09090b] p-3 rounded-lg border border-slate-300 relative group shadow-sm" id="canvas_container">
              {/* Top-down sky helper indicator line */}
              <div className="absolute top-3 left-3 right-3 h-0.5 border-t border-dashed border-white/5 pointer-events-none"></div>

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
                width={COLS * CELL_SIZE}
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
                  <span>GRID: {COLS}x{ROWS}</span>
                  <span>•</span>
                  <span>SPEED: {simSpeed}ms</span>
                </div>
                {selectedCell ? (
                  <div className="flex gap-2 items-center">
                    <span className="text-yellow-400 font-bold">選択セル (Active): X:{selectedCell.x} Y:{selectedCell.y}</span>
                    <span className="text-slate-300">
                      ({grid[selectedCell.y]?.[selectedCell.x]?.type === 'empty' 
                        ? '空相/Empty' 
                        : getSubstanceNameJaById(grid[selectedCell.y]?.[selectedCell.x]?.type)})
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
                      ? '空相/Empty' 
                      : getSubstanceNameJaById(grid[hoveredCell.y]?.[hoveredCell.x]?.type)})
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
              {/* RIGHT COLUMN: DETAILED SIDEBAR PANELS (cols 8-12) */}
        <section className="lg:col-span-5 flex flex-col gap-4 h-[calc(100vh-140px)] min-h-[500px]" id="sidebar_section">
          
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
              onClick={() => setActiveTab('oracle')}
              className={`py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'oracle' 
                  ? 'bg-white text-slate-900 border border-slate-300/85 shadow-sm font-bold' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/50'
              }`}
              id="tab_oracle"
            >
              創世 of Oracle
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

            {/* 4. AI ORACLE TAB */}
            {!draggedCell && activeTab === 'oracle' && (
              <div className="flex flex-col gap-4 animate-fade-in flex-1" id="oracle_panel">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-600" />
                    創世の信託 (Gemini Oracle AI)
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                    万物の知識を持つ全知全能の信託。物質の英語スペル、合成方法のヒント、科学的な役割について謎解きのように導いてくれます。
                  </p>
                </div>

                {/* Oracle Dialogue Bubble */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex-1 flex flex-col gap-3 min-h-[160px] relative shadow-inner">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[9px] text-slate-700 px-2 py-0.5 rounded-full bg-white border border-slate-200 font-mono">
                    <Atom className="w-2.5 h-2.5 text-yellow-600 animate-spin-slow" />
                    <span>ACTIVE CONNECTION</span>
                  </div>
                  
                  <div className="text-xs font-mono text-slate-700 leading-relaxed overflow-y-auto max-h-[220px] whitespace-pre-wrap flex-1 pr-1" id="oracle_bubble">
                    {oracleAnswer}
                  </div>
                </div>

                {/* Oracle Submission Form */}
                <form onSubmit={handleAskOracle} className="flex gap-2 shrink-0" id="oracle_form">
                  <input
                    type="text"
                    value={oracleQuestion}
                    onChange={(e) => setOracleQuestion(e.target.value)}
                    placeholder="アミノ酸はどう作る？ / 磁石のスペルは？"
                    disabled={isOracleLoading}
                    className="flex-1 bg-white border border-slate-200 focus:border-yellow-500 outline-none rounded-lg px-3 py-2 text-xs font-mono text-slate-800 placeholder-slate-300 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isOracleLoading || !oracleQuestion.trim()}
                    className="bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border border-yellow-200 active:scale-95 disabled:opacity-40 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    id="oracle_submit_btn"
                  >
                    {isOracleLoading ? (
                      <span className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>問う</span>
                      </>
                    )}
                  </button>
                </form>
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

      {/* BIG BANG VICTORY MODAL OVERLAY */}
      {bigBangActive && (
        <div className="fixed inset-0 z-50 bg-[#050508]/95 backdrop-blur-md flex items-center justify-center p-4" id="victory_modal">
          <div className="bg-[#0a0a14] border border-cyan-500/40 max-w-lg w-full p-6 rounded-2xl shadow-2xl shadow-cyan-500/10 text-center flex flex-col items-center gap-5 relative overflow-hidden animate-fade-in">
            {/* Ambient animated cosmic particles */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
            
            <div className="p-4 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-full text-slate-900 animate-spin-slow">
              <Globe className="w-10 h-10 text-slate-950" />
            </div>

            <div className="flex flex-col gap-1.5">
              <h2 className="text-2xl font-bold tracking-wider font-mono bg-gradient-to-r from-cyan-200 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                COSMIC GENERATION COMPLETE!
              </h2>
              <span className="text-xs text-cyan-400 font-mono uppercase tracking-widest font-semibold text-indigo-300">
                大いなる大いなる宇宙の誕生
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-mono bg-[#050508]/60 p-4 rounded-xl border border-[#2a2a40] text-left">
              若き創造主よ！あなたは基本物質である水、火、土、石、電気を駆使し、
              分子の分解から最先端の半導体・技術文明を育み、ついに生命（Life）を覚醒させました。
              そしてその大いなる力は銀河を繋ぎ、時空の終着点である「宇宙（Universe）」の創造を遂げました。
              <br /><br />
              自然界における元素とテクノロジーの驚異的な結びつきを理解した、あなたこそ真の科学の設計者です。
            </p>

            <div className="flex gap-3 font-mono text-xs w-full">
              <button
                onClick={() => setBigBangActive(false)}
                className="flex-1 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-400/50 rounded-lg font-bold transition-all cursor-pointer"
              >
                このまま創造を続ける
              </button>
              <button
                onClick={() => {
                  setBigBangActive(false);
                  resetProgress();
                }}
                className="flex-1 py-2.5 bg-[#050508] hover:bg-red-950/40 text-slate-400 hover:text-red-300 rounded-lg border border-[#2a2a40] font-bold transition-all cursor-pointer"
              >
                新たな輪廻を始める
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
