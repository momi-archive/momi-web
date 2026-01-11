-- ===========================================
-- Momi Authentication Migration
-- Google OAuth 인증을 위한 DB 스키마 수정
-- ===========================================

-- 1. user_id 컬럼 추가
ALTER TABLE archives ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "Enable read access for all users" ON archives;
DROP POLICY IF EXISTS "Enable insert for all users" ON archives;
DROP POLICY IF EXISTS "Enable update for all users" ON archives;
DROP POLICY IF EXISTS "Enable delete for all users" ON archives;

DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
DROP POLICY IF EXISTS "Enable insert for all users" ON categories;
DROP POLICY IF EXISTS "Enable update for all users" ON categories;
DROP POLICY IF EXISTS "Enable delete for all users" ON categories;

-- 3. 사용자별 RLS 정책 생성
-- Archives
CREATE POLICY "Users can view their own archives" 
  ON archives FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own archives" 
  ON archives FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own archives" 
  ON archives FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own archives" 
  ON archives FOR DELETE 
  USING (auth.uid() = user_id);

-- Categories
CREATE POLICY "Users can view their own categories" 
  ON categories FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categories" 
  ON categories FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
  ON categories FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
  ON categories FOR DELETE 
  USING (auth.uid() = user_id);

-- 4. (선택) 기존 데이터가 있다면 user_id 업데이트
-- UPDATE archives SET user_id = '[your-user-id]' WHERE user_id IS NULL;
-- UPDATE categories SET user_id = '[your-user-id]' WHERE user_id IS NULL;
