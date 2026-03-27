"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryNode, StoryChoice } from '@/lib/game/types';
import { STORY_NODES } from '@/lib/game/story';

interface Props {
  nodeId: string;
  flags: string[];
  onChoice: (choice: StoryChoice, nextNodeId: string) => void;
  onOpenWorld: () => void;
}

const CHARS_PER_FRAME = 3; // characters revealed per animation frame (~60fps = ~180 chars/sec)

export default function StoryView({ nodeId, flags, onChoice, onOpenWorld }: Props) {
  const node: StoryNode = STORY_NODES[nodeId] || STORY_NODES['intro'];
  const [charCount, setCharCount] = useState(0);
  const [done, setDone] = useState(false);
  const rafRef = useRef<number | null>(null);
  const countRef = useRef(0);
  const textRef = useRef(node.text);

  const cancel = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const skip = useCallback(() => {
    cancel();
    countRef.current = textRef.current.length;
    setCharCount(textRef.current.length);
    setDone(true);
  }, []);

  useEffect(() => {
    textRef.current = node.text;
    countRef.current = 0;
    setCharCount(0);
    setDone(false);
    cancel();

    const tick = () => {
      countRef.current = Math.min(countRef.current + CHARS_PER_FRAME, textRef.current.length);
      setCharCount(countRef.current);
      if (countRef.current < textRef.current.length) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return cancel;
  }, [nodeId]);

  const displayed = node.text.slice(0, charCount);

  const availableChoices = node.choices.filter(c =>
    !c.requiresFlag || flags.includes(c.requiresFlag)
  );

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-3xl">
        {node.chapterNumber && (
          <div className="text-aethrix-gold text-[10px] tracking-[0.5em] uppercase mb-2">
            Chapter {node.chapterNumber}
          </div>
        )}
        <h2 className="text-2xl font-black uppercase tracking-widest mb-8 terminal-text">{node.title}</h2>

        <div className="border border-gray-800 bg-gray-950 p-8 mb-8 min-h-[300px]">
          <pre className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-mono">
            {displayed}
            {!done && <span className="text-aethrix-gold">█</span>}
          </pre>
        </div>

        {done ? (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-3">
              {node.isEnding ? (
                <div className="text-center space-y-4">
                  <div className="text-aethrix-gold text-lg uppercase tracking-widest">— Chronicle Complete —</div>
                  <button onClick={onOpenWorld}
                    className="border border-aethrix-gold px-8 py-3 text-sm uppercase tracking-widest hover:bg-aethrix-gold hover:text-black transition-all">
                    Return to World
                  </button>
                </div>
              ) : nodeId === 'world_hub' ? (
                <button onClick={onOpenWorld}
                  className="w-full bg-aethrix-gold text-black font-black uppercase tracking-widest py-4 hover:bg-white transition-all">
                  Open World Map →
                </button>
              ) : (
                availableChoices.map((choice, i) => (
                  <motion.button key={choice.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.2 }}
                    onClick={() => onChoice(choice, choice.nextNodeId)}
                    className="w-full text-left border border-gray-700 p-4 hover:border-aethrix-gold hover:bg-white/5 transition-all group">
                    <span className="text-aethrix-gold mr-3 group-hover:text-white">[{i + 1}]</span>
                    <span className="text-sm">{choice.text}</span>
                    {choice.effect.aethReward && (
                      <span className="ml-2 text-[10px] text-aethrix-gold">+{choice.effect.aethReward} AETH</span>
                    )}
                    {choice.effect.goldReward && (
                      <span className="ml-2 text-[10px] text-yellow-600">+{choice.effect.goldReward} Gold</span>
                    )}
                  </motion.button>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        ) : (
          <button onClick={skip} className="text-gray-600 text-[10px] uppercase hover:text-gray-400">
            [Skip]
          </button>
        )}
      </div>
    </div>
  );
}
