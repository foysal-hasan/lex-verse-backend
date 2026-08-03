
export const FILE_UPLOAD_QUEUES = {
  FILE_ATTACHMENT: 'file-attachment-queue',
} as const;

export const FILE_UPLOAD_JOBS = {
  MARK_ATTACHED: 'mark-attached',
  MARK_DETACHED: 'mark-detached',
} as const;