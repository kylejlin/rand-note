declare module "react-abc" {
  import React from "react";

  export class Notation extends React.Component<NotationProps> {}

  export interface NotationProps {
    notation: string;
    el?: HTMLElement | string;
    engraverParams?: any;
    parserParams?: any;
    renderParams?: any;
  }
}
