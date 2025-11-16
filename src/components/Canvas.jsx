import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as fabric from 'fabric';
import './Components.css';

const Canvas = ({ resumeData, onCanvasReady, isGridEnabled, isSnapEnabled, onHistoryChange }) => {
  const canvasRef = useRef(null);
  const canvasInstanceRef = useRef(null);
  const gridSize = 20;
  
  // 命令历史记录
  const [history, setHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  
  // 绘制网格线
  const drawGrid = useCallback((canvas) => {
    const lineOptions = {
      stroke: '#e0e0e0',
      strokeWidth: 1,
      selectable: false,
      evented: false
    };
    
    // 清除旧网格线
    canvas.getObjects().forEach((object) => {
      if (object.type === 'line') {
        canvas.remove(object);
      }
    });
    
    // 水平网格线
    for (let i = 0; i < canvas.height; i += gridSize) {
      canvas.add(new fabric.Line([0, i, canvas.width, i], lineOptions));
    }
    
    // 垂直网格线
    for (let i = 0; i < canvas.width; i += gridSize) {
      canvas.add(new fabric.Line([i, 0, i, canvas.height], lineOptions));
    }
  }, [gridSize]);
  
  // 启用吸附功能
  const enableSnap = useCallback((canvas) => {
    canvas.on('object:moving', (e) => {
      const object = e.target;
      object.set({
        left: Math.round(object.left / gridSize) * gridSize,
        top: Math.round(object.top / gridSize) * gridSize
      });
    });
  }, [gridSize]);
  
  // 处理对象添加事件
  const handleObjectAdded = useCallback(() => {
    // 记录命令
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;
    
    const command = {
      type: 'add',
      objects: JSON.stringify(canvas.toJSON())
    };
    
    setHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), command]);
    setCurrentHistoryIndex(prev => prev + 1);
    
    if (onHistoryChange) {
      onHistoryChange(history, currentHistoryIndex);
    }
  }, [currentHistoryIndex, history, onHistoryChange]);
  
  // 处理对象移除事件
  const handleObjectRemoved = useCallback(() => {
    // 记录命令
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;
    
    const command = {
      type: 'remove',
      objects: JSON.stringify(canvas.toJSON())
    };
    
    setHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), command]);
    setCurrentHistoryIndex(prev => prev + 1);
    
    if (onHistoryChange) {
      onHistoryChange(history, currentHistoryIndex);
    }
  }, [currentHistoryIndex, history, onHistoryChange]);
  
  // 处理对象修改事件
  const handleObjectModified = useCallback(() => {
    // 记录命令
    const canvas = canvasInstanceRef.current;
    if (!canvas) return;
    
    const command = {
      type: 'modify',
      objects: JSON.stringify(canvas.toJSON())
    };
    
    setHistory(prev => [...prev.slice(0, currentHistoryIndex + 1), command]);
    setCurrentHistoryIndex(prev => prev + 1);
    
    if (onHistoryChange) {
      onHistoryChange(history, currentHistoryIndex);
    }
  }, [currentHistoryIndex, history, onHistoryChange]);
  
  // 初始化简历内容
  const initializeResumeContent = useCallback((canvas, data) => {
    if (!canvas || !data) return;
    
    // 清除画布
    canvas.clear();
    
    // 添加网格
    if (isGridEnabled) {
      drawGrid(canvas);
    }
    
    // 添加个人信息部分
    const personalInfoText = `${data.personal.name}
${data.personal.title}
${data.personal.email} | ${data.personal.phone}
${data.personal.location}`;
    
    const personalText = new fabric.Textbox(personalInfoText, {
      left: 50,
      top: 50,
      width: 350,
      fontSize: 24,
      fontWeight: 'bold',
      fill: '#333333',
      editable: true
    });
    
    canvas.add(personalText);
    
    // 添加头像
    if (data.personal.avatar) {
      const avatar = new fabric.Text(data.personal.avatar, {
        left: 500,
        top: 50,
        fontSize: 60,
        fontWeight: 'bold'
      });
      canvas.add(avatar);
    }
    
    // 添加摘要部分
    if (data.summary) {
      const summaryTitle = new fabric.Text('个人简介', {
        left: 50,
        top: 200,
        fontSize: 18,
        fontWeight: 'bold',
        fill: '#333333'
      });
      
      const summaryText = new fabric.Textbox(data.summary, {
        left: 50,
        top: 230,
        width: 650,
        fontSize: 14,
        fill: '#666666',
        editable: true
      });
      
      canvas.add(summaryTitle, summaryText);
    }
  }, [isGridEnabled, drawGrid]);
  
  // 初始化画布
  useEffect(() => {
    let canvas;
    
    try {
      canvas = new fabric.Canvas('resume-canvas', {
        width: 800,
        height: 1131, // A4 比例
        backgroundColor: '#ffffff',
        preserveObjectStacking: true // 保持对象堆叠顺序
      });
      
      canvasInstanceRef.current = canvas;
      
      // 启用网格和吸附
      if (isGridEnabled) {
        drawGrid(canvas);
      }
      
      // 吸附到网格
      if (isSnapEnabled) {
        enableSnap(canvas);
      }
      
      // 注册对象添加事件，用于记录命令
      canvas.on('object:added', handleObjectAdded);
      canvas.on('object:removed', handleObjectRemoved);
      canvas.on('object:modified', handleObjectModified);
      
      // 初始化简历内容
      initializeResumeContent(canvas, resumeData);
      
      // 通知父组件画布已准备好
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
    } catch (error) {
      console.error('Error initializing canvas:', error);
    }
    
    return () => {
      if (canvas && canvas.dispose) {
        canvas.dispose();
      }
    };
  }, [drawGrid, enableSnap, handleObjectAdded, handleObjectRemoved, handleObjectModified, initializeResumeContent, isGridEnabled, isSnapEnabled, resumeData, onCanvasReady]);
  
  // 渲染画布容器
  return (
    <div className="canvas-container">
      <canvas id="resume-canvas" ref={canvasRef}></canvas>
    </div>
  );
};

export default Canvas;