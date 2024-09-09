import NextI18Next from 'next-i18next';

const NextI18NextInstance = new NextI18Next({
    defaultLanguage: 'en',
    otherLanguages: ['ka', 'ru'], // Add other supported languages here
});

export default NextI18NextInstance;