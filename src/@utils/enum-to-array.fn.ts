const stringIsNumber = (value: string) => isNaN(Number(value)) === false;


const enumToArray = <T>(e: T): number[] => {
    return Object.keys(e)
    .filter(stringIsNumber)
    .map((x: any) => (e as any)[x]);
}

export { enumToArray };