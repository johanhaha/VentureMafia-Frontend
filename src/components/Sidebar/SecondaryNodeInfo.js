import { text } from "../../styling.js";

function SecondaryNodeInfo({ selectedNodeData, epochToDate, formatToUSD }) {
  return (
    <div>
      <h1 style={{ ...text.header }}>{selectedNodeData.name}</h1>

      <p style={text.contentFocus}>{selectedNodeData.shortDescription}</p>
      <ul style={text.content}>
        <li>
          HQ: {selectedNodeData.orgCity}, {selectedNodeData.orgCountryCode}
        </li>
        <li>Total funding: {formatToUSD(selectedNodeData.totalFundingUsd)}</li>
        <li>Founded: {epochToDate(selectedNodeData.foundedOn)}</li>
      </ul>
      {/* Displaying IPO info */}
      {selectedNodeData &&
        selectedNodeData.type === "secondary" &&
        selectedNodeData.exitType === "ipo" && (
          <div style={text.content}>
            {selectedNodeData.name} went public{" "}
            {epochToDate(selectedNodeData.exitDate)}
            {selectedNodeData.exitValuation &&
              " at a value of " + formatToUSD(selectedNodeData.exitValuation)}
          </div>
        )}
      {/* Displaying acquisition info */}
      {selectedNodeData &&
        selectedNodeData.type === "secondary" &&
        selectedNodeData.exitType === "acquisition" && (
          <div style={text.content}>
            {selectedNodeData.name} was acquired on{" "}
            {epochToDate(selectedNodeData.exitDate)} by{" "}
            {selectedNodeData.acquirerName}
            {selectedNodeData.exitValuation &&
              " for " + formatToUSD(selectedNodeData.exitValuation)}
          </div>
        )}
    </div>
  );
}
export default SecondaryNodeInfo;
