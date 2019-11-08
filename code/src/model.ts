import { KnownBlock } from "@slack/types";

export interface User {
  id: string;
  name: string;
  is_restricted: boolean;
  is_bot: boolean;
  is_stranger: boolean;
  deleted: boolean;
}

export interface Message {
  blocks: Array<KnownBlock>;
  ts: string;
}

export interface Action {
  value?: string;
  block_id: string;
  selected_option?: {
    value?: string;
  };
}

export interface Channel {
  id: string;
}

export interface EventBody {
  user: User;
  channel: Channel;
  message: Message;
  actions: Array<Action>;
  response_url: string;
}

export interface EventCallback {
  type: string;
  user: string;
  channel: string;
  tab?: string;
}
