import * as React from "react";

import ChangelogJSON from "changelog.json";
import generateChangelog from "generateChangelog";
import ReactMarkdown from "react-markdown";

interface IChangelogProps {}

const Changelog: React.FunctionComponent<IChangelogProps> = (props) => {
  const changelog = generateChangelog(ChangelogJSON);

  return <ReactMarkdown>{changelog}</ReactMarkdown>;
};

export default Changelog;
