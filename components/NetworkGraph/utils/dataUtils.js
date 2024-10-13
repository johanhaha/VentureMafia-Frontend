// Combining datasets and mapping them to the correct attribute names
export const combineAndProcessData = (primaryNodes, secondaryNodes, links) => {
  const combinedNodes = [
    ...primaryNodes.map(({ personUuid: id, personName: name, ...rest }) => ({
      type: "primary",
      id,
      name,
      ...rest,
    })),
    ...secondaryNodes.map(({ orgUuid: id, orgName: name, ...rest }) => ({
      type: "secondary",
      id,
      name,
      ...rest,
    })),
  ];
  const combinedLinks = links.map(
    ({ personUuid: source, orgUuid: target, ...rest }) => ({
      source,
      target,
      ...rest,
    })
  );

  const data = {
    nodes: combinedNodes,
    links: combinedLinks,
  };

  return data;
};
