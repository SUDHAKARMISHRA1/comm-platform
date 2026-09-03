export type UserId = string;

export type RoleName = 'user' | 'admin';

export type Profile = {
  id: UserId;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
};

export type UserRole = {
  userId: UserId;
  role: RoleName;
};

export type AuthSessionStatus = 'unauthenticated' | 'authenticated';

export type AccountStatus = 'active' | 'unconfirmed' | 'banned';

export type AdminUserOverview = Profile & {
  email: string | null;
  emailConfirmedAt: string | null;
  lastSignInAt: string | null;
  bannedUntil: string | null;
  role: RoleName;
  accountStatus: AccountStatus;
};

export type ProfileRow = {
  id: string;
  display_name: string | null;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type UserRoleRow = {
  user_id: string;
  role: RoleName;
  created_at: string;
};

export type AdminUserOverviewRow = {
  id: string;
  display_name: string | null;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
  email: string | null;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  banned_until: string | null;
  role: RoleName;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: {
          id: string;
          display_name?: string | null;
          username: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          username?: string;
          avatar_url?: string | null;
          bio?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: UserRoleRow;
        Insert: {
          user_id: string;
          role: RoleName;
          created_at?: string;
        };
        Update: {
          role?: RoleName;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          action: string;
          target_user_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          action: string;
          target_user_id?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          metadata?: Record<string, unknown>;
        };
        Relationships: [];
      };
      user_question_progress: {
        Row: {
          user_id: string;
          question_id: number;
          status: 'ATTEMPTED' | 'SOLVED';
          updated_at: string;
        };
        Insert: {
          user_id: string;
          question_id: number;
          status: 'ATTEMPTED' | 'SOLVED';
          updated_at?: string;
        };
        Update: {
          status?: 'ATTEMPTED' | 'SOLVED';
          updated_at?: string;
        };
        Relationships: [];
      };
      question_interview_votes: {
        Row: {
          user_id: string;
          question_id: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          question_id: number;
          created_at?: string;
        };
        Update: {
          created_at?: string;
        };
        Relationships: [];
      };
      question_vote_counts: {
        Row: {
          question_id: number;
          vote_count: number;
          updated_at: string;
        };
        Insert: {
          question_id: number;
          vote_count?: number;
          updated_at?: string;
        };
        Update: {
          vote_count?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      code_submissions: {
        Row: {
          id: string;
          user_id: string;
          question_id: number;
          language: string;
          source_code: string;
          status: string;
          passed_test_cases: number;
          total_test_cases: number;
          execution_time: string;
          memory: string;
          test_case_results: unknown;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          question_id: number;
          language: string;
          source_code: string;
          status: string;
          passed_test_cases?: number;
          total_test_cases?: number;
          execution_time?: string;
          memory?: string;
          test_case_results?: unknown;
          created_at?: string;
        };
        Update: {
          status?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      admin_user_overview: {
        Row: AdminUserOverviewRow;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
