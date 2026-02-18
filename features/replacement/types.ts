
import { OemSearchItem } from '../../components/employee/EmployeeDashboard';

export interface ReplacementStep extends OemSearchItem {}

export interface CachedChain {
  chain: ReplacementStep[];
  ts: number;
}

export interface ReplacementChainState {
  chain: ReplacementStep[];
  isResolving: boolean;
  isIncomplete: boolean;
}
