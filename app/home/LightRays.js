'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

export default function LightRays({
  raysOrigin = 'top-center',
  raysColor = '#ffffff',
  raysSpeed = 1,
  lightSpread = 0.5,
  rayLength = 1.0,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = false,
  mouseInfluence = 0.5,
  noiseAmount = 0.0,
  distortion = 0.0,
  className = '',
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new Renderer({ canvas, alpha: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    // Parse hex color to RGB
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
          }
        : { r: 1, g: 1, b: 1 };
    };

    const color = hexToRgb(raysColor);

    // Calculate origin position based on raysOrigin
    const getOriginPosition = () => {
      const origins = {
        'top-center': [0.5, 1.0],
        'top-left': [0.0, 1.0],
        'top-right': [1.0, 1.0],
        'right': [1.0, 0.5],
        'left': [0.0, 0.5],
        'bottom-center': [0.5, 0.0],
        'bottom-right': [1.0, 0.0],
        'bottom-left': [0.0, 0.0],
      };
      return origins[raysOrigin] || [0.5, 1.0];
    };

    const origin = getOriginPosition();

    // Shader code
    const vertex = /* glsl */ `
      attribute vec2 position;
      attribute vec2 uv;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 0, 1);
      }
    `;

    const fragment = /* glsl */ `
      precision highp float;
      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uOrigin;
      uniform vec3 uColor;
      uniform float uSpeed;
      uniform float uSpread;
      uniform float uRayLength;
      uniform float uFadeDistance;
      uniform float uSaturation;
      uniform vec2 uMouse;
      uniform float uMouseInfluence;
      uniform float uNoiseAmount;
      uniform float uDistortion;
      uniform bool uPulsating;
      varying vec2 vUv;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = vUv;
        vec2 st = (gl_FragCoord.xy / uResolution.xy);
        
        // Apply distortion
        if (uDistortion > 0.0) {
          st.x += sin(st.y * 10.0 + uTime * 0.5) * uDistortion * 0.1;
          st.y += cos(st.x * 10.0 + uTime * 0.5) * uDistortion * 0.1;
        }

        vec2 origin = uOrigin;
        
        // Mouse influence
        if (uMouseInfluence > 0.0) {
          origin = mix(origin, uMouse, uMouseInfluence);
        }

        vec2 dir = st - origin;
        float dist = length(dir);
        float angle = atan(dir.y, dir.x);

        // Create rays
        float rayPattern = sin(angle * 20.0 / uSpread + uTime * uSpeed) * 0.5 + 0.5;
        
        // Add noise
        if (uNoiseAmount > 0.0) {
          rayPattern += noise(st * 10.0 + uTime * 0.1) * uNoiseAmount;
        }

        // Pulsating effect
        float pulse = 1.0;
        if (uPulsating) {
          pulse = sin(uTime * 2.0) * 0.2 + 0.8;
        }

        // Calculate intensity
        float intensity = rayPattern * pulse;
        intensity *= smoothstep(uRayLength, 0.0, dist);
        intensity *= smoothstep(0.0, uFadeDistance * 0.1, dist);

        // Apply color and saturation
        vec3 finalColor = mix(vec3(intensity), uColor * intensity, uSaturation);
        float alpha = intensity * 0.6;

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    // Create geometry
    const geometry = new Triangle(gl);

    // Create program
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [canvas.width, canvas.height] },
        uOrigin: { value: origin },
        uColor: { value: [color.r, color.g, color.b] },
        uSpeed: { value: raysSpeed },
        uSpread: { value: lightSpread },
        uRayLength: { value: rayLength },
        uFadeDistance: { value: fadeDistance },
        uSaturation: { value: saturation },
        uMouse: { value: [mouseRef.current.x, mouseRef.current.y] },
        uMouseInfluence: { value: followMouse ? mouseInfluence : 0 },
        uNoiseAmount: { value: noiseAmount },
        uDistortion: { value: distortion },
        uPulsating: { value: pulsating },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });

    // Handle mouse movement
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1.0 - (e.clientY - rect.top) / rect.height,
      };
    };

    if (followMouse) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    // Handle resize
    const handleResize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;
      program.uniforms.uTime.value = time;
      if (followMouse) {
        program.uniforms.uMouse.value = [mouseRef.current.x, mouseRef.current.y];
      }
      renderer.render({ scene: mesh });
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      if (followMouse) {
        canvas.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
