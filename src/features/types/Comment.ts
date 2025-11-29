export interface CommentUser {
    id: string;
    username: string;
    avatar?: string | null;
  }
  
  export interface CommentAnime {
    id: string;
    title: string;
  }
  
  export interface Comment {
    id: string;
    text: string;
    userId: string;
    animeId: string;
    createdAt: Date;
    updatedAt: Date;
    user: CommentUser;
    anime: CommentAnime;
  }
  
  // 🔹 CREATE DTO
  export interface CreateCommentDto {
    animeId: string;
    text: string;
  }
  
  // 🔹 UPDATE DTO
  export interface UpdateCommentDto {
    text?: string;
  }