"use client";

import { useEffect, useRef } from "react";
import styles from "../layout.module.css";

interface MeshNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isControlNode: boolean;
}

export default function ClusterMeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const pointer = {
      x: -9999,
      y: -9999,
      active: false,
    };

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let nodes: MeshNode[] = [];

    function createNodes() {
      const area = width * height;
      const count = Math.min(54, Math.max(22, Math.floor(area / 32000)));
      nodes = Array.from({ length: count }, (_, idx) => {
        const speed = 0.16 + Math.random() * 0.22;
        const angle = Math.random() * Math.PI * 2;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: idx % 6 === 0 ? 2.1 : 1.35,
          isControlNode: idx % 6 === 0,
        };
      });
    }

    function resize() {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createNodes();
    }

    function drawFrame() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      const maxLinkDist = 160;
      const maxPointerDist = 200;

      if (pointer.active) {
        const gradient = ctx.createRadialGradient(
          pointer.x,
          pointer.y,
          0,
          pointer.x,
          pointer.y,
          240
        );
        gradient.addColorStop(0, "rgba(139, 224, 201, 0.055)");
        gradient.addColorStop(0.5, "rgba(56, 189, 248, 0.02)");
        gradient.addColorStop(1, "rgba(13, 18, 25, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      if (!reducedMotionQuery.matches) {
        for (const node of nodes) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < -20) node.x = width + 20;
          if (node.x > width + 20) node.x = -20;
          if (node.y < -20) node.y = height + 20;
          if (node.y > height + 20) node.y = -20;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxLinkDist * maxLinkDist) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxLinkDist) * 0.16;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139, 224, 201, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }

        if (pointer.active) {
          const pdx = pointer.x - a.x;
          const pdy = pointer.y - a.y;
          const pDistSq = pdx * pdx + pdy * pdy;

          if (pDistSq < maxPointerDist * maxPointerDist) {
            const pDist = Math.sqrt(pDistSq);
            const alpha = (1 - pDist / maxPointerDist) * 0.28;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.strokeStyle = `rgba(139, 224, 201, ${alpha.toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      for (const node of nodes) {
        if (node.isControlNode) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 3.2, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(139, 224, 201, 0.14)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = node.isControlNode
          ? "rgba(139, 224, 201, 0.48)"
          : "rgba(173, 185, 201, 0.32)";
        ctx.fill();
      }

      if (!reducedMotionQuery.matches && !document.hidden) {
        animationId = requestAnimationFrame(drawFrame);
      }
    }

    function handleMouseMove(event: MouseEvent) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    }

    function handleMouseLeave() {
      pointer.active = false;
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else if (!reducedMotionQuery.matches) {
        cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(drawFrame);
      }
    }

    resize();
    drawFrame();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseout", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.clusterCanvas} aria-hidden="true" />;
}
