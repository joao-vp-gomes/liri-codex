// frontend/src/services/useImageUpload.ts


import { useState } from 'react';
import { supabase } from '../services/supabase';
import type { EntryCategory } from '../../../shared/entry/entry';

import toolImage from '../images/tool.png';
import apparelImage from '../images/apparel.png';
import accessoryImage from '../images/accessory.png';
import abilityImage from '../images/ability.png';
import recipeImage from '../images/recipe.png';
import catalogueImage from '../images/catalogue.png';
import pawnImage from '../images/pawn.png';
import rosterImage from '../images/roster.png';
import materialImage from '../images/material.png';
import characterImage from '../images/character.png';


const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const BUCKET = 'images';

export const getImageUrl = (imagePath: string | null | undefined, category: EntryCategory): string => {

    if (imagePath) {
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(imagePath);
        return data.publicUrl;
    }

    switch (category) {
        case 'tool': return toolImage;
        case 'apparel': return apparelImage;
        case 'accessory': return accessoryImage;
        case 'ability': return abilityImage;
        case 'pawn': return pawnImage;
        case 'roster': return rosterImage;
        case 'recipe': return recipeImage;
        case 'catalogue': return catalogueImage;
        case 'material': return materialImage;
        case 'character': return characterImage;
        default: return toolImage;
    }

};

interface UseImageUploadResult {
    uploading: boolean;
    uploadError: string | null;
    triggerUpload: (entryKey: string, onSuccess: (path: string) => void) => void;
    deleteImage: (imagePath: string, onSuccess: () => void) => void;
}

export const useImageUpload = (): UseImageUploadResult => {

    const [uploading, setUploading]       = useState(false);
    const [uploadError, setUploadError]   = useState<string | null>(null);

    const triggerUpload = (entryKey: string, onSuccess: (path: string) => void) => {

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            if (file.size > MAX_SIZE_BYTES) { setUploadError('image-too-large'); return; }

            setUploading(true);
            setUploadError(null);

            const ext  = file.name.split('.').pop();
            const path = `entries/${entryKey}.${ext}`;

            const { error } = await supabase.storage
                .from(BUCKET)
                .upload(path, file, { upsert: true });

            setUploading(false);
            if (error) { setUploadError('upload-error'); return; }
            onSuccess(path);
        };

        input.click();

    };

    const deleteImage = async (imagePath: string, onSuccess: () => void) => {
        setUploading(true);
        setUploadError(null);
        const { error } = await supabase.storage.from(BUCKET).remove([imagePath]);
        setUploading(false);
        if (error) { setUploadError('upload-error'); return; }
        onSuccess();
    };

    return { uploading, uploadError, triggerUpload, deleteImage };

};