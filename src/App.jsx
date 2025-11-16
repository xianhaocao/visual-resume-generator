import { useState, useRef } from 'react'
import './App.css'
import Canvas from './components/Canvas'
import LayoutStorage from './components/LayoutStorage'
import PdfExport from './components/PdfExport'
import StyleThemes from './components/StyleThemes'

function App() {
  const [resumeData, setResumeData] = useState({
    personal: {
      name: '张三',
      title: '前端开发工程师',
      email: 'zhangsan@example.com',
      phone: '138-0013-8000',
      location: '北京',
      avatar: '👨💻'
    },
    summary: '热爱前端开发，熟悉 React、Vue 等技术栈，具有良好的团队协作精神和问题解决能力。',
    experience: [
      {
        company: '科技有限公司',
        position: '前端开发工程师',
        startDate: '2020-06',
        endDate: '至今',
        description: '负责公司产品的前端开发工作，参与需求分析、技术选型和项目管理。'
      }
    ],
    education: [
      {
        school: '大学',
        degree: '本科',
        major: '计算机科学与技术',
        graduationDate: '2020-06'
      }
    ],
    skills: ['React', 'Vue', 'JavaScript', 'CSS', 'HTML', 'Git']
  })

  const handleInputChange = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: field ? {
        ...prev[section],
        [field]: value
      } : value
    }))
  }

  const handleSectionChange = (section, index, field, value) => {
    setResumeData(prev => {
      const newSection = [...prev[section]]
      newSection[index] = {
        ...newSection[index],
        [field]: value
      }
      return {
        ...prev,
        [section]: newSection
      }
    })
  }

  // 画布引用
  const canvasRef = useRef(null);

  // 加载布局数据
  const loadLayout = (layoutData) => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.clear();
      canvas.loadFromJSON(layoutData, () => {
        canvas.renderAll();
      });
    }
  };

  // 画布准备好时的回调
  const handleCanvasReady = (canvas) => {
    canvasRef.current = canvas;
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>可视化简历生成器</h1>
      </header>
      <main className="app-main">
        {/* 左侧画布区域 */}
        <div className="canvas-section">
          <Canvas
            ref={canvasRef}
            onCanvasReady={handleCanvasReady}
            resumeData={resumeData}
          />
        </div>

        {/* 右侧控制面板 */}
        <div className="control-panel">
          {/* 简历编辑 */}
          <div className="editor-section">
            <h2>简历编辑</h2>
          </div>
          
          {/* 个人信息 */}
          <div className="form-section">
            <h3>个人信息</h3>
            <div className="form-row">
              <div className="form-group">
                <label>姓名</label>
                <input
                  type="text"
                  value={resumeData.personal.name}
                  onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>头衔</label>
                <input
                  type="text"
                  value={resumeData.personal.title}
                  onChange={(e) => handleInputChange('personal', 'title', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>邮箱</label>
                <input
                  type="email"
                  value={resumeData.personal.email}
                  onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>电话</label>
                <input
                  type="tel"
                  value={resumeData.personal.phone}
                  onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>所在地</label>
                <input
                  type="text"
                  value={resumeData.personal.location}
                  onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>头像表情</label>
                <input
                  type="text"
                  value={resumeData.personal.avatar}
                  onChange={(e) => handleInputChange('personal', 'avatar', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 个人简介 */}
          <div className="form-section">
            <h3>个人简介</h3>
            <div className="form-group">
              <textarea
                value={resumeData.summary}
                onChange={(e) => handleInputChange('summary', null, e.target.value)}
                rows={4}
              />
            </div>
          </div>

          {/* 工作经历 */}
          <div className="form-section">
            <h3>工作经历</h3>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="experience-item">
                <div className="form-row">
                  <div className="form-group">
                    <label>公司</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => handleSectionChange('experience', index, 'company', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>职位</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => handleSectionChange('experience', index, 'position', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>开始日期</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => handleSectionChange('experience', index, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>结束日期</label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => handleSectionChange('experience', index, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>描述</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => handleSectionChange('experience', index, 'description', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* 教育经历 */}
          <div className="form-section">
            <h3>教育经历</h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="education-item">
                <div className="form-row">
                  <div className="form-group">
                    <label>学校</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => handleSectionChange('education', index, 'school', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>学位</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleSectionChange('education', index, 'degree', e.target.value)}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>专业</label>
                    <input
                      type="text"
                      value={edu.major}
                      onChange={(e) => handleSectionChange('education', index, 'major', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>毕业日期</label>
                    <input
                      type="text"
                      value={edu.graduationDate}
                      onChange={(e) => handleSectionChange('education', index, 'graduationDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 技能 */}
          <div className="form-section">
            <h3>技能</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="添加技能"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value) {
                    setResumeData(prev => ({
                      ...prev,
                      skills: [...prev.skills, e.target.value]
                    }))
                    e.target.value = ''
                  }
                }}
              />
            </div>
            <div className="skills-list">
              {resumeData.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                  <button
                    className="skill-remove"
                    onClick={() => {
                      setResumeData(prev => ({
                        ...prev,
                        skills: prev.skills.filter((_, i) => i !== index)
                      }))
                    }}
                  >×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="preview-section">
          <h2>简历预览</h2>
          <div className="resume-preview">
            <div className="resume-header">
              <div className="avatar">{resumeData.personal.avatar}</div>
              <div className="personal-info">
                <h1 className="resume-name">{resumeData.personal.name}</h1>
                <h2 className="resume-title">{resumeData.personal.title}</h2>
                <div className="contact-info">
                  <span>{resumeData.personal.email}</span>
                  <span>•</span>
                  <span>{resumeData.personal.phone}</span>
                  <span>•</span>
                  <span>{resumeData.personal.location}</span>
                </div>
              </div>
            </div>

            <div className="resume-content">
              <div className="section">
                <h3 className="section-title">个人简介</h3>
                <p className="section-content">{resumeData.summary}</p>
              </div>

              <div className="section">
                <h3 className="section-title">工作经历</h3>
                {resumeData.experience.map((exp, index) => (
                  <div key={index} className="experience-entry">
                    <div className="experience-header">
                      <div>
                        <div className="experience-company">{exp.company}</div>
                        <div className="experience-position">{exp.position}</div>
                      </div>
                      <div className="experience-dates">{exp.startDate} - {exp.endDate}</div>
                    </div>
                    <div className="experience-description">{exp.description}</div>
                  </div>
                ))}
              </div>

              <div className="section">
                <h3 className="section-title">教育经历</h3>
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="education-entry">
                    <div className="education-header">
                      <div>
                        <div className="education-school">{edu.school}</div>
                        <div className="education-major">{edu.degree} • {edu.major}</div>
                      </div>
                      <div className="education-date">{edu.graduationDate}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="section">
                <h3 className="section-title">技能</h3>
                <div className="skills-section">
                  {resumeData.skills.map((skill, index) => (
                    <span key={index} className="skill-item">{skill}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* PDF 导出 */}
          <PdfExport canvas={canvasRef.current} />

          {/* 布局存储 */}
          <LayoutStorage canvas={canvasRef.current} onLoadLayout={loadLayout} />

          {/* 样式主题 */}
          <StyleThemes canvas={canvasRef.current} />
        </div>
      </main>
    </div>
  )
}

export default App
