export interface Room {
  id: string;
  ownerId: string;
  owner: {
    name: string;
    picture: {
      url: string;
      type: number;
      thumbnailUrl: string | null;
    };
  };
  topic: string;
  description: string;
  maximumMembers: number;
  medias: Array<{
    url: string;
    type: number;
    thumbnailUrl: string | null;
  }>;
  status: string | null;
  members: Array<any>;  // Type of members array not provided, using any.
  createTime: number;
  lastModifyTime: number;
  isReported: boolean;
  formattedCreateTime?: string;

}
