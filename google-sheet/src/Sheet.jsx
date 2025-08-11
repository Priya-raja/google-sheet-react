import React,{useRef,useState, useEffect} from 'react'
import {calculateRowAndColumnsToDisplay, resizeCanvas} from './Sheet.util'

export const Sheet = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const cellWidth = 100;
  const cellHeight = 22;

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate visible cells based on current dimensions
  const { visible: visibleColumns, start: columnStart, end: columnEnd } = 
    calculateRowAndColumnsToDisplay(cellWidth, dimensions.width);
  const { visible: visibleRows, start: rowStart, end: rowEnd } = 
    calculateRowAndColumnsToDisplay(cellHeight, dimensions.height);

  console.log("columns", visibleColumns.length, columnStart, columnEnd);
  console.log("rows", visibleRows.length, rowStart, rowEnd);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    resizeCanvas(canvas);

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set line style
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;

    // Draw columns
    let startX = 0;
    for (const col of visibleColumns) {
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX, dimensions.height);
      ctx.stroke();
      startX += cellWidth;
    }

    // Draw rows
    let startY = 0;
    for (const row of visibleRows) {
      ctx.beginPath();
      ctx.moveTo(0, startY);
      ctx.lineTo(dimensions.width, startY);
      ctx.stroke();
      startY += cellHeight;
    }

    // Draw final border lines
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX, dimensions.height);
    ctx.moveTo(0, startY);
    ctx.lineTo(dimensions.width, startY);
    ctx.stroke();

  }, [dimensions, visibleColumns, visibleRows]);

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <canvas 
        ref={canvasRef} 
        style={{ 
          height: '100%', 
          width: '100%',
          display: 'block'
        }} 
      />
    </div>
  );
};