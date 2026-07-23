const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'blog.db');

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ── Schema ────────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS blog_posts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    slug       TEXT    NOT NULL UNIQUE,
    title      TEXT    NOT NULL,
    excerpt    TEXT    NOT NULL DEFAULT '',
    content    TEXT    NOT NULL DEFAULT '',
    tags       TEXT    NOT NULL DEFAULT '[]',
    published  INTEGER NOT NULL DEFAULT 0,
    read_time  TEXT    NOT NULL DEFAULT '',
    created_at TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
`);

// ── Seed sample posts if the table is empty ───────────────────────────────────
const count = db.prepare('SELECT COUNT(*) as n FROM blog_posts').get();

if (count.n === 0) {
  const insert = db.prepare(`
    INSERT INTO blog_posts (slug, title, excerpt, content, tags, published, read_time, created_at, updated_at)
    VALUES (@slug, @title, @excerpt, @content, @tags, @published, @read_time, @created_at, @updated_at)
  `);

  const seedMany = db.transaction((posts) => {
    for (const post of posts) insert.run(post);
  });

  seedMany([
    {
      slug: 'zero-downtime-deployments',
      title: 'Zero-Downtime Deployments on AWS ECS',
      excerpt: 'Walking through the patterns I use in production to achieve truly zero-downtime blue/green deployments with CodeDeploy and ECS — including health checks, traffic shifting, and rollback triggers.',
      content: `
## The Problem

Rolling out new container versions without dropping a single request sounds simple on paper. In practice, ECS service updates can cause brief connection resets during task replacement if you're not careful.

## Blue/Green with CodeDeploy

The cleanest approach is to let CodeDeploy manage traffic shifting between two target groups on the same ALB:

\`\`\`yaml
# appspec.yml
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: "<TASK_DEFINITION>"
        LoadBalancerInfo:
          ContainerName: "app"
          ContainerPort: 8080
\`\`\`

### Traffic Shifting Strategies

- **Canary10Percent5Minutes** — shift 10% immediately, then 100% after 5 min
- **Linear10PercentEvery1Minute** — gradual linear ramp (great for stateful workloads)
- **AllAtOnce** — instant cutover (only safe with very fast health checks)

## Health Check Tuning

The most common footgun is a health check that's too aggressive:

\`\`\`hcl
health_check {
  path                = "/health"
  interval            = 15
  timeout             = 5
  healthy_threshold   = 2
  unhealthy_threshold = 3
  matcher             = "200-299"
}
\`\`\`

Pair this with a **deregistration delay** of at least 30 seconds on the target group so in-flight connections drain gracefully before the old task gets killed.

## Rollback Triggers

Set CloudWatch alarms on your error rate and wire them to the deployment:

\`\`\`bash
aws deploy create-deployment \\
  --auto-rollback-configuration enabled=true,events=DEPLOYMENT_FAILURE,DEPLOYMENT_STOP_ON_ALARM \\
  --alarm-configuration alarms=[{name=HighErrorRate}],enabled=true
\`\`\`

This gives you automatic, observable rollbacks without manual intervention.

## Lessons Learned

1. Always set \`deregistration_delay\` — defaults are too short for most apps
2. Smoke-test in the replacement target group with a lifecycle hook before shifting traffic
3. Use structured logs with \`deployment_id\` injected so you can correlate errors back to a specific release
      `.trim(),
      tags: JSON.stringify(['AWS', 'ECS', 'DevOps', 'CI/CD']),
      published: 1,
      read_time: '8 min',
      created_at: '2026-06-12T00:00:00Z',
      updated_at: '2026-06-12T00:00:00Z',
    },
    {
      slug: 'terraform-at-scale',
      title: 'Terraform at Scale: Module Patterns That Actually Work',
      excerpt: 'After managing hundreds of Terraform modules across multiple AWS accounts, here are the patterns I keep reaching for — and the anti-patterns I keep cleaning up.',
      content: `
## The Monorepo vs. Multi-Repo Debate

Short answer: **monorepo for modules, separate repos per environment**. Here's why.

Keeping all your reusable modules in one place enables atomic cross-module refactors, shared CI pipelines, and a single source of truth for versioning.

## Module Versioning

Pin modules by **git tag**, never by branch:

\`\`\`hcl
module "vpc" {
  source  = "git::https://github.com/org/tf-modules.git//vpc?ref=v2.4.1"
}
\`\`\`

This makes upgrades deliberate and rollbacks trivial.

## The Wrapper Pattern

A thin "wrapper" root module per environment composes shared modules with environment-specific inputs:

\`\`\`
infrastructure/
  modules/          # reusable, versioned
    vpc/
    ecs-service/
    rds/
  environments/
    prod/
      main.tf
      terraform.tfvars
    staging/
      main.tf
\`\`\`

## Remote State + Workspaces

Avoid Terraform workspaces for environment isolation — they share the same backend config and are easy to mix up. Instead, use separate S3 state keys per environment:

\`\`\`hcl
terraform {
  backend "s3" {
    bucket = "my-tf-state"
    key    = "prod/vpc/terraform.tfstate"
    region = "eu-west-1"
  }
}
\`\`\`

## Anti-Patterns to Avoid

- **\`count\` for conditional resources** — use \`for_each\` with an empty map instead
- **Hardcoded AMI IDs** — query them with a data source
- **\`terraform apply\` in CI without plan review** — use Atlantis or Spacelift
      `.trim(),
      tags: JSON.stringify(['Terraform', 'IaC', 'AWS', 'Platform Engineering']),
      published: 1,
      read_time: '11 min',
      created_at: '2026-04-28T00:00:00Z',
      updated_at: '2026-04-28T00:00:00Z',
    },
    {
      slug: 'k8s-cost-optimisation',
      title: 'Cutting Kubernetes Costs Without Cutting Corners',
      excerpt: "A practical guide to reducing EKS spend by 40%+ using Karpenter, Spot instances, and right-sizing — without sacrificing reliability.",
      content: `
## Why Kubernetes Bills Are So High

The default EKS node group config is designed for safety, not efficiency. Most clusters run at 20-40% CPU utilisation with nodes that are never bin-packed efficiently.

## Karpenter Over Cluster Autoscaler

Karpenter provisions nodes based on the *actual shape* of pending pods rather than scaling pre-defined node groups:

\`\`\`yaml
apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: default
spec:
  template:
    spec:
      requirements:
        - key: karpenter.sh/capacity-type
          operator: In
          values: ["spot", "on-demand"]
        - key: node.kubernetes.io/instance-type
          operator: In
          values: ["m6i.large", "m6a.large", "m5.large"]
\`\`\`

## Spot Instances With Graceful Fallback

\`\`\`yaml
spec:
  disruption:
    consolidationPolicy: WhenUnderutilized
    consolidateAfter: 30s
\`\`\`

Karpenter's built-in consolidation reclaims empty or underutilised nodes automatically.

## Right-Sizing with VPA

\`\`\`bash
kubectl get vpa --all-namespaces -o json | \\
  jq '.items[] | {name: .metadata.name, recommendation: .status.recommendation}'
\`\`\`

## Results

- **Node count**: down 35%
- **Monthly EC2 spend**: down 42%
- **P99 latency**: unchanged
      `.trim(),
      tags: JSON.stringify(['Kubernetes', 'Cost Optimisation', 'AWS', 'EKS']),
      published: 1,
      read_time: '9 min',
      created_at: '2026-02-15T00:00:00Z',
      updated_at: '2026-02-15T00:00:00Z',
    },
    {
      slug: 'on-call-culture',
      title: "Building an On-Call Culture That Doesn't Burn People Out",
      excerpt: "On-call doesn't have to mean anxiety and sleepless nights. Here's how to build a rotation, runbooks, and a blameless culture that people actually feel okay about.",
      content: `
## The Burnout Trap

The most common on-call failure mode isn't a bad alert — it's an exhausted engineer who's been paged at 3 AM five nights in a row and has stopped caring about alert quality.

## Rotation Design

1. **Shadow → Primary → Secondary** progression for new engineers
2. **Maximum 1 primary shift per week** per person in a healthy-sized team
3. **Follow-the-sun** for global teams: hand off the pager across timezones

## Runbooks That Actually Get Used

\`\`\`markdown
## Alert: HighErrorRate5xx

**Severity**: SEV-2

### Immediate Actions
1. Check \`kubectl get pods -n production\` for crash loops
2. Tail logs: \`kubectl logs -l app=api --since=5m\`
3. Check downstream dependency health

### Decision Tree
- If errors are from a single pod → drain and delete it
- If errors are global → escalate to SEV-1
\`\`\`

## Blameless Post-Mortems

The goal of a post-mortem is never to find who caused an incident — it's to find *what conditions* allowed it to happen.

## The Alert Quality Bar

Every alert should pass this test:
- Is it **actionable**?
- Is it **urgent**?
- Is it **accurately calibrated**?
      `.trim(),
      tags: JSON.stringify(['SRE', 'Culture', 'On-Call', 'Reliability']),
      published: 1,
      read_time: '6 min',
      created_at: '2025-11-03T00:00:00Z',
      updated_at: '2025-11-03T00:00:00Z',
    },
  ]);

  console.log('[db] Seeded 4 sample blog posts.');
}

module.exports = db;
