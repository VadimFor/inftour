"use client";

import { ServiceRecipesStyleModal } from "./ServiceRecipesStyleModal";

type ReferenceNumbersModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ReferenceNumbersModal({
  isOpen,
  onClose,
}: ReferenceNumbersModalProps) {
  return (
    <ServiceRecipesStyleModal
      isOpen={isOpen}
      onClose={onClose}
      ariaTitleId="reference-numbers-modal-title"
      titleKey="referenceNumbersModalTitle"
      subtitleKey="referenceNumbersModalSubtitle"
    />
  );
}
