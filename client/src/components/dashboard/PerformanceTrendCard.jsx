import React from 'react';
import { Card } from '../common/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useSelector } from 'react-redux';

export const PerformanceTrendCard = () => {
  // Use history data if it was passed via props or available in Redux
  const user = useSelector((state) => state.auth.user);
  
  // Since we don't have direct access to `history` from props here without passing it down,
  // we could optionally use Redux or fetch it. For now, we assume `history` is accessible
  // or passed down. Actually, we'll export a component that expects `history` as a prop.
  return null;
};

export const PerformanceTrendContent = ({ history = [] }) => {
  const recentExams = history.slice(0, 5).reverse(); // Get last 5 exams, chronologically
  
  // Calculate trend
  let improvement = 0;
  let trendDirection = 'flat';
  
  if (recentExams.length >= 2) {
    const latest = recentExams[recentExams.length - 1].score || 0;
    const previous = recentExams[recentExams.length - 2].score || 0;
    improvement = latest - previous;
    trendDirection = improvement > 0 ? 'up' : improvement < 0 ? 'down' : 'flat';
  }

  const renderTrendIcon = () => {
    if (trendDirection === 'up') return <TrendingUp className="h-4 w-4 text-primary" />;
    if (trendDirection === 'down') return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-text-secondary" />;
  };
  
  const getTrendColor = () => {
    if (trendDirection === 'up') return 'text-primary';
    if (trendDirection === 'down') return 'text-red-500';
    return 'text-text-secondary';
  };

  // Simple SVG Chart Generation
  // Graph bounds: y from 0 to 100, x from 0 to width
  const svgWidth = 200;
  const svgHeight = 100;
  
  // Create points for polyline
  let pointsStr = '';
  const xStep = recentExams.length > 1 ? svgWidth / (recentExams.length - 1) : svgWidth;
  
  const points = recentExams.map((exam, idx) => {
    const x = idx * xStep;
    // Invert Y axis (SVG 0 is top)
    const y = svgHeight - ((exam.score || 0) / 100) * svgHeight;
    return { x, y, score: exam.score || 0 };
  });

  if (points.length > 0) {
    pointsStr = points.map(p => `${p.x},${p.y}`).join(' ');
  }

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span>PERFORMANCE TREND</span>
        </div>
      } 
      className="h-full flex flex-col"
    >
      <div className="flex flex-col h-full mt-2">
        <p className="text-sm font-medium text-text-secondary mb-4">Your last {recentExams.length || 5} exams</p>
        
        {recentExams.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-sm text-text-secondary">
            No exam history yet.
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-end relative h-32 mb-4">
            <svg 
              width="100%" 
              height="100%" 
              viewBox={`-10 -10 ${svgWidth + 20} ${svgHeight + 20}`} 
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              {/* Grid Lines */}
              {[25, 50, 75, 100].map(val => (
                <line 
                  key={val}
                  x1="0" 
                  y1={svgHeight - (val / 100) * svgHeight} 
                  x2={svgWidth} 
                  y2={svgHeight - (val / 100) * svgHeight} 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Line */}
              {points.length > 1 && (
                <polyline 
                  points={pointsStr} 
                  fill="none" 
                  stroke="currentColor" 
                  className="text-primary"
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
              )}
              
              {/* Points */}
              {points.map((p, idx) => (
                <g key={idx}>
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r="4" 
                    className="fill-surface stroke-primary" 
                    strokeWidth="2" 
                  />
                  <text 
                    x={p.x} 
                    y={p.y - 10} 
                    fontSize="10" 
                    fill="currentColor" 
                    textAnchor="middle"
                    className="text-text-secondary"
                  >
                    {p.score}%
                  </text>
                  <text 
                    x={p.x} 
                    y={svgHeight + 15} 
                    fontSize="10" 
                    fill="currentColor" 
                    textAnchor="middle"
                    className="text-text-secondary uppercase"
                  >
                    E{idx + 1}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-hair flex items-center gap-2">
          {renderTrendIcon()}
          <span className={`text-sm font-bold ${getTrendColor()}`}>
            {Math.abs(improvement)}% {trendDirection === 'up' ? 'improvement' : trendDirection === 'down' ? 'decline' : 'no change'}
          </span>
        </div>
      </div>
    </Card>
  );
};
