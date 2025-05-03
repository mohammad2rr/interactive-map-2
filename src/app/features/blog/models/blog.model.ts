export interface Blog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  mapId: string;
  areaId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
  adminMessage?: string;
  tags?: string[];
  images?: string[];
}

export interface BlogCreateDto {
  title: string;
  content: string;
  mapId: string;
  areaId: string;
  tags?: string[];
  images?: string[];
}

export interface BlogUpdateDto {
  title?: string;
  content?: string;
  tags?: string[];
  images?: string[];
}
