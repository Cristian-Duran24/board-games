import { registerEnumType } from '@nestjs/graphql';

export enum LoanStatus {
    ACTIVE = 'active',
    RETURNED = 'returned',
    OVERDUE = 'overdue',
}

registerEnumType(LoanStatus, { name: 'LoanStatus' });
