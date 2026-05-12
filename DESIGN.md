# Quote Demo Design Contract

## Source

This file adapts the local `design-md-reference` guidance into a concrete contract for the quotation demo. The target style is a compact operational workbench, not a presentation page.

## Non-Negotiables

- Preserve the existing blue and white palette.
- Keep the app focused on work objects: project, quotation version, parameters, BOM, quote sheet, import task, and history record.
- Prefer dense tables and direct editing over explanatory cards.
- Remove decorative emphasis from secondary information.
- Use consistent type sizes and row heights across modules.

## Typography Scale

```yaml
typography:
  app_title: 15px / 700 / 1.2
  nav_item: 14px / 600 / 1.2
  page_title: 18px / 800 / 1.2
  object_title: 16px / 800 / 1.2
  section_title: 14px / 800 / 1.25
  body: 13px / 500 / 1.4
  table: 12px / 500 / 1.35
  label: 12px / 700 / 1.3
  meta: 11px / 500 / 1.3
```

## Density Tokens

```yaml
density:
  sidebar_width: 224px
  nav_item_height: 36px
  project_row_height: 56px
  object_header_height: 56px
  version_toolbar_height: 44px
  tab_bar_height: 38px
  input_height: 32px
  button_height: 34px
  table_header_height: 34px
  table_row_height: 36px
  card_radius: 8px
  control_radius: 8px
```

## Layout Rules

### Sidebar

- The primary navigation is a compact rail with 36px rows.
- The recent quotation area is the high-frequency work list, so the navigation must not consume excessive vertical space.
- Search and filtering belong together. The filter trigger sits inside or directly attached to the search field.
- Recent project rows should show only the minimum scannable data: name, scene, and scheme.

### Header

- The page header is one object header, not multiple stacked summaries.
- Project title, scene, flow number/project code, quotation version, amount, and AI assistant entry should fit in one row where possible.
- Do not repeat the same object identity across the header and toolbar.

### Work Area

- The three-step process is the dominant workflow chrome.
- Requirement parameters use one continuous page with section dividers.
- Tables should use compact rows and small controls.
- Submodule testing buttons are removed; only the top-level intelligent material matching action remains.

### History And Import

- History and batch import screens use searchable, filterable work lists.
- Search fields must support business identifiers: flow number, project name, scheme name, project code, shell size, scene, and material.
- Results should be table-like when comparison is important.

## Component Rules

```yaml
sidebar_nav_item:
  height: 36px
  font: nav_item
  icon: 16px
  radius: 8px

primary_button:
  height: 34px
  radius: 8px
  font: 13px / 700

secondary_button:
  height: 34px
  radius: 8px
  font: 13px / 600

input:
  height: 32px
  radius: 8px
  font: 12px / 500

table:
  font: table
  header_height: 34px
  row_height: 36px
  cell_padding: 7px 8px
```

## Anti-Patterns

- Do not use large cards for metadata that can be a compact pill.
- Do not put explanatory copy in operational screens.
- Do not let secondary navigation take more vertical space than the recent project list.
- Do not create nested cards inside cards.
- Do not use large shadows for normal panels.
- Do not let empty states consume a large area unless they are the primary screen state.
