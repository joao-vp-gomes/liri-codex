// frontend/src/utils/localizer.ts

/*

Exibe textos da UI em diferentes linguas e contextos.
Duas funcoes (translate e format) combinadas em uma (t).

translate(): 
- Traduz o texto 'text' para uma linguagem suportada 'language'. 
- 'text' deve ser escrito em kebab-case em ingles.
- Usa o lexico local em /frontend/src/data/lexicon.json
- Se o texto nao for encontrado no lexico, retorna o texto original 'text'.

format():
- Formata o texto 'text' para uma das cinco formatacoes, de acordo com 'mode', que pode ser:
    -- LOWERCASE: Todas as letras em minusculo.
    -- UPPERCASE: Todas as letras em maiusculo.
    -- TITLECASE: 
        --- Todas as letras iniciais em maiusculo. 
        --- Letras maiusculas nao-triviais sao preservadas.
        --- Atencao: Letras minusculas nao-triviais nao sao preservadas 
    -- PLAIN: Texto gramaticalmente normal. Retorn padrao da funcao.
    -- PLAIN_FIRST_UPPER: Texto gramaticalmente normal, mas com a primeira letra em maiusculo.
- 'text' deve ser escrito de forma gramaticalmente normal (PLAIN).

*/

import lexicon from '../data/lexicon.json'


const supportedLanguagesList = ['en', 'pt'] as const;
type SupportedLanguage = typeof supportedLanguagesList[number];
export function translate(text: keyof typeof lexicon, language: SupportedLanguage): string {
    return lexicon[text][language] || text;
}


export function format(text: string, mode: 'LOWERCASE' | 'UPPERCASE' | 'TITLECASE' | 'PLAIN' | 'PLAIN_FIRST_UPPER' = 'PLAIN'): string {
    switch(mode) {
        case 'LOWERCASE': return text.toLowerCase();
        case 'UPPERCASE': return text.toUpperCase();
        case 'TITLECASE': return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        case 'PLAIN_FIRST_UPPER': return text.charAt(0).toUpperCase() + text.slice(1);
        case 'PLAIN': default: return text;
    }
}


export function t(text: keyof typeof lexicon, language: SupportedLanguage, mode: 'LOWERCASE' | 'UPPERCASE' | 'TITLECASE' | 'PLAIN' | 'PLAIN_FIRST_UPPER' = 'PLAIN'): string {
    return format(translate(text, language), mode);
}


export default t;
