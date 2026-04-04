"use client";

import { ServiceRecipesStyleModal } from "./ServiceRecipesStyleModal";

type RequestsCommentsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function RequestsCommentsModal({
  isOpen,
  onClose,
}: RequestsCommentsModalProps) {
  return (
    <ServiceRecipesStyleModal
      isOpen={isOpen}
      onClose={onClose}
      ariaTitleId="requests-comments-modal-title"
      titleKey="requestsCommentsModalTitle"
      subtitleKey="requestsCommentsModalSubtitle"
    />
  );
}
