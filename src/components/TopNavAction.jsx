export default function TopNavAction({
    isGameActive = false,
    hubUrl = 'https://spillarena.no',
    onGiveUp,
    backToHubLabel = 'Back to hub',
    giveUpLabel = 'Give up',
    activeGameLabel,
    theme = 'dark',
}) {
    const isLightTheme = theme === 'light'

    const className = isLightTheme
        ? 'inline-flex items-center justify-center rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 shadow-sm transition hover:border-red-500 hover:bg-red-100 hover:text-red-800'
        : 'inline-flex items-center justify-center rounded-xl border border-red-800 bg-red-950 px-4 py-2 text-sm font-semibold text-red-200 shadow-sm transition hover:border-red-500 hover:bg-red-900 hover:text-red-100'

    if (!isGameActive) {
        return (
            <a href={hubUrl} className={className}>
                {backToHubLabel}
            </a>
        )
    }

    return (
        <button type="button" onClick={onGiveUp} className={className}>
            {activeGameLabel ?? giveUpLabel}
        </button>
    )
}