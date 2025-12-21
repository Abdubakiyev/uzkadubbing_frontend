export type Advertisement = {
    id: string;
    video?: string;  // video fayl URL yoki path
    text?: string;   // reklama matni
    link?: string;   // tashqi havola (button bosilganda)
    createdAt: string; // ISO string yoki Date
    updatedAt: string; // ISO string yoki Date
};