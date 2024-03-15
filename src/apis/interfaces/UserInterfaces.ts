export interface UserProfile {
    first_name: string;
    last_name: string;
    email: string;
    country_id: number;
    phone: string;
    telegram: string
}

export interface IAcccountBalanceResponse {
    demo: number;
    main: number;
    commission: number;
    bonus: number;
    auth: boolean;
    id: number
}

