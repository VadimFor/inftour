import type * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "agent-id"?: string;
        placement?: string;
        "override-language"?: string;
        "action-text"?: string;
        "start-call-text"?: string;
        "end-call-text"?: string;
        "listening-text"?: string;
        "speaking-text"?: string;
        "dynamic-variables"?: string;
      };
    }
  }
}
