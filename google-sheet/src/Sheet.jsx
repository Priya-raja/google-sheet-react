import React,{useRef,useState, useEffect} from 'react'
import {calculateRowAndColumnsToDisplay, resizeCanvas,getEncodedCharacter} from './Sheet.util'

export const Sheet = () => {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const cellWidth = 100;
  const cellHeight = 22;
  const rowHeaderHeight = 22
  const colHeaderWidth = 50


  const headerColor ='#e7eef5ff'


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
    calculateRowAndColumnsToDisplay(cellWidth, dimensions.width, colHeaderWidth);
  const { visible: visibleRows, start: rowStart, end: rowEnd } = 
    calculateRowAndColumnsToDisplay(cellHeight, dimensions.height,rowHeaderHeight);

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
    let startX = colHeaderWidth;
    for (const col of visibleColumns) {
      ctx.beginPath();
      ctx.moveTo(startX, rowHeaderHeight);
      ctx.lineTo(startX, dimensions.height);
      ctx.stroke();
      startX += cellWidth;
    }

    // Draw rows
    let startY = rowHeaderHeight;
    for (const row of visibleRows) {
      ctx.beginPath();
      ctx.moveTo(colHeaderWidth, startY);
      ctx.lineTo(dimensions.width, startY);
      ctx.stroke();
      startY += cellHeight;
    }

    //Draw row header lines
    
    startY = rowHeaderHeight;

    ctx.fillStyle = headerColor;
    ctx.fillRect(0,0,colHeaderWidth, canvas.height)
    for (const row of visibleRows) {
      ctx.beginPath();
      ctx.moveTo(0, startY);
      ctx.lineTo(colHeaderWidth, startY);
      ctx.stroke();
      startY += cellHeight;
    }

    //Draw column header lines
    startX = colHeaderWidth;
   
    ctx.fillRect(0,0,canvas.width,rowHeaderHeight )

    for (const col of visibleColumns) {
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX, rowHeaderHeight);
      ctx.stroke();
      startX += cellWidth;
    }

    // Draw final border lines
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX, dimensions.height);
    ctx.moveTo(0, startY);
    ctx.lineTo(dimensions.width, startY);
    ctx.stroke();

    //Write labels for columns
    startX = colHeaderWidth;

    ctx.textAlign= 'center';
    ctx.textBaseline = 'middle'
    ctx.font = "13px sans-serif"
    ctx.fillStyle="grey"

    for (const col of visibleColumns) {
      const centreX = startX + (cellWidth * 0.5)
      const centreY = rowHeaderHeight * 0.5

      const content= getEncodedCharacter(col);
      ctx.fillText(content, centreX, centreY)
      startX += cellWidth;
    } 

    //Write labels for rows

    startY = rowHeaderHeight;

    for (const row of visibleRows) {

     const centreX = colHeaderWidth * 0.5
    
      const centreY =  startY + (cellHeight * 0.5)

      const content= row + 1;
       ctx.fillText(content, centreX, centreY)

      startY += cellHeight;
    }

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