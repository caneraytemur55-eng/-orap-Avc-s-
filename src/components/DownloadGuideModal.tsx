import React, { useState } from 'react';
import { Download, Terminal, Laptop, Globe, Check, Copy, ExternalLink, X, FolderArchive, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface DownloadGuideModalProps {
  onClose: () => void;
}

export const DownloadGuideModal: React.FC<DownloadGuideModalProps> = ({ onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const steps = [
    {
      title: '1. AI Studio Üzerinden Projeyi İndirme',
      desc: 'Ekranın sağ üst köşesinde yer alan "Export" / "İndir" butonuna tıklayın. Buradan projeyi ".zip" dosyası olarak bilgisayarınıza indirebilir veya tek tıkla doğrudan kendi GitHub hesabınıza aktarabilirsiniz.',
      icon: FolderArchive,
    },
    {
      title: '2. Bilgisayarınızda Projeyi Açma',
      desc: 'İndirdiğiniz ZIP dosyasını klasöre çıkartın (örn: Masaüstü > corap-avcisi). Visual Studio Code veya herhangi bir kod editörüyle klasörü açın.',
      icon: Laptop,
    },
    {
      title: '3. Bağımlılıkları Kurma & Çalıştırma',
      desc: 'Bilgisayarınızda Node.js (v18 veya üzeri) yüklü olduğundan emin olun. Klasörün içinde bir terminal açıp aşağıdaki komutları sırasıyla çalıştırın:',
      icon: Terminal,
      command: 'npm install\nnpm run dev',
    },
    {
      title: '4. ikas veya Web Sitesinde Yayınlama (Build)',
      desc: 'Projeyi yayına almak için statik üretim paketini oluşturun. Çıkan "dist" klasörünü Vercel, Netlify veya kendi hostinginize yükleyip ikas mağazanıza alt alan adı (örn: oyun.magazaniz.com) veya iframe olarak bağlayabilirsiniz:',
      icon: Globe,
      command: 'npm run build',
    },
  ];

  const handleCopy = async (text: string, idx: number) => {
    sound.playSelect();
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-display">
              Projeyi Bilgisayarınıza İndirme ve Çalıştırma
            </h2>
            <p className="text-xs text-slate-400">
              Bu oyunu kendi bilgisayarınızda yerel olarak çalıştırmak ve ikas'a entegre etmek için adımlar
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-800 rounded-xl text-amber-400 shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white">{step.title}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{step.desc}</p>

                    {step.command && (
                      <div className="mt-2.5 relative">
                        <pre className="p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-mono text-cyan-300 overflow-x-auto">
                          {step.command}
                        </pre>
                        <button
                          type="button"
                          onClick={() => handleCopy(step.command!, idx)}
                          className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
                          title="Komutu Kopyala"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-[10px] text-emerald-400 font-sans">Kopyalandı</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span className="text-[10px] font-sans">Kopyala</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ikas Entegrasyon Notu */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-amber-300 font-semibold block mb-1">💡 ikas Mağazanıza Nasıl Ekleyebilirsiniz?</strong>
          1. <code>npm run build</code> çıktısı olan <code>dist</code> klasörünü ücretsiz olarak Vercel veya Netlify'a yükleyin.<br />
          2. ikas mağazanızda bir özel sayfa açıp <code>&lt;iframe src="https://oyununuz.vercel.app" width="100%" height="800px"&gt;&lt;/iframe&gt;</code> koduyla sitenize gömebilir veya doğrudan bir alt alan adı (subdomain) bağlayabilirsiniz.
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer transition-colors"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
