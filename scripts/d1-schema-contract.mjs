import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export const schemaContract = {
  schemaPath: "database/d1/001_initial_site_schema.sql",
  migrationsDir: "migrations",
  requiredTables: {
    ap_runtime_config: ["key", "value", "status", "updated_at"],
    ap_business_settings: ["key", "value_json", "updated_at"],
    ap_asset_records: [
      "asset_id",
      "current_revision_id",
      "display_name",
      "origin",
      "visibility",
      "protected",
      "replaceable",
      "deleted_at",
    ],
    ap_asset_revisions: [
      "revision_id",
      "asset_id",
      "revision_number",
      "storage_key",
      "content_hash",
      "file_name",
      "mime_type",
      "size_bytes",
      "status",
      "scan_status",
    ],
    ap_asset_aliases: ["alias", "asset_id", "origin", "protected"],
    ap_asset_events: [
      "event_id",
      "asset_id",
      "revision_id",
      "operation",
      "actor_type",
      "created_at",
    ],
    ap_asset_release_state: [
      "environment",
      "current_revision_number",
      "current_asset_hash",
      "current_snapshot_hash",
      "active_asset_count",
      "deleted_asset_count",
    ],
    ap_admin_sessions: [
      "id",
      "subject",
      "role",
      "session_token_hash",
      "csrf_token_hash",
      "expires_at",
      "revoked_at",
    ],
    ap_admin_sso_exchanges: [
      "id",
      "jti",
      "subject",
      "project_id",
      "environment",
      "role",
      "target_path",
      "expires_at",
    ],
    ap_content_revision_log: [
      "id",
      "revision_number",
      "source",
      "actor_type",
      "operation",
      "collection",
      "entry",
      "locale",
    ],
    ap_content_environment_state: [
      "environment",
      "current_revision_number",
      "current_published_hash",
      "current_snapshot_hash",
    ],
    ap_emdash_bootstrap_state: [
      "template_key",
      "template_version",
      "builder_registry_hash",
      "expected_collections",
      "expected_fields",
      "expected_entries",
    ],
    ap_customer_accounts: [
      "id",
      "email",
      "display_name",
      "password_hash",
      "password_salt",
      "created_at",
      "updated_at",
    ],
    ap_customer_sessions: [
      "id",
      "account_id",
      "session_token_hash",
      "csrf_token_hash",
      "expires_at",
      "revoked_at",
    ],
    ap_customer_password_resets: [
      "id",
      "account_id",
      "reset_token_hash",
      "expires_at",
      "used_at",
      "created_at",
    ],
    ap_customer_user_profiles: [
      "id",
      "account_id",
      "profile_name",
      "birth_date",
      "birth_time",
      "birth_place",
      "place_lat",
      "place_lon",
      "place_timezone",
      "is_default",
    ],
    ap_chart_readings: [
      "id",
      "account_id",
      "profile_id",
      "reading_type",
      "provider",
      "locale",
      "status",
      "title",
      "input_json",
      "result_json",
      "generated_at",
    ],
    ap_astrology_provider_cache: ["id", "provider", "endpoint", "cache_key", "locale", "response_json", "status", "expires_at", "created_at", "updated_at"],
    ap_report_products: [
      "id",
      "slug",
      "report_type",
      "price_cents",
      "currency",
      "image_url",
      "active",
      "sort_order",
    ],
    ap_shop_products: [
      "id",
      "slug",
      "display_name",
      "category",
      "price_cents",
      "currency",
      "image_url",
      "active",
      "sort_order",
    ],
    ap_astrologers: [
      "id",
      "slug",
      "name",
      "rate_cents",
      "currency",
      "availability",
      "image_url",
      "active",
      "sort_order",
    ],
    ap_session_entitlements: [
      "id",
      "account_id",
      "astrologer_slug",
      "session_type",
      "delivery_mode",
      "duration_minutes",
      "amount_cents",
      "currency",
      "status",
      "request_key",
    ],
    ap_payment_attempts: [
      "id",
      "account_id",
      "payable_type",
      "payable_id",
      "provider",
      "amount_cents",
      "currency",
      "status",
      "idempotency_key",
    ],
    ap_payment_events: [
      "id",
      "payable_type",
      "payable_id",
      "provider",
      "provider_event_id",
      "status",
      "payload_json",
    ],
    ap_astrology_chat_sessions: [
      "id",
      "account_id",
      "entitlement_id",
      "profile_id",
      "astrologer_slug",
      "session_name",
      "session_type",
      "status",
      "duration_minutes",
      "started_at",
      "ends_at",
    ],
    ap_astrology_chat_messages: [
      "id",
      "session_id",
      "role",
      "message",
      "reply_to_message_id",
      "client_request_key",
      "created_at",
    ],
    ap_astrologer_calendly_event_types: [
      "id",
      "astrologer_slug",
      "duration_minutes",
      "event_type_uri",
      "active",
    ],
    ap_scheduled_sessions: [
      "id",
      "account_id",
      "entitlement_id",
      "profile_id",
      "astrologer_slug",
      "status",
      "duration_minutes",
      "requested_start_at",
      "scheduled_start_at",
    ],
    ap_calendly_events: [
      "id",
      "scheduled_session_id",
      "provider_event_key",
      "event_type",
      "payload_json",
      "created_at",
    ],
    ap_commerce_orders: [
      "id",
      "order_number",
      "account_id",
      "order_type",
      "status",
      "fulfillment_status",
      "currency",
      "subtotal_cents",
      "shipping_cents",
      "tax_cents",
      "total_cents",
      "request_key",
    ],
    ap_commerce_order_lines: [
      "id",
      "order_id",
      "product_slug",
      "product_name",
      "product_kind",
      "quantity",
      "unit_cents",
      "total_cents",
    ],
    ap_commerce_order_notifications: ["id", "order_id", "event_type", "status", "provider_message_id", "last_error", "created_at", "updated_at", "sent_at"],
    ap_session_entitlement_notifications: ["id", "entitlement_id", "event_type", "status", "provider_message_id", "last_error", "created_at", "updated_at", "sent_at"],
    ap_business_events: [
      "id",
      "event_type",
      "aggregate_type",
      "aggregate_id",
      "payload_json",
      "created_at",
    ],
    ap_leads: [
      "id",
      "status",
      "kind",
      "source",
      "full_name",
      "email",
      "phone",
      "details_json",
      "dedupe_key",
      "created_at",
    ],
    ap_email_templates: [
      "key",
      "display_name",
      "event_type",
      "audience",
      "locale",
      "subject",
      "html_body",
      "text_body",
      "required_variables_json",
      "sample_payload_json",
    ],
    ap_email_events: [
      "event_type",
      "audience",
      "email_type",
      "enabled",
      "schedule_json",
      "updated_at",
    ],
    ap_email_variable_mappings: [
      "variable_key",
      "source_type",
      "source_path",
      "enabled",
      "updated_at",
    ],
  },
  requiredViews: {
    ap_sales_transactions_v1: [
      "transaction_id",
      "reference",
      "kind_key",
      "kind_label",
      "item_key",
      "item_label",
      "owner_key",
      "owner_label",
      "amount_minor",
      "refunded_minor",
      "currency",
      "payment_status",
      "payment_provider",
      "business_status",
      "fulfillment_status",
      "created_at",
      "paid_at",
      "updated_at",
    ],
    ap_sales_dimensions_v1: [
      "transaction_id",
      "dimension_key",
      "dimension_label",
      "value_key",
      "value_label",
    ],
  },
  requiredIndexes: [
    "idx_ap_admin_sessions_token",
    "idx_ap_asset_revisions_asset",
    "idx_ap_asset_events_asset",
    "idx_ap_admin_sessions_subject",
    "idx_ap_admin_sso_exchanges_jti",
    "idx_ap_admin_sso_exchanges_project",
    "idx_ap_content_revision_log_revision",
    "idx_ap_content_revision_log_target",
    "idx_ap_content_revision_log_source",
    "idx_ap_customer_accounts_email",
    "idx_ap_customer_sessions_token",
    "idx_ap_customer_sessions_account",
    "idx_ap_customer_password_resets_token",
    "idx_ap_customer_password_resets_account",
    "idx_ap_customer_user_profiles_account",
    "idx_ap_chart_readings_account",
    "idx_ap_chart_readings_profile",
    "idx_ap_astrology_provider_cache_key",
    "idx_ap_astrology_provider_cache_expiry",
    "idx_ap_report_products_active_order",
    "idx_ap_shop_products_active_sort",
    "idx_ap_astrologers_active_order",
    "idx_ap_session_entitlements_account",
    "idx_ap_payment_attempts_payable",
    "idx_ap_payment_events_payable",
    "idx_ap_astrology_chat_sessions_account",
    "idx_ap_astrology_chat_sessions_status",
    "idx_ap_astrology_chat_messages_session",
    "idx_ap_astrology_chat_messages_request",
    "idx_ap_astrologer_calendly_event_types_active",
    "idx_ap_scheduled_sessions_account",
    "idx_ap_scheduled_sessions_status",
    "idx_ap_scheduled_sessions_event",
    "idx_ap_scheduled_sessions_invitee",
    "idx_ap_calendly_events_session",
    "idx_ap_commerce_orders_account",
    "idx_ap_commerce_orders_status",
    "idx_ap_commerce_order_lines_order",
    "idx_ap_commerce_order_notifications_status",
    "idx_ap_session_entitlement_notifications_status",
    "idx_ap_business_events_aggregate",
    "idx_ap_leads_dedupe",
    "idx_ap_leads_status",
    "idx_ap_leads_kind",
    "idx_ap_leads_email",
    "idx_ap_leads_created",
    "idx_ap_email_templates_event",
    "idx_ap_email_templates_event_audience_locale",
  ],
  forbiddenTables: [
    "ap_report_orders",
    "ap_puja_orders",
    "ap_product_orders",
    "ap_consultation_bookings",
    "ap_notification_outbox",
    "ap_integration_events",
    "ap_admin_audit_events",
  ],
};

export const readMigrationFiles = (root = process.cwd()) =>
  readdirSync(join(root, schemaContract.migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) =>
      readFileSync(join(root, schemaContract.migrationsDir, file), "utf8"),
    )
    .join("\n");

export const extractTableColumns = (schema, tableName) => {
  const match = new RegExp(
    `CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+${tableName}\\s*\\(([^;]+?)\\);`,
    "ims",
  ).exec(schema);
  if (!match) return undefined;
  return match[1]
    .split("\n")
    .map((line) => line.trim().replace(/,$/, ""))
    .filter((line) => line.length > 0)
    .map((line) => line.split(/\s+/)[0])
    .filter((column) => !["FOREIGN", "CONSTRAINT", "PRIMARY"].includes(column));
};

export const validateD1Schema = (root = process.cwd()) => {
  const failures = [];
  let migration = "";
  try {
    migration = readMigrationFiles(root);
  } catch {
    failures.push(`${schemaContract.migrationsDir} migrations are missing`);
    return failures;
  }

  for (const tableName of schemaContract.forbiddenTables) {
    if (
      new RegExp(
        `CREATE\\s+TABLE\\s+IF\\s+NOT\\s+EXISTS\\s+${tableName}\\b`,
        "im",
      ).test(migration)
    ) {
      failures.push(`base template must not create ${tableName}`);
    }
  }

  for (const [tableName, columns] of Object.entries(
    schemaContract.requiredTables,
  )) {
    const actualColumns = extractTableColumns(migration, tableName);
    if (!actualColumns) {
      failures.push(`${schemaContract.migrationsDir} must create ${tableName}`);
      continue;
    }
    for (const column of columns) {
      if (!actualColumns.includes(column)) {
        failures.push(`${tableName} must include ${column}`);
      }
    }
  }

  for (const indexName of schemaContract.requiredIndexes) {
    if (
      !new RegExp(
        `CREATE\\s+(?:UNIQUE\\s+)?INDEX\\s+IF\\s+NOT\\s+EXISTS\\s+${indexName}\\b`,
        "im",
      ).test(migration)
    ) {
      failures.push(`${schemaContract.migrationsDir} must create ${indexName}`);
    }
  }

  if (schemaContract.requiredViews) {
    for (const [viewName] of Object.entries(schemaContract.requiredViews)) {
      if (
        !new RegExp(
          `CREATE\\s+VIEW\\s+IF\\s+NOT\\s+EXISTS\\s+${viewName}\\b`,
          "im",
        ).test(migration)
      ) {
        failures.push(
          `${schemaContract.migrationsDir} must create view ${viewName}`,
        );
      }
    }
  }

  return failures;
};
