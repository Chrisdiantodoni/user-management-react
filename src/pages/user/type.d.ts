export interface UsersProps {
  meta?: Meta;
  data?: Data;
}

export interface Data {
  current_page?: number;
  data?: Datum[];
  first_page_url?: string;
  from?: number;
  last_page?: number;
  last_page_url?: string;
  links?: Link[];
  next_page_url?: null;
  path?: string;
  per_page?: number;
  prev_page_url?: null;
  to?: number;
  total?: number;
}

export interface UserDetailprops {
  meta?: Meta;
  data?: Datum;
}

export interface Datum {
  id?: string;
  name?: string;
  username?: string;
  email_verified_at?: null;
  password_reset_at?: null;
  created_at?: Date;
  updated_at?: Date;
  user_status?: string;
}

export interface Link {
  url?: null | string;
  label?: string;
  active?: boolean;
}

export interface Meta {
  code?: number;
  status?: string;
  message?: string;
}
