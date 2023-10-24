export type StatusMessage =
  | {
      value: 'idle'
    }
  | {
      value: 'starting'
    }
  | {
      value: 'listening'
    }
  | {
      value: 'closing'
    }
  | {
      value: 'closed'
    }
  | {
      value: 'timeout'
    }
  | {
      value: 'error'
      error: string
    }

export type Status = StatusMessage['value']
