export const formatEthAddress = (address: string) => `${address.slice(0, 5)}…${address.slice(-4)}`;

export const formatEns = (name: string, maxLength: number) => {
    return (name.length > maxLength) ? name.substring(0, maxLength - 1) + '...eth' : name;
};
