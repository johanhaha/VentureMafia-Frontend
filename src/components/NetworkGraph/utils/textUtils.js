import * as d3 from "d3";

// Update primary node text styling, including splitting names into multiple lines
export const primaryNodeTextWrapping = (
  nodeElements,
  center,
  targetOrgName
) => {
  nodeElements
    .filter((d) => d.type === "primary")
    .select("text")
    .each(function () {
      const text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        dy = parseFloat(text.attr("dy") || 0.35);

      text.text(null); // Clear the text once and manage via tspans

      if (words.length === 1) {
        let word = words[0];
        text
          .append("tspan")
          .attr("x", 0)
          .attr("y", 0)
          .attr("dy", `${dy}em`)
          .text(word);
      } else {
        let word,
          line = [],
          vw = window.innerWidth,
          scaleWidth = { x: vw * 0.02 + 65, y: vw * 0.02 + 24 },
          tspan = text
            .append("tspan")
            .attr("x", (d) => {
              const angle = Math.atan2(d.y - center.y, d.x - center.x);
              return Math.cos(angle) * scaleWidth.x;
            })
            .attr("y", (d) => {
              const angle = Math.atan2(d.y - center.y, d.x - center.x);
              return Math.sin(angle) * scaleWidth.y;
            })
            .style("text-anchor", "middle")
            .attr("dy", `${dy}em`);

        while (words.length > 0) {
          word = words.pop();
          line.push(word);
          tspan.text(line.join(" ")); // Update text in the existing tspan

          // Append new tspan for the new line
          if (tspan.node().getComputedTextLength() > 100 && line.length > 1) {
            line.pop(); // Remove last word that caused overflow
            tspan.text(line.join(" ")); // Set text to previous valid line
            line = [word]; // Start new line with last word
            tspan = text
              .append("tspan")
              // eslint-disable-next-line no-loop-func
              .attr("x", (d) => {
                const angle = Math.atan2(d.y - center.y, d.x - center.x);
                return Math.cos(angle) * scaleWidth.x;
              })
              // eslint-disable-next-line no-loop-func
              .attr("y", (d) => {
                const angle = Math.atan2(d.y - center.y, d.x - center.x);
                return Math.sin(angle) * scaleWidth.y;
              })
              .style("text-anchor", "middle")
              .text(word);
          }
        }
      }

      // Add primary node aria-label for SEO
      nodeElements
        .filter((d) => d.type === "primary")
        .attr("aria-label", (d) => {
          return `${d.name}, ${d.jobTitle}, ${targetOrgName}`;
        });

      // Recalculate dy for each tspan to vertically center them
      let tspans = text.selectAll("tspan");
      let lineCount = tspans.size();
      let lineNumber = 0;
      tspans.each(function () {
        d3.select(this).attr(
          "dy",
          `${(lineNumber - lineCount / 2 + 0.5) * 1.1 + dy}em`
        );
        lineNumber++;
      });
    });
};

// Helper function for secondary node text wrapping
export const secondaryNodeTextWrapping = (d3, selection, width) => {
  selection.each(function () {
    const text = selection,
      words = text.text().split(/\s+/).reverse(),
      dy = parseFloat(text.attr("dy") || 0.35);

    text.text(null); // Clear the text once and manage via tspans

    if (words.length === 1) {
      let word = words[0];
      text
        .append("tspan")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", `${dy}em`)
        .text(word);
    } else {
      let word,
        line = [],
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", 0)
          .attr("dy", `${dy}em`);

      while (words.length > 0) {
        word = words.pop();
        line.push(word);
        tspan.text(line.join(" ")); // Update text in the existing tspan

        if (tspan.node().getComputedTextLength() > width && line.length > 1) {
          line.pop(); // Remove last word that caused overflow
          tspan.text(line.join(" ")); // Set text to previous valid line
          line = [word]; // Start new line with last word
          tspan = text.append("tspan").attr("x", 0).attr("y", 0).text(word); // Append new tspan for the new line
        }
      }
    }

    // Recalculate dy for each tspan to vertically center them
    let tspans = text.selectAll("tspan");
    let lineCount = tspans.size();
    let lineNumber = 0;
    tspans.each(function () {
      d3.select(this).attr(
        "dy",
        `${(lineNumber - lineCount / 2 + 0.5) * 1.1 + dy}em`
      );
      lineNumber++;
    });
  });
};
