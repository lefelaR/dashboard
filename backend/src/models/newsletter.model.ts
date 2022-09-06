import { v4 as UUID } from 'uuid';
export default class Newsletter {
  newsletterId: string;
  datePublished: number;
  updatedAt: number;
  title: string;
  slug: string;
  html: string;
  status: string;
  author: string;
  viewers: string[];
  rating: number = 0;
  summary: string;
  featuredImageUrl: string;
  notified: boolean;
  youtube: string;

  constructor() {
    this.newsletterId = UUID();
  }

}

