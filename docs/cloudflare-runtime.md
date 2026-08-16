# Cloudflare Runtime Contract

Sidera Warm Modern supports two repository modes.

## Template Source Mode

This repo keeps template release workflows:

- `.github/workflows/deploy-template-preview.yml`
- `.github/workflows/deploy-production.yml`
- `.astropages/generated-site-workflows/*`

Template release workflows may use template deployment secrets such as `BUILDER_MCP_TOKEN` and `BUILDER_MCP_PROVISION_SECRET` because they validate and release the source template itself.

## Generated-Site Mode

The control plane installs generated-site workflows into generated repos:

- `.github/workflows/deploy-preview.yml`
- `.github/workflows/deploy-production.yml`

Generated-site Worker runtime secrets are:

- `EMDASH_ENCRYPTION_KEY`
- `ASTROPAGES_CONTROL_PLANE_CALLBACK_TOKEN`

Generated-site deployments require generic resource variables only:

- `PREVIEW_SITE_URL`
- `PREVIEW_SITE_D1_DATABASE_ID`
- `PREVIEW_SITE_SESSION_KV_NAMESPACE_ID`
- `PRODUCTION_SITE_URL`
- `PRODUCTION_SITE_D1_DATABASE_ID`
- `PRODUCTION_SITE_SESSION_KV_NAMESPACE_ID`

Generated-site deployments must not require Builder MCP deploy secrets. MCP access is provisioned through generated-site editor/token endpoints and EmDash, not by Worker deploy secrets.

## Bootstrap And Readiness

After D1 migrations and Worker deploy, workflows run:

```sh
node scripts/prepare-deployed-emdash.mjs preview
node scripts/prepare-deployed-emdash.mjs production
```

The script first checks:

```text
/api/astropages/generated-site/edit-readiness
```

If bootstrap state is current, it skips the full content bootstrap. If state is missing or stale, it calls:

```text
POST /api/astropages/generated-site/emdash/bootstrap
```

The full bootstrap is idempotent and must not overwrite non-empty edited content.

Expected smoke endpoints:

```text
/api/astropages/generated-site/health
/api/astropages/generated-site/edit-readiness
/
/_emdash/admin
```
