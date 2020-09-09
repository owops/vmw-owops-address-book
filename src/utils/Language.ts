export const getLanguage = (): string => {
    const lang = navigator.language;
    if (/^zh/.test(lang)) {
        return 'zh'
    } else {
        return 'en'
    }
}
