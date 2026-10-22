'use client';
import { useState } from 'react';
import { exportProgress, importProgress, resetProgress } from '@/lib/storage';
import { CopyButton } from '@/components/prompt/copy-button';

export function ProgressTransfer() {
  const [code, setCode] = useState('');
  const [msg, setMsg] = useState('');
  return (
    <div className="not-prose my-4 grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-fd-card p-4">
        <p className="font-semibold">내보내기</p>
        <p className="mt-1 text-sm text-fd-muted-foreground">이 브라우저의 체크·진도·퀴즈·과제·빈칸 입력값을 코드 하나로 복사합니다.</p>
        <div className="mt-3">
          <CopyButton text={() => exportProgress()} label="진도 코드 복사" />
        </div>
      </div>
      <div className="rounded-xl border bg-fd-card p-4">
        <p className="font-semibold">가져오기</p>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={3}
          placeholder="복사한 진도 코드를 붙여 넣으세요"
          className="mt-2 w-full rounded-lg border bg-fd-background px-3 py-2 font-mono text-xs outline-none focus:ring-2 focus:ring-fd-ring"
        />
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMsg(importProgress(code) ? '가져왔어요. 진도가 반영됐습니다.' : '코드가 올바르지 않아요.')}
            className="rounded-lg bg-fd-primary px-3 py-1.5 text-sm font-medium text-fd-primary-foreground"
          >
            가져오기
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('이 브라우저의 진도와 입력값을 모두 지울까요? 되돌릴 수 없어요.')) {
                resetProgress();
                setMsg('모두 지웠어요.');
              }
            }}
            className="rounded-lg border px-3 py-1.5 text-sm"
          >
            진도 초기화
          </button>
          {msg && <span className="text-sm text-fd-muted-foreground">{msg}</span>}
        </div>
      </div>
    </div>
  );
}
