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
    title: string;
    description: string;
    cost: number;
    currencySymbol: string;
    currencyAddress: string;
    tokenId: number;
    tokenURI: string;
    owner: string;
    creator: string;
    duration: number;
    availabilityTo: string;
    availablilityFrom: string;
    royaltyPercentage: number;
}