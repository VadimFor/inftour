"use client";

import { ServiceRecipesStyleModal } from "./ServiceRecipesStyleModal";

type OurServicesModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function OurServicesModal({
  isOpen,
  onClose,
}: OurServicesModalProps) {
  return (
    <ServiceRecipesStyleModal
      isOpen={isOpen}
      onClose={onClose}
      ariaTitleId="our-services-modal-title"
      titleKey="ourServicesModalTitle"
      subtitleKey="ourServicesModalSubtitle"
    />
  );
}
