import React, { useState } from 'react';
import './Components.css'
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const PdfExport = ({ canvas }) => {
  const [pageSize, setPageSize] = useState('a4');
  const [orientation, setOrientation] = useState('portrait');
  const [margin, setMargin] = useState(10);
  const [quality, setQuality] = useState(1.0);

  // 页面尺寸选项
  const pageSizeOptions = [
    { value: 'a4', label: 'A4 (210x297mm)' },
    { value: 'a3', label: 'A3 (297x420mm)' },
    { value: 'letter', label: 'Letter (216x279mm)' },
    { value: 'legal', label: 'Legal (216x356mm)' }
  ];

  // 导出 PDF
  const exportPdf = () => {
    if (!canvas) return;

    // 创建 canvas 元素的图像数据
    const canvasElement = canvas.getElement();
    
    // 使用 html2canvas 将 canvas 转换为图像
    html2canvas(canvasElement).then(canvasImg => {
      // 创建 PDF 文档
      const imgData = canvasImg.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvasImg.height * imgWidth) / canvasImg.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 设置 PDF 选项
      const doc = new jsPDF(orientation, 'mm', pageSize);
      doc.setProperties({
        title: 'My Resume',
        subject: 'Resume',
        author: 'Resume Generator',
        keywords: 'resume, cv, curriculum vitae'
      });

      // 第一页
      doc.addImage(imgData, 'PNG', margin, margin, imgWidth - 2 * margin, imgHeight - 2 * margin);
      heightLeft -= pageHeight;

      // 多页处理
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', margin, position + margin, imgWidth - 2 * margin, imgHeight - 2 * margin);
        heightLeft -= pageHeight;
      }

      // 保存 PDF
      doc.save('resume.pdf');
      alert('PDF 导出成功！');
    });
  };

  // 高级导出选项
  const exportWithOptions = () => {
    if (!canvas) return;

    const canvasElement = canvas.getElement();
    
    html2canvas(canvasElement, {
      scale: quality * 2, // 提高分辨率
      logging: false
    }).then(canvasImg => {
      const imgData = canvasImg.toDataURL('image/jpeg', quality);
      
      // 根据页面大小设置参数
      const pageSizeConfig = {
        'a4': { width: 210, height: 297 },
        'a3': { width: 297, height: 420 },
        'letter': { width: 216, height: 279 },
        'legal': { width: 216, height: 356 }
      };

      const size = pageSizeConfig[pageSize];
      const doc = new jsPDF(orientation, 'mm', pageSize);
      
      // 计算图像尺寸
      const imgWidth = size.width - 2 * margin;
      const imgHeight = (canvasImg.height * imgWidth) / canvasImg.width;
      
      doc.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
      doc.save('resume.pdf');
      alert('PDF 导出成功！');
    });
  };

  return (
    <div className="pdf-export">
      <h3>PDF 导出</h3>
      
      <div className="export-options">
        <div className="option-group">
          <label>页面尺寸:</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value)}
          >
            {pageSizeOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="option-group">
          <label>方向:</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value)}
          >
            <option value="portrait">纵向</option>
            <option value="landscape">横向</option>
          </select>
        </div>
        
        <div className="option-group">
          <label>边距 (mm):</label>
          <input
            type="number"
            min="0"
            max="50"
            value={margin}
            onChange={(e) => setMargin(parseInt(e.target.value))}
          />
        </div>
        
        <div className="option-group">
          <label>质量:</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
          />
          <span>{quality.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="export-buttons">
        <button onClick={exportPdf} className="btn-primary">
          快速导出 PDF
        </button>
        <button onClick={exportWithOptions} className="btn-secondary">
          高级导出
        </button>
      </div>
      
      <div className="export-info">
        <h4>导出提示</h4>
        <ul>
          <li>确保所有内容都在画布内可见</li>
          <li>调整边距以避免内容被截断</li>
          <li>较高的质量设置会生成较大的 PDF 文件</li>
          <li>建议使用 A4 尺寸进行打印</li>
        </ul>
      </div>
    </div>
  );
};

export default PdfExport;