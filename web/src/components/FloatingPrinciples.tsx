'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import principlesData from '@/data/principles.json';
import sourcesData from '@/data/sources.json';

interface Principle {
  id: string;
  title: string;
  description: string;
  readings: string[];
}

interface Source {
  id: string;
  title: string;
  author: string;
}

interface PrincipleState {
  id: string;
  x: number; // percentage position
  y: number; // percentage position
  vx: number; // velocity in x direction (% per second)
  vy: number; // velocity in y direction (% per second)
}

interface Connection {
  from: { x: number; y: number };
  to: { x: number; y: number };
  strength: number; // 0-1 based on distance
}

export function FloatingPrinciples() {
  const [expandedPrinciple, setExpandedPrinciple] = useState<string | null>(null);
  const principles: Principle[] = principlesData.principles;
  const sources: Source[] = sourcesData.sources;

  // Animation constants
  const BASE_SPEED = 10; // % per second - slightly faster initial movement
  const BOUNDARY_MARGIN = 8; // margin from edges (%)
  const COLLISION_FORCE = 50; // stronger repulsion strength to prevent overlapping
  const MIN_DISTANCE = 10; // minimum distance between elements (%)
  const FRICTION = 0.8; // friction coefficient (0.98 = 2% speed reduction per frame)
  const MIN_SPEED = 5; // minimum speed before friction stops applying
  
  // Connection line constants
  const MAX_CONNECTION_DISTANCE = 30; // maximum distance for visible connections (%)
  const MAX_CONNECTIONS_PER_PILL = 3; // limit connections per pill
  const CONNECTION_OPACITY = 0.3; // maximum opacity for connection lines

  // Convert HSL to RGB for canvas rendering
  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    
    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  };

  const getSourceById = (id: string): Source | undefined => {
    return sources.find(source => source.id === id);
  };

  const handlePrincipleClick = (principleId: string) => {
    setExpandedPrinciple(expandedPrinciple === principleId ? null : principleId);
  };

  const handleBackgroundClick = () => {
    setExpandedPrinciple(null);
  };

  // Calculate connections between nearby pills
  const calculateConnections = useCallback((states: PrincipleState[]): Connection[] => {
    const connections: Connection[] = [];
    
    states.forEach((state, index) => {
      const distances: Array<{ distance: number; otherState: PrincipleState; otherIndex: number }> = [];
      
      // Calculate distances to all other pills
      states.forEach((otherState, otherIndex) => {
        if (index === otherIndex) return;
        
        const dx = state.x - otherState.x;
        const dy = state.y - otherState.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= MAX_CONNECTION_DISTANCE) {
          distances.push({ distance, otherState, otherIndex });
        }
      });
      
      // Sort by distance and take closest ones
      distances.sort((a, b) => a.distance - b.distance);
      const closestConnections = distances.slice(0, MAX_CONNECTIONS_PER_PILL);
      
      // Create connections
      closestConnections.forEach(({ distance, otherState }) => {
        const strength = 1 - (distance / MAX_CONNECTION_DISTANCE);
        connections.push({
          from: { x: state.x, y: state.y },
          to: { x: otherState.x, y: otherState.y },
          strength
        });
      });
    });
    
    return connections;
  }, [MAX_CONNECTION_DISTANCE, MAX_CONNECTIONS_PER_PILL]);

  // State for connections
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize animated state with random positions and velocities
  const [principleStates, setPrincipleStates] = useState<PrincipleState[]>(() => {
    return principles.map((principle, index) => {
      // Use seeded random for initial positions (same as before)
      const seed = index * 123.456;
      const x = ((Math.sin(seed) + 1) / 2) * (100 - 2 * BOUNDARY_MARGIN) + BOUNDARY_MARGIN;
      const y = ((Math.cos(seed * 1.3) + 1) / 2) * (100 - 2 * BOUNDARY_MARGIN) + BOUNDARY_MARGIN;
      
      // Random initial velocity
      const angle = Math.random() * 2 * Math.PI;
      const speed = BASE_SPEED * (0.5 + Math.random() * 0.5); // vary speed slightly
      
      return {
        id: principle.id,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      };
    });
  });

  // Animation loop with collision detection
  useEffect(() => {
    let animationId: number;
    let lastTime = 0;

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;

      setPrincipleStates(prevStates => {
        const newStates = prevStates.map((state, index) => {
          let newX = state.x;
          let newY = state.y;
          let newVx = state.vx;
          let newVy = state.vy;

          // Apply collision avoidance with other elements
          prevStates.forEach((otherState, otherIndex) => {
            if (index === otherIndex) return;

            const dx = state.x - otherState.x;
            const dy = state.y - otherState.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < MIN_DISTANCE && distance > 0) {
              // Inverse square law repulsion (more realistic physics)
              const force = COLLISION_FORCE / (distance * distance);
              const fx = (dx / distance) * force;
              const fy = (dy / distance) * force;
              
              newVx += fx * deltaTime;
              newVy += fy * deltaTime;
            }
          });

          // Apply friction to slow down movement gradually
          const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
          if (currentSpeed > MIN_SPEED) {
            newVx *= FRICTION;
            newVy *= FRICTION;
          }

          // Apply velocity to position
          newX += newVx * deltaTime;
          newY += newVy * deltaTime;

          // Boundary collision detection - bounce off edges
          if (newX < BOUNDARY_MARGIN) {
            newX = BOUNDARY_MARGIN;
            newVx = Math.abs(newVx); // bounce off left edge
          } else if (newX > 100 - BOUNDARY_MARGIN) {
            newX = 100 - BOUNDARY_MARGIN;
            newVx = -Math.abs(newVx); // bounce off right edge
          }

          if (newY < BOUNDARY_MARGIN) {
            newY = BOUNDARY_MARGIN;
            newVy = Math.abs(newVy); // bounce off top edge
          } else if (newY > 100 - BOUNDARY_MARGIN) {
            newY = 100 - BOUNDARY_MARGIN;
            newVy = -Math.abs(newVy); // bounce off bottom edge
          }

          return {
            ...state,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        });
        
        // Calculate connections for the new states
        const newConnections = calculateConnections(newStates);
        
        // Draw connections on canvas
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Get accent color from CSS custom property
            const computedStyle = getComputedStyle(document.documentElement);
            const accent1Color = computedStyle.getPropertyValue('--accent1').trim();
            
            // Draw connections
            newConnections.forEach(connection => {
              const opacity = connection.strength * CONNECTION_OPACITY;
              // Convert HSL to RGB for canvas
              const hslMatch = accent1Color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
              if (hslMatch) {
                const [, h, s, l] = hslMatch.map(Number);
                const rgb = hslToRgb(h, s / 100, l / 100);
                ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
              } else {
                // Fallback to accent1 color with opacity
                ctx.strokeStyle = accent1Color;
              }
              ctx.lineWidth = 1 + connection.strength * 2; // 1-3px thickness
              ctx.beginPath();
              ctx.moveTo(
                (connection.from.x / 100) * canvas.width,
                (connection.from.y / 100) * canvas.height
              );
              ctx.lineTo(
                (connection.to.x / 100) * canvas.width,
                (connection.to.y / 100) * canvas.height
              );
              ctx.stroke();
            });
          }
        }
        
        return newStates;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [BASE_SPEED, BOUNDARY_MARGIN, COLLISION_FORCE, MIN_DISTANCE, FRICTION, MIN_SPEED]);

  return (
    <section className="py-20 relative overflow-hidden min-h-[600px] bg-gradient-to-b from-transparent to-background/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Ideas I'm interested in</h2>
        </div>
      </div>

      {/* Floating Principles Container */}
      <div 
        className="relative w-full h-[500px] cursor-pointer"
        onClick={handleBackgroundClick}
      >
        {/* Connection Lines Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          width={800}
          height={500}
          style={{ width: '100%', height: '100%' }}
        />
        {principles.map((principle, index) => {
          const isExpanded = expandedPrinciple === principle.id;
          const state = principleStates[index];
          
          return (
            <div
              key={principle.id}
              className="absolute group will-change-transform"
              style={{
                left: `${state.x}%`,
                top: `${state.y}%`,
                transform: 'translate(-50%, -50%)', // Center the element
                transition: 'transform 0.1s ease-out'
              }}
              onClick={(e) => {
                e.stopPropagation();
                handlePrincipleClick(principle.id);
              }}
            >
              {/* Principle Title */}
              <div className={`
                floating-principle-title
                px-4 py-3 rounded-xl
                bg-white/90 dark:bg-black/90 backdrop-blur-sm
                border-2 border-accent1-200/50
                hover:border-accent1-400 hover:bg-accent1/10
                transition-all duration-300
                cursor-pointer
                shadow-lg
                ${isExpanded ? 'bg-accent1/20 border-accent1-400 shadow-xl' : ''}
              `}>
                <h3 className="text-sm sm:text-base font-semibold text-foreground whitespace-nowrap">
                  {principle.title}
                </h3>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="absolute top-full left-0 mt-3 w-80 sm:w-96 z-20">
                  <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm rounded-xl p-5 border-2 border-accent1-200/50 shadow-xl">
                    <p className="text-sm text-foreground/90 mb-4 leading-relaxed">
                      {principle.description}
                    </p>
                    
                    {principle.readings.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-accent1 mb-3 uppercase tracking-wide">Readings:</h4>
                        <ul className="space-y-2">
                          {principle.readings.map((readingId) => {
                            const source = getSourceById(readingId);
                            return source ? (
                              <li key={readingId} className="text-xs text-foreground/80">
                                <span className="font-semibold">{source.title}</span>
                                <span className="text-foreground/60"> by {source.author}</span>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}