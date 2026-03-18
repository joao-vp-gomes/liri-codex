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


// translate: -------------------------------------------------------------------------------------------------------------------

const supportedLanguagesList = ['en', 'pt'] as const;
type SupportedLanguage = typeof supportedLanguagesList[number];
type ARGS_translante = {
    text: string, 
    language: SupportedLanguage
}
export function translate(args: ARGS_translante): string {
    return lexicon[args.text as keyof typeof lexicon]?.[args.language] ?? args.text;
}


// format: ----------------------------------------------------------------------------------------------------------------------

type ARGS_format = {
    text: string, 
    mode: 'LOWERCASE' | 'UPPERCASE' | 'TITLECASE' | 'PLAIN' | 'PLAIN_FIRST_UPPER'
}
export function format(args: ARGS_format): string {
    switch(args.mode) {
        case 'LOWERCASE': return args.text.toLowerCase();
        case 'UPPERCASE': return args.text.toUpperCase();
        case 'TITLECASE': return args.text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        case 'PLAIN_FIRST_UPPER': return args.text.charAt(0).toUpperCase() + args.text.slice(1);
        case 'PLAIN': default: return args.text;
    }
}


// t: ---------------------------------------------------------------------------------------------------------------------------

type ARGS_t = {
    text: string, 
    language: SupportedLanguage, 
    mode: 'LOWERCASE' | 'UPPERCASE' | 'TITLECASE' | 'PLAIN' | 'PLAIN_FIRST_UPPER'
}
export function t(args: ARGS_t): string {
    return format({text: translate({text: args.text, language: args.language}), mode: args.mode});
}



