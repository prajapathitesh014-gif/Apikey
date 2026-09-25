-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROJECTS TABLE
create table if not exists public.projects (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid default auth.uid(),
    name text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TARGETS TABLE (Authorized Sandboxes)
create table if not exists public.targets (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references public.projects(id) on delete cascade not null,
    name text not null,
    base_url text not null,
    environment text default 'sandbox' not null,
    is_sandbox boolean default true not null,
    authorization_status text default 'authorized' not null,
    auth_header_user_a text,
    auth_header_user_b text,
    openapi_raw text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. SCANS TABLE
create table if not exists public.scans (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references public.projects(id) on delete cascade not null,
    target_id uuid references public.targets(id) on delete cascade not null,
    status text check (status in ('queued', 'running', 'completed', 'failed')) default 'queued' not null,
    progress integer default 0 not null,
    current_phase text default 'Initializing scan...',
    risk_score integer default 0,
    endpoint_count integer default 0,
    critical_count integer default 0,
    high_count integer default 0,
    medium_count integer default 0,
    low_count integer default 0,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SCAN EVENTS (Realtime Streamed Telemetry)
create table if not exists public.scan_events (
    id uuid primary key default uuid_generate_v4(),
    scan_id uuid references public.scans(id) on delete cascade not null,
    event_type text not null,
    message text not null,
    endpoint_path text,
    progress integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ENDPOINTS TABLE
create table if not exists public.endpoints (
    id uuid primary key default uuid_generate_v4(),
    scan_id uuid references public.scans(id) on delete cascade not null,
    method text not null,
    path text not null,
    operation_id text,
    authenticated boolean default false,
    parameter_names text[] default array[]::text[],
    response_schema jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. FINDINGS TABLE
create table if not exists public.findings (
    id uuid primary key default uuid_generate_v4(),
    scan_id uuid references public.scans(id) on delete cascade not null,
    endpoint_id uuid references public.endpoints(id) on delete set null,
    type text not null, -- e.g. BOLA, EXCESSIVE_DATA_EXPOSURE, BROKEN_AUTHENTICATION, RATE_LIMIT
    title text not null,
    severity text check (severity in ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO')) not null,
    confidence numeric(3,2) not null,
    status text default 'open' not null,
    endpoint_method text not null,
    endpoint_path text not null,
    summary text not null,
    technical_explanation text not null,
    impact text not null,
    remediation text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. EVIDENCE TABLE
create table if not exists public.evidence (
    id uuid primary key default uuid_generate_v4(),
    finding_id uuid references public.findings(id) on delete cascade not null,
    request_a_redacted jsonb not null,
    response_a_redacted jsonb not null,
    request_b_redacted jsonb,
    response_b_redacted jsonb,
    expected_behavior text not null,
    observed_behavior text not null,
    diff_summary text not null,
    comparison_json jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row-Level Security Setup
alter table public.projects enable row level security;
alter table public.targets enable row level security;
alter table public.scans enable row level security;
alter table public.scan_events enable row level security;
alter table public.endpoints enable row level security;
alter table public.findings enable row level security;
alter table public.evidence enable row level security;

-- Permissive demo policies (allows both authenticated users & demo sessions)
create policy "Allow all operations for projects" on public.projects for all using (true) with check (true);
create policy "Allow all operations for targets" on public.targets for all using (true) with check (true);
create policy "Allow all operations for scans" on public.scans for all using (true) with check (true);
create policy "Allow all operations for scan_events" on public.scan_events for all using (true) with check (true);
create policy "Allow all operations for endpoints" on public.endpoints for all using (true) with check (true);
create policy "Allow all operations for findings" on public.findings for all using (true) with check (true);
create policy "Allow all operations for evidence" on public.evidence for all using (true) with check (true);
