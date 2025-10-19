CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251008171833_InitialCreate') THEN
    CREATE TABLE "Users" (
        "Id" uuid NOT NULL,
        "Username" character varying(100) NOT NULL,
        "PasswordHash" character varying(200) NOT NULL,
        "Name" character varying(100) NOT NULL,
        "Address" character varying(300) NOT NULL,
        "PhoneNumber" character varying(20) NOT NULL,
        "CreatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_Users" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251008171833_InitialCreate') THEN
    CREATE UNIQUE INDEX "IX_Users_Username" ON "Users" ("Username");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251008171833_InitialCreate') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20251008171833_InitialCreate', '9.0.9');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    ALTER TABLE "Users" ALTER COLUMN "PhoneNumber" DROP NOT NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    ALTER TABLE "Users" ALTER COLUMN "Name" DROP NOT NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    ALTER TABLE "Users" ALTER COLUMN "Address" DROP NOT NULL;
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    CREATE TABLE "MenuCategories" (
        "Id" uuid NOT NULL,
        "Name" character varying(100) NOT NULL,
        "Description" character varying(500),
        "CreatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_MenuCategories" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    CREATE TABLE "RestaurantTypes" (
        "Id" uuid NOT NULL,
        "Code" character varying(6) NOT NULL,
        "Name" character varying(100) NOT NULL,
        "Description" character varying(250),
        "CreatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_RestaurantTypes" PRIMARY KEY ("Id")
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    CREATE TABLE "Restaurants" (
        "Id" uuid NOT NULL,
        "Name" character varying(100) NOT NULL,
        "Address" character varying(300) NOT NULL,
        "OwnerId" uuid NOT NULL,
        "Phone" character varying(20),
        "OpeningHours" character varying(20),
        "ImageUrl" character varying(500),
        "IsActive" boolean NOT NULL,
        "Description" character varying(500),
        "Rating" numeric(3,2),
        "RatingCount" integer NOT NULL DEFAULT 0,
        "RestaurantTypeId" uuid,
        "CreatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_Restaurants" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Restaurants_RestaurantTypes_RestaurantTypeId" FOREIGN KEY ("RestaurantTypeId") REFERENCES "RestaurantTypes" ("Id") ON DELETE RESTRICT
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    CREATE TABLE "Menus" (
        "Id" uuid NOT NULL,
        "Name" character varying(100) NOT NULL,
        "Description" character varying(500),
        "Price" numeric(10,2) NOT NULL,
        "IsActive" boolean NOT NULL,
        "RestaurantId" uuid NOT NULL,
        "CategoryId" uuid NOT NULL,
        "Rating" numeric,
        "RatingCount" integer NOT NULL DEFAULT 0,
        "ImageUrl" character varying(500),
        "CreatedAt" timestamp with time zone NOT NULL,
        CONSTRAINT "PK_Menus" PRIMARY KEY ("Id"),
        CONSTRAINT "FK_Menus_MenuCategories_CategoryId" FOREIGN KEY ("CategoryId") REFERENCES "MenuCategories" ("Id") ON DELETE RESTRICT,
        CONSTRAINT "FK_Menus_Restaurants_RestaurantId" FOREIGN KEY ("RestaurantId") REFERENCES "Restaurants" ("Id") ON DELETE CASCADE
    );
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    CREATE INDEX "IX_Menus_CategoryId" ON "Menus" ("CategoryId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    CREATE INDEX "IX_Menus_RestaurantId" ON "Menus" ("RestaurantId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    CREATE INDEX "IX_Restaurants_Name" ON "Restaurants" ("Name");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    CREATE INDEX "IX_Restaurants_OwnerId" ON "Restaurants" ("OwnerId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    CREATE INDEX "IX_Restaurants_RestaurantTypeId" ON "Restaurants" ("RestaurantTypeId");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    CREATE UNIQUE INDEX "IX_RestaurantTypes_Code" ON "RestaurantTypes" ("Code");
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251009191230_InitialDomain') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20251009191230_InitialDomain', '9.0.9');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251010200426_AddUserRolesArray') THEN
    ALTER TABLE "Users" ADD "Role" text[] NOT NULL DEFAULT ARRAY[]::text[];
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251010200426_AddUserRolesArray') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20251010200426_AddUserRolesArray', '9.0.9');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251015181429_AddUserRoles') THEN
    ALTER TABLE "Users" RENAME COLUMN "Role" TO "Roles";
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251015181429_AddUserRoles') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20251015181429_AddUserRoles', '9.0.9');
    END IF;
END $EF$;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM "__EFMigrationsHistory" WHERE "MigrationId" = '20251019113423_Tables') THEN
    INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
    VALUES ('20251019113423_Tables', '9.0.9');
    END IF;
END $EF$;
COMMIT;

