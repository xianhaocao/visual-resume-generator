import React, { useState, useEffect } from 'react';
import './Components.css'

const StyleThemes = ({ canvas }) => {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customColors, setCustomColors] = useState({});
  const [customFont, setCustomFont] = useState('Arial');
  const [customSpacing, setCustomSpacing] = useState(20);

  // 预设主题模板
  const themes = [
    {
      id: 'default',
      name: '默认主题',
      colors: {
        background: '#ffffff',
        textPrimary: '#333333',
        textSecondary: '#666666',
        accent: '#3b82f6'
      },
      font: 'Arial',
      spacing: 20
    },
    {
      id: 'professional',
      name: '专业主题',
      colors: {
        background: '#ffffff',
        textPrimary: '#1a1a1a',
        textSecondary: '#4a5568',
        accent: '#2563eb'
      },
      font: 'Helvetica',
      spacing: 25
    },
    {
      id: 'creative',
      name: '创意主题',
      colors: {
        background: '#fef6e4',
        textPrimary: '#001858',
        textSecondary: '#172c66',
        accent: '#f3d2c1'
      },
      font: 'Georgia',
      spacing: 18
    },
    {
      id: 'modern',
      name: '现代主题',
      colors: {
        background: '#0f172a',
        textPrimary: '#ffffff',
        textSecondary: '#cbd5e1',
        accent: '#8b5cf6'
      },
      font: 'Roboto',
      spacing: 22
    },
    {
      id: 'minimal',
      name: '极简主题',
      colors: {
        background: '#ffffff',
        textPrimary: '#2d3748',
        textSecondary: '#718096',
        accent: '#2b6cb0'
      },
      font: 'Arial',
      spacing: 28
    }
  ];

  // 字体选项
  const fontOptions = ['Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Roboto', 'Verdana'];

  // 应用主题
  const applyTheme = (themeId) => {
    const theme = themes.find(t => t.id === themeId);
    if (theme && canvas) {
      // 应用背景颜色
      canvas.setBackgroundColor(theme.colors.background);
      
      // 应用文本颜色
      const objects = canvas.getObjects();
      objects.forEach(object => {
        if (object.type === 'text' || object.type === 'textbox') {
          // 应用主要文本颜色
          object.set('fill', theme.colors.textPrimary);
          
          // 应用字体
          object.set('fontFamily', theme.font);
        }
      });
      
      canvas.renderAll();
      setSelectedTheme(themeId);
      setCustomColors(theme.colors);
      setCustomFont(theme.font);
      setCustomSpacing(theme.spacing);
    }
  };

  // 应用自定义样式
  const applyCustomStyles = () => {
    if (!canvas) return;
    
    // 应用背景颜色
    canvas.setBackgroundColor(customColors.background || '#ffffff');
    
    // 应用文本颜色
    const objects = canvas.getObjects();
    objects.forEach(object => {
      if (object.type === 'text' || object.type === 'textbox') {
        // 应用主要文本颜色
        object.set('fill', customColors.textPrimary || '#333333');
        
        // 应用字体
        object.set('fontFamily', customFont || 'Arial');
      }
    });
    
    canvas.renderAll();
  };

  // 切换暗黑模式
  const toggleDarkMode = () => {
    const darkMode = !isDarkMode;
    setIsDarkMode(darkMode);
    
    if (darkMode) {
      // 应用暗黑主题
      applyTheme('modern');
    } else {
      // 恢复默认主题
      applyTheme('default');
    }
  };

  // 自定义颜色变更
  const handleColorChange = (colorType, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  return (
    <div className="style-themes">
      <h3>样式主题</h3>
      
      <div className="theme-section">
        <h4>预设主题</h4>
        <div className="theme-grid">
          {themes.map(theme => (
            <div
              key={theme.id}
              className={`theme-card ${selectedTheme === theme.id ? 'selected' : ''}`}
              onClick={() => applyTheme(theme.id)}
              style={{ backgroundColor: theme.colors.background }}
            >
              <div className="theme-preview">
                <div className="preview-text" style={{ color: theme.colors.textPrimary, fontFamily: theme.font }}>
                  <div className="preview-name">张三</div>
                  <div className="preview-title" style={{ color: theme.colors.textSecondary }}>
                    前端开发工程师
                  </div>
                </div>
                <div className="preview-accent" style={{ backgroundColor: theme.colors.accent }}></div>
              </div>
              <div className="theme-name">{theme.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="theme-section">
        <h4>自定义样式</h4>
        <div className="custom-options">
          <div className="option-group">
            <label>背景颜色:</label>
            <input
              type="color"
              value={customColors.background || '#ffffff'}
              onChange={(e) => handleColorChange('background', e.target.value)}
            />
          </div>
          
          <div className="option-group">
            <label>主要文本颜色:</label>
            <input
              type="color"
              value={customColors.textPrimary || '#333333'}
              onChange={(e) => handleColorChange('textPrimary', e.target.value)}
            />
          </div>
          
          <div className="option-group">
            <label>次要文本颜色:</label>
            <input
              type="color"
              value={customColors.textSecondary || '#666666'}
              onChange={(e) => handleColorChange('textSecondary', e.target.value)}
            />
          </div>
          
          <div className="option-group">
            <label>强调色:</label>
            <input
              type="color"
              value={customColors.accent || '#3b82f6'}
              onChange={(e) => handleColorChange('accent', e.target.value)}
            />
          </div>
          
          <div className="option-group">
            <label>字体:</label>
            <select
              value={customFont}
              onChange={(e) => setCustomFont(e.target.value)}
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>
          
          <div className="option-group">
            <label>间距:</label>
            <input
              type="number"
              min="10"
              max="50"
              value={customSpacing}
              onChange={(e) => setCustomSpacing(parseInt(e.target.value))}
            />
          </div>
        </div>
        
        <div className="custom-actions">
          <button onClick={applyCustomStyles} className="btn-primary">
            应用自定义样式
          </button>
        </div>
      </div>
      
      <div className="theme-section">
        <h4>显示设置</h4>
        <div className="option-group">
          <label>暗黑模式:</label>
          <button onClick={toggleDarkMode} className={`toggle-btn ${isDarkMode ? 'active' : ''}`}>
            {isDarkMode ? '开启' : '关闭'}
          </button>
        </div>
      </div>
      
      <div className="theme-section">
        <h4>主题市场</h4>
        <div className="market-info">
          <p>即将推出更多精美主题...</p>
          <div className="market-placeholder">
            <div className="market-card">主题 1</div>
            <div className="market-card">主题 2</div>
            <div className="market-card">主题 3</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleThemes;