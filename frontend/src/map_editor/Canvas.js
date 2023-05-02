import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { handleDrawing } from './buttons_hendlers/Drawing';
import './Canvas.css'

function FabricCanvas() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedObject, setSelectedObject] = useState(null);
  const [canvasObjects, setCanvasObjects] = useState([]);
  const [isDoubleSided, setIsDoubleSided] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(1);
  const [canvasPosition, setCanvasPosition] = useState({ x: 0, y: 0});

  const setAllFalse = () => {
    setIsDrawing(false);
    setIsSelecting(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const fabricCanvas = new fabric.Canvas(canvas, {
      backgroundColor: 'green',
      selection: false,
      height: window.innerHeight,
      width: window.innerWidth,
    });

    canvasObjects.forEach((obj) => {
      fabricCanvas.add(obj);
    });

    fabricCanvas.setZoom(canvasZoom);
    fabricCanvas.relativePan({x: canvasPosition.x ,y: canvasPosition.y});

    if (isDrawing) {
      handleDrawing(fabricCanvas, canvasObjects, setCanvasObjects, isDoubleSided);
    } else if (isSelecting) {

    }

    fabricCanvas.on('mouse:wheel', (opt) => {
      var delta = opt.e.deltaY;
      var zoom = fabricCanvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 10) zoom = 10;
      if (zoom < 0.1) zoom = 0.1;
      fabricCanvas.zoomToPoint(fabricCanvas.getPointer(),zoom);
      setCanvasZoom(zoom);
      setCanvasPosition({ x: fabricCanvas.viewportTransform[4], y: fabricCanvas.viewportTransform[5] });
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });

    return () => {
      fabricCanvas.dispose();
    };

  }, [isDrawing, isSelecting, isDoubleSided, canvasObjects,]);

  const handleDrawButtonClick = (event) => {
    event.preventDefault();
    setIsSelecting(false);
    setIsDrawing(true);
  };

  const handleSelectButtonClick = (event) => {
    event.preventDefault();
    setIsDrawing(false);
    setIsSelecting(true);
  };

  const handleInputChange = (event) => {
    setSelectedObject(event.target.value);
  };

  const handleDoubleSidedCheckboxChange = (event) => {
    setIsDoubleSided(event.target.checked);
  };

  return (
    <div id="map-editor-container">
      <div>
        <button onClick={handleDrawButtonClick}>Рисовать линию</button>
        <button onClick={handleSelectButtonClick}>Выбрать элемент</button>
        {isDrawing && (
          <div>
            <label>
              <input
                type="checkbox"
                checked={isDoubleSided}
                onChange={handleDoubleSidedCheckboxChange}
              />
              Двухстороннее
            </label>
          </div>
        )}
      </div>
      <div id="drawing-field">
        <textarea type="text" value={selectedObject ? selectedObject.toString() : ""} onChange={handleInputChange} />
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default FabricCanvas;
