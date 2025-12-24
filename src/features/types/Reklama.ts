export type Advertisement = {
    id: string;
    video?: string;      // video fayl URL yoki path
    text?: string;       // reklama matni
    link?: string;       // tashqi havola (button bosilganda)
    episodeId?: string;  // qaysi episodga tegishli ekanini ko‘rsatadi (nullable)
    createdAt: string;   // ISO string yoki Date
    updatedAt: string;   // ISO string yoki Date
  };
  
  
export type CreateAdvertisementDto = {
    text?: string;
    link?: string;
    video?: string;
    episodeId?: string;
  };
  
  export type UpdateAdvertisementDto = {
    text?: string;
    link?: string;
    video?: string;
    episodeId?: string;
  };
  