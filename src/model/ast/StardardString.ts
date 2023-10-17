// StandardString type is just a string, but is 'branded' with a unique symbol to prevent assigning it to a string
// without using the 'as' keyword. This makes it easier to see where breakscaping is being used.
// Otherwise, a BreakscapedString could be assigned to a StandardString directly, which would be a bug.
export type StandardString = string & { readonly __isStandard: unique symbol };
