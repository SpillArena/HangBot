import { useEffect, useState } from 'react'

const HANGMAN_FRAMES = [
    ` +---+
 |   |
     |
     |
     |
     |
========`,
    ` +---+
 |   |
 O   |
     |
     |
     |
========`,
    ` +---+
 |   |
 O   |
 |   |
     |
     |
========`,
    ` +---+
 |   |
 O   |
/|   |
     |
     |
========`,
    ` +---+
 |   |
 O   |
/|\\  |
     |
     |
========`,
    ` +---+
 |   |
 O   |
/|\\  |
/    |
     |
========`,
    ` +---+
 |   |
 O   |
/|\\  |
/ \\  |
     |
========`,
]

export default function LoadingScreen({
    isLightTheme,
    label,
    fullscreen = true,
}) {
    const [frameIndex, setFrameIndex] = useState(0)

    useEffect(() => {
        const interval = window.setInterval(() => {
            setFrameIndex((prev) => (prev + 1) % HANGMAN_FRAMES.length)
        }, 280)

        return () => window.clearInterval(interval)
    }, [])

    const wrapperClassName = fullscreen
        ? [
            'fixed inset-0 z-50 flex items-center justify-center px-4',
            isLightTheme
                ? 'bg-slate-50/95 text-slate-900'
                : 'bg-slate-950/95 text-slate-100',
        ].join(' ')
        : 'flex w-full items-center justify-center px-4 py-10'

    const cardClassName = isLightTheme
        ? 'w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-2xl shadow-slate-300/20'
        : 'w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-black/30'

    return (
        <div className={wrapperClassName}>
            <div className={cardClassName}>
                <div className="flex flex-col items-center gap-5 text-center">
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
                        HangBot
                    </p>

                    <pre
                        className={[
                            'min-h-[140px] select-none overflow-hidden font-mono text-xs leading-snug sm:text-sm',
                            'transition-all duration-200',
                            isLightTheme ? 'text-slate-600' : 'text-slate-300',
                        ].join(' ')}
                        aria-hidden="true"
                    >
                        {HANGMAN_FRAMES[frameIndex]}
                    </pre>

                    <div className="space-y-2">
                        <p
                            className={`text-sm font-medium ${isLightTheme ? 'text-slate-700' : 'text-slate-200'}`}
                        >
                            {label}
                        </p>

                        <div
                            className={`mx-auto h-1 w-40 overflow-hidden rounded-full ${isLightTheme ? 'bg-slate-200' : 'bg-slate-800'
                                }`}
                        >
                            <div className="h-full w-1/3 animate-scanning rounded-full bg-cyan-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}