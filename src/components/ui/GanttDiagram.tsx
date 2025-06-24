import React from "react";
import FormationItem from "./FormationItem";

const GanttDiagram = ({ formations }:{formations:Formation[]}) => {
  return (
    <div className="space-y-4 p-4">
      {formations.map((formation) => (
        <FormationItem key={formation._id} formation={formation} />
      ))}
    </div>
  );
};

export default GanttDiagram;
