export class DynamicFlatNode {
  constructor(
    public item?: string,
    public level = 1,
    public expandable = false,
    public isLoading = false,
    public node?: Node
  ) {}
}
