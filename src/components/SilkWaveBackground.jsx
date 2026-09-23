import React, { useEffect, useRef } from "react";
import "../styles/silk-waves.css";

/**
 * SilkWaveBackground Component
 * 
 * Hyper-realistic, luxury flowing pink silk ribbons background with glowing neon filaments.
 * Renders fluid, continuously moving, undulating silk waves on Canvas at 60 FPS.
 * 
 * @param {boolean} animated - Enables continuous dynamic wave motion (default: true)
 * @param {string} className - Optional container styling classes
 * @param {boolean} fullscreen - When true, fixes to viewport (fixed, full screen, z-index -1)
 * @param {string} opacity - Opacity value (default: '0.55')
 * @param {boolean} showShimmer - Toggles the subtle light shimmer overlay
 * @param {number} speed - Motion speed multiplier (default: 1)
 */
const SilkWaveBackground = ({
  animated = true,
  className = "",
  fullscreen = true,
  opacity = "0.3",
  showShimmer = true,
  speed = 1,
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;
    let time = 0;

    // Handle high DPI displays and window resize
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Multi-harmonic wave curve generator
    const getWaveY = (x, baseY, amplitudes, frequencies, speeds, phaseOffsets, t) => {
      let y = baseY;
      for (let i = 0; i < amplitudes.length; i++) {
        y += amplitudes[i] * Math.sin(x * frequencies[i] + t * speeds[i] + phaseOffsets[i]);
      }
      return y;
    };

    // Draw a single flowing silk ribbon
    const drawSilkRibbon = (
      topParams,
      bottomParams,
      gradientColors,
      filamentConfig = null,
      t
    ) => {
      const steps = 80;
      const dx = width / steps;

      ctx.save();
      ctx.beginPath();

      // Top Curve Points
      const topPoints = [];
      for (let i = 0; i <= steps; i++) {
        const x = i * dx;
        const y = getWaveY(
          x,
          topParams.baseY * height,
          topParams.amplitudes.map((a) => a * height),
          topParams.frequencies.map((f) => f / width),
          topParams.speeds.map((s) => s * speed),
          topParams.phases,
          t
        );
        topPoints.push({ x, y });
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      // Bottom Curve Points (in reverse to close polygon)
      const bottomPoints = [];
      for (let i = steps; i >= 0; i--) {
        const x = i * dx;
        const y = getWaveY(
          x,
          bottomParams.baseY * height,
          bottomParams.amplitudes.map((a) => a * height),
          bottomParams.frequencies.map((f) => f / width),
          bottomParams.speeds.map((s) => s * speed),
          bottomParams.phases,
          t
        );
        bottomPoints.push({ x, y });
        ctx.lineTo(x, y);
      }

      ctx.closePath();

      // Fill with multi-stop linear gradient
      const grad = ctx.createLinearGradient(0, topParams.baseY * height, width, bottomParams.baseY * height);
      gradientColors.forEach(({ stop, color }) => {
        grad.addColorStop(stop, color);
      });
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();

      // Draw Glowing Neon Filament along the top crest
      if (filamentConfig) {
        ctx.save();
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const pt = topPoints[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }

        // Outer Neon Halo
        ctx.shadowColor = filamentConfig.glowColor || "#ff3399";
        ctx.shadowBlur = filamentConfig.glowBlur || 14;
        ctx.lineWidth = filamentConfig.width || 2;

        const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
        (filamentConfig.colors || [
          { stop: 0, color: "rgba(255, 255, 255, 0.9)" },
          { stop: 0.5, color: "rgba(255, 180, 220, 1)" },
          { stop: 1, color: "rgba(255, 255, 255, 0.85)" },
        ]).forEach(({ stop, color }) => strokeGrad.addColorStop(stop, color));

        ctx.strokeStyle = strokeGrad;
        ctx.stroke();

        // Inner Sharp Pure White Core
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#ffffff";
        ctx.lineWidth = Math.max(1, (filamentConfig.width || 2) * 0.5);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.stroke();

        ctx.restore();
      }
    };

    // Draw a standalone glowing filament strand
    const drawFilamentStrand = (params, config, t) => {
      const steps = 70;
      const dx = width / steps;

      ctx.save();
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const x = i * dx;
        const y = getWaveY(
          x,
          params.baseY * height,
          params.amplitudes.map((a) => a * height),
          params.frequencies.map((f) => f / width),
          params.speeds.map((s) => s * speed),
          params.phases,
          t
        );
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.shadowColor = config.glowColor || "#ff1477";
      ctx.shadowBlur = config.glowBlur || 12;
      ctx.lineWidth = config.width || 1.6;

      const strokeGrad = ctx.createLinearGradient(0, 0, width, 0);
      config.colors.forEach(({ stop, color }) => strokeGrad.addColorStop(stop, color));
      ctx.strokeStyle = strokeGrad;
      ctx.stroke();
      ctx.restore();
    };

    // Main 60 FPS Render Loop
    const render = () => {
      if (!ctx || width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      if (animated) {
        time += 0.015;
      }

      ctx.clearRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 1. Base Ambient Background Gradients
      // -------------------------------------------------------------
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, "#ffe8f2");
      bgGrad.addColorStop(0.25, "#ffb8d7");
      bgGrad.addColorStop(0.55, "#f5388c");
      bgGrad.addColorStop(0.85, "#b80052");
      bgGrad.addColorStop(1, "#5e0028");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Top-Left Soft Luminous Radial Glow
      const glowTopLeft = ctx.createRadialGradient(
        width * 0.2, height * 0.2, 0,
        width * 0.2, height * 0.2, width * 0.6
      );
      glowTopLeft.addColorStop(0, "rgba(255, 240, 248, 0.95)");
      glowTopLeft.addColorStop(0.4, "rgba(255, 180, 215, 0.5)");
      glowTopLeft.addColorStop(1, "rgba(255, 180, 215, 0)");
      ctx.fillStyle = glowTopLeft;
      ctx.fillRect(0, 0, width, height);

      // Center Vibrant Magenta Radial Glow
      const glowCenter = ctx.createRadialGradient(
        width * 0.55, height * 0.5, 0,
        width * 0.55, height * 0.5, width * 0.5
      );
      glowCenter.addColorStop(0, "rgba(255, 30, 130, 0.45)");
      glowCenter.addColorStop(0.6, "rgba(200, 0, 90, 0.2)");
      glowCenter.addColorStop(1, "rgba(200, 0, 90, 0)");
      ctx.fillStyle = glowCenter;
      ctx.fillRect(0, 0, width, height);

      // -------------------------------------------------------------
      // 2. LAYER 1: Deep Atmospheric Background Chiffon Veil (Slow, gentle)
      // -------------------------------------------------------------
      drawSilkRibbon(
        {
          baseY: 0.14,
          amplitudes: [0.06, 0.03, 0.02],
          frequencies: [3.5, 7.2, 1.8],
          speeds: [0.35, 0.5, 0.2],
          phases: [0.2, 1.5, 3.1],
        },
        {
          baseY: 0.38,
          amplitudes: [0.07, 0.04, 0.025],
          frequencies: [3.2, 6.8, 2.1],
          speeds: [0.3, 0.45, 0.25],
          phases: [0.8, 2.2, 0.5],
        },
        [
          { stop: 0, color: "rgba(255, 255, 255, 0.65)" },
          { stop: 0.3, color: "rgba(255, 200, 228, 0.45)" },
          { stop: 0.7, color: "rgba(245, 80, 150, 0.3)" },
          { stop: 1, color: "rgba(215, 20, 105, 0.1)" },
        ],
        {
          glowColor: "#ff99cc",
          glowBlur: 10,
          width: 1.6,
          colors: [
            { stop: 0, color: "rgba(255, 255, 255, 0.9)" },
            { stop: 0.5, color: "rgba(255, 210, 235, 0.85)" },
            { stop: 1, color: "rgba(255, 255, 255, 0.7)" },
          ],
        },
        time
      );

      // -------------------------------------------------------------
      // 3. LAYER 2: Upper Flowing Chiffon Wave
      // -------------------------------------------------------------
      drawSilkRibbon(
        {
          baseY: 0.26,
          amplitudes: [0.08, 0.04, 0.03],
          frequencies: [4.2, 8.5, 2.6],
          speeds: [0.45, 0.6, 0.3],
          phases: [1.1, 0.4, 2.8],
        },
        {
          baseY: 0.54,
          amplitudes: [0.09, 0.05, 0.035],
          frequencies: [3.8, 7.6, 2.2],
          speeds: [0.4, 0.55, 0.35],
          phases: [1.7, 1.2, 3.4],
        },
        [
          { stop: 0, color: "rgba(255, 220, 238, 0.7)" },
          { stop: 0.35, color: "rgba(255, 110, 175, 0.55)" },
          { stop: 0.75, color: "rgba(230, 20, 115, 0.4)" },
          { stop: 1, color: "rgba(160, 0, 70, 0.2)" },
        ],
        {
          glowColor: "#ffffff",
          glowBlur: 12,
          width: 2.2,
          colors: [
            { stop: 0, color: "rgba(255, 255, 255, 0.95)" },
            { stop: 0.4, color: "rgba(255, 230, 245, 1)" },
            { stop: 0.8, color: "rgba(255, 140, 195, 0.9)" },
            { stop: 1, color: "rgba(255, 255, 255, 0.85)" },
          ],
        },
        time
      );

      // -------------------------------------------------------------
      // 4. LAYER 3: Main Saturated Centerpiece Silk Ribbon Wave (Focal Wave)
      // -------------------------------------------------------------
      drawSilkRibbon(
        {
          baseY: 0.44,
          amplitudes: [0.11, 0.055, 0.035],
          frequencies: [3.6, 6.4, 2.4],
          speeds: [0.55, 0.7, 0.4],
          phases: [2.3, 0.9, 1.6],
        },
        {
          baseY: 0.78,
          amplitudes: [0.12, 0.06, 0.04],
          frequencies: [3.4, 6.0, 2.0],
          speeds: [0.5, 0.65, 0.35],
          phases: [2.9, 1.5, 2.2],
        },
        [
          { stop: 0, color: "rgba(255, 130, 185, 0.85)" },
          { stop: 0.25, color: "rgba(255, 36, 131, 0.8)" },
          { stop: 0.58, color: "rgba(220, 0, 103, 0.85)" },
          { stop: 0.85, color: "rgba(150, 0, 62, 0.75)" },
          { stop: 1, color: "rgba(75, 0, 30, 0.55)" },
        ],
        {
          glowColor: "#ff0077",
          glowBlur: 16,
          width: 2.8,
          colors: [
            { stop: 0, color: "rgba(255, 255, 255, 1)" },
            { stop: 0.3, color: "rgba(255, 240, 250, 1)" },
            { stop: 0.65, color: "rgba(255, 120, 185, 0.95)" },
            { stop: 1, color: "rgba(255, 255, 255, 0.9)" },
          ],
        },
        time
      );

      // -------------------------------------------------------------
      // 5. Delicate Mid-Wave Filament Strand
      // -------------------------------------------------------------
      drawFilamentStrand(
        {
          baseY: 0.52,
          amplitudes: [0.08, 0.04, 0.02],
          frequencies: [4.8, 9.2, 3.1],
          speeds: [0.65, 0.8, 0.45],
          phases: [3.4, 1.8, 0.6],
        },
        {
          glowColor: "#ffffff",
          glowBlur: 10,
          width: 1.8,
          colors: [
            { stop: 0, color: "rgba(255, 255, 255, 0.9)" },
            { stop: 0.5, color: "rgba(255, 190, 225, 0.95)" },
            { stop: 1, color: "rgba(255, 255, 255, 0.8)" },
          ],
        },
        time
      );

      // -------------------------------------------------------------
      // 6. LAYER 4: Lower Sinuous Silk Drape
      // -------------------------------------------------------------
      drawSilkRibbon(
        {
          baseY: 0.65,
          amplitudes: [0.09, 0.05, 0.03],
          frequencies: [3.9, 7.5, 2.5],
          speeds: [0.45, 0.6, 0.35],
          phases: [0.5, 2.7, 1.9],
        },
        {
          baseY: 0.92,
          amplitudes: [0.1, 0.055, 0.035],
          frequencies: [3.5, 6.9, 2.1],
          speeds: [0.4, 0.55, 0.3],
          phases: [1.1, 3.2, 2.4],
        },
        [
          { stop: 0, color: "rgba(255, 45, 135, 0.9)" },
          { stop: 0.35, color: "rgba(225, 10, 110, 0.85)" },
          { stop: 0.7, color: "rgba(170, 0, 75, 0.8)" },
          { stop: 1, color: "rgba(95, 0, 40, 0.65)" },
        ],
        {
          glowColor: "#ff2a8d",
          glowBlur: 14,
          width: 2.4,
          colors: [
            { stop: 0, color: "rgba(255, 255, 255, 0.95)" },
            { stop: 0.5, color: "rgba(255, 210, 235, 1)" },
            { stop: 1, color: "rgba(255, 255, 255, 0.85)" },
          ],
        },
        time
      );

      // -------------------------------------------------------------
      // 7. LAYER 5: Deep Saturated Base Foundation Wave (Bottom Rich Crimson)
      // -------------------------------------------------------------
      drawSilkRibbon(
        {
          baseY: 0.82,
          amplitudes: [0.07, 0.04, 0.025],
          frequencies: [3.3, 6.5, 2.0],
          speeds: [0.35, 0.5, 0.25],
          phases: [1.8, 0.3, 2.9],
        },
        {
          baseY: 1.08,
          amplitudes: [0.04, 0.02, 0.01],
          frequencies: [2.5, 5.0, 1.5],
          speeds: [0.25, 0.35, 0.2],
          phases: [2.2, 0.8, 3.4],
        },
        [
          { stop: 0, color: "rgba(255, 20, 120, 0.95)" },
          { stop: 0.3, color: "rgba(210, 0, 95, 0.92)" },
          { stop: 0.65, color: "rgba(155, 0, 65, 0.95)" },
          { stop: 1, color: "rgba(70, 0, 28, 0.98)" },
        ],
        {
          glowColor: "#ff0066",
          glowBlur: 12,
          width: 2.2,
          colors: [
            { stop: 0, color: "rgba(255, 255, 255, 0.9)" },
            { stop: 0.45, color: "rgba(255, 190, 225, 0.95)" },
            { stop: 1, color: "rgba(255, 255, 255, 0.85)" },
          ],
        },
        time
      );

      // -------------------------------------------------------------
      // 8. Deep Bottom Accent Filament
      // -------------------------------------------------------------
      drawFilamentStrand(
        {
          baseY: 0.89,
          amplitudes: [0.05, 0.025, 0.015],
          frequencies: [4.1, 7.8, 2.6],
          speeds: [0.4, 0.55, 0.3],
          phases: [2.5, 1.1, 3.7],
        },
        {
          glowColor: "#ff55aa",
          glowBlur: 10,
          width: 1.6,
          colors: [
            { stop: 0, color: "rgba(255, 255, 255, 0.85)" },
            { stop: 0.5, color: "rgba(255, 180, 220, 0.9)" },
            { stop: 1, color: "rgba(255, 255, 255, 0.75)" },
          ],
        },
        time
      );

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [animated, speed]);

  return (
    <div
      className={`silk-waves-container ${fullscreen ? "fullscreen" : ""} ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="silk-waves-canvas absolute top-0 left-0 w-full h-full block pointer-events-none"
      />
      {showShimmer && <div className="silk-shimmer-sheen" />}
    </div>
  );
};

export default SilkWaveBackground;
