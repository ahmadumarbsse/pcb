CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" varchar(32) DEFAULT 'fan' NOT NULL,
	"phone_number" text,
	"cnic" varchar(20),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rows" (
	"id" text PRIMARY KEY NOT NULL,
	"section_id" text NOT NULL,
	"row_number" varchar(10) NOT NULL,
	"capacity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seats" (
	"id" text PRIMARY KEY NOT NULL,
	"row_id" text NOT NULL,
	"stand_id" text NOT NULL,
	"seat_number" varchar(10) NOT NULL,
	"seat_code" varchar(50) NOT NULL,
	"is_wheelchair_accessible" boolean DEFAULT false NOT NULL,
	"is_vip" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" text PRIMARY KEY NOT NULL,
	"stand_id" text NOT NULL,
	"name" varchar(50) NOT NULL,
	"code" varchar(20) NOT NULL,
	"capacity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stands" (
	"id" text PRIMARY KEY NOT NULL,
	"venue_id" text NOT NULL,
	"name" text NOT NULL,
	"code" varchar(20) NOT NULL,
	"tier" varchar(30) DEFAULT 'GENERAL' NOT NULL,
	"gate_number" varchar(20) NOT NULL,
	"capacity" integer NOT NULL,
	"is_reserved_seating" boolean DEFAULT true NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"address" text NOT NULL,
	"capacity" integer NOT NULL,
	"image_url" text,
	"description" text NOT NULL,
	"rules" text,
	"gates_info" text,
	"accessibility_info" text,
	"parking_info" text,
	"latitude" text,
	"longitude" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "matches" (
	"id" text PRIMARY KEY NOT NULL,
	"series_id" text NOT NULL,
	"venue_id" text NOT NULL,
	"match_number" integer DEFAULT 1 NOT NULL,
	"title" text NOT NULL,
	"home_team" text NOT NULL,
	"away_team" text NOT NULL,
	"home_team_code" varchar(10) NOT NULL,
	"away_team_code" varchar(10) NOT NULL,
	"format" varchar(20) NOT NULL,
	"match_date" timestamp NOT NULL,
	"start_time" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'UPCOMING' NOT NULL,
	"sales_open" boolean DEFAULT true NOT NULL,
	"sales_opens_at" timestamp,
	"sales_closes_at" timestamp,
	"ticket_limit_per_user" integer DEFAULT 6 NOT NULL,
	"refund_policy_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "seat_holds" (
	"id" text PRIMARY KEY NOT NULL,
	"match_id" text NOT NULL,
	"seat_id" text,
	"category_id" text NOT NULL,
	"user_id" text,
	"hold_token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "seat_holds_hold_token_unique" UNIQUE("hold_token")
);
--> statement-breakpoint
CREATE TABLE "series" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" varchar(50) NOT NULL,
	"format" varchar(20) NOT NULL,
	"season" varchar(20) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "series_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "ticket_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"match_id" text NOT NULL,
	"stand_id" text NOT NULL,
	"name" text NOT NULL,
	"tier" varchar(30) NOT NULL,
	"price_pkr" integer NOT NULL,
	"total_quota" integer NOT NULL,
	"available_quota" integer NOT NULL,
	"sales_status" varchar(30) DEFAULT 'ON_SALE' NOT NULL,
	"perks_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"ticket_category_id" text NOT NULL,
	"seat_id" text,
	"unit_price_pkr" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"attendee_name" text NOT NULL,
	"attendee_cnic" varchar(20),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"order_number" varchar(30) NOT NULL,
	"user_id" text NOT NULL,
	"match_id" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_cnic" varchar(20),
	"total_amount_pkr" integer NOT NULL,
	"subtotal_amount_pkr" integer NOT NULL,
	"discount_amount_pkr" integer DEFAULT 0 NOT NULL,
	"fees_amount_pkr" integer DEFAULT 0 NOT NULL,
	"status" varchar(30) DEFAULT 'PENDING' NOT NULL,
	"payment_method" varchar(50),
	"promo_code_applied" varchar(50),
	"idempotency_key" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number"),
	CONSTRAINT "orders_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "ticket_transfers" (
	"id" text PRIMARY KEY NOT NULL,
	"ticket_id" text NOT NULL,
	"from_user_id" text NOT NULL,
	"to_user_id" text,
	"recipient_email" text NOT NULL,
	"recipient_name" text NOT NULL,
	"recipient_cnic" varchar(20),
	"status" varchar(30) DEFAULT 'PENDING' NOT NULL,
	"transfer_token" text NOT NULL,
	"transferred_at" timestamp DEFAULT now() NOT NULL,
	"accepted_at" timestamp,
	CONSTRAINT "ticket_transfers_transfer_token_unique" UNIQUE("transfer_token")
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"ticket_number" varchar(40) NOT NULL,
	"order_id" text NOT NULL,
	"match_id" text NOT NULL,
	"ticket_category_id" text NOT NULL,
	"seat_id" text,
	"user_id" text NOT NULL,
	"holder_name" text NOT NULL,
	"holder_cnic" varchar(20),
	"qr_signature_token" text NOT NULL,
	"status" varchar(30) DEFAULT 'ISSUED' NOT NULL,
	"gate_assigned" varchar(30),
	"issued_at" timestamp DEFAULT now() NOT NULL,
	"scanned_at" timestamp,
	"cancelled_at" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tickets_ticket_number_unique" UNIQUE("ticket_number"),
	CONSTRAINT "tickets_qr_signature_token_unique" UNIQUE("qr_signature_token")
);
--> statement-breakpoint
CREATE TABLE "payment_events" (
	"id" text PRIMARY KEY NOT NULL,
	"payment_id" text,
	"order_id" text,
	"event_type" varchar(50) NOT NULL,
	"payload_raw" text NOT NULL,
	"signature_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"provider" varchar(50) NOT NULL,
	"transaction_reference" varchar(100),
	"amount_pkr" integer NOT NULL,
	"currency" varchar(10) DEFAULT 'PKR' NOT NULL,
	"status" varchar(30) DEFAULT 'INITIATED' NOT NULL,
	"idempotency_key" text,
	"provider_response_raw" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	CONSTRAINT "payments_transaction_reference_unique" UNIQUE("transaction_reference"),
	CONSTRAINT "payments_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "refund_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"order_id" text NOT NULL,
	"ticket_id" text,
	"user_id" text NOT NULL,
	"amount_pkr" integer NOT NULL,
	"reason" text NOT NULL,
	"status" varchar(30) DEFAULT 'REQUESTED' NOT NULL,
	"admin_notes" text,
	"reviewed_by_user_id" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotional_codes" (
	"id" text PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"discount_type" varchar(20) NOT NULL,
	"discount_value" integer NOT NULL,
	"min_order_amount_pkr" integer DEFAULT 0 NOT NULL,
	"max_discount_pkr" integer,
	"usage_limit" integer DEFAULT 1000 NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"valid_from" timestamp NOT NULL,
	"valid_until" timestamp NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "promotional_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "gate_scans" (
	"id" text PRIMARY KEY NOT NULL,
	"ticket_id" text,
	"match_id" text NOT NULL,
	"scanned_by_user_id" text NOT NULL,
	"gate_name" varchar(50) NOT NULL,
	"scan_result" varchar(40) NOT NULL,
	"rejection_reason" text,
	"device_info" text,
	"raw_token_scanned" text,
	"scanned_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group_inquiries" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_name" text NOT NULL,
	"contact_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"match_id" text,
	"requested_quantity" integer NOT NULL,
	"category_preference" varchar(50) NOT NULL,
	"organization_type" varchar(50) NOT NULL,
	"status" varchar(30) DEFAULT 'NEW' NOT NULL,
	"notes" text,
	"admin_quotation_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"user_email" text NOT NULL,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" text,
	"details_json" text,
	"ip_address" varchar(45),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"type" varchar(50) NOT NULL,
	"channel" varchar(20) NOT NULL,
	"recipient" text NOT NULL,
	"subject" text,
	"content" text NOT NULL,
	"status" varchar(30) DEFAULT 'PENDING' NOT NULL,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"sent_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rows" ADD CONSTRAINT "rows_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seats" ADD CONSTRAINT "seats_row_id_rows_id_fk" FOREIGN KEY ("row_id") REFERENCES "public"."rows"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seats" ADD CONSTRAINT "seats_stand_id_stands_id_fk" FOREIGN KEY ("stand_id") REFERENCES "public"."stands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_stand_id_stands_id_fk" FOREIGN KEY ("stand_id") REFERENCES "public"."stands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stands" ADD CONSTRAINT "stands_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "matches" ADD CONSTRAINT "matches_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_holds" ADD CONSTRAINT "seat_holds_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_holds" ADD CONSTRAINT "seat_holds_seat_id_seats_id_fk" FOREIGN KEY ("seat_id") REFERENCES "public"."seats"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_holds" ADD CONSTRAINT "seat_holds_category_id_ticket_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."ticket_categories"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seat_holds" ADD CONSTRAINT "seat_holds_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_categories" ADD CONSTRAINT "ticket_categories_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_categories" ADD CONSTRAINT "ticket_categories_stand_id_stands_id_fk" FOREIGN KEY ("stand_id") REFERENCES "public"."stands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_ticket_category_id_ticket_categories_id_fk" FOREIGN KEY ("ticket_category_id") REFERENCES "public"."ticket_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_seat_id_seats_id_fk" FOREIGN KEY ("seat_id") REFERENCES "public"."seats"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_transfers" ADD CONSTRAINT "ticket_transfers_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_transfers" ADD CONSTRAINT "ticket_transfers_from_user_id_user_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_transfers" ADD CONSTRAINT "ticket_transfers_to_user_id_user_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_ticket_category_id_ticket_categories_id_fk" FOREIGN KEY ("ticket_category_id") REFERENCES "public"."ticket_categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_seat_id_seats_id_fk" FOREIGN KEY ("seat_id") REFERENCES "public"."seats"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_events" ADD CONSTRAINT "payment_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_reviewed_by_user_id_user_id_fk" FOREIGN KEY ("reviewed_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gate_scans" ADD CONSTRAINT "gate_scans_ticket_id_tickets_id_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gate_scans" ADD CONSTRAINT "gate_scans_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gate_scans" ADD CONSTRAINT "gate_scans_scanned_by_user_id_user_id_fk" FOREIGN KEY ("scanned_by_user_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_inquiries" ADD CONSTRAINT "group_inquiries_match_id_matches_id_fk" FOREIGN KEY ("match_id") REFERENCES "public"."matches"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;