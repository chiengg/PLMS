import React, { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, GripVertical } from 'lucide-react';

interface FeatureMarkerProps {
  children: React.ReactNode;
  title?: string;
  description: React.ReactNode;
  requirementNumber?: number;
}

export function FeatureMarker({ children, title = '功能说明', description, requirementNumber }: FeatureMarkerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let tooltipX = rect.left - 450 + 8;
    let tooltipY = rect.bottom + 8;
    
    if (tooltipX < 10) tooltipX = 10;
    if (tooltipX + 450 > window.innerWidth - 10) tooltipX = window.innerWidth - 460;
    if (tooltipY + 400 > window.innerHeight - 10) tooltipY = rect.top - 408;
    
    setPos({ x: tooltipX, y: tooltipY });
    setIsOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!tooltipRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - tooltipRef.current.getBoundingClientRect().left,
      y: e.clientY - tooltipRef.current.getBoundingClientRect().top
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    let newX = e.clientX - dragOffset.x;
    let newY = e.clientY - dragOffset.y;
    
    if (newX < 10) newX = 10;
    if (newX + 450 > window.innerWidth - 10) newX = window.innerWidth - 460;
    if (newY < 10) newY = 10;
    if (newY + 400 > window.innerHeight - 10) newY = window.innerHeight - 410;
    
    setPos({ x: newX, y: newY });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      className="relative inline-flex" 
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <div 
        className="absolute -top-2 -right-2 w-5 h-5 bg-[rgb(250,173,20)] rounded-sm flex items-center justify-center shadow-sm cursor-pointer z-20"
        style={{ fontSize: '10px', fontWeight: 'bold', lineHeight: '14px', color: 'white', padding: '0 4px' }}
      >
        {requirementNumber || '?'}
      </div>
      
      {isOpen && createPortal(
        <div 
          ref={tooltipRef}
          className="fixed z-[9999] bg-[#f0efef] rounded-md shadow-lg w-[450px] overflow-hidden select-none"
          style={{ 
            left: pos.x, 
            top: pos.y,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#e8e7e7] cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown}>
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-amber-600">[{requirementNumber || '?'}]</span>
              <span className="text-[13px] font-bold text-gray-700">需求描述：{title}</span>
            </div>
            <div className="flex items-center gap-1">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <button 
                className="p-1 hover:bg-gray-300 rounded transition-colors"
                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
          <div className="border-t border-gray-300" />
          <div className="p-4 text-[13px] text-gray-700 leading-[1.6]" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {description}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
