import { useRef, useImperativeHandle, forwardRef } from 'react';

interface SignatureCanvasProps {
  onSignatureChange?: (signature: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

export interface SignatureCanvasRef {
  clear: () => void;
  getSignature: () => string;
  isEmpty: () => boolean;
}

const SignatureCanvas = forwardRef<SignatureCanvasRef, SignatureCanvasProps>(
  ({ onSignatureChange, width = 400, height = 200, className = '' }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);

    useImperativeHandle(ref, () => ({
      clear: () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            onSignatureChange?.('');
          }
        }
      },
      getSignature: () => {
        const canvas = canvasRef.current;
        return canvas ? canvas.toDataURL() : '';
      },
      isEmpty: () => {
        const canvas = canvasRef.current;
        if (!canvas) return true;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return true;
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        return !imageData.data.some(channel => channel !== 0);
      }
    }));

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      isDrawingRef.current = true;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';
      }
    };

    const stopDrawing = () => {
      if (isDrawingRef.current) {
        isDrawingRef.current = false;
        const canvas = canvasRef.current;
        if (canvas) {
          onSignatureChange?.(canvas.toDataURL());
        }
      }
    };

    return (
      <div className={`border-2 border-dashed border-gray-300 rounded-lg ${className}`}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="cursor-crosshair bg-white rounded-lg"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    );
  }
);

SignatureCanvas.displayName = 'SignatureCanvas';

export default SignatureCanvas;
