import React from 'react';
import { X, Sparkles, Keyboard, MousePointer } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" id="guide_modal_backdrop">
      
      {/* 画面の約6割の大きさのコンパクトなコンテナ */}
      <div 
        className="relative bg-white border-2 border-slate-200 rounded-2xl shadow-2xl flex flex-col w-full max-w-4xl h-[560px] overflow-hidden" 
        style={{ width: '64%' }}
        id="guide_modal_container"
      >
        
        {/* ヘッダー */}
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0" id="guide_modal_header">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-yellow-100 border border-yellow-400 flex items-center justify-center rounded">
              <span className="text-yellow-700 font-bold text-lg font-mono">Σ</span>
            </div>
            <div>
              <h2 className="text-sm font-bold font-sans text-slate-800 tracking-tight flex items-center gap-1.5">
                <span>Magerial (マジェリアル) 操作ガイド</span>
                <span className="text-[9px] font-mono font-normal uppercase bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                  Gameplay Guide
                </span>
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-all cursor-pointer"
            title="閉じる"
            id="guide_modal_close_btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* モーダルボディ：スクロールなしで完全に収める */}
        <div className="p-5 flex-1 flex flex-col gap-4 min-h-0 bg-white" id="guide_modal_body">
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 flex-1 min-h-0">
            
            {/* 左側：ブロック生成説明 (3/5 幅) */}
            <div className="md:col-span-3 flex flex-col bg-slate-50 border border-slate-100 rounded-xl p-4 min-h-0 justify-between" id="guide_typing_section">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center rounded-lg font-bold text-xs">
                    1
                  </span>
                  <h3 className="font-sans font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Keyboard className="w-3.5 h-3.5 text-cyan-500" />
                    タイピングでブロック生成
                  </h3>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pl-8">
                  解放された物質のスペル（例: <code className="bg-slate-200/60 px-1 py-0.5 rounded font-mono text-cyan-700 font-bold">water</code> など）をキーボードで入力し、
                  <kbd className="bg-white border border-slate-300 px-1 py-0.5 rounded font-mono text-[9px] shadow-sm font-semibold mx-0.5">Enter</kbd>
                  を押すと、その物質ブロックを空から降下させることができます。
                </p>
              </div>

              {/* GIF配置エリア */}
              <div className="mt-3 flex-1 min-h-0 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden relative group">
                <img 
                  src="/assets/type.gif" 
                  alt="タイピングで生成のデモ"
                  className="max-w-full max-h-full object-contain pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 text-[9px] text-cyan-400 font-mono px-2 py-0.5 rounded border border-cyan-950">
                  SPELL_ENGINE
                </div>
              </div>
            </div>

            {/* 右側：ドラッグ＆ドロップ合成(上) と 最終目標(下) */}
            <div className="md:col-span-2 flex flex-col gap-4 min-h-0">
              
              {/* 右上：ドラッグ＆ドロップ合成 */}
              <div className="flex-1 flex flex-col bg-slate-50 border border-slate-100 rounded-xl p-4 min-h-0 justify-between" id="guide_drag_section">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center rounded-lg font-bold text-xs">
                      2
                    </span>
                    <h3 className="font-sans font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <MousePointer className="w-3.5 h-3.5 text-amber-500" />
                      ドラッグ＆ドロップ合成
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-8">
                    キャンバス上のピクセルを掴んで、別のピクセルの上に重ねてドロップします。相性が良ければ「新物質」が創世されます。
                  </p>
                </div>

                {/* GIF配置エリア */}
                <div className="mt-3 flex-1 min-h-0 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden relative group">
                  <img 
                    src="/assets/drag.gif" 
                    alt="ドラッグ＆ドロップ合成のデモ"
                    className="max-w-full max-h-full object-contain pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/80 text-[9px] text-amber-400 font-mono px-2 py-0.5 rounded border border-amber-950">
                    FUSE_ENGINE
                  </div>
                </div>
              </div>

              {/* 右下：最終目標 (コンパクト版) */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-slate-100 p-4 rounded-xl border border-indigo-950 shrink-0" id="guide_goal_banner">
                <div className="flex items-start gap-2.5">
                  <span className="text-lg leading-none">🌌</span>
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-widest">
                      最終目標：宇宙の創生
                    </h4>
                    <p className="text-[10px] text-slate-300 leading-relaxed">
                      「水」「火」「空気」「土」からスタートし、科学と化学反応を繰り返して、最終目標である無限の「宇宙 (Universe)」を創り出しましょう！
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
