import React from 'react';

const Background = ({ children, variant = 'rink' }) => {
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'rink':
        return {
          background: `
            radial-gradient(circle at 20% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(14, 165, 233, 0.05) 0%, transparent 50%),
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)
          `,
        };
      case 'ice':
        return {
          background: `
            linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)
          `,
        };
      case 'dark':
        return {
          background: `
            radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #1e293b 0%, #0f172a 100%)
          `,
        };
      default:
        return {
          background: '#f8fafc',
        };
    }
  };

  const RinkLines = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Center ice circle */}
      <div 
        className="absolute border border-blue-200/30 rounded-full"
        style={{
          width: '200px',
          height: '200px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Center line */}
      <div 
        className="absolute bg-blue-200/20 h-full w-px"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />
      
      {/* Face-off circles */}
      <div 
        className="absolute border border-blue-200/20 rounded-full"
        style={{
          width: '120px',
          height: '120px',
          top: '30%',
          left: '25%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div 
        className="absolute border border-blue-200/20 rounded-full"
        style={{
          width: '120px',
          height: '120px',
          top: '30%',
          right: '25%',
          transform: 'translate(50%, -50%)',
        }}
      />
      <div 
        className="absolute border border-blue-200/20 rounded-full"
        style={{
          width: '120px',
          height: '120px',
          bottom: '30%',
          left: '25%',
          transform: 'translate(-50%, 50%)',
        }}
      />
      <div 
        className="absolute border border-blue-200/20 rounded-full"
        style={{
          width: '120px',
          height: '120px',
          bottom: '30%',
          right: '25%',
          transform: 'translate(50%, 50%)',
        }}
      />
    </div>
  );

  return (
    <div 
      className="min-h-screen relative"
      style={getBackgroundStyle()}
    >
      {variant === 'rink' && <RinkLines />}
      
      {/* Ice texture overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(14, 165, 233, 0.15) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px',
        }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default Background;