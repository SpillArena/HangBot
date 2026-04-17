import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const LANGUAGE_STORAGE_KEY = "hangbot.language";
const SUPPORTED_LANGUAGES = ["en", "no"];

const normalizeLanguage = (language) => {
    if (!language || typeof language !== "string") {
        return "en";
    }

    const lower = language.toLowerCase();
    if (lower.startsWith("no")) {
        return "no";
    }
    if (lower.startsWith("en")) {
        return "en";
    }

    return "en";
};

const readStoredLanguage = () => {
    if (typeof window === "undefined") {
        return "en";
    }

    try {
        return normalizeLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY));
    } catch {
        return "en";
    }
};

const resources = {
    en: {
        translation: {
            start: {
                appDescription:
                    "Enter your username, pick difficulty, and challenge the bot's mystery words. Results are persisted in the local leaderboard.",
                startRound: "Start a round",
                username: "Username",
                difficulty: "Difficulty",
                usernameError: "Username must be at least 2 characters long.",
                launch: "Launch HangBot Round",
                botBehavior: "Bot behavior:",
                bulletOne: "HangBot picks a hidden word and reveals a hint + category.",
                bulletTwo: "Every round uses real dictionary words only.",
                bulletThree: "Score rewards wins, few mistakes, and higher difficulty.",
                topScore: "Top score:",
                by: "by",
                lastRound: "Last round:",
                win: "Win",
                loss: "Loss",
                letters: "letters",
                themeLabel: "Theme",
                languageLabel: "Language",
                light: "Light",
                dark: "Dark",
                norwegian: "Norwegian",
                english: "English",
            },
            leaderboard: {
                title: "Leaderboard",
                developerMode: "Developer mode",
                allDifficulties: "All difficulties",
                allOutcomes: "All outcomes",
                wins: "Wins",
                losses: "Losses",
                noRounds:
                    "No rounds saved yet. Start a game and your results will appear here.",
                noMatches: "No entries match the selected filters.",
                player: "Player",
                result: "Result",
                difficulty: "Difficulty",
                score: "Score",
                mistakes: "Mistakes",
                date: "Date",
                win: "Win",
                loss: "Loss",
                deleteLabel: "Delete leaderboard entry for",
            },
            game: {
                generatingRound: "Generating a new mystery word...",
                unableInitRound: "Unable to initialize a round.",
                tryAgain: "Try again",
                backToLobby: "Back to Lobby",
                player: "Player",
                difficulty: "Difficulty",
                timer: "Timer",
                attemptsLeft: "Attempts left",
                loadingWord: "Loading word...",
                botTransmission: "Bot transmission",
                category: "Category",
                source: "Source",
                hint: "Hint",
                wrongLetters: "Wrong letters",
                none: "None",
                mysteryWord: "Mystery word",
                keyboardTip:
                    "Keyboard tip: press {{alphabetLabel}} to guess quickly, and press Enter after round end to start a new one.",
                roundWon: "Round won",
                roundLost: "Round lost",
                correctWord: "Correct word",
                score: "Score",
                newWord: "New word",
                returnLobby: "Return lobby",
                lowUniqueLetterWord:
                    "Low unique-letter word detected. Consonant sweeps are effective here.",
            },
            difficulty: {
                easy: { label: "Easy", description: "More attempts and direct hints." },
                medium: {
                    label: "Medium",
                    description: "Balanced challenge and score gain.",
                },
                hard: {
                    label: "Hard",
                    description: "Fewer attempts and tougher words.",
                },
                insane: {
                    label: "Insane",
                    description: "Longest, toughest dictionary words.",
                },
            },
        },
    },
    no: {
        translation: {
            start: {
                appDescription:
                    "Skriv inn brukernavn, velg vanskelighetsgrad, og utfordre botens skjulte ord. Resultater lagres i den lokale topplisten.",
                startRound: "Start en runde",
                username: "Brukernavn",
                difficulty: "Vanskelighetsgrad",
                usernameError: "Brukernavn ma vaere minst 2 tegn langt.",
                launch: "Start HangBot-runde",
                botBehavior: "Bot-oppførsel:",
                bulletOne: "HangBot velger et skjult ord og gir hint + kategori.",
                bulletTwo: "Hver runde bruker kun ekte ordbokord.",
                bulletThree:
                    "Poeng belønner seier, få feil og høyere vanskelighetsgrad.",
                topScore: "Toppscore:",
                by: "av",
                lastRound: "Siste runde:",
                win: "Seier",
                loss: "Tap",
                letters: "bokstaver",
                themeLabel: "Tema",
                languageLabel: "Språk",
                light: "Lys",
                dark: "Mørk",
                norwegian: "Norsk",
                english: "Engelsk",
            },
            leaderboard: {
                title: "Toppliste",
                developerMode: "Utviklermodus",
                allDifficulties: "Alle vanskelighetsgrader",
                allOutcomes: "Alle utfall",
                wins: "Seiere",
                losses: "Tap",
                noRounds:
                    "Ingen runder lagret enna. Start et spill for a vise resultater her.",
                noMatches: "Ingen oppforinger matcher valgte filtre.",
                player: "Spiller",
                result: "Resultat",
                difficulty: "Vanskelighetsgrad",
                score: "Poeng",
                mistakes: "Feil",
                date: "Dato",
                win: "Seier",
                loss: "Tap",
                deleteLabel: "Slett topplisteoppføring for",
            },
            game: {
                generatingRound: "Genererer et nytt skjult ord...",
                unableInitRound: "Kunne ikke starte en runde.",
                tryAgain: "Prove igjen",
                backToLobby: "Tilbake til lobby",
                player: "Spiller",
                difficulty: "Vanskelighetsgrad",
                timer: "Tid",
                attemptsLeft: "Forsok igjen",
                loadingWord: "Laster ord...",
                botTransmission: "Bot-overføring",
                category: "Kategori",
                source: "Kilde",
                hint: "Hint",
                wrongLetters: "Feil bokstaver",
                none: "Ingen",
                mysteryWord: "Skjult ord",
                keyboardTip:
                    "Tastaturtips: trykk {{alphabetLabel}} for raske gjetninger, og trykk Enter etter runden for et nytt ord.",
                roundWon: "Runde vunnet",
                roundLost: "Runde tapt",
                correctWord: "Riktig ord",
                score: "Poeng",
                newWord: "Nytt ord",
                returnLobby: "Tilbake til lobby",
                lowUniqueLetterWord:
                    "Ord med fa unike bokstaver oppdaget. Konsonant-sveip fungerer godt her.",
            },
            difficulty: {
                easy: { label: "Lett", description: "Flere forsøk og tydelige hint." },
                medium: {
                    label: "Middels",
                    description: "Balansert utfordring og poeng.",
                },
                hard: {
                    label: "Vanskelig",
                    description: "Færre forsøk og hardere ord.",
                },
                insane: {
                    label: "Ekstrem",
                    description: "Lengste og vanskeligste ordbokord.",
                },
            },
        },
    },
};

i18n.use(initReactI18next).init({
    resources,
    lng: readStoredLanguage(),
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: {
        escapeValue: false,
    },
});

i18n.on("languageChanged", (language) => {
    if (typeof window === "undefined") {
        return;
    }

    try {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language));
    } catch {
        // Ignore storage write failures.
    }
});

export default i18n;
