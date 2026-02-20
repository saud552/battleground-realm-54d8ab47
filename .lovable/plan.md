

# Kilegram Alpha — Development Plan

## Overview
Continue development of Kilegram, a 3D Top-Down Battle Royale Telegram Mini App. The project already has solid foundations: procedural 3D models for all 4 characters and 5 weapons, a game registry with the official roster, store UI with tabs, admin dashboard, and Supabase integration. The focus now is on **upgrading the 3D visuals, loading the GLB reference models, polishing the store/armory, syncing inventory with the database, and enhancing the admin panel**.

---

## Phase 1: Load GLB 3D Models from Reference Files
Replace the current procedural box-geometry models with the actual `.glb` files already in the repository.

- **Weapon Models**: Map each official weapon to its closest GLB reference file:
  - `K416` → `rifle__m4a1-s_weapon_model_cs2.glb`
  - `AK-Death` → `ak-47disassembly_of_weapons.glb`
  - `AWM-X` → `rifle__awp_weapon_model_cs2.glb`
  - `Vector-Neon` → `animated_pp-19-01.glb`
  - `S12-Breacher` → `shotgun_mr-133_animated.glb`

- **Character Models**: Map each character to a GLB reference:
  - `Ghost Riley` → `snake_eyes__fortnite_item_shop_skin.glb`
  - `Nova Prime` → `fortnite_oblivion_skin.glb`
  - `Viper Snake` → `torin__fortnite_chapter_2_season_8_bp_skin.glb`
  - `Shadow Exe` → `the_omega_tier_100_skin_fortnite_3d_model.glb`

- Use `@react-three/drei`'s `useGLTF` to load models with proper positioning, scaling, and auto-rotation in the store viewer
- Add loading fallback (the existing procedural models serve as fallback if GLB fails to load)

## Phase 2: Polished Visual Store & Armory
Upgrade the store UI to feel premium and match a AAA mobile game store experience.

- **Characters Tab**: Full-card layout with GLB model rotating in a 3D viewer, rarity glow effects, character name/description, and purchase/equip buttons
- **Weapons Tab**: Horizontal card with 3D weapon preview, stat bars (damage, fire rate, range), ammo type badge, expand for full details
- **Gear Tab (Helmets & Backpacks)**: Enhanced 3D gear previews with armor/capacity stats and rarity styling
- **Loot Crate Models**: Use the `weapon_crate_loot_crate.glb` and `futuristic_crate_-_animated.glb` for crate visuals in store or arena

## Phase 3: Inventory System (Database Sync)
Connect the store purchases to the Supabase `inventory` table properly.

- **On Purchase**: Insert item into `inventory` table with correct `item_type` (skin, weapon, helmet, backpack), `item_id`, and `item_name`
- **On Load**: Fetch player's inventory from Supabase and display owned/equipped status accurately in store
- **Equip System**: Update `is_equipped` flag in inventory, ensure only one item per type is equipped at a time
- **Update `weapons.ts`**: Sync the old weapon system IDs (`m4_tech`, `viper_smg`, etc.) to the new official roster IDs (`k416`, `ak_death`, etc.)
- Add `7.62mm` ammo type to the weapon state system (currently missing, only has 5.56mm, 9mm, .300mag, 12gauge)

## Phase 4: Arena Loot Visual Upgrade
Make in-game loot drops visually match the store items.

- Replace the generic colored boxes in `Loot3D.tsx` with miniature weapon/gear GLB models or distinct styled meshes per weapon type
- Weapon loot shows a small rotating version of the actual weapon model
- Ammo crate loot uses the `soviet_weapons_ammo_crate_box_animated_low_poly.glb` model
- Medkit and armor drops get unique visual treatments

## Phase 5: Admin Panel Enhancement
Expand the existing admin dashboard at `/admin`.

- **News/Events Publisher**: Already functional — polish the UI with better form styling and preview capability
- **Player Management**: Add ability to grant gems (not just coins), reset player stats, and view player inventory
- **Game Stats Dashboard**: Add charts/graphs for daily active users, matches played, revenue tracking
- **Push Notifications**: Prepare event system so published news appears on the home screen for all players

---

## Technical Notes
- All GLB models are already in the repository under `Models/` — no external downloads needed
- The Supabase schema already has `inventory`, `profiles`, `game_events`, `user_roles` tables with correct structure
- The `item_type` enum already supports: `skin`, `weapon`, `helmet`, `armor`, `backpack`
- No schema migration needed — existing tables cover the requirements

