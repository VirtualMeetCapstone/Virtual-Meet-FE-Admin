export interface Media {
    url: string;
    type: number;
    thumbnailUrl: string | null;
  }
  
  export interface Comment {
    // Thêm các thuộc tính của comment nếu có, hiện tại đang là mảng rỗng
  }
  
  export interface Post {
    id: string;
    content: string;
    userId: string;
    comments: Comment[]; 
    medias: Media[];
    privacy: number;
    countReaction: number;
    createTime: number;
    lastModifyTime: number;
  }
  