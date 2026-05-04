import { useState, useRef, useEffect } from 'react';
import { Mail, Copy, Download, Palette, Layout, CheckCircle2, X, Eye, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Send, Type, Image as ImageIcon } from 'lucide-react';
import { templates } from './templates';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as htmlToImage from 'html-to-image';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function App() {
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(Object.keys(templates)[0]);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('preview');
  const previewRef = useRef<HTMLDivElement>(null);
  const lastTemplateRef = useRef(selectedTemplate);

  // Sync content from editable div to state
  const handleContentInput = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const editableDiv = target.querySelector('.editable-content') as HTMLDivElement;
    if (editableDiv) {
      setContent(editableDiv.innerHTML);
    }
  };

  // Update preview HTML when template or content changes
  useEffect(() => {
    if (!previewRef.current) return;

    const editableDiv = previewRef.current.querySelector('.editable-content') as HTMLDivElement;
    const templateChanged = lastTemplateRef.current !== selectedTemplate;

    // Normalize and compare HTML to avoid unnecessary re-renders
    const domHtml = editableDiv ? editableDiv.innerHTML : null;
    const contentChangedExternally = domHtml !== content;

    if (templateChanged || contentChangedExternally) {
      const html = templates[selectedTemplate].render(content, true);
      previewRef.current.innerHTML = html;
      lastTemplateRef.current = selectedTemplate;
    }
  }, [selectedTemplate, content]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    // Trigger update manually since execCommand doesn't always trigger onInput
    if (previewRef.current) {
      const editableDiv = previewRef.current.querySelector('.editable-content') as HTMLDivElement;
      if (editableDiv) {
        setContent(editableDiv.innerHTML);
      }
    }
  };

  const handleIndent = () => {
    // Custom first line indent logic that works on the current paragraph
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const editableDiv = previewRef.current?.querySelector('.editable-content') as HTMLDivElement;
    if (!editableDiv) return;

    let node = selection.anchorNode;
    if (!node) return;

    // Find the nearest block-level ancestor within the editable area
    let blockElement = node.nodeType === 1 ? (node as HTMLElement) : node.parentElement;
    
    while (blockElement && blockElement !== editableDiv && 
           !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE'].includes(blockElement.tagName)) {
      blockElement = blockElement.parentElement;
    }

    if (blockElement && blockElement !== editableDiv) {
      // Toggle indent on the found block element
      if (blockElement.style.textIndent === '2em') {
        blockElement.style.textIndent = '';
      } else {
        blockElement.style.textIndent = '2em';
      }
    } else {
      // If we're directly in the container or no block found, 
      // first ensure the content is wrapped in a block (usually <p>)
      document.execCommand('formatBlock', false, 'p');
      
      // Get the updated selection and try to find the block again
      const newSelection = window.getSelection();
      const newNode = newSelection?.anchorNode;
      let newBlock = newNode?.nodeType === 1 ? (newNode as HTMLElement) : newNode?.parentElement;
      
      while (newBlock && newBlock !== editableDiv && 
             !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'BLOCKQUOTE'].includes(newBlock.tagName)) {
        newBlock = newBlock.parentElement;
      }
      
      if (newBlock && newBlock !== editableDiv) {
        newBlock.style.textIndent = '2em';
      }
    }

    // Trigger update manually
    setContent(editableDiv.innerHTML);
  };

  const exportAsImage = async () => {
    if (!previewRef.current) return;

    try {
      // Find the inner table to export (the actual letter)
      const table = previewRef.current.querySelector('table');
      if (!table) return;

      // Temporarily set contenteditable to false for export
      const editableDiv = table.querySelector('.editable-content') as HTMLDivElement;
      const wasEditable = editableDiv?.getAttribute('contenteditable');
      if (editableDiv) editableDiv.setAttribute('contenteditable', 'false');

      const dataUrl = await htmlToImage.toPng(table, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#f8fafc'
      });

      // Restore editability
      if (editableDiv && wasEditable) editableDiv.setAttribute('contenteditable', wasEditable);

      const link = document.createElement('a');
      link.download = `galaxy-post-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('导出图片失败，请重试');
    }
  };

  const handleSend = async () => {
    await handleCopy('rich');
    // After copying, try to open mail app
    window.location.href = "mailto:?subject=来自银河驿站的信件&body=（请在此处粘贴刚才复制的内容）";
  };

  const handleCopy = async (mode: 'rich' | 'html') => {
    if (!previewRef.current) return;

    try {
      const html = templates[selectedTemplate].render(content);

      if (mode === 'rich') {
        // Fallback for mobile browsers that might not support ClipboardItem fully
        if (navigator.clipboard && window.ClipboardItem) {
          try {
            const blob = new Blob([html], { type: 'text/html' });
            const data = [new ClipboardItem({ 'text/html': blob })];
            await navigator.clipboard.write(data);
          } catch (e) {
            console.warn('ClipboardItem failed, trying execCommand fallback', e);
            copyToClipboardFallback(html);
          }
        } else {
          copyToClipboardFallback(html);
        }
      } else {
        await navigator.clipboard.writeText(html);
      }

      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert('复制失败，请重试或尝试手动选择内容复制。');
    }
  };

  const copyToClipboardFallback = (html: string) => {
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.position = 'fixed';
    container.style.pointerEvents = 'none';
    container.style.opacity = '0';
    document.body.appendChild(container);

    const range = document.createRange();
    range.selectNode(container);
    window.getSelection()?.removeAllRanges();
    window.getSelection()?.addRange(range);

    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy failed', err);
    }

    document.body.removeChild(container);
    window.getSelection()?.removeAllRanges();
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
          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-1.5 bg-slate-100 p-1 rounded-full border">
            <button
              onClick={() => {
                setMobileView(mobileView === 'preview' ? 'editor' : 'preview');
              }}
              className="p-1.5 text-indigo-600 bg-white rounded-full shadow-sm"
            >
              {mobileView === 'preview' ? <Palette className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={exportAsImage}
              className="p-1.5 text-indigo-600 bg-white rounded-full shadow-sm"
              title="导出图片"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleSend}
              className="p-1.5 text-white bg-indigo-600 rounded-full shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

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
              onClick={exportAsImage}
              className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-sm font-medium text-slate-600 hover:bg-slate-200"
            >
              <ImageIcon className="w-4 h-4" />
              图片
            </button>
            <button
              onClick={() => handleCopy('html')}
              className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full transition-all text-sm font-medium text-slate-600 hover:bg-slate-200"
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
          "bg-white border-r flex flex-col overflow-y-auto transition-all duration-300 z-20",
          "w-full md:w-80",
          mobileView === 'preview' ? "hidden md:flex" : "flex",
          "p-4 md:p-6 gap-6 md:gap-8"
        )}>
          {/* Template Selection */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Palette className="w-4 h-4" />
                <h2>选择信纸样式</h2>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              {Object.entries(templates).map(([id, template]) => (
                <button
                  key={id}
                  onClick={() => {
                    setSelectedTemplate(id);
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

          {/* Tips */}
          <section className="bg-amber-50 rounded-xl p-3 md:p-4 border border-amber-100 hidden sm:block">
            <h3 className="text-xs md:text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              使用说明
            </h3>
            <ul className="text-[10px] md:text-xs text-amber-700 space-y-1 md:space-y-2 leading-relaxed">
              <li>1. 直接点击右侧信纸区域即可开始编辑。</li>
              <li>2. 点击右上角“复制富文本”，在邮箱窗口粘贴。</li>
              <li>3. 系统会自动同步您的修改。</li>
            </ul>
          </section>
        </div>

        {/* Preview / WYSIWYG Editor Area */}
        <div className={cn(
          "flex-1 bg-slate-100 overflow-y-auto p-2 sm:p-4 md:p-8 flex flex-col items-center transition-all duration-300",
          mobileView === 'editor' ? "hidden md:flex" : "flex"
        )}>
          {/* Editor Toolbar */}
          <div className="w-full max-w-2xl bg-white mb-4 p-2 rounded-xl border shadow-sm flex flex-wrap items-center gap-1 sticky top-0 z-10">
            <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
              <button
                onClick={() => execCommand('bold')}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                title="加粗"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('italic')}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                title="倾斜"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('underline')}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                title="下划线"
              >
                <Underline className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
              <button
                onClick={() => execCommand('justifyLeft')}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                title="左对齐"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('justifyCenter')}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                title="居中对齐"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => execCommand('justifyRight')}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                title="右对齐"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-0.5 border-r pr-1 mr-1">
              <button
                onClick={handleIndent}
                className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 transition-colors"
                title="首行缩进"
              >
                <Type className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <input
                type="color"
                onChange={(e) => execCommand('foreColor', e.target.value)}
                className="w-6 h-6 p-0 border-0 bg-transparent cursor-pointer rounded overflow-hidden"
                title="文字颜色"
              />
            </div>
          </div>

          <div className="w-full max-w-2xl">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="flex items-center gap-2 text-slate-500 font-medium text-[10px] md:text-sm uppercase tracking-wider">
                <Layout className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>直接在此编辑内容</span>
              </div>
              {mobileView === 'editor' && (
                <button
                  onClick={() => setMobileView('preview')}
                  className="md:hidden text-xs text-indigo-600 font-medium flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-sm"
                >
                  查看预览 <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div
              ref={previewRef}
              className={cn(
                "letter-preview bg-white shadow-xl rounded-sm overflow-hidden transition-all duration-300",
                "ring-4 ring-indigo-100 focus-within:ring-indigo-200",
                "max-w-full"
              )}
              style={{
                // Ensure the table inside doesn't overflow
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
              onInput={handleContentInput}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
