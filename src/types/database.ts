// ============================================================
// GAUDIA Supabase ????뺤쓽
// DB ?ㅽ궎留덉? 1:1 ???// ============================================================

export type PointType =
  | 'signup_bonus'
  | 'daily_check'
  | 'prediction_bet'
  | 'prediction_win'
  | 'prediction_refund'
  | 'event_reward'
  | 'referral_bonus'
  | 'admin_adjust'
  | 'prize_use'

export type GameStatus =
  | 'scheduled' | 'live' | 'finished' | 'cancelled' | 'postponed'

export type TopicStatus =
  | 'draft' | 'active' | 'closed' | 'settled' | 'cancelled'

export type TopicCategory =
  | 'win_loss' | 'first_score' | 'score_range' | 'extra_time'
  | 'player_stat_baseball' | 'team_stat_baseball'
  | 'player_stat_basketball' | 'team_stat_basketball'
  | 'player_stat_volleyball' | 'player_stat_soccer'
  | 'team_stat_soccer' | 'custom'

// ?? ?좎?
export interface User {
  id: string
  nickname: string
  favorite_team: string | null
  favorite_sport_id: string | null
  country_code: string
  locale: string
  avatar_url: string | null
  point_balance: number
  accuracy_rate: number
  total_predictions: number
  correct_predictions: number
  weekly_rank: number | null
  all_time_rank: number | null
  is_adult_verified: boolean
  is_banned: boolean
  created_at: string
  updated_at: string
}

export interface Sport {
  id: string
  code: string
  name_ko: string
  name_en: string
  icon: string | null
  country_code: string
  season_start_month: number | null
  season_end_month: number | null
  is_active: boolean
  sort_order: number
}

// ?? 寃쎄린
export interface Game {
  id: string
  sport_id: string
  external_id: string | null
  game_date: string
  home_team: string
  away_team: string
  stadium: string | null
  country_code: string
  status: GameStatus
  home_score: number
  away_score: number
  current_inning: number
  inning_half: 'top' | 'bottom'
  first_score_team: string | null
  started_at: string | null
  finished_at: string | null
  created_at: string
  updated_at: string
}

// ?? ?덉륫 ?좏뵿
export interface Topic {
  id: string
  sport_id: string
  game_id: string | null
  country_code: string
  category: TopicCategory
  title_ko: string
  title_en: string | null
  option_yes_ko: string
  option_no_ko: string
  option_yes_en: string | null
  option_no_en: string | null
  status: TopicStatus
  closes_at: string
  result: 'yes' | 'no' | null
  settled_at: string | null
  total_yes_pts: number
  total_no_pts: number
  participant_count: number
  is_reviewed: boolean
  created_at: string
  updated_at: string
  // 議곗씤 ?곗씠??  sport?: Sport
  game?: Game
}

// ?? ?덉륫 李몄뿬
export interface Prediction {
  id: string
  user_id: string
  topic_id: string
  choice: 'yes' | 'no'
  points_bet: number
  points_won: number
  is_correct: boolean | null
  is_settled: boolean
  settled_at: string | null
  created_at: string
  // 議곗씤 ?곗씠??  topic?: Topic
}

// ?? ?ъ씤??嫄곕옒
export interface PointTransaction {
  id: string
  user_id: string
  amount: number
  balance_after: number
  type: PointType
  reference_id: string | null
  description: string
  created_at: string
}

// ?? 寃뚯떆湲
export interface Post {
  id: string
  user_id: string
  sport_id: string | null
  topic_id: string | null
  team_tag: string | null
  content: string
  like_count: number
  comment_count: number
  is_deleted: boolean
  is_hidden: boolean
  created_at: string
  updated_at: string
  // 議곗씤 ?곗씠??  user?: Pick<User, 'id' | 'nickname' | 'avatar_url'>
}

export interface TopicOdds {
  id: string
  sport_id: string
  title_ko: string
  status: TopicStatus
  total_yes_pts: number
  closes_at: string | null
  total_no_pts: number
  participant_count: number
  yes_pct: number
  no_pct: number
  sport_name: string
  sport_icon: string
}
