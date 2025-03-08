declare module 'react-native-tesseract-ocr' {
    export interface TesseractOcrOptions {
      whitelist?: string | null;
      tessjs_create_pdf?: string;
    }
  
    export default class TesseractOcr {
      static recognize(
        uri: string,
        lang: string,
        options?: TesseractOcrOptions
      ): Promise<string>;
    }
  }