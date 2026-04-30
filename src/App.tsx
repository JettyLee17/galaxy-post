import { useState, useRef } from 'react';
import { Mail, Copy, Download, Palette, PenTool, Layout, CheckCircle2 } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-indigo-200 shadow-lg">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">银河驿站</h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em] mt-1">Galaxy Post Service</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 p-1 rounded-full border">
            <button
              onClick={() => handleCopy('rich')}
              className={cn(
                "flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-sm font-medium",
                "bg-indigo-600 text-white shadow-sm"
              )}
            >
              {showCopySuccess ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {showCopySuccess ? '已复制' : '复制富文本'}
            </button>
            <button
              onClick={() => handleCopy('html')}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-sm font-medium text-slate-600 hover:bg-slate-200"
            >
              <Download className="w-4 h-4" />
              复制 HTML
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-73px)] overflow-hidden">
        {/* Sidebar - Editor & Templates */}
        <div className="w-full md:w-sidebar bg-white border-r flex flex-col overflow-y-auto p-6 gap-8">
          {/* Template Selection */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-medium">
              <Palette className="w-4 h-4" />
              <h2>选择信纸样式</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(templates).map(([id, template]) => (
                <button
                  key={id}
                  onClick={() => setSelectedTemplate(id)}
                  className={cn(
                    "relative group overflow-hidden rounded-xl border-2 transition-all p-3 text-left h-24 flex flex-col justify-between",
                    selectedTemplate === id
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-slate-100 hover:border-indigo-200 bg-slate-50"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium",
                    selectedTemplate === id ? "text-indigo-700" : "text-slate-600"
                  )}>
                    {template.name}
                  </span>
                  <div className="flex justify-end">
                    <div className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center",
                      selectedTemplate === id ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
                    )}>
                      {selectedTemplate === id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Editor */}
          <section className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-slate-700 font-medium">
              <PenTool className="w-4 h-4" />
              <h2>书写信件内容</h2>
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="在此输入您的信件内容..."
              className="flex-1 w-full p-4 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none font-serif text-lg leading-relaxed text-slate-800 shadow-inner bg-slate-50/50"
            />
          </section>

          {/* Tips */}
          <section className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <h3 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              使用说明
            </h3>
            <ul className="text-xs text-amber-700 space-y-2 leading-relaxed">
              <li>1. 在上方输入信件内容，右侧可实时预览效果。</li>
              <li>2. 点击“复制富文本”，然后直接在 QQ 邮箱写信窗口粘贴。</li>
              <li>3. 如果粘贴效果不佳，可尝试使用“复制 HTML”并在邮箱的 HTML 模式下粘贴。</li>
              <li>4. 建议使用中文字体以获得最佳排版效果。</li>
            </ul>
          </section>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-slate-100 overflow-y-auto p-8 flex justify-center items-start">
          <div className="w-full max-w-2xl">
            <div className="flex items-center gap-2 mb-4 text-slate-500 font-medium text-sm uppercase tracking-wider">
              <Layout className="w-4 h-4" />
              <span>实时预览 (QQ 邮箱显示效果)</span>
            </div>

            <div
              ref={previewRef}
              className="letter-preview"
              dangerouslySetInnerHTML={{ __html: templates[selectedTemplate].render(content) }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
