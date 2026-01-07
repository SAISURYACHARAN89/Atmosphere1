export type AccountType = 'personal' | 'startup' | 'investor';

export type VerifyStatus = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error';

export type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken';

export interface AccountTypeOption {
    value: AccountType;
    label: string;
    description: string;
}

export interface SignUpProps {
    onSignedUp?: () => void;
    onSignIn?: () => void;
}
