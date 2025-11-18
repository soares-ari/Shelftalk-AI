// backend/src/config/multer.config.ts

import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';

/**
 * Configuração do Multer para upload de imagens
 */
export const multerConfig = {
  storage: diskStorage({
    // Destino dos arquivos
    destination: './uploads/products',

    // Nome do arquivo (UUID + extensão original)
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  }),

  // Filtro de arquivos (apenas imagens)
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido. Use apenas imagens.'), false);
    }
  },
  // Limite de tamanho (5MB)
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};
