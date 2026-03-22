// backend/utils/key.ts


const _KEY_LENGTH = 16;
const _KEY_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateKey = (): string => {
    return Array.from({ length: _KEY_LENGTH }, () =>
            _KEY_CHARACTERS[Math.floor(Math.random() * _KEY_CHARACTERS.length)]
        ).join('');
}


export default generateKey;