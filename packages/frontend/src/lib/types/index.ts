export interface TxStatus {
  submitted: boolean;
  confirmed: boolean;
  txHash?: string;
  action: string;
}
