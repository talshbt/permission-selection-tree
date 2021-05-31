export const TREE_DATA = {
  Tribe: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null
    }
  },
  Mesila: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};

export class PermissionData {
  set treeData(treeData) {
    this.treeData = treeData;
  }

  get treeData() {
    return this.treeData;
  }
}

// dataMap = new Map<string, string[]>([
//   ['Tribe', ['a', 'b', 'c']],
//   ['Mesila', ['e', 'f', 'g']],
//   ['Rest', ['h', 'i']],
//   ['Web Client', ['j', 'k', 'l']]
// ]);
