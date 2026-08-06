CREATE TYPE public.app_role AS ENUM ('owner','admin','ceo','manager','rep','qa');

CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  plan text NOT NULL DEFAULT 'trial',
  seats int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  full_name text,
  job_title text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid();
$$;

CREATE POLICY "members read own company" ON public.companies FOR SELECT TO authenticated
  USING (id = public.current_company_id());
CREATE POLICY "admins update own company" ON public.companies FOR UPDATE TO authenticated
  USING (id = public.current_company_id() AND (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin')));

CREATE POLICY "read profiles in company" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR (company_id IS NOT NULL AND company_id = public.current_company_id()));
CREATE POLICY "insert own profile" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());
CREATE POLICY "update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "read roles in company" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR (company_id IS NOT NULL AND company_id = public.current_company_id()));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (company_id = public.current_company_id() AND (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin')))
  WITH CHECK (company_id = public.current_company_id() AND (public.has_role(auth.uid(),'owner') OR public.has_role(auth.uid(),'admin')));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE new_company uuid;
BEGIN
  INSERT INTO public.companies (name)
  VALUES (COALESCE(NEW.raw_user_meta_data->>'company_name', split_part(NEW.email,'@',2), 'My company'))
  RETURNING id INTO new_company;

  INSERT INTO public.profiles (id, company_id, full_name)
  VALUES (NEW.id, new_company, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)));

  INSERT INTO public.user_roles (user_id, company_id, role) VALUES (NEW.id, new_company, 'owner');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();