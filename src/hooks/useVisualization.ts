import { useRef, useState, useCallback, useEffect } from 'react';
import type { Particle, ASTNode, ControlSettings, TokenType } from '../types';
import { tokenize, buildAST } from '../utils/codeParser';

const NODE_COLORS: Record<TokenType, string> = {
  keyword: '#FFD700',
  identifier: '#4FC3F7',
  string: '#66BB6A',
  number: '#FF8A65',
  operator: '#CE93D8',
  punctuation: '#B0BEC5',
  comment: '#78909C',
  whitespace: '#546E7A',
};

export function useVisualization(code: string, settings: ControlSettings) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [treeNodes, setTreeNodes] = useState<ASTNode[]>([]);

  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const treeNodesRef = useRef<ASTNode[]>([]);

  const generateParticles = useCallback(() => {
    const chars = code.split('').filter(ch => ch.trim().length > 0);
    const canvas = canvasRef.current;
    if (!canvas) return [];

    const newParticles: Particle[] = [];
    const width = canvas.width;
    const colors = Object.values(NODE_COLORS);

    for (let i = 0; i < Math.min(chars.length, 200); i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * -200,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.3 + Math.random() * 0.7,
        char: chars[i % chars.length],
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 10 + Math.random() * 10,
        opacity: 0.3 + Math.random() * 0.7,
        life: 0,
        maxLife: 200 + Math.random() * 300,
      });
    }
    return newParticles;
  }, [code]);

  const updateTreeNodes = useCallback(() => {
    const tokens = tokenize(code);
    const ast = buildAST(tokens);

    function flattenAST(node: ASTNode, depth: number, index: number, parentX?: number): ASTNode[] {
      const result: ASTNode[] = [];
      const x = parentX ? parentX + (index - 1) * 100 : 400 + index * 120;
      const y = depth * 80 + 50;

      const flatNode: ASTNode = {
        ...node,
        x,
        y,
        targetX: x,
        targetY: y,
        children: [],
      };

      result.push(flatNode);

      let childIndex = 0;
      for (const child of node.children) {
        const childNodes = flattenAST(child, depth + 1, childIndex, x);
        result.push(...childNodes);
        childIndex++;
      }

      return result;
    }

    const flattened = flattenAST(ast, 0, 0);
    setTreeNodes(flattened);
    treeNodesRef.current = flattened;
  }, [code]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = 'rgba(13, 17, 23, 0.95)';
    ctx.fillRect(0, 0, width, height);

    // Draw tree edges
    const nodes = treeNodesRef.current;
    ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
    ctx.lineWidth = 1;

    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const dx = (node.x ?? 0);
          const dy = (node.y ?? 0);
          const cx = (child.targetX ?? child.x ?? 0);
          const cy = (child.targetY ?? child.y ?? 0);
          // Store edge info in the node for later drawing
          ctx.beginPath();
          ctx.moveTo(dx, dy);
          ctx.lineTo(cx, cy);
          ctx.stroke();
        }
      }
    }

    // Smooth move nodes toward targets
    for (const node of nodes) {
      if (node.targetX !== undefined && node.x !== undefined) {
        node.x += ((node.targetX - node.x) * 0.1);
      }
      if (node.targetY !== undefined && node.y !== undefined) {
        node.y += ((node.targetY - node.y) * 0.1);
      }
    }

    // Draw nodes
    for (const node of nodes) {
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const color = NODE_COLORS[node.type] || '#888';

      // Node circle
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#fff';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(node.name || node.type, x, y - 14);
    }

    // Draw particles if playing
    if (isPlaying && settings.showParticles) {
      const parts = particlesRef.current;
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life++;
        p.y += p.vy * settings.animationSpeed;
        p.x += p.vx * settings.animationSpeed * 0.5;
        p.opacity = Math.max(0, 1 - p.life / p.maxLife);

        if (p.life >= p.maxLife || p.y > height + 20) {
          // Respawn at top
          p.y = -20;
          p.x = Math.random() * width;
          p.life = 0;
          p.opacity = 0.7;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px "JetBrains Mono", monospace`;
        ctx.fillText(p.char, p.x, p.y);
      }
      ctx.globalAlpha = 1;
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, [isPlaying, settings]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => {
      const next = !prev;
      if (next) {
        const newParticles = generateParticles();
        particlesRef.current = newParticles;
        setParticles(newParticles);
      }
      return next;
    });
  }, [generateParticles]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    particlesRef.current = [];
    setParticles([]);
    updateTreeNodes();
  }, [updateTreeNodes]);

  // Start/stop animation loop
  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [animate]);

  // Update AST when code changes
  useEffect(() => {
    updateTreeNodes();
  }, [updateTreeNodes]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight || 500;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    canvasRef,
    isPlaying,
    togglePlay,
    reset,
    particles,
    treeNodes,
  };
}
