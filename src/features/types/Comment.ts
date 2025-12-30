export interface CommentUser {
  id: string;
  username: string;
  avatar?: string | null;
}

export interface CommentAnime {
  id: string;
  title: string;
}

export interface CommentEpisode {
  id: string;
  title: string;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  animeId: string;
  episodeId?: string; // optional
  createdAt: Date;
  updatedAt: Date;
  user: CommentUser;
  anime: CommentAnime;
  episode?: CommentEpisode; // optional
}

// 🔹 CREATE DTO
export interface CreateCommentDto {
  animeId: string;
  episodeId?: string; // optional
  text: string;
}

// 🔹 UPDATE DTO
export interface UpdateCommentDto {
  text?: string;
  episodeId?: string; // optional
}
