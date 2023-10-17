// BreakscapedString type is just a string, but is 'branded' with a unique symbol to prevent assigning it to a string
// without using the 'as' keyword. This makes it easier to see where breakscaping is being used.
export type BreakscapedString = string & { readonly __isBreakscaped: unique symbol };
