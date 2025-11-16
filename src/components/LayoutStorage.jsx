import React, { useState, useEffect } from 'react';
import './Components.css'

const LayoutStorage = ({ canvas, onLoadLayout }) => {
  const [templates, setTemplates] = useState([]);
  const [versionHistory, setVersionHistory] = useState([]);
  const [templateName, setTemplateName] = useState('');
  const STORAGE_KEY = 'resume-templates';
  const VERSION_KEY = 'resume-version-history';
  const AUTO_SAVE_INTERVAL = 5000; // 5秒自动保存

  // 加载本地存储的模板
  useEffect(() => {
    const savedTemplates = localStorage.getItem(STORAGE_KEY);
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }

    const savedVersions = localStorage.getItem(VERSION_KEY);
    if (savedVersions) {
      setVersionHistory(JSON.parse(savedVersions));
    }

    // 自动保存
    const autoSaveTimer = setInterval(() => {
      autoSave();
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(autoSaveTimer);
  }, []);

  // 自动保存功能
  const autoSave = () => {
    if (!canvas) return;

    const canvasData = canvas.toJSON();
    const version = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      data: canvasData,
      description: '自动保存'
    };

    setVersionHistory(prev => {
      const newHistory = [...prev, version];
      // 限制版本历史数量
      const trimmedHistory = newHistory.slice(-50); // 保留最近50个版本
      localStorage.setItem(VERSION_KEY, JSON.stringify(trimmedHistory));
      return trimmedHistory;
    });
  };

  // 保存当前布局为模板
  const saveAsTemplate = () => {
    if (!canvas || !templateName) return;

    const canvasData = canvas.toJSON();
    const template = {
      id: Date.now(),
      name: templateName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data: canvasData
    };

    setTemplates(prev => {
      const newTemplates = [...prev, template];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
      return newTemplates;
    });

    setTemplateName('');
    alert('模板保存成功！');
  };

  // 加载模板
  const loadTemplate = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template && onLoadLayout) {
      onLoadLayout(template.data);
      alert('模板加载成功！');
    }
  };

  // 删除模板
  const deleteTemplate = (templateId) => {
    setTemplates(prev => {
      const newTemplates = prev.filter(t => t.id !== templateId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
      return newTemplates;
    });
  };

  // 恢复到指定版本
  const restoreVersion = (versionId) => {
    const version = versionHistory.find(v => v.id === versionId);
    if (version && onLoadLayout) {
      onLoadLayout(version.data);
      alert('版本恢复成功！');
    }
  };

  // 清理版本历史
  const clearVersionHistory = () => {
    if (confirm('确定要清空版本历史吗？')) {
      setVersionHistory([]);
      localStorage.removeItem(VERSION_KEY);
    }
  };

  return (
    <div className="layout-storage">
      <div className="storage-section">
        <h3>模板管理</h3>
        <div className="template-input">
          <input
            type="text"
            placeholder="输入模板名称"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
          <button onClick={saveAsTemplate} disabled={!templateName}>
            保存为模板
          </button>
        </div>
        
        <div className="template-list">
          <h4>已保存模板</h4>
          {templates.length === 0 ? (
            <p>暂无保存的模板</p>
          ) : (
            <ul>
              {templates.map(template => (
                <li key={template.id} className="template-item">
                  <div>
                    <strong>{template.name}</strong>
                    <span className="template-date">
                      {new Date(template.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="template-actions">
                    <button onClick={() => loadTemplate(template.id)}>加载</button>
                    <button onClick={() => deleteTemplate(template.id)}>删除</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className="storage-section">
        <h3>版本历史</h3>
        <div className="version-actions">
          <button onClick={clearVersionHistory} disabled={versionHistory.length === 0}>
            清空历史
          </button>
        </div>
        
        <div className="version-list">
          {versionHistory.length === 0 ? (
            <p>暂无版本历史</p>
          ) : (
            <ul>
              {versionHistory.slice().reverse().map(version => (
                <li key={version.id} className="version-item">
                  <div>
                    <span className="version-description">{version.description}</span>
                    <span className="version-date">
                      {new Date(version.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="version-actions">
                    <button onClick={() => restoreVersion(version.id)}>恢复</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default LayoutStorage;