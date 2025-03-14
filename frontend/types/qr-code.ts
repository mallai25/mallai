export interface QRCodeData {
  websiteUrl: string;
  name: string;
  description: string;
  age: number;
}

export interface QRCodeActions {
  generateQRCode: () => Promise<void>;
  downloadQRCode: () => void;
}

