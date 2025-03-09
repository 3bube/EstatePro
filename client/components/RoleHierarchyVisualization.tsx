"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

type Role = {
  id: string;
  name: string;
  parentRole?: string;
};

type RoleHierarchyVisualizationProps = {
  roles: Role[];
};

export function RoleHierarchyVisualization({
  roles,
}: RoleHierarchyVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 90, bottom: 30, left: 90 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const hierarchyData = d3
      .stratify<Role>()
      .id((d) => d.id)
      .parentId((d) => d.parentRole)(roles);

    const treeLayout = d3
      .tree<Role>()
      .size([
        height - margin.top - margin.bottom,
        width - margin.left - margin.right,
      ]);

    const root = treeLayout(hierarchyData);

    const link = g
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr(
        "d",
        d3
          .linkHorizontal<
            d3.HierarchyPointLink<Role>,
            d3.HierarchyPointNode<Role>
          >()
          .x((d) => d.y)
          .y((d) => d.x)
      )
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

    const node = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${d.y},${d.x})`);

    node.append("circle").attr("r", 10).attr("fill", "#69b3a2");

    node
      .append("text")
      .attr("dy", ".31em")
      .attr("x", (d) => (d.children ? -13 : 13))
      .style("text-anchor", (d) => (d.children ? "end" : "start"))
      .text((d) => d.data.name);
  }, [roles]);

  return (
    <div className="overflow-x-auto">
      <svg ref={svgRef}></svg>
    </div>
  );
}
