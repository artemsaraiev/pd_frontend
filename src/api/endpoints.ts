import { post } from './client';

export type AnchorKind = 'Section' | 'Figure' | 'Lines';

export const paper = {
  async ensure(args: { id: string; title?: string }): Promise<{ id: string }> {
    const data = await post<{ result: string }>(`/PaperIndex/ensure`, args);
    return { id: data.result };
  },
  async updateMeta(args: { id: string; title?: string }): Promise<void> {
    await post<{ ok: true }>(`/PaperIndex/updateMeta`, args);
  },
};

export const anchored = {
  async create(args: { paperId: string; kind: AnchorKind; ref: string; snippet: string }): Promise<{ anchorId: string }> {
    const data = await post<{ result: string }>(`/AnchoredContext/create`, args);
    return { anchorId: data.result };
  },
};

export const discussion = {
  async open(args: { paperId: string }): Promise<{ pubId: string }> {
    const data = await post<{ result: string }>(`/DiscussionPub/open`, args);
    return { pubId: data.result };
  },
  async startThread(args: { pubId: string; author: string; body: string; anchorId?: string }): Promise<{ threadId: string }> {
    const data = await post<{ result: string }>(`/DiscussionPub/startThread`, args);
    return { threadId: data.result };
  },
  async reply(args: { threadId: string; author: string; body: string }): Promise<{ replyId: string }> {
    const data = await post<{ result: string }>(`/DiscussionPub/reply`, args);
    return { replyId: data.result };
  },
};

export const identity = {
  async addORCID(args: { userId: string; orcid: string }): Promise<void> {
    await post<{ ok: true }>(`/IdentityVerification/addORCID`, args);
  },
  async addBadge(args: { userId: string; badge: string }): Promise<void> {
    await post<{ ok: true }>(`/IdentityVerification/addBadge`, args);
  },
};


