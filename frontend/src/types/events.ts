export type Event = {
  id: string;
  user_id: string;
  google_event_id: string;
  title: string;
  summary?: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  created_at: string;
};
