export enum Category {
    business = "Business",
    development = "Development",
    community = "Community",
    advertising = "Advertising",
    design = "Design",
    other = "Other",
}

export interface NFTProps {
    address: string;
    name?: string;
    avatar?: string;
    category: Category;
    date: string;
    title: string;
    description: string;
    cost: number;
    currencySymbol: string;
    currencyAddress: string;
}