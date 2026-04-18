import type * as React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        "agent-id"?: string;
        placement?: string;
        variant?: string;
        dismissible?: string;
        "always-expanded"?: string;
        "default-expanded"?: string;
        "override-language"?: string;
        "override-first-message"?: string;
        "action-text"?: string;
        "expand-text"?: string;
        "start-call-text"?: string;
        "end-call-text"?: string;
        "listening-text"?: string;
        "speaking-text"?: string;
        "dynamic-variables"?: string;
      };
    }
  }
}
