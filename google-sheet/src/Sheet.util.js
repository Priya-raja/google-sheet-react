export const calculateRowAndColumnsToDisplay =(size, visibleArea) =>{

    const visible = []
    const start =[]
    const end = []

    let idx = 0;
    let nextStart = 0

    while( nextStart  < visibleArea)
    {
        visible.push(idx) 
        start.push(nextStart) //cell starts with 0 index.. then u add size of 100 --> next columns ends at 100
        end.push(nextStart + size)

        idx++
        nextStart += size
        
    }
return { visible , start, end};
}

export const resizeCanvas = (canvas) => {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  
//   // Set CSS size
//   canvas.style.width = rect.width + 'px';
//   canvas.style.height = rect.height + 'px';

}