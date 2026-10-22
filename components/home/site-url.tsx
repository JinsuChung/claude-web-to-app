'use client';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Check, Copy } from 'lucide-react';
import { copyText } from '@/components/prompt/copy-button';
import { siteUrl } from '@/lib/shared';

/** 홈 히어로의 큰 사이트 주소: 강의실 화면에서 보고 따라 치거나 QR로 열기 */
export function SiteUrl() {
  const url = `${siteUrl}/`;
  const host = siteUrl.replace(/^https?:\/\//, '');
  const [svg, setSvg] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toString(url, { type: 'svg', margin: 0, color: { dark: '#14123a', light: '#ffffff' } }).then(setSvg);
  }, [url]);

  return (
    <div className="mt-10 flex flex-col gap-5 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur sm:flex-row sm:items-center sm:p-6">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/70">이 사이트 주소</p>
        <p className="mt-1 font-bold leading-tight tracking-[-0.03em] [overflow-wrap:normal] [word-break:keep-all]">
          <span className="text-lg text-white/60 sm:text-2xl lg:text-3xl">https://<wbr /></span>
          <span className="text-[1.6rem] text-white sm:text-4xl lg:text-5xl">
            {host.split('.').map((part, i) => (
              <span key={i}>
                {i > 0 && (
                  <>
                    <wbr />.
                  </>
                )}
                <span className="whitespace-nowrap">{part}</span>
              </span>
            ))}
          </span>
          <span className="text-lg text-white/60 sm:text-2xl lg:text-3xl">/</span>
        </p>
        <button
          type="button"
          onClick={async () => {
            if (await copyText(url)) {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          }}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-[#14123a] hover:bg-white/90"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? '복사됨' : '주소 복사'}
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? '주소를 복사했습니다' : ''}
        </span>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-center">
        <div
          className="size-28 shrink-0 rounded-xl bg-white p-2 sm:size-32"
          role="img"
          aria-label={`${url} QR 코드`}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <p className="text-xs text-white/70 sm:text-center">휴대폰 카메라로 찍으면 열려요</p>
      </div>
    </div>
  );
}
