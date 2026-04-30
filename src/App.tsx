import { useState, useRef } from 'react';
import { Mail, Copy, Download, Palette, PenTool, Layout, CheckCircle2, X, Eye } from 'lucide-react';
import { templates } from './templates';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(Object.keys(templates)[0]);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [showTemplateMobile, setShowTemplateMobile] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleCopy = async (mode: 'rich' | 'html') => {
    if (!previewRef.current) return;

    try {
      const html = templates[selectedTemplate].render(content);

      if (mode === 'rich') {
        const blob = new Blob([html], { type: 'text/html' });
        const data = [new ClipboardItem({ 'text/html': blob })];
        await navigator.clipboard.write(data);
      } else {
        await navigator.clipboard.writeText(html);
      }

      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-indigo-600 p-1.5 md:p-2 rounded-lg md:rounded-xl shadow-indigo-200 shadow-lg">
            <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight leading-none">银河驿站</h1>
            <p className="hidden md:block text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] mt-1">Galaxy Post Service</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Preview Toggle */}
          <button
            onClick={() => setMobileView(mobileView === 'editor' ? 'preview' : 'editor')}
            className="md:hidden p-2 text-slate-600 bg-slate-100 rounded-full"
          >
            {mobileView === 'editor' ? <Eye className="w-5 h-5" /> : <PenTool className="w-5 h-5" />}
          </button>

          <div className="flex bg-slate-100 p-1 rounded-full border scale-90 md:scale-100">
            <button
              onClick={() => handleCopy('rich')}
              className={cn(
                "flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 rounded-full transition-all text-xs md:text-sm font-medium",
                "bg-indigo-600 text-white shadow-sm"
              )}
            >
              {showCopySuccess ? <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" /> : <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />}
              <span className="hidden xs:inline">{showCopySuccess ? '已复制' : '复制富文本'}</span>
              <span className="xs:hidden">{showCopySuccess ? '已复制' : '复制'}</span>
            </button>
            <button
              onClick={() => handleCopy('html')}
              className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-sm font-medium text-slate-600 hover:bg-slate-200"
            >
              <Download className="w-4 h-4" />
              HTML
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-60px)] md:h-[calc(100vh-73px)] overflow-hidden relative">
        {/* Sidebar - Editor & Templates */}
        <div className={cn(
          "w-full md:w-sidebar bg-white border-r flex flex-col overflow-y-auto p-4 md:p-6 gap-6 md:gap-8 transition-all duration-300 z-20",
          mobileView === 'preview' ? "hidden md:flex" : "flex"
        )}>
          {/* Template Selection - Mobile Drawer Toggle */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Palette className="w-4 h-4" />
                <h2>选择信纸样式</h2>
              </div>
              <button
                onClick={() => setShowTemplateMobile(!showTemplateMobile)}
                className="md:hidden text-xs text-indigo-600 font-medium"
              >
                {showTemplateMobile ? '收起' : '更换'}
              </button>
            </div>

            <div className={cn(
              "grid grid-cols-2 gap-2 md:gap-3 transition-all",
              !showTemplateMobile && "hidden md:grid"
            )}>
              {Object.entries(templates).map(([id, template]) => (
                <button
                  key={id}
                  onClick={() => {
                    setSelectedTemplate(id);
                    if (window.innerWidth < 768) setShowTemplateMobile(false);
                  }}
                  className={cn(
                    "relative group overflow-hidden rounded-xl border-2 transition-all p-2.5 md:p-3 text-left h-20 md:h-24 flex flex-col justify-between",
                    selectedTemplate === id
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-100 hover:border-indigo-200 bg-slate-50"
                  )}
                >
                  <span className={cn(
                    "text-xs md:text-sm font-medium",
                    selectedTemplate === id ? "text-indigo-700" : "text-slate-600"
                  )}>
                    {template.name}
                  </span>
                  <div className="flex justify-end">
                    <div className={cn(
                      "w-3.5 h-3.5 md:w-4 md:h-4 rounded-full border flex items-center justify-center",
                      selectedTemplate === id ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
                    )}>
                      {selectedTemplate === id && <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Editor */}
          <section className="flex-1 flex flex-col min-h-[300px]">
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-medium">
              <PenTool className="w-4 h-4" />
              <h2>书写信件内容</h2>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在此输入您的信件内容..."
              className="flex-1 w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none font-serif text-base md:text-lg leading-relaxed text-slate-800 shadow-inner bg-slate-50/50"
            />
          </section>

          {/* Tips - Collapsible on Mobile */}
          <section className="bg-amber-50 rounded-xl p-3 md:p-4 border border-amber-100 hidden sm:block">
            <h3 className="text-xs md:text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              使用说明
            </h3>
            <ul className="text-[10px] md:text-xs text-amber-700 space-y-1 md:space-y-2 leading-relaxed">
              <li>1. 输入内容，点击右上角预览按钮查看效果。</li>
              <li>2. 点击“复制富文本”，在邮箱窗口粘贴。</li>
              <li>3. 移动端建议使用“复制富文本”以获得最佳体验。</li>
            </ul>
          </section>
        </div>

        {/* Preview Area */}
        <div className={cn(
          "flex-1 bg-slate-100 overflow-y-auto p-4 md:p-8 flex justify-center items-start transition-all duration-300",
          mobileView === 'editor' ? "hidden md:flex" : "flex"
        )}>
          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-500 font-medium text-[10px] md:text-sm uppercase tracking-wider">
                <Layout className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>实时预览 (QQ 邮箱效果)</span>
              </div>
              <button
                onClick={() => setMobileView('editor')}
                className="md:hidden text-xs text-indigo-600 font-medium flex items-center gap-1"
              >
                返回编辑 <X className="w-3 h-3" />
              </button>
            </div>

            <div
              ref={previewRef}
              className="letter-preview bg-white overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: templates[selectedTemplate].render(content) }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
