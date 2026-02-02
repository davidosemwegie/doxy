---
description: Import architecture skill from another repo
---

# Import Codebase Architecture Skill

Import an exported architecture skill from another repository into this project.

## Step 1: Parse Arguments

Get the import path from arguments.

<check-arguments>
  <has name="$ARGUMENTS">
    <set-variable name="IMPORT_PATH" value="$ARGUMENTS" />
  </has>
  <has-not name="$ARGUMENTS">
    <AskUserQuestion>
      <Header>Import path</Header>
      <Question>What is the path to the exported skill?</Question>
      <Option name="Other" description="I'll provide the path" />
    </AskUserQuestion>
    <set-variable name="IMPORT_PATH" value="$RESPONSE" />
  </has-not>
</check-arguments>

## Step 2: Detect Format

Check the import path to determine the export format.

<detect-format>
  <check-path path="$IMPORT_PATH">
    <if-directory>
      <check-file path="$IMPORT_PATH/doxy-codebase-manifest.json">
        <exists>
          <set-variable name="FORMAT" value="full" />
          <log>Detected full export format (directory with manifest)</log>
        </exists>
        <not-exists>
          <error>
            Invalid import path. Expected either:
            - A directory containing `doxy-codebase-manifest.json` (full export)
            - A single `.md` file (standalone export)

            The directory exists but does not contain a manifest file.
          </error>
        </not-exists>
      </check-file>
    </if-directory>
    <if-file>
      <check-extension ext=".md">
        <matches>
          <set-variable name="FORMAT" value="standalone" />
          <log>Detected standalone export format (single .md file)</log>
        </matches>
        <not-matches>
          <error>
            Invalid import path. Expected either:
            - A directory containing `doxy-codebase-manifest.json` (full export)
            - A single `.md` file (standalone export)

            The file must have a `.md` extension for standalone imports.
          </error>
        </not-matches>
      </check-extension>
    </if-file>
    <not-exists>
      <error>
        Import path does not exist: $IMPORT_PATH

        Expected either:
        - A directory containing `doxy-codebase-manifest.json` (full export)
        - A single `.md` file (standalone export)
      </error>
    </not-exists>
  </check-path>
</detect-format>

## Step 3: Extract Skill Name

Extract the skill name from the export based on format.

<extract-name>
  <if-format is="full">
    <read-json path="$IMPORT_PATH/doxy-codebase-manifest.json">
      <set-variable name="SKILL_NAME" value="$json.name" />
    </read-json>
  </if-format>
  <if-format is="standalone">
    <read-file path="$IMPORT_PATH">
      <parse-header-metadata>
        <set-variable name="SKILL_NAME" value="$metadata.name" />
      </parse-header-metadata>
    </read-file>
  </if-format>
</extract-name>

## Step 4: Check for Conflicts

Check if a skill with this name already exists.

<check-conflicts>
  <check-directory path=".claude/skills/$SKILL_NAME/">
    <exists>
      <AskUserQuestion>
        <Header>Conflict</Header>
        <Question>A skill named '$SKILL_NAME' already exists. What would you like to do?</Question>
        <Option name="Overwrite" description="Replace existing skill" />
        <Option name="Rename" description="Import with a different name" />
        <Option name="Cancel" description="Abort import" />
      </AskUserQuestion>

      <if-response is="Overwrite">
        <log>Will overwrite existing skill</log>
      </if-response>
      <if-response is="Rename">
        <AskUserQuestion>
          <Header>New name</Header>
          <Question>What name would you like to use for this skill?</Question>
          <Option name="Other" description="I'll provide the name" />
        </AskUserQuestion>
        <set-variable name="SKILL_NAME" value="$RESPONSE" />
        <if-not-ends-with value="-arch">
          <set-variable name="SKILL_NAME" value="$SKILL_NAME-arch" />
        </if-not-ends-with>
      </if-response>
      <if-response is="Cancel">
        <abort>Import cancelled by user.</abort>
      </if-response>
    </exists>
  </check-directory>
</check-conflicts>

## Step 5: Ask for Local Source Path

Ask the user where the source codebase is located for future updates.

<AskUserQuestion>
  <Header>Local path</Header>
  <Question>Where is the source codebase located on this machine? (For future updates)</Question>
  <Option name="Skip" description="Don't set a local path, updates won't work" />
  <Option name="Other" description="I'll provide the path" />
</AskUserQuestion>

<set-local-path>
  <if-response is="Skip">
    <set-variable name="LOCAL_SOURCE_PATH" value="" />
  </if-response>
  <else>
    <set-variable name="LOCAL_SOURCE_PATH" value="$RESPONSE" />
  </else>
</set-local-path>

## Step 6: Process Import

Process the import based on the detected format.

<process-import>
  <if-format is="full">
    <!-- Full export: copy all files and update manifest -->
    <create-directory path=".claude/skills/$SKILL_NAME/" />
    <copy-files from="$IMPORT_PATH/" to=".claude/skills/$SKILL_NAME/" />

    <update-manifest path=".claude/skills/$SKILL_NAME/doxy-codebase-manifest.json">
      <if-has-value var="LOCAL_SOURCE_PATH">
        <set-field name="source_path" value="$LOCAL_SOURCE_PATH" />
      </if-has-value>
      <set-field name="imported_at" value="$ISO_8601_TIMESTAMP" />
      <!-- Preserve exported_from field from original manifest -->
    </update-manifest>
  </if-format>

  <if-format is="standalone">
    <!-- Standalone file: parse and create separate files -->
    <create-directory path=".claude/skills/$SKILL_NAME/" />

    <parse-standalone-file path="$IMPORT_PATH">
      <!-- Extract SKILL.md content -->
      <extract-section name="SKILL.md">
        <write-file path=".claude/skills/$SKILL_NAME/SKILL.md" content="$section_content" />
      </extract-section>

      <!-- Extract api-surface.md content if present -->
      <extract-section name="api-surface.md" optional="true">
        <if-present>
          <write-file path=".claude/skills/$SKILL_NAME/api-surface.md" content="$section_content" />
        </if-present>
      </extract-section>
    </parse-standalone-file>

    <!-- Create minimal manifest for standalone import -->
    <create-manifest path=".claude/skills/$SKILL_NAME/doxy-codebase-manifest.json">
      {
        "name": "$SKILL_NAME",
        "source_path": "$LOCAL_SOURCE_PATH",
        "imported_at": "$ISO_8601_TIMESTAMP",
        "imported_from_standalone": true
      }
    </create-manifest>
  </if-format>
</process-import>

## Step 7: Show Usage Instructions

Display completion message and usage instructions.

<output>
Import complete: .claude/skills/$SKILL_NAME/

The skill is now available. Claude will use it when relevant.

<if-has-value var="LOCAL_SOURCE_PATH">
To update this skill (if local path was set):
  /doxy:codebase:update $SKILL_NAME
</if-has-value>
</output>
