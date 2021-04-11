export default function generateChangelog(changelogJSON: { releases: any[] }) {
  let lines = [
    "# Changelog",
    "",
    "All notable changes to this project will be documented in this file.",
    "",
    "The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)",
    "and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).",
    "",
  ];

  const releaseLines = changelogJSON.releases
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((release) => {
      let releaseLines = [];
      if (release.isReleased === "false") {
        releaseLines.push("## [Unreleased]");
        releaseLines.push("");
      }
      releaseLines.push(`## [${release.version}] - ${release.date}`);
      releaseLines.push("");
      if (release.added && release.added.length > 0) {
        releaseLines.push("### Added");
        releaseLines.push("");
        releaseLines.push(
          release.added.map((add: string) => "- " + add).join("\n")
        );
        releaseLines.push("");
      }
      if (release.changed && release.changed.length > 0) {
        releaseLines.push("### Changed");
        releaseLines.push("");
        releaseLines.push(
          release.changed.map((change: string) => "- " + change).join("\n")
        );
        releaseLines.push("");
      }
      if (release.deprecated && release.deprecated.length > 0) {
        releaseLines.push("### Deprecated");
        releaseLines.push("");
        releaseLines.push(
          release.deprecated.map((dep: string) => "- " + dep).join("\n")
        );
        releaseLines.push("");
      }
      if (release.removed && release.removed.length > 0) {
        releaseLines.push("### Removed");
        releaseLines.push("");
        releaseLines.push(
          release.removed.map((rm: string) => "- " + rm).join("\n")
        );
        releaseLines.push("");
      }
      if (release.fixed && release.fixed.length > 0) {
        releaseLines.push("### Fixed");
        releaseLines.push("");
        releaseLines.push(
          release.fixed.map((fix: string) => "- " + fix).join("\n")
        );
        releaseLines.push("");
      }
      if (release.security && release.security.length > 0) {
        releaseLines.push("### Security");
        releaseLines.push("");
        releaseLines.push(
          release.security.map((sec: string) => "- " + sec).join("\n")
        );
        releaseLines.push("");
      }
      return releaseLines.join("\n");
    });

  lines.push(...releaseLines);

  const base_url = "https://github.com/TEACHActive/TEACHActive";

  const releaseLinks = changelogJSON.releases
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((release, i, arr) => {
      const versionName =
        release.isReleased === "false"
          ? "[unreleased]"
          : `[${release.version}]`;
      const isFirstRelease = i === 0;
      const isTerminalRelease = i >= arr.length - 1;
      let postpend_url;
      if (isFirstRelease) {
        postpend_url = `${release.version}...HEAD`;
      } else if (isTerminalRelease) {
        postpend_url = `releases/tag/${release.version}`;
      } else {
        postpend_url = `${release.version}...${arr[i - 1].version}`;
      }
      return `${versionName}: ${base_url}/compare/${postpend_url}`;
    });

  lines.push(...releaseLinks);
  return lines.join("\n");
}
