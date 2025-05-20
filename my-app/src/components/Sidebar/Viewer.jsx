import React from "react";
import { SidebarButton } from "../../assets";

export default function Viewer(props) {
  return (
    <div className="contents-container schedule-creation">
      <div className="button-group">
        <h1>hi</h1>
      </div>
      <SidebarButton step={5} setStep={props.setStep}/>
    </div>
  );
}
