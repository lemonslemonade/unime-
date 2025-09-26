import React, { useMemo } from 'react';

interface SecurityScoreCircleProps {
    score: number;
}

const SecurityScoreCircle: React.FC<SecurityScoreCircleProps> = ({ score }) => {
    const size = 88;
    const strokeWidth = 9;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const scoreColorClass = useMemo(() => {
        if (score === 100) return 'text-brand-success';
        if (score >= 75) return 'text-yellow-500';
        return 'text-brand-danger';
    }, [score]);

    const strokeColorClass = useMemo(() => {
        if (score === 100) return 'stroke-brand-success';
        if (score >= 75) return 'stroke-yellow-500';
        return 'stroke-brand-danger';
    }, [score]);

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <circle
                    className="stroke-gray-200"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={`${strokeColorClass} transition-all duration-1000 ease-out`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                    }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                 <span className={`text-2xl font-bold ${scoreColorClass}`}>
                    {score}
                </span>
                <span className="text-xs text-gray-500 -mt-1">Score</span>
            </div>
        </div>
    );
};

export default SecurityScoreCircle;