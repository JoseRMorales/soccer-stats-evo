

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_assists_number"("input_season" "text", "input_player" smallint) RETURNS TABLE("assists" integer)
    LANGUAGE "plpgsql"
    AS $$BEGIN
    RETURN QUERY
    
select sum(amount)::int from
"Assists" a
where a.player = input_player and a.season = input_season;


END;$$;


ALTER FUNCTION "public"."get_assists_number"("input_season" "text", "input_player" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_bench"("input_season" "text", "input_round" smallint) RETURNS TABLE("player_number" smallint, "player_position" smallint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
SELECT
  l.player, l.position
FROM
  "Lineups" l
WHERE
  l.season = input_season
  AND l.round = input_round
  AND l.position = -1
ORDER BY l.position;
END;
$$;


ALTER FUNCTION "public"."get_bench"("input_season" "text", "input_round" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_goals_number"("input_season" "text", "input_player" smallint) RETURNS TABLE("goals" integer)
    LANGUAGE "plpgsql"
    AS $$


BEGIN
    RETURN QUERY
    
select sum(amount)::int from
"Goals" g
where g.player = input_player and g.season = input_season;

END;


$$;


ALTER FUNCTION "public"."get_goals_number"("input_season" "text", "input_player" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_match_assists"("input_season" "text", "input_round" smallint) RETURNS TABLE("player_name" "text", "assists_amount" smallint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
SELECT
  p.name,
  a.amount
FROM
  "Matches" m
  JOIN "Assists" a ON a.season = m.season
  AND a.round = m.round
  JOIN "Players" p ON m.season = p.season
  AND a.player = p.number
WHERE
  m.season = input_season
  AND m.round = input_round;
END;
$$;


ALTER FUNCTION "public"."get_match_assists"("input_season" "text", "input_round" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_match_lineup"("input_season" "text", "input_round" smallint) RETURNS TABLE("player_number" smallint, "player_position" smallint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
SELECT
  l.player, l.position
FROM
  "Lineups" l
WHERE
  l.season = input_season
  AND l.round = input_round
ORDER BY l.position;
END;
$$;


ALTER FUNCTION "public"."get_match_lineup"("input_season" "text", "input_round" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_match_red_cards"("input_season" "text", "input_round" smallint) RETURNS TABLE("player_name" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
SELECT
  p.name
FROM
  "Matches" m
  JOIN "RedCards" r ON r.season = m.season
  AND r.round = m.round
  JOIN "Players" p ON m.season = p.season
  AND r.player = p.number
WHERE
  m.season = input_season
  AND m.round = input_round;
END;
$$;


ALTER FUNCTION "public"."get_match_red_cards"("input_season" "text", "input_round" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_match_scorers"("input_season" "text", "input_round" smallint) RETURNS TABLE("player_name" "text", "goals_amount" smallint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
      p.name, g.amount
    FROM
      "Matches" m
      JOIN "Goals" g ON g.season = m.season
      AND g.round = m.round
      JOIN "Players" p ON m.season = p.season
      AND g.player = p.number
    WHERE
      m.season = input_season
      AND m.round = input_round;
END;
$$;


ALTER FUNCTION "public"."get_match_scorers"("input_season" "text", "input_round" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_match_stats"("input_season" "text", "input_round" smallint) RETURNS TABLE("stat_type" "text", "player_name" "text", "player_number" smallint, "goals" smallint, "assists" smallint, "yellow_cards" smallint, "red_cards" smallint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    WITH match_info AS (
        SELECT 
            season,
            round
        FROM 
            public."Matches"
        WHERE 
            season = input_season AND round = input_round
    )
    
    SELECT 
        'goal' AS stat_type,
        p.name AS player_name,
        g.player AS player_number,
        g.amount AS goals,
        NULL::smallint AS assists,
        NULL::smallint AS yellow_cards,
        NULL::smallint AS red_cards
    FROM 
        match_info m
    JOIN 
        public."Goals" g ON m.season = g.season AND m.round = g.round
    JOIN 
        public."Players" p ON g.player = p.number AND m.season = p.season

    UNION ALL

    SELECT 
        'assist' AS stat_type,
        p.name AS player_name,
        a.player AS player_number,
        NULL::smallint AS goals,
        a.amount AS assists,
        NULL::smallint AS yellow_cards,
        NULL::smallint AS red_cards
    FROM 
        match_info m
    JOIN 
        public."Assists" a ON m.season = a.season AND m.round = a.round
    JOIN 
        public."Players" p ON a.player = p.number AND m.season = p.season

    UNION ALL

    SELECT 
        'yellow_card' AS stat_type,
        p.name AS player_name,
        yc.player AS player_number,
        NULL::smallint AS goals,
        NULL::smallint AS assists,
        yc.amount AS yellow_cards,
        NULL::smallint AS red_cards
    FROM 
        match_info m
    JOIN 
        public."YellowCards" yc ON m.season = yc.season AND m.round = yc.round
    JOIN 
        public."Players" p ON yc.player = p.number AND m.season = p.season

    UNION ALL

    SELECT 
        'red_card' AS stat_type,
        p.name AS player_name,
        rc.player AS player_number,
        NULL::smallint AS goals,
        NULL::smallint AS assists,
        NULL::smallint AS yellow_cards,
        1::smallint AS red_cards 
    FROM 
        match_info m
    JOIN 
        public."RedCards" rc ON m.season = rc.season AND m.round = rc.round
    JOIN 
        public."Players" p ON rc.player = p.number AND m.season = p.season;
END; 
$$;


ALTER FUNCTION "public"."get_match_stats"("input_season" "text", "input_round" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_match_yellow_cards"("input_season" "text", "input_round" smallint) RETURNS TABLE("player_name" "text", "cards_amount" smallint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
SELECT
  p.name,
  y.amount
FROM
  "Matches" m
  JOIN "YellowCards" y ON y.season = m.season
  AND y.round = m.round
  JOIN "Players" p ON m.season = p.season
  AND y.player = p.number
WHERE
  m.season = input_season
  AND m.round = input_round;
END;
$$;


ALTER FUNCTION "public"."get_match_yellow_cards"("input_season" "text", "input_round" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_penalties_saved"("input_season" "text", "input_player" smallint) RETURNS TABLE("saved_penalties" integer, "total_penalties" integer)
    LANGUAGE "plpgsql"
    AS $$BEGIN
    RETURN QUERY
    
SELECT
  SUM(s.saved)::int AS saved_penalties,
  SUM(s.amount)::int AS total_penalties
FROM
  "PenaltiesAgainst" s
WHERE
  s.player = input_player
  AND s.season = input_season;

END;$$;


ALTER FUNCTION "public"."get_penalties_saved"("input_season" "text", "input_player" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_played_games"("input_season" "text", "input_player" smallint) RETURNS TABLE("played_matches" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
select count(*)::int from
"Matches" m
join "Lineups" l on m.season = l.season and m.round = l.round
where l.player = input_player and m.season = input_season;
END;
$$;


ALTER FUNCTION "public"."get_played_games"("input_season" "text", "input_player" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_player_stats"("season_input" "text", "player_number" smallint) RETURNS TABLE("season" "text", "player_name" "text", "played_matches" bigint, "total_goals" bigint, "total_assists" bigint, "total_penalties" bigint, "total_penalties_saved" bigint, "total_red_cards" bigint, "total_yellow_cards" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m.season,
        p.name AS player_name,
        COUNT(DISTINCT m.round) AS played_matches,
        COALESCE(SUM(g.amount), 0) AS total_goals,
        COALESCE(SUM(a.amount), 0) AS total_assists,
        COALESCE(SUM(pa.amount), 0) AS total_penalties,
        COALESCE(SUM(pa.saved), 0) AS total_penalties_saved,
        COUNT(rc.player) AS total_red_cards,
        COALESCE(SUM(yc.amount), 0) AS total_yellow_cards
    FROM 
        (SELECT l.season, l.round 
         FROM public."Lineups" l
         WHERE l.player = player_number AND l.season = season_input) m
    LEFT JOIN 
        public."Goals" g ON m.season = g.season AND m.round = g.round AND g.player = player_number
    LEFT JOIN 
        public."Assists" a ON m.season = a.season AND m.round = a.round AND a.player = player_number
    LEFT JOIN 
        public."PenaltiesAgainst" pa ON m.season = pa.season AND m.round = pa.round AND pa.player = player_number
    LEFT JOIN 
        public."RedCards" rc ON m.season = rc.season AND m.round = rc.round AND rc.player = player_number
    LEFT JOIN 
        public."YellowCards" yc ON m.season = yc.season AND m.round = yc.round AND yc.player = player_number
    LEFT JOIN 
        public."Players" p ON p.number = player_number AND p.season = season_input
    GROUP BY 
        m.season, p.name
    ORDER BY 
        m.season;
END; $$;


ALTER FUNCTION "public"."get_player_stats"("season_input" "text", "player_number" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_red_cards_number"("input_season" "text", "input_player" smallint) RETURNS TABLE("red_cards" integer)
    LANGUAGE "plpgsql"
    AS $$BEGIN
    RETURN QUERY
select count(*)::int from
"RedCards" r
where r.player = input_player and r.season = input_season;
END;$$;


ALTER FUNCTION "public"."get_red_cards_number"("input_season" "text", "input_player" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_standing"("season_input" "text") RETURNS TABLE("name" "text", "played" smallint, "won" smallint, "drawn" smallint, "lost" smallint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
select
  t.name,
  s.played,
  s.won,
  s.drawn,
  s.lost
  from "Standings" s
  join "Teams" t on t.id = s.team_id
  where s.season = season_input;

END; $$;


ALTER FUNCTION "public"."get_standing"("season_input" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_starters"("input_season" "text", "input_round" smallint) RETURNS TABLE("player_number" smallint, "player_position" smallint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
SELECT
  l.player, l.position
FROM
  "Lineups" l
WHERE
  l.season = input_season
  AND l.round = input_round
  AND l.position != -1
ORDER BY l.position;
END;
$$;


ALTER FUNCTION "public"."get_starters"("input_season" "text", "input_round" smallint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_yellow_cards_number"("input_season" "text", "input_player" smallint) RETURNS TABLE("yellow_cards" integer)
    LANGUAGE "plpgsql"
    AS $$BEGIN
    RETURN QUERY
select sum(amount)::int from
"YellowCards" y
where y.player = input_player and y.season = input_season;
END;$$;


ALTER FUNCTION "public"."get_yellow_cards_number"("input_season" "text", "input_player" smallint) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."Assists" (
    "season" "text" NOT NULL,
    "round" smallint NOT NULL,
    "player" smallint NOT NULL,
    "amount" smallint DEFAULT '1'::smallint NOT NULL
);


ALTER TABLE "public"."Assists" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Goals" (
    "season" "text" NOT NULL,
    "round" smallint NOT NULL,
    "player" smallint NOT NULL,
    "goal_type" "text" DEFAULT 'InGame'::"text" NOT NULL,
    "amount" smallint DEFAULT '1'::smallint NOT NULL
);


ALTER TABLE "public"."Goals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Lineups" (
    "season" "text" NOT NULL,
    "round" smallint NOT NULL,
    "player" smallint NOT NULL,
    "position" smallint DEFAULT '-1'::smallint
);


ALTER TABLE "public"."Lineups" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."MVPVotes" (
    "voted_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "season" "text" NOT NULL,
    "round" smallint NOT NULL,
    "voter" smallint NOT NULL,
    "player_voted" smallint
);


ALTER TABLE "public"."MVPVotes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Matches" (
    "season" "text" NOT NULL,
    "round" smallint NOT NULL,
    "opponent" "uuid" NOT NULL,
    "goals_scored" smallint,
    "goals_conceded" smallint,
    "played" boolean DEFAULT false NOT NULL,
    "date" "date",
    "time" time without time zone,
    "mvp" smallint
);


ALTER TABLE "public"."Matches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."PenaltiesAgainst" (
    "season" "text" NOT NULL,
    "round" smallint NOT NULL,
    "player" smallint NOT NULL,
    "amount" smallint DEFAULT '1'::smallint NOT NULL,
    "saved" smallint DEFAULT '0'::smallint NOT NULL
);


ALTER TABLE "public"."PenaltiesAgainst" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Players" (
    "number" smallint NOT NULL,
    "name" "text" NOT NULL,
    "season" "text" NOT NULL
);


ALTER TABLE "public"."Players" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."RedCards" (
    "season" "text" NOT NULL,
    "round" smallint NOT NULL,
    "player" smallint NOT NULL
);


ALTER TABLE "public"."RedCards" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Seasons" (
    "id" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."Seasons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Standings" (
    "season" "text" NOT NULL,
    "team_id" "uuid" NOT NULL,
    "played" smallint DEFAULT '0'::smallint NOT NULL,
    "won" smallint DEFAULT '0'::smallint NOT NULL,
    "drawn" smallint DEFAULT '0'::smallint NOT NULL,
    "lost" smallint DEFAULT '0'::smallint NOT NULL
);


ALTER TABLE "public"."Standings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."Teams" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "owner" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."Teams" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."YellowCards" (
    "season" "text" NOT NULL,
    "round" smallint NOT NULL,
    "player" smallint NOT NULL,
    "amount" smallint DEFAULT '1'::smallint NOT NULL
);


ALTER TABLE "public"."YellowCards" OWNER TO "postgres";


ALTER TABLE ONLY "public"."Assists"
    ADD CONSTRAINT "Assists_pkey" PRIMARY KEY ("season", "round", "player");



ALTER TABLE ONLY "public"."Goals"
    ADD CONSTRAINT "Goals_pkey" PRIMARY KEY ("season", "round", "player");



ALTER TABLE ONLY "public"."Lineups"
    ADD CONSTRAINT "Lineups_pkey" PRIMARY KEY ("season", "round", "player");



ALTER TABLE ONLY "public"."MVPVotes"
    ADD CONSTRAINT "MVPVotes_pkey" PRIMARY KEY ("season", "round", "voter");



ALTER TABLE ONLY "public"."MVPVotes"
    ADD CONSTRAINT "MVPVotes_round_key" UNIQUE ("round");



ALTER TABLE ONLY "public"."Matches"
    ADD CONSTRAINT "Matches_pkey" PRIMARY KEY ("season", "round");



ALTER TABLE ONLY "public"."Players"
    ADD CONSTRAINT "Players_pkey" PRIMARY KEY ("number", "season");



ALTER TABLE ONLY "public"."RedCards"
    ADD CONSTRAINT "RedCards_pkey" PRIMARY KEY ("season", "round", "player");



ALTER TABLE ONLY "public"."PenaltiesAgainst"
    ADD CONSTRAINT "SavedPenalties_pkey" PRIMARY KEY ("season", "round", "player");



ALTER TABLE ONLY "public"."Seasons"
    ADD CONSTRAINT "Seasons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."Standings"
    ADD CONSTRAINT "Standings_pkey" PRIMARY KEY ("season", "team_id");



ALTER TABLE ONLY "public"."Teams"
    ADD CONSTRAINT "Teams_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."YellowCards"
    ADD CONSTRAINT "YellowCards_pkey" PRIMARY KEY ("season", "round", "player");



ALTER TABLE ONLY "public"."Assists"
    ADD CONSTRAINT "Assists_player_season_fkey" FOREIGN KEY ("player", "season") REFERENCES "public"."Players"("number", "season") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Assists"
    ADD CONSTRAINT "Assists_season_round_fkey" FOREIGN KEY ("season", "round") REFERENCES "public"."Matches"("season", "round") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Goals"
    ADD CONSTRAINT "Goals_player_season_fkey" FOREIGN KEY ("player", "season") REFERENCES "public"."Players"("number", "season") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Goals"
    ADD CONSTRAINT "Goals_season_round_fkey" FOREIGN KEY ("season", "round") REFERENCES "public"."Matches"("season", "round") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Lineups"
    ADD CONSTRAINT "Lineups_player_season_fkey" FOREIGN KEY ("player", "season") REFERENCES "public"."Players"("number", "season") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Lineups"
    ADD CONSTRAINT "Lineups_season_round_fkey" FOREIGN KEY ("season", "round") REFERENCES "public"."Matches"("season", "round") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."MVPVotes"
    ADD CONSTRAINT "MVPVotes_player_voted_season_fkey" FOREIGN KEY ("player_voted", "season") REFERENCES "public"."Players"("number", "season") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."MVPVotes"
    ADD CONSTRAINT "MVPVotes_season_round_fkey" FOREIGN KEY ("season", "round") REFERENCES "public"."Matches"("season", "round") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."MVPVotes"
    ADD CONSTRAINT "MVPVotes_voter_season_fkey" FOREIGN KEY ("voter", "season") REFERENCES "public"."Players"("number", "season") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Matches"
    ADD CONSTRAINT "Matches_mvp_season_fkey" FOREIGN KEY ("mvp", "season") REFERENCES "public"."Players"("number", "season");



ALTER TABLE ONLY "public"."Matches"
    ADD CONSTRAINT "Matches_opponent_fkey" FOREIGN KEY ("opponent") REFERENCES "public"."Teams"("id") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."Matches"
    ADD CONSTRAINT "Matches_season_fkey" FOREIGN KEY ("season") REFERENCES "public"."Seasons"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Matches"
    ADD CONSTRAINT "Matches_season_fkey1" FOREIGN KEY ("season") REFERENCES "public"."Seasons"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Players"
    ADD CONSTRAINT "Players_season_fkey" FOREIGN KEY ("season") REFERENCES "public"."Seasons"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."RedCards"
    ADD CONSTRAINT "RedCards_player_season_fkey" FOREIGN KEY ("player", "season") REFERENCES "public"."Players"("number", "season") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."RedCards"
    ADD CONSTRAINT "RedCards_season_round_fkey" FOREIGN KEY ("season", "round") REFERENCES "public"."Matches"("season", "round") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."PenaltiesAgainst"
    ADD CONSTRAINT "SavedPenalties_player_season_fkey" FOREIGN KEY ("player", "season") REFERENCES "public"."Players"("number", "season") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."PenaltiesAgainst"
    ADD CONSTRAINT "SavedPenalties_season_round_fkey" FOREIGN KEY ("season", "round") REFERENCES "public"."Matches"("season", "round") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Standings"
    ADD CONSTRAINT "Standings_season_fkey" FOREIGN KEY ("season") REFERENCES "public"."Seasons"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."Standings"
    ADD CONSTRAINT "Standings_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "public"."Teams"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."YellowCards"
    ADD CONSTRAINT "YellowCards_player_season_fkey" FOREIGN KEY ("player", "season") REFERENCES "public"."Players"("number", "season") ON UPDATE CASCADE ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."YellowCards"
    ADD CONSTRAINT "YellowCards_season_round_fkey" FOREIGN KEY ("season", "round") REFERENCES "public"."Matches"("season", "round") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE "public"."Assists" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Enable read access for all users" ON "public"."Assists" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Goals" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Lineups" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."MVPVotes" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Matches" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."PenaltiesAgainst" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Players" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."RedCards" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Seasons" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Standings" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."Teams" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."YellowCards" FOR SELECT USING (true);



ALTER TABLE "public"."Goals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Lineups" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."MVPVotes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Matches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."PenaltiesAgainst" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Players" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."RedCards" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Seasons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Standings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."Teams" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."YellowCards" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."get_assists_number"("input_season" "text", "input_player" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_assists_number"("input_season" "text", "input_player" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_assists_number"("input_season" "text", "input_player" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_bench"("input_season" "text", "input_round" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_bench"("input_season" "text", "input_round" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_bench"("input_season" "text", "input_round" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_goals_number"("input_season" "text", "input_player" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_goals_number"("input_season" "text", "input_player" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_goals_number"("input_season" "text", "input_player" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_match_assists"("input_season" "text", "input_round" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_match_assists"("input_season" "text", "input_round" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_match_assists"("input_season" "text", "input_round" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_match_lineup"("input_season" "text", "input_round" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_match_lineup"("input_season" "text", "input_round" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_match_lineup"("input_season" "text", "input_round" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_match_red_cards"("input_season" "text", "input_round" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_match_red_cards"("input_season" "text", "input_round" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_match_red_cards"("input_season" "text", "input_round" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_match_scorers"("input_season" "text", "input_round" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_match_scorers"("input_season" "text", "input_round" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_match_scorers"("input_season" "text", "input_round" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_match_stats"("input_season" "text", "input_round" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_match_stats"("input_season" "text", "input_round" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_match_stats"("input_season" "text", "input_round" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_match_yellow_cards"("input_season" "text", "input_round" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_match_yellow_cards"("input_season" "text", "input_round" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_match_yellow_cards"("input_season" "text", "input_round" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_penalties_saved"("input_season" "text", "input_player" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_penalties_saved"("input_season" "text", "input_player" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_penalties_saved"("input_season" "text", "input_player" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_played_games"("input_season" "text", "input_player" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_played_games"("input_season" "text", "input_player" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_played_games"("input_season" "text", "input_player" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_player_stats"("season_input" "text", "player_number" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_player_stats"("season_input" "text", "player_number" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_player_stats"("season_input" "text", "player_number" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_red_cards_number"("input_season" "text", "input_player" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_red_cards_number"("input_season" "text", "input_player" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_red_cards_number"("input_season" "text", "input_player" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_standing"("season_input" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_standing"("season_input" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_standing"("season_input" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_starters"("input_season" "text", "input_round" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_starters"("input_season" "text", "input_round" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_starters"("input_season" "text", "input_round" smallint) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_yellow_cards_number"("input_season" "text", "input_player" smallint) TO "anon";
GRANT ALL ON FUNCTION "public"."get_yellow_cards_number"("input_season" "text", "input_player" smallint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_yellow_cards_number"("input_season" "text", "input_player" smallint) TO "service_role";


















GRANT ALL ON TABLE "public"."Assists" TO "anon";
GRANT ALL ON TABLE "public"."Assists" TO "authenticated";
GRANT ALL ON TABLE "public"."Assists" TO "service_role";



GRANT ALL ON TABLE "public"."Goals" TO "anon";
GRANT ALL ON TABLE "public"."Goals" TO "authenticated";
GRANT ALL ON TABLE "public"."Goals" TO "service_role";



GRANT ALL ON TABLE "public"."Lineups" TO "anon";
GRANT ALL ON TABLE "public"."Lineups" TO "authenticated";
GRANT ALL ON TABLE "public"."Lineups" TO "service_role";



GRANT ALL ON TABLE "public"."MVPVotes" TO "anon";
GRANT ALL ON TABLE "public"."MVPVotes" TO "authenticated";
GRANT ALL ON TABLE "public"."MVPVotes" TO "service_role";



GRANT ALL ON TABLE "public"."Matches" TO "anon";
GRANT ALL ON TABLE "public"."Matches" TO "authenticated";
GRANT ALL ON TABLE "public"."Matches" TO "service_role";



GRANT ALL ON TABLE "public"."PenaltiesAgainst" TO "anon";
GRANT ALL ON TABLE "public"."PenaltiesAgainst" TO "authenticated";
GRANT ALL ON TABLE "public"."PenaltiesAgainst" TO "service_role";



GRANT ALL ON TABLE "public"."Players" TO "anon";
GRANT ALL ON TABLE "public"."Players" TO "authenticated";
GRANT ALL ON TABLE "public"."Players" TO "service_role";



GRANT ALL ON TABLE "public"."RedCards" TO "anon";
GRANT ALL ON TABLE "public"."RedCards" TO "authenticated";
GRANT ALL ON TABLE "public"."RedCards" TO "service_role";



GRANT ALL ON TABLE "public"."Seasons" TO "anon";
GRANT ALL ON TABLE "public"."Seasons" TO "authenticated";
GRANT ALL ON TABLE "public"."Seasons" TO "service_role";



GRANT ALL ON TABLE "public"."Standings" TO "anon";
GRANT ALL ON TABLE "public"."Standings" TO "authenticated";
GRANT ALL ON TABLE "public"."Standings" TO "service_role";



GRANT ALL ON TABLE "public"."Teams" TO "anon";
GRANT ALL ON TABLE "public"."Teams" TO "authenticated";
GRANT ALL ON TABLE "public"."Teams" TO "service_role";



GRANT ALL ON TABLE "public"."YellowCards" TO "anon";
GRANT ALL ON TABLE "public"."YellowCards" TO "authenticated";
GRANT ALL ON TABLE "public"."YellowCards" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
