import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const LANGUAGE_STORAGE_KEY = 'hangbot.language'
const SUPPORTED_LANGUAGES = ['en', 'no']

const normalizeLanguage = (language) => {
    if (!language || typeof language !== 'string') {
        return 'no'
    }

    const lower = language.toLowerCase()

    if (lower.startsWith('no') || lower.startsWith('nb') || lower.startsWith('nn')) {
        return 'no'
    }

    if (lower.startsWith('en')) {
        return 'en'
    }

    return 'no'
}

const readStoredLanguage = () => {
    if (typeof window === 'undefined') {
        return 'no'
    }

    try {
        return normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY))
    } catch {
        return 'no'
    }
}

const resources = {
    en: {
        translation: {
            start: {
                appDescription:
                    "Enter your username, choose a difficulty, and challenge the bot's mystery words. Your best score is saved!",
                startRound: 'Start a round',
                username: 'Username',
                difficulty: 'Difficulty',
                usernameError: 'Username must be at least 2 characters long.',
                usernameReservedError: 'This username is not allowed. Please choose another one.',
                launch: 'Launch HangBot Round',
                botBehavior: 'Bot behavior:',
                bulletOne: 'HangBot picks a hidden word and reveals a hint and category.',
                bulletTwo: 'Every round uses real dictionary words only.',
                bulletThree:
                    'Score rewards wins, few mistakes, and higher difficulty.',
                topScore: 'Top score:',
                by: 'by',
                lastRound: 'Last round:',
                win: 'Win',
                loss: 'Loss',
                letters: 'letters',
                themeLabel: 'Theme',
                languageLabel: 'Language',
                light: 'Light',
                dark: 'Dark',
                norwegian: 'Norwegian',
                english: 'English',
                backToArena: 'Back to the Arena',
            },
            leaderboard: {
                title: 'Leaderboard',
                developerMode: 'Developer mode',
                allDifficulties: 'All difficulties',
                allOutcomes: 'All outcomes',
                wins: 'Wins',
                losses: 'Losses',
                noRounds:
                    'No rounds saved yet. Start a game and your results will appear here.',
                noMatches: 'No entries match the selected filters.',
                player: 'Player',
                result: 'Result',
                difficulty: 'Difficulty',
                score: 'Score',
                mistakes: 'Mistakes',
                date: 'Date',
                win: 'Win',
                loss: 'Loss',
                deleteLabel: 'Delete leaderboard entry for',
            },
            game: {
                generatingRound: 'Generating a new mystery word...',
                unableInitRound: 'Unable to initialize a round.',
                tryAgain: 'Try again',
                backToLobby: 'Back to lobby',
                player: 'Player',
                difficulty: 'Difficulty',
                timer: 'Timer',
                attemptsLeft: 'Attempts left',
                loadingWord: 'Loading word...',
                botTransmission: 'Message from the bot',
                category: 'Category',
                source: 'Source',
                hint: 'Hint',
                wrongLetters: 'Wrong letters',
                none: 'None',
                mysteryWord: 'Mystery word',
                keyboardTip:
                    'Keyboard tip: press {{alphabetLabel}} to guess quickly, and press Enter after the round ends to start a new one.',
                roundWon: 'Round won',
                roundLost: 'Round lost',
                correctWord: 'Correct word',
                score: 'Score',
                newWord: 'New word',
                returnLobby: 'Return to lobby',
                giveUp: 'Give up',
                lowUniqueLetterWord:
                    'A word with few unique letters was detected. Sweeping through consonants can be effective here.',
            },
            difficulty: {
                easy: {
                    label: 'Easy',
                    description: 'More attempts and direct hints.',
                },
                medium: {
                    label: 'Medium',
                    description: 'Balanced challenge and score gain.',
                },
                hard: {
                    label: 'Hard',
                    description: 'Fewer attempts and tougher words.',
                },
                insane: {
                    label: 'Insane',
                    description: 'Long and tough dictionary words.',
                },
                impossible: {
                    label: 'Impossible',
                    description: 'The longest words with only three attempts.',
                },
            },
        },
    },
    no: {
        translation: {
            start: {
                appDescription:
                    'Skriv inn brukernavn, velg vanskelighetsgrad og utfordre botens skjulte ord. Din beste poengsum blir lagret!',
                startRound: 'Start en runde',
                username: 'Brukernavn',
                difficulty: 'Vanskelighetsgrad',
                usernameError: 'Brukernavnet må være minst 2 tegn langt.',
                usernameReservedError: 'Dette brukernavnet er ikke tillatt. Velg et annet.',
                launch: 'Start HangBot-runde',
                botBehavior: 'Botens oppførsel:',
                bulletOne: 'HangBot velger et skjult ord og gir deg hint og kategori.',
                bulletTwo: 'Hver runde bruker kun ekte ordbokord.',
                bulletThree:
                    'Poeng belønner seier, få feil og høyere vanskelighetsgrad.',
                topScore: 'Toppscore:',
                by: 'av',
                lastRound: 'Siste runde:',
                win: 'Seier',
                loss: 'Tap',
                letters: 'bokstaver',
                themeLabel: 'Tema',
                languageLabel: 'Språk',
                light: 'Lyst',
                dark: 'Mørkt',
                norwegian: 'Norsk',
                english: 'Engelsk',
                backToArena: 'Tilbake til arenaen',
            },
            leaderboard: {
                title: 'Toppliste',
                developerMode: 'Utviklermodus',
                allDifficulties: 'Alle vanskelighetsgrader',
                allOutcomes: 'Alle utfall',
                wins: 'Seiere',
                losses: 'Tap',
                noRounds:
                    'Ingen runder er lagret ennå. Start et spill, så vises resultatene her.',
                noMatches: 'Ingen oppføringer matcher de valgte filtrene.',
                player: 'Spiller',
                result: 'Resultat',
                difficulty: 'Vanskelighetsgrad',
                score: 'Poeng',
                mistakes: 'Feil',
                date: 'Dato',
                win: 'Seier',
                loss: 'Tap',
                deleteLabel: 'Slett topplisteoppføring for',
            },
            game: {
                generatingRound: 'Genererer et nytt skjult ord...',
                unableInitRound: 'Kunne ikke starte en runde.',
                tryAgain: 'Prøv igjen',
                backToLobby: 'Tilbake til lobbyen',
                player: 'Spiller',
                difficulty: 'Vanskelighetsgrad',
                timer: 'Tid',
                attemptsLeft: 'Forsøk igjen',
                loadingWord: 'Laster ord...',
                botTransmission: 'Melding fra boten',
                category: 'Kategori',
                source: 'Kilde',
                hint: 'Hint',
                wrongLetters: 'Feil bokstaver',
                none: 'Ingen',
                mysteryWord: 'Skjult ord',
                keyboardTip:
                    'Tastaturtips: trykk {{alphabetLabel}} for raske gjetninger, og trykk Enter etter at runden er ferdig for å starte en ny.',
                roundWon: 'Runden er vunnet',
                roundLost: 'Runden er tapt',
                correctWord: 'Riktig ord',
                score: 'Poeng',
                newWord: 'Nytt ord',
                returnLobby: 'Tilbake til lobbyen',
                giveUp: 'Gi opp',
                lowUniqueLetterWord:
                    'Et ord med få unike bokstaver ble oppdaget. Det kan være effektivt å prøve flere konsonanter her.',
            },
            difficulty: {
                easy: {
                    label: 'Lett',
                    description: 'Flere forsøk og tydelige hint.',
                },
                medium: {
                    label: 'Middels',
                    description: 'Balansert utfordring og poenggevinst.',
                },
                hard: {
                    label: 'Vanskelig',
                    description: 'Færre forsøk og vanskeligere ord.',
                },
                insane: {
                    label: 'Ekstrem',
                    description: 'Lange og vanskelige ord.',
                },
                impossible: {
                    label: 'Umulig',
                    description: 'De lengste ordene med bare tre forsøk.',
                },
            },
        },
    },
}

i18n.use(initReactI18next).init({
    resources,
    lng: readStoredLanguage(),
    fallbackLng: 'no',
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
        escapeValue: false,
    },
})

i18n.on('languageChanged', (language) => {
    if (typeof window === 'undefined') {
        return
    }

    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language))
    } catch {
        // Ignore storage write failures.
    }
})

export default i18n