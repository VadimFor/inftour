"use client";

import { useEffect, useState } from "react";
import type { DriveFileDetails } from "../../lib/drive";

export function usePdfDetails(fileId: string): DriveFileDetails | null {
  const [details, setDetails] = useState<DriveFileDetails | null>(null);
  useEffect(() => {
    fetch(`/api/pdf-details?id=${fileId}`)
      .then((r) => r.json())
      .then(setDetails)
      .catch(() => setDetails({ pages: null, excerpt: null }));
  }, [fileId]);
  return details;
}
